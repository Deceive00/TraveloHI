package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type Users struct {
	ID                   uint              `gorm:"primary_key;autoIncrement" json:"id"`
	FirstName            string            `json:"firstName"`
	LastName             string            `json:"lastName"`
	Email                string            `gorm:"uniqueIndex" json:"email"`
	DateOfBirth          string            `json:"dob"`
	Gender               string            `json:"gender"`
	Password             string            `json:"-"`
	IsBanned             bool            	 `json:"isBanned"`
	IsSubscribe          bool              `json:"isSubscribe"`
	SecurityQuestions    SecurityQuestionArray `json:"securityQuestions" gorm:"type:json"`
	ProfilePicture			 string						 `json:"profilePicture"`
	CreatedAt            time.Time         `json:"-"`
	UpdatedAt            time.Time         `json:"-"`
}

type SecurityQuestion struct {
	Answers  string `json:"answer"`
	Questions string `json:"question"`
}

type SecurityQuestionArray []SecurityQuestion

func (sqa *SecurityQuestionArray) Scan(value interface{}) error {
	if data, ok := value.([]byte); ok {
		return json.Unmarshal(data, sqa)
	}
	return nil
}

func (sqa SecurityQuestionArray) Value() (driver.Value, error) {
	return json.Marshal(sqa)
}

func MigrateUsers(db *gorm.DB) error {
	err := db.AutoMigrate(&Users{})
	return err
}
