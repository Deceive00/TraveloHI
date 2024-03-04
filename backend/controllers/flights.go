package controllers

import (
	"log"
	"strconv"

	"github.com/eldrian/go-fiber-postgres/database"
	"github.com/eldrian/go-fiber-postgres/models"
	"github.com/gofiber/fiber/v2"
)

type GetAllAiportRespoonse struct {
	AirportName string `json:"airportName"`
	AirportCode string `json:"airportCode"`
	CityName    string `json:"cityName"`
	CountryName string `json:"countryName"`
}

func GetAllAirports(c *fiber.Ctx) error {
	db := database.GetDB()

	var airportResponses []GetAllAiportRespoonse

	db.Table("airports").
		Select("airports.airport_name, airports.airport_code, cities.city_name, countries.country_name").
		Joins("JOIN cities ON airports.city_id = cities.id").
		Joins("JOIN countries ON cities.country_id = countries.id").
		Scan(&airportResponses)
	return c.JSON(airportResponses)
}

func GetAllFlightData(c *fiber.Ctx) error {
	db := database.GetDB()

	var flightSegments []models.FlightSegment
	if err := db.Preload("Flight").Preload("FlightSchedule.Airplane.Airline").Preload("FlightSchedule.FlightRoute.DepartureAirport.City.Country").Preload("FlightSchedule.FlightRoute.ArrivalAirport.City.Country").Find(&flightSegments).Error; err != nil {
		log.Printf("Error fetching flights: %v", err)
		log.Printf("Query: %s", db.Dialector.Explain(db.Statement.SQL.String(), db.Statement.Vars...))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	var flights []models.Flights
	if err := db.Order("click_count DESC").Limit(8).Find(&flights).Error; err != nil {
		log.Printf("Error fetching flights: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	flightIndexMap := make(map[uint]int)
	var flightData []struct {
		Flight          models.Flights
		FlightSchedules []models.FlightSchedules
	}

	for _, fs := range flightSegments {
		for _, flight := range flights {
			if flight.ID == fs.FlightID {
				index, ok := flightIndexMap[flight.ID]
				if !ok {
					flightData = append(flightData, struct {
						Flight          models.Flights
						FlightSchedules []models.FlightSchedules
					}{
						Flight: flight,
					})
					flightIndexMap[flight.ID] = len(flightData) - 1
					index = len(flightData) - 1
				}
				flightData[index].FlightSchedules = append(flightData[index].FlightSchedules, fs.FlightSchedule)
				break
			}
		}
	}

	return c.JSON(flightData)
}

func GetFlightById(c *fiber.Ctx) error {
	db := database.GetDB()
	id := c.Params("id")

	flightID, err := strconv.Atoi(id)
	if err != nil {
		return err
	}
	var existFlight models.Flights
	if err := db.Find(&existFlight).Error; err != nil {
		return err
	}
	existFlight.ClickCount++
	if err := db.Save(&existFlight).Error; err != nil {
		return err
	}

	var flightSegments []models.FlightSegment
	if err := db.
		Preload("Flight").
		Preload("FlightSchedule.Airplane.Airline").
		Preload("FlightSchedule.FlightRoute.DepartureAirport.City.Country").
		Preload("FlightSchedule.FlightRoute.ArrivalAirport.City.Country").
		Where("flight_id = ?", flightID).
		Find(&flightSegments).Error; err != nil {
		log.Printf("Error fetching flights: %v", err)
		log.Printf("Query: %s", db.Dialector.Explain(db.Statement.SQL.String(), db.Statement.Vars...))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	var flightData struct {
		Flight          models.Flights
		FlightSchedules []models.FlightSchedules
		Seats           [][]models.Seats
	}

	if len(flightSegments) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Flight not found",
		})
	}

	flightData.Flight = flightSegments[0].Flight
	for _, segment := range flightSegments {
		flightData.FlightSchedules = append(flightData.FlightSchedules, segment.FlightSchedule)
	}

	var seats [][]models.Seats
	for _, schedule := range flightData.FlightSchedules {
		var seat []models.Seats
		if err := db.Preload("Airplane").
			Preload("SeatClass").
			Where("airplane_id = ?", schedule.AirplaneID).
			Order("id").
			Find(&seat).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		seats = append(seats, seat)
	}

	flightData.Seats = seats

	return c.JSON(flightData)
}
