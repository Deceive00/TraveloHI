package models

import "gorm.io/gorm"

type FlightRoutes struct {
	gorm.Model
	Duration           int      `json:"duration"`
	DepartureAirportID uint     `json:"departureAirportId"`
	ArrivalAirportID   uint     `json:"arrivalAirportId"`
	DepartureAirport   Airports `gorm:"foreignKey:DepartureAirportID;;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	ArrivalAirport     Airports `gorm:"foreignKey:ArrivalAirportID;;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	FlightRouteCode    int      `json:"flightRouteCode"`
}

func MigrateFlightRoutes(db *gorm.DB) error {
	err := db.AutoMigrate(&FlightRoutes{})
	return err
}
