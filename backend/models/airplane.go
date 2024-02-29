package models

import "gorm.io/gorm"

type Airplanes struct{
    gorm.Model
    AirplaneName string `gorm:"not null" json:"airplaneName"`
    IsAvailable bool `gorm:"not null" json:"isAvailable"`
    AirlineID   uint      `json:"airlineId"`
    Airline     Airlines  `gorm:"foreignKey:AirlineID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
    SeatRow int `json:"seatRow"`
    SeatColumn int `json:"seatColumn"`
}


type Seats struct {
	gorm.Model
	SeatNumber string `json:"seatNumber"`
	IsAvailable bool `json:"isAvailable"`
	AirplaneID uint `json:"airplaneId"`
	Airplane Airplanes `gorm:"foreignKey:AirplaneID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	SeatClassID uint `json:"seatClassId"`
	SeatClass SeatClass `gorm:"foreignKey:SeatClassID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type SeatClass struct{
	gorm.Model
	SeatClass string `json:"seatClass"`
	Mutliplier int `json:"multiplier"`
}


