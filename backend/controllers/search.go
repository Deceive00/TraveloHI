package controllers

import (
	"errors"
	"log"
	"math"
	"strconv"
	"time"

	"github.com/eldrian/go-fiber-postgres/database"
	"github.com/eldrian/go-fiber-postgres/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type SearchResultResponse struct {
	Countries       []CountryResult        `json:"countries"`
	Cities          []CityResult           `json:"cities"`
	Hotels          []HotelResult          `json:"hotels"`
	SearchHistories []models.SearchHistory `json:"searchHistories"`
}

type FlightSearchResponse struct {
	Countries []CountryResult `json:"countries"`
	Cities    []CityResult    `json:"cities"`
	Airports  []AirportResult `json:"airports"`
}

type CountryResult struct {
	CountryID   uint   `json:"countryId"`
	CountryName string `json:"countryName"`
}

type CityResult struct {
	CityID   uint   `json:"cityId"`
	CityName string `json:"cityName"`
}

type HotelResult struct {
	HotelID   uint   `json:"hotelId"`
	HotelName string `json:"hotelName"`
}
type AirportResult struct {
	AirportCode string `gorm:"not null" json:"airportCode"`
	AirportName string `gorm:"not null" json:"airportName"`
}

type ErrorResponse struct {
	Message string `json:"message"`
}
type SuccessResponse struct {
	Message string `json:"message"`
}

// GetSearchResult godoc
// @Summary Get search results
// @Description Retrieve search results for countries, cities, and hotels based on a search term
// @Tags Search
// @Accept json
// @Produce json
// @Param term query string true "Search term"
// @Success 200 {object} SearchResultResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/search-name [get]
func GetSearchResult(c *fiber.Ctx) error {
	term := c.Query("term")
	userIdStr := c.Query("userId")
	userId, err := strconv.ParseUint(userIdStr, 10, 64)
	if err != nil {
		return err
	}

	var countries []models.Country
	var cities []models.City
	var hotels []models.Hotels
	db := database.GetDB()
	var searchHistories []models.SearchHistory

	if err := db.Where("user_id = ?", userId).
		Order("search_date DESC").
		Limit(3).
		Find(&searchHistories).Error; err != nil {
		return err
	}
	if err := db.Select("id, country_name").Where("country_name ILIKE ?", "%"+term+"%").Find(&countries).Error; err != nil {
		return err
	}

	if err := db.
		Table("cities").
		Select("cities.id, cities.city_name").
		Joins("JOIN countries ON cities.country_id = countries.id").
		Where("cities.city_name ILIKE ? OR countries.country_name ILIKE ?", "%"+term+"%", "%"+term+"%").
		Find(&cities).Error; err != nil {
		return err
	}

	if err := db.
		Table("hotels").
		Select("hotels.id, hotels.hotel_name").
		Joins("JOIN cities ON cities.id = hotels.city_id").
		Joins("JOIN countries ON cities.country_id = countries.id").
		Where("cities.city_name ILIKE ? OR hotels.hotel_name ILIKE ? OR countries.country_name ILIKE ?", "%"+term+"%", "%"+term+"%", "%"+term+"%").
		Find(&hotels).Error; err != nil {
		return err
	}

	results := SearchResultResponse{
		Countries:       make([]CountryResult, len(countries)),
		Cities:          make([]CityResult, len(cities)),
		Hotels:          make([]HotelResult, len(hotels)),
		SearchHistories: searchHistories,
	}

	for i, country := range countries {
		results.Countries[i] = CountryResult{CountryID: country.ID, CountryName: country.CountryName}
	}

	for i, city := range cities {
		results.Cities[i] = CityResult{CityID: city.ID, CityName: city.CityName}
	}

	for i, hotel := range hotels {
		results.Hotels[i] = HotelResult{HotelID: hotel.ID, HotelName: hotel.HotelName}
	}

	return c.JSON(results)
}

type HotelWithFacilitiesAndRoomsResponse struct {
	ID                uint                `json:"id"`
	HotelName         string              `json:"hotelName"`
	HotelDescription  string              `json:"hotelDescription"`
	HotelAddress      string              `json:"hotelAddress"`
	HotelPicture      models.Pictures     `json:"hotelPicture"`
	HotelStar         int                 `json:"hotelStar"`
	CleanlinessRating float64             `json:"cleanlinessRating"`
	ComfortnessRating float64             `json:"comfortnessRating"`
	LocationRating    float64             `json:"locationRating"`
	ServiceRating     float64             `json:"serviceRating"`
	OverallRating     float64             `json:"overallRating"`
	Facilities        []models.Facilities `json:"facilities"`
	Rooms             []models.HotelRooms `json:"rooms"`
}

