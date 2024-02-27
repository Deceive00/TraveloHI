package controllers

import (
	"log"

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
	log.Println(airportResponses)
	return c.JSON(airportResponses)
}

// if err := db.
// Joins("INNER JOIN flight_segments ON flights.id = flight_segments.flight_id").
// Joins("INNER JOIN flight_schedules ON flight_segments.flight_schedule_id = flight_schedules.id").
// Joins("INNER JOIN flight_routes ON flight_schedules.flight_route_id = flight_routes.id").
// Joins("INNER JOIN airports AS departure_airports ON flight_routes.departure_airport_id = departure_airports.id").
// Joins("INNER JOIN airports AS arrival_airports ON flight_routes.arrival_airport_id = arrival_airports.id").
// Joins("INNER JOIN airplanes ON flight_schedules.airplane_id = airplanes.id").
// Joins("INNER JOIN airlines ON airplanes.airline_id = airlines.id").
// Find(&flights).Error; err != nil {
// return err
// }
func GetAllFlightData(c *fiber.Ctx) error {
	db := database.GetDB()
	var flightSchedule []models.FlightSchedules
	if err := db.Preload("Airplanes").Preload("FlightRoutes").Find(&flightSchedule).
		Error; err != nil {
		log.Printf("Error fetching flights: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	// var flights []models.Flights
	// var flightSegments []models.FlightSegment

	// Return the flightLists
	return c.JSON(fiber.Map{"data": flightSchedule})
}
