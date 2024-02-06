package models

import "gorm.io/gorm"

type Country struct {
	gorm.Model
	CountryName string `gorm:"not null" json:"countryName"`
	CountryCode string `gorm:"not null" json:"countryCode"`
}

type City struct {
	gorm.Model
	CityName string `gorm:"not null" json:"cityName"`
	CountryID uint `json:"countryId"`
	Country  Country `gorm:"foreignKey:CountryID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}


func MigrateLocations(db *gorm.DB) error {
	err := db.AutoMigrate(&Country{}, &City{})
	return err
}