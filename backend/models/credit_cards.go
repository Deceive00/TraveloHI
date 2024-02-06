package models

import (
	"gorm.io/gorm"
)

type CreditCards struct {
	gorm.Model
	AccountName   string `gorm:"not null"`
	AccountNumber string `gorm:"not null"`
	BankName      string `gorm:"not null"`
	CVV           string `gorm:"not null;size:3"`
}

type UserCreditCards struct {
	gorm.Model
	UserID       uint
	User         Users `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	CreditCardID uint
	CreditCard   CreditCards `gorm:"foreignKey:CreditCardID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

func (ucc *UserCreditCards) Associate(db *gorm.DB) {
	db.Model(ucc).Association("CreditCard").Append(&ucc.CreditCard)
}

func MigrateCreditCards(db *gorm.DB) error {
	err := db.AutoMigrate(&CreditCards{}, &UserCreditCards{})
	return err
}
