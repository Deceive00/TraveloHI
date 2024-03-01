package services

import (
	"errors"
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/eldrian/go-fiber-postgres/database"
	"github.com/eldrian/go-fiber-postgres/models"
	"gorm.io/gorm"
)

const (
	otpLength    = 6
	otpExpirationMinutes = 5 
)

func GenerateOTP() string {
	digits := "0123456789"
	otp := make([]byte, otpLength)

	for i := range otp {
		otp[i] = digits[rand.Intn(len(digits))]
	}

	return string(otp)
}

func SaveOTP(email, code string) error {
	db := database.GetDB()

	var existingOTP models.Otps
	result := db.Where("email = ?", email).First(&existingOTP)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		expiration := time.Now().Add(otpExpirationMinutes * time.Minute)
		otp := models.Otps{
			Email:      email,
			Code:       code,
			Expiration: expiration,
		}

		return db.Create(&otp).Error
	} else if result.Error != nil {
		return result.Error
	}

	expiration := time.Now().Add(otpExpirationMinutes * time.Minute)
	existingOTP.Code = code
	existingOTP.Expiration = expiration

	return db.Save(&existingOTP).Error
}



func VerifyOTP(email, code string) error {
	db := database.GetDB()
	
	var otp models.Otps
	result := db.Where("email = ? AND code = ? AND expiration > ?", email, code, time.Now()).First(&otp)
	log.Print(result)
	if result.Error != nil {
		return fmt.Errorf("Invalid OTP")
	}

	return nil
}