func GetSearchPageData(c *fiber.Ctx) error {
	userIdStr := c.Query("userId")

	userId, err := strconv.ParseUint(userIdStr, 10, 64)
	if err != nil {
		return err
	}
	db := database.GetDB()
	term := c.Query("term")
	page := c.Query("page")

	var existingSearchHistory models.SearchHistory
	if err := db.Where("user_id = ? AND search_term = ?", userId, term).First(&existingSearchHistory).Error; err != nil {

		if errors.Is(err, gorm.ErrRecordNotFound) {
			searchHistory := models.SearchHistory{
				UserID:     uint(userId),
				SearchTerm: term,
				SearchDate: time.Now(),
			}
			if err := db.Create(&searchHistory).Error; err != nil {
				return err
			}
		} else {
			return err
		}
	} else {
		existingSearchHistory.SearchDate = time.Now()
		if err := db.Save(&existingSearchHistory).Error; err != nil {
			return err
		}
	}

	pageSize := c.Query("pageSize")

	pageNum, err := strconv.Atoi(page)
	if err != nil {
		pageNum = 1
	}
	pageSizeNum, err := strconv.Atoi(pageSize)
	if err != nil || pageSizeNum <= 0 {
		pageSizeNum = 5
	}

	var hotels []models.Hotels

	var totalHotels int64
	if err := db.
		Table("hotels").
		Joins("JOIN cities ON cities.id = hotels.city_id").
		Joins("JOIN countries ON cities.country_id = countries.id").
		Where("cities.city_name ILIKE ? OR hotels.hotel_name ILIKE ? OR countries.country_name ILIKE ?", "%"+term+"%", "%"+term+"%", "%"+term+"%").
		Count(&totalHotels).Error; err != nil {
		return err
	}

	totalPages := int(math.Ceil(float64(totalHotels) / float64(pageSizeNum)))

	if pageNum < 1 {
		pageNum = 1
	} else if pageNum > totalPages {
		pageNum = totalPages
	}

	if err := db.
		Table("hotels").
		Select("hotels.id, hotels.hotel_name, hotels.hotel_description, hotels.hotel_address, hotels.hotel_picture, hotels.hotel_star, hotels.cleanliness_rating, hotels.comfortness_rating, hotels.location_rating, hotels.service_rating, hotels.overall_rating").
		Joins("JOIN cities ON cities.id = hotels.city_id").
		Joins("JOIN countries ON cities.country_id = countries.id").
		Where("cities.city_name ILIKE ? OR hotels.hotel_name ILIKE ? OR countries.country_name ILIKE ?", "%"+term+"%", "%"+term+"%", "%"+term+"%").
		Offset((pageNum - 1) * pageSizeNum).
		Limit(pageSizeNum).
		Find(&hotels).Error; err != nil {
		return err
	}
	log.Println(term)

	var hotelsWithFacilitiesAndRooms []HotelWithFacilitiesAndRoomsResponse

	for _, hotel := range hotels {
		var facilities []models.Facilities
		if err := db.
			Table("facilities").
			Select("facilities.id, facilities.facility_name").
			Joins("JOIN hotel_facilities ON facilities.id = hotel_facilities.facility_id").
			Where("hotel_facilities.hotel_id = ?", hotel.ID).
			Find(&facilities).Error; err != nil {
			return err
		}

		var rooms []models.HotelRooms
		if err := db.Where("hotel_id = ?", hotel.ID).Find(&rooms).Error; err != nil {
			return err
		}

		hotelsWithFacilitiesAndRooms = append(hotelsWithFacilitiesAndRooms, HotelWithFacilitiesAndRoomsResponse{
			ID:                hotel.ID,
			HotelName:         hotel.HotelName,
			HotelDescription:  hotel.HotelDescription,
			HotelAddress:      hotel.HotelAddress,
			HotelPicture:      hotel.HotelPicture,
			HotelStar:         hotel.HotelStar,
			CleanlinessRating: hotel.CleanlinessRating,
			ComfortnessRating: hotel.ComfortnessRating,
			LocationRating:    hotel.LocationRating,
			ServiceRating:     hotel.ServiceRating,
			OverallRating:     hotel.OverallRating,
			Facilities:        facilities,
			Rooms:             rooms,
		})
	}

	return c.JSON(fiber.Map{
		"message":    "success",
		"hotels":     hotelsWithFacilitiesAndRooms,
		"totalPages": strconv.Itoa(totalPages),
	})
}

