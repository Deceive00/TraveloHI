package models

import "gorm.io/gorm"

type HotelCart struct {
	gorm.Model
	CheckInDate  string     `json:"checkInDate"`
	CheckOutDate string     `json:"checkOutDate"`
	HotelID      uint       `json:"hotelId"`
	Hotel        Hotels     `gorm:"foreignKey:HotelID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	RoomID   uint       `json:"roomId"`
	Room         HotelRooms `gorm:"foreignKey:HotelID;references:HotelID,RoomID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	UserID       uint       `json:"userId"`
	TotalRooms   int        `json:"totalRooms"`
	User         Users      `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	IsPaid       bool       `json:"isPaid"`
}

func MigrateCarts(db *gorm.DB) error {
	err := db.AutoMigrate(&HotelCart{})
	return err
}
