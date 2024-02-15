package controllers

import (
	"time"

	"github.com/eldrian/go-fiber-postgres/database"
	"github.com/eldrian/go-fiber-postgres/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetAllPromotions(c *fiber.Ctx) error {
	db := database.GetDB()
	userID := c.Locals("userID").(uint)
	currentDate := time.Now()

	var promotions []models.Promotions
	if err := db.
		Select("promotions.id, promotions.promotion_name, promotions.promotion_percentage, promotions.promotion_start_date, promotions.promotion_end_date, promotions.promotion_image, promotions.promotion_code").
		Joins("inner join user_promotions on promotions.id = user_promotions.promotion_id").
		Where("user_promotions.user_id = ? AND user_promotions.is_used = ?", userID, false).
		Find(&promotions).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "No promotions available",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve promotions",
		})
	}

	var validPromotions []models.Promotions
	for _, promotion := range promotions {
		endDate, err := time.Parse("2006-01-02", promotion.PromotionEndDate)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Error parsing promotion",
			})
		}
		if currentDate.Before(endDate) || currentDate.Equal(endDate) {
			validPromotions = append(validPromotions, promotion)
		}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"promotions": validPromotions,
	})
}
