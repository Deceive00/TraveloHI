package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type Hotels struct {
	ID                uint           `gorm:"primaryKey" json:"id"`
	CreatedAt         time.Time      `json:"createdAt"`
	UpdatedAt         time.Time      `json:"updatedAt"`
	DeletedAt         gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
	HotelName         string         `gorm:"not null" json:"hotelName"`
	HotelDescription  string         `gorm:"not null" json:"hotelDescription"`
	HotelAddress      string         `gorm:"not null" json:"hotelAddress"`
	HotelRating       float64        `gorm:"not null" json:"hotelRating"`
	CityID            uint           `json:"cityId"`
	City              City           `gorm:"foreignKey:CityID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	HotelPicture      Pictures       `json:"hotelPicture" gorm:"type:json"`
	HotelStar         int            `json:"hotelStar"`
	CleanlinessRating float64        `json:"cleanlinessRating"`
	ComfortnessRating float64        `json:"comfortnessRating"`
	LocationRating    float64        `json:"locationRating"`
	ServiceRating     float64        `json:"serviceRating"`
	OverallRating     float64        `json:"overallRating"`
}

type Pictures []string

func (hp *Pictures) Scan(value interface{}) error {
	if data, ok := value.([]byte); ok {
		return json.Unmarshal(data, hp)
	}
	return nil
}

func (hp Pictures) Value() (driver.Value, error) {
	return json.Marshal(hp)
}

type Facilities struct {
	gorm.Model
	FacilityName string `gorm:"not null" json:"facilityName"`
}

type HotelFacilities struct {
	HotelID    uint           `json:"hotelId"`
	Hotels     Hotels         `gorm:"foreignKey:HotelID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	FacilityID uint           `json:"facilityId"`
	Facilities Facilities     `gorm:"foreignKey:FacilityID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	CreatedAt  time.Time      `json:"createdAt"`
	UpdatedAt  time.Time      `json:"updatedAt"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}

func (HotelFacilities) TableName() string {
	return "hotel_facilities"
}

func (hf *HotelFacilities) BeforeCreate(tx *gorm.DB) error {
	tx.Statement.Set("gorm:primaryKey", []string{"hotel_id", "facility_id"})
	return nil
}

type HotelRooms struct {
	gorm.Model
	HotelID         uint     `json:"hotelId"`
	Hotel          Hotels   `gorm:"foreignKey:HotelID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	RoomName        string   `json:"roomName"`
	RoomPrice       float64  `json:"roomPrice"`
	RoomCapacity    int      `json:"roomCapacity"`
	IsRefundable    bool     `json:"isRefundable"`
	IsSmoking       bool     `json:"isSmoking"`
	IsReschedulable bool     `json:"isReschedulable"`
	GotBreakfast    bool     `json:"gotBreakfast"`
	GotFreeWifi     bool     `json:"gotFreeWifi"`
	RoomPicture     Pictures `json:"roomPicture" gorm:"type:json"`
	TotalRoom       int      `json:"totalRoom"`
	RoomSize        float64  `json:"roomSize"`
	RoomBed         string   `json:"roomBed"`
}

func MigrateHotels(db *gorm.DB) error {
	err := db.AutoMigrate(&Hotels{}, &Facilities{}, &HotelFacilities{}, &HotelRooms{})
	if err != nil {
		return err
	}
	return err
}

func IsDuplicateHotelName(db *gorm.DB, name string) bool {
	var count int64
	db.Model(&Hotels{}).Where("LOWER(hotel_name) = LOWER(?)", name).Count(&count)
	return count > 0
}