func GetSearchFlightResult(c *fiber.Ctx) error {
	term := c.Query("term")
	userIdStr := c.Query("userId")

	userId, err := strconv.ParseUint(userIdStr, 10, 64)
	if err != nil {
		return err
	}

	var countries []models.Country
	var cities []models.City
	var airports []models.Airports
	var searchHistories []models.SearchHistory

	db := database.GetDB()
	if err := db.Where("user_id = ?", userId).
		Order("search_date DESC").
		Limit(3).
		Find(&searchHistories).Error; err != nil {
		return err
	}
	if err := db.Select("id, country_name").Where("country_name ILIKE ?", "%"+term+"%").Find(&countries).Error; err != nil {
		return err
	}

	if err := db.
		Table("cities").
		Select("cities.id, cities.city_name").
		Joins("JOIN countries ON cities.country_id = countries.id").
		Where("cities.city_name ILIKE ? OR countries.country_name ILIKE ?", "%"+term+"%", "%"+term+"%").
		Find(&cities).Error; err != nil {
		return err
	}

	if err := db.
		Table("airports").
		Select("airports.id, airports.airport_name, airports.airport_code").
		Joins("JOIN cities ON cities.id = airports.city_id").
		Joins("JOIN countries ON cities.country_id = countries.id").
		Where("cities.city_name ILIKE ? OR airports.airport_name ILIKE ? OR countries.country_name ILIKE ?", "%"+term+"%", "%"+term+"%", "%"+term+"%").
		Find(&airports).Error; err != nil {
		return err
	}

	results := FlightSearchResponse{
		Countries: make([]CountryResult, len(countries)),
		Cities:    make([]CityResult, len(cities)),
		Airports:  make([]AirportResult, len(airports)),
	}

	for i, country := range countries {
		results.Countries[i] = CountryResult{CountryID: country.ID, CountryName: country.CountryName}
	}

	for i, city := range cities {
		results.Cities[i] = CityResult{CityID: city.ID, CityName: city.CityName}
	}

	for i, airport := range airports {
		results.Airports[i] = AirportResult{AirportCode: airport.AirportCode, AirportName: airport.AirportName}
	}
	return c.JSON(fiber.Map{
		"searchHistories": searchHistories,
		"airports":        results.Airports,
		"cities":          results.Cities,
		"countries":       results.Countries,
	})
}

func GetSearchFlightData(c *fiber.Ctx) error {
	db := database.GetDB()
	departureTerm := c.Query("departureTerm")
	arrivalTerm := c.Query("arrivalTerm")
	departureDateString := c.Query("departureDate")
	var departureDate time.Time
	if departureDateString != "" {
		departDate, err := time.Parse("2006-01-02", departureDateString)
		if err != nil {
			log.Printf("Error parsing departureDate: %v", err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid departureDate format",
			})
		}
		departureDate = departDate
	} else {
		departureDate = time.Time{}
	}
	var arrival string
	if arrivalTerm != "" {
		arrival = "%" + arrivalTerm + "%"
	} else {
		arrival = ""
	}
	var correspondingFlightSegment []models.FlightSegment
	query := db.Table("flight_segments").
		Joins("JOIN flight_schedules ON flight_segments.flight_schedule_id = flight_schedules.id").
		Joins("JOIN flights ON flight_segments.flight_id = flights.id").
		Joins("JOIN flight_routes ON flight_schedules.flight_route_id = flight_routes.id").
		Joins("JOIN airports AS departure_airports ON departure_airports.id = flight_routes.departure_airport_id").
		Joins("JOIN airports AS arrival_airports ON arrival_airports.id = flight_routes.arrival_airport_id").
		Joins("JOIN cities AS departure_cities ON departure_cities.id = departure_airports.city_id").
		Joins("JOIN cities AS arrival_cities ON arrival_cities.id = arrival_airports.city_id").
		Joins("JOIN countries AS departure_countries ON departure_countries.id = departure_cities.country_id").
		Joins("JOIN countries AS arrival_countries ON arrival_countries.id = arrival_cities.country_id").
		Where("(departure_cities.city_name ILIKE ? AND arrival_cities.city_name ILIKE ?) OR (departure_countries.country_name ILIKE ? AND arrival_countries.country_name ILIKE ?) OR (departure_airports.airport_name ILIKE ? AND arrival_airports.airport_name ILIKE ?)", "%"+departureTerm+"%", arrival, "%"+departureTerm+"%", arrival, "%"+departureTerm+"%", arrival).
		Where("DATE(flight_schedules.departure_time) > ?", departureDate.Format("2006-01-02")).
		Preload("Flight").
		Preload("FlightSchedule.Airplane.Airline").
		Preload("FlightSchedule.FlightRoute.DepartureAirport.City.Country").
		Preload("FlightSchedule.FlightRoute.ArrivalAirport.City.Country")

	if err := query.Find(&correspondingFlightSegment).Error; err != nil {
		return err
	}

	flightIndexMap := make(map[uint]int)
	var flightData []struct {
		Flight          models.Flights
		FlightSchedules []models.FlightSchedules
	}

	for _, fs := range correspondingFlightSegment {

		index, ok := flightIndexMap[fs.FlightID]
		if !ok {
			flightData = append(flightData, struct {
				Flight          models.Flights
				FlightSchedules []models.FlightSchedules
			}{
				Flight: fs.Flight,
			})
			flightIndexMap[fs.FlightID] = len(flightData) - 1
			index = len(flightData) - 1
		}
		flightData[index].FlightSchedules = append(flightData[index].FlightSchedules, fs.FlightSchedule)
	}

	return c.JSON(flightData)
}
