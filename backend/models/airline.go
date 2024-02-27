package models

import "gorm.io/gorm"

type Airlines struct {
    gorm.Model
    AirlineName  string `gorm:"not null" json:"airlineName"`
    AirlineImage string `gorm:"not null" json:"airlineImage"`
    AirlineCode  string `gorm:"not null" json:"airlineCode"`
}
