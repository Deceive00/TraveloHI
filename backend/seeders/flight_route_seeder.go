package seeders

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/eldrian/go-fiber-postgres/models"
	"gorm.io/gorm"
)

func FlightRouteSeeder(db *gorm.DB) {
	var airports []models.Airports
	db.Find(&airports)

	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(airports), func(i, j int) { airports[i], airports[j] = airports[j], airports[i] })

	usedRoutes := make(map[string]bool)

	var flightRoutes []models.FlightRoutes
	for _, departureAirport := range airports {
		for _, arrivalAirport := range airports {
			if departureAirport.ID == arrivalAirport.ID {
				continue
			}
			routeKey := fmt.Sprintf("%d-%d", departureAirport.ID, arrivalAirport.ID)

			if usedRoutes[routeKey] || usedRoutes[fmt.Sprintf("%d-%d", arrivalAirport.ID, departureAirport.ID)] {
				continue
			}

			usedRoutes[routeKey] = true

			flightRoute := models.FlightRoutes{
				Duration:           rand.Intn(1000) + 80, 
				DepartureAirportID: departureAirport.ID,
				ArrivalAirportID:   arrivalAirport.ID,
				FlightRouteCode:    rand.Intn(900) + 100,
			}
			flightRoutes = append(flightRoutes, flightRoute)
		}
	}

	for i := range flightRoutes {
		db.Create(&flightRoutes[i])
	}

	fmt.Println("Flight routes data inserted successfully")
}
