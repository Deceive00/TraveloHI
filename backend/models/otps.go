// models/otp.go
package models

import (
	"gorm.io/gorm"
	"time"
)

type Otps struct {
	gorm.Model
	Email      string    `gorm:"uniqueIndex;not null"`
	Code       string    `gorm:"not null"`
	Expiration time.Time `gorm:"not null"`
}

func MigrateOTP(db *gorm.DB) error {
	err := db.AutoMigrate(&Otps{})
	return err
}
