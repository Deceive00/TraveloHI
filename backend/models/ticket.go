package models

import "gorm.io/gorm"

type Tickets struct{
	gorm.Model
	FlightID uint `json:"flightId"`
	Flight Flights `gorm:"foreignKey:FlightID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	SeatID uint `json:"seatId"`
	Seats Seats `gorm:"foreignKey:SeatID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	BaggageWeight float64 `json:"baggageWeight"`
	Status string `json:"status"`
}
func MigrateTickets(db *gorm.DB) error {
	err := db.AutoMigrate(&Tickets{},)
	return err
}
