package models

import (
	"time"

	"gorm.io/gorm"
)

type Flights struct {
	gorm.Model
	FlightPrice      float64 `json:"flightPrice"`
	IsTransit        bool    `json:"isTransit"`
	IsIncludeBaggage bool    `json:"isIncludeBaggage"`
	BaggageMaxWeight int     `json:"baggageMaxWeight"`
	CabinMaxWeight   int     `json:"cabinMaxWeight"`
}

type FlightSegment struct {
	FlightID         uint            `json:"flightId"`
	Flight           Flights         `gorm:"foreignKey:FlightID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	FlightScheduleID uint            `json:"flightScheduleId"`
	FlightSchedule   FlightSchedules `gorm:"foreignKey:FlightScheduleID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
type FlightSchedules struct {
	gorm.Model
	FlightRouteID   uint         `json:"flightRouteId"`
	FlightRoute     FlightRoutes `gorm:"foreignKey:FlightRouteID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	ArrivalTime     time.Time    `json:"arrivalTime"`
	DepartureTime   time.Time    `json:"departureTime"`
	AirplaneID      uint         `json:"airplaneId"`
	Airplane        Airplanes    `gorm:"foreignKey:AirplaneID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

func MigrateFlight(db *gorm.DB) error {
	err := db.AutoMigrate(&Airlines{}, &Airplanes{}, &SeatClass{}, &Seats{}, &Flights{}, &FlightSchedules{}, &FlightSegment{})
	return err
}
