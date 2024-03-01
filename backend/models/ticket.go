package models

import "gorm.io/gorm"

type Tickets struct {
	gorm.Model
	FlightID           uint            `json:"flightId"`
	Flight             Flights         `gorm:"foreignKey:FlightID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	FlightScheduleID   uint            `json:"flightScheduleId"`
	FlightSchedule     FlightSchedules `gorm:"foreignKey:FlightScheduleID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	AddOnBaggageWeight int             `json:"addOnBaggageWeight"`
	Status             string          `json:"status"`
	UserID             uint            `json:"userId"`
	User               Users           `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	SeatID             uint            `json:"seatId"`
	Seat               Seats           `gorm:"foreignKey:SeatID;references:ID;constraint:OnUpdate:CASCADE"`
}

func MigrateTickets(db *gorm.DB) error {
	err := db.AutoMigrate(&Tickets{})
	return err
}
