package controllers

import (
	"github.com/eldrian/go-fiber-postgres/database"
	"github.com/eldrian/go-fiber-postgres/models"
	"github.com/gofiber/fiber/v2"
)

type SearchResultResponse struct {
	Countries []CountryResult `json:"countries"`
	Cities    []CityResult    `json:"cities"`
	Hotels    []HotelResult   `json:"hotels"`
}

type CountryResult struct {
	CountryID   uint    `json:"countryId"`
	CountryName string `json:"countryName"`
}

type CityResult struct {
	CityID   uint    `json:"cityId"`
	CityName string `json:"cityName"`
}

type HotelResult struct {
	HotelID   uint    `json:"hotelId"`
	HotelName string `json:"hotelName"`
}
type ErrorResponse struct {
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

	var countries []models.Country
	var cities []models.City
	var hotels []models.Hotels
	db := database.GetDB()

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
		Countries: make([]CountryResult, len(countries)),
		Cities:    make([]CityResult, len(cities)),
		Hotels:    make([]HotelResult, len(hotels)),
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
func GetSearchPageData(c *fiber.Ctx) error {
	term := c.Query("term")

	var hotels []models.Hotels
	db := database.GetDB()

	if err := db.
		Table("hotels").
		Select("hotels.id, hotels.hotel_name").
		Joins("JOIN cities ON cities.id = hotels.city_id").
		Joins("JOIN countries ON cities.country_id = countries.id").
		Where("cities.city_name ILIKE ? OR hotels.hotel_name ILIKE ? OR countries.country_name ILIKE ?", "%"+term+"%", "%"+term+"%", "%"+term+"%").
		Find(&hotels).Error; err != nil {
		return err
	}

	results := struct {
		Hotels []models.Hotels `json:"hotels"`
	}{
		Hotels: hotels,
	}

	return c.JSON(results)
}
