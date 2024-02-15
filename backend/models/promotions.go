package models

import "gorm.io/gorm"

type Promotions struct {
	gorm.Model
	PromotionName string `gorm:"not null" json:"promotionName"`
	PromotionType string `gorm:"not null" json:"promotionType"`
	PromotionCode string `gorm:"not null" json:"promotionCode"`
	PromotionPercentage int `gorm:"not null" json:"promotionPercentage"`
	PromotionStartDate string `gorm:"not null" json:"promotionStartDate"`
	PromotionEndDate string `gorm:"not null" json:"promotionEndDate"`
	PromotionImage string `gorm:"not null" json:"promotionImage"`
}

type UserPromotions struct {
	PromotionID uint `json:"promotionId"`
	Promotion Promotions`gorm:"foreignKey:PromotionID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	UserID uint `json:"userId"`
	User Users `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	IsUsed	bool	 `json:"isUsed"`
}
func (UserPromotions) TableName() string {
	return "user_promotions"
}

func (hf *UserPromotions) BeforeCreate(tx *gorm.DB) error {
	tx.Statement.Set("gorm:primaryKey", []string{"promotion_id", "user_id"})
	return nil
}

func MigratePromotions(db *gorm.DB) error {
	err := db.AutoMigrate(&Promotions{}, &UserPromotions{})
	return err
}