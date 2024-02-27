package seeders

import (
	// "fmt"
	// "math/rand"
	"math/rand"
	"time"

	"github.com/eldrian/go-fiber-postgres/models"
	"gorm.io/gorm"
)

func FlightSeeder(db *gorm.DB) {
	// var flightRoutes []models.FlightRoutes
	// db.Find(&flightRoutes)

	// var airplanes []models.Airplanes
	// db.Find(&airplanes)

	// rand.Seed(time.Now().UnixNano())
	// numFlights := 10
	// minDeparture := time.Now()
	// maxDeparture := minDeparture.AddDate(0, 0, 30)
	// // Single Flight
	// for i := 0; i < numFlights; i++ {
	// 	flightRoute := flightRoutes[rand.Intn(len(flightRoutes))]

	// 	airplane := airplanes[rand.Intn(len(airplanes))]

	// 	departureTime := minDeparture.Add(time.Duration(rand.Intn(int(maxDeparture.Sub(minDeparture).Hours()))) * time.Hour)

	// 	arrivalTime := departureTime.Add(time.Duration(flightRoute.Duration) * time.Hour)

	// 	basePrice := float64(rand.Intn(500-100+1) + 100)

	// 	flightSchedule := models.FlightSchedules{
	// 		FlightRouteID:   flightRoute.ID,
	// 		ArrivalTime:     arrivalTime,
	// 		DepartureTime:   departureTime,

	// 		AirplaneID:      airplane.ID,
	// 	}

	// 	db.Create(&flightSchedule)
	// 	flight := models.Flights{
	// 		FlightPrice:      basePrice,
	// 		IsTransit:        false,
	// 		IsIncludeBaggage: true,
	// 		BaggageMaxWeight: rand.Intn(20) + 10,
	// 		CabinMaxWeight:   rand.Intn(5) + 5,
	// 	}

	// 	db.Create(&flight)
	// 	flightSegment := models.FlightSegment{
	// 		FlightScheduleID: flightSchedule.ID,
	// 		FlightID:         flight.ID,
	// 	}
	// 	db.Create(&flightSegment)

	// 	fmt.Printf("Flight with ID %d created successfully\n", i+1)
	// }
	gmt7 := time.FixedZone("GMT+7", 7*60*60)
	// Transit Manual
	basePrice1 := float64(rand.Intn(500-100+1) + 300)

	flight1 := models.Flights{
		FlightPrice:      basePrice1,
		IsTransit:        true,
		IsIncludeBaggage: true,
		BaggageMaxWeight: rand.Intn(20) + 10,
		CabinMaxWeight:   rand.Intn(5) + 5,
	}

	db.Create(&flight1)

	flightSchedule1 := []models.FlightSchedules{
		{
			FlightRouteID: 1265,
			DepartureTime: time.Date(2024, time.March, 1, 8, 0, 0, 0, gmt7), // Example: March 1, 2024, 08:00:00 AM
			ArrivalTime:   time.Date(2024, time.March, 2, 0, 12, 0, 0, gmt7),
			AirplaneID:    1,
		},
		{
			FlightRouteID: 1288,
			DepartureTime: time.Date(2024, time.March, 2, 2, 12, 0, 0, gmt7),
			ArrivalTime:   time.Date(2024, time.March, 2, 12, 9, 0, 0, gmt7),
			AirplaneID:    2,
		},
		{
			FlightRouteID: 1322,
			DepartureTime: time.Date(2024, time.March, 2, 13, 9, 0, 0, gmt7),
			ArrivalTime:   time.Date(2024, time.March, 2, 20, 59, 0, 0, gmt7),
			AirplaneID:    2,
		},
	}
	for i := range flightSchedule1 {
		db.Create(&flightSchedule1[i])
		flightSegment := models.FlightSegment{
			FlightScheduleID: flightSchedule1[i].ID,
			FlightID:         flight1.ID,
		}
		db.Create(&flightSegment)
	}
	basePrice2 := float64(rand.Intn(500-100+1) + 300)
	flight2 := models.Flights{
		FlightPrice:      basePrice2,
		IsTransit:        true,
		IsIncludeBaggage: true,
		BaggageMaxWeight: rand.Intn(20) + 10,
		CabinMaxWeight:   rand.Intn(5) + 5,
	}
	db.Create(&flight2)
	flightSchedule2 := []models.FlightSchedules{
		{
			FlightRouteID: 1331,
			DepartureTime: time.Date(2024, time.March, 4, 0, 0, 0, 0, gmt7),
			ArrivalTime:   time.Date(2024, time.March, 4, 13, 52, 0, 0, gmt7),
			AirplaneID:    7,
		},
		{
			FlightRouteID: 1351,
			DepartureTime: time.Date(2024, time.March, 4, 15, 00, 0, 0, gmt7),
			ArrivalTime:   time.Date(2024, time.March, 5, 5, 55, 0, 0, gmt7),
			AirplaneID:    6,
		},
	}

	for i := range flightSchedule2 {
		db.Create(&flightSchedule2[i])
		flightSegment := models.FlightSegment{
			FlightScheduleID: flightSchedule2[i].ID,
			FlightID:         flight2.ID,
		}
		db.Create(&flightSegment)
	}
	basePrice3 := float64(rand.Intn(500-100+1) + 300)
	flight3 := models.Flights{
		FlightPrice:      basePrice3,
		IsTransit:        true,
		IsIncludeBaggage: true,
		BaggageMaxWeight: rand.Intn(20) + 10,
		CabinMaxWeight:   rand.Intn(5) + 5,
	}
	db.Create(&flight3)
	flightSchedule3 := []models.FlightSchedules{
		{
			FlightRouteID: 1531,
			DepartureTime: time.Date(2024, time.March, 10, 0, 0, 0, 0, gmt7),
			ArrivalTime:   time.Date(2024, time.March, 10, 1, 28, 0, 0, gmt7),
			AirplaneID:    33,
		},
		{
			FlightRouteID: 1535,
			DepartureTime: time.Date(2024, time.March, 10, 3, 00, 0, 0, gmt7),
			ArrivalTime:   time.Date(2024, time.March, 10, 15, 8, 0, 0, gmt7),
			AirplaneID:    45,
		},
	}

	for i := range flightSchedule3 {
		db.Create(&flightSchedule3[i])
		flightSegment := models.FlightSegment{
			FlightScheduleID: flightSchedule3[i].ID,
			FlightID:         flight3.ID,
		}
		db.Create(&flightSegment)
	}

}
