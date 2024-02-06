package models

import "gorm.io/gorm"

type Airports struct {
	gorm.Model
	AirportCode string `gorm:"not null" json:"airportCode"`
	AirportName string `gorm:"not null" json:"airportName"`
	CityID      uint   `json:"cityId"`
	City        City   `gorm:"foreignKey:CityID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

func MigrateAirports(db *gorm.DB) error {
	err := db.AutoMigrate(&Airports{})
	return err
}