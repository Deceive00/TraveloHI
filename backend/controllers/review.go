package controllers

import (

	"github.com/eldrian/go-fiber-postgres/database"
	"github.com/eldrian/go-fiber-postgres/models"
	"github.com/gofiber/fiber/v2"
)
func GetHotelReviews(c *fiber.Ctx) error {
	db := database.GetDB()

	hotelID := c.Query("hotelId")
	if hotelID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Hotel ID is required",
		})
	}

	var reviews []models.HotelReview

	if err := db.Where("hotel_id = ?", hotelID).Find(&reviews).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch hotel reviews data",
		})
	}

	var response []map[string]interface{}

	for _, review := range reviews {
		username := "Anonymous"
		if !review.IsAnonymous {
			var user models.Users
			if err := db.First(&user, review.UserID).Error; err == nil {
				username = user.FirstName + " " + user.LastName
			}
		}

		date := review.ReviewDate.Format("2 Jan 2006")

		reviewResponse := map[string]interface{}{
			"overallRating":     review.OverallRating,
			"reviewDescription": review.ReviewDescription,
			"reviewDate":        date,
		}

		if username != "" {
			reviewResponse["username"] = username
		}

		response = append(response, reviewResponse)
	}

	return c.JSON(response)
}
