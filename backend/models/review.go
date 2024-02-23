package models

import (
	"time"

	"gorm.io/gorm"
)

type HotelReview struct {
	gorm.Model
	HotelID           uint      `json:"hotelId"`
	Hotels            Hotels    `gorm:"foreignKey:HotelID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	UserID            uint      `json:"userId"`
	User              Users     `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	CleanlinessRating int       `json:"cleanlinessRating"`
	ComfortnessRating int       `json:"comfortnessRating"`
	LocationRating    int       `json:"locationRating"`
	ServiceRating     int       `json:"serviceRating"`
	OverallRating     int       `json:"overallRating"`
	IsAnonymous       bool      `json:"isAnonymous"`
	ReviewDescription string    `json:"reviewDescription"`
	ReviewDate        time.Time `json:"reviewDate"`
}

func MigrateHotelReview(db *gorm.DB) error {
	err := db.AutoMigrate(&HotelReview{})
	return err
}
