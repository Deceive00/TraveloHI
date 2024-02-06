package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type Hotels struct {
	ID               uint           `gorm:"primaryKey" json:"id"`
	CreatedAt        time.Time      `json:"createdAt"`
	UpdatedAt        time.Time      `json:"updatedAt"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
	HotelName        string         `gorm:"not null" json:"hotelName"`
	HotelDescription string         `gorm:"not null" json:"hotelDescription"`
	HotelAddress     string         `gorm:"not null" json:"hotelAddress"`
	HotelRating      float64        `gorm:"not null" json:"hotelRating"`
	CityID           uint           `json:"cityId"`
	City             City           `gorm:"foreignKey:CityID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	HotelPicture     HotelPictures  `json:"hotelPicture" gorm:"type:json"`
}

type HotelPictures []string
func (hp *HotelPictures) Scan(value interface{}) error {
	if data, ok := value.([]byte); ok {
		return json.Unmarshal(data, hp)
	}
	return nil
}

func (hp HotelPictures) Value() (driver.Value, error) {
	return json.Marshal(hp)
}

type Facilities struct {
	gorm.Model
	FacilityName string `gorm:"not null" json:"facilityName"`

}
func MigrateHotels(db *gorm.DB) error {
	err := db.AutoMigrate(&Hotels{})
	return err
}
