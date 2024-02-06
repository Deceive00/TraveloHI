package controllers

import (
	"errors"
	"log"
	"strconv"

	"github.com/eldrian/go-fiber-postgres/database"
	"github.com/eldrian/go-fiber-postgres/models"
	"github.com/eldrian/go-fiber-postgres/services"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func SendCustomEmailToSubscribersController(c *fiber.Ctx) error {
	db := database.GetDB()
	var subscribedUsers []models.Users
	result := db.Where("is_subscribe = ?", true).Find(&subscribedUsers)

	if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		log.Printf("Error fetching subscribed users: %v", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}
	
	var requestBody map[string]string
	if err := c.BodyParser(&requestBody); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": "Invalid JSON format",
			})
	}

	title, titleExists := requestBody["title"]
	content, contentExists := requestBody["content"]

	if !titleExists || !contentExists {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": "Title and content are required",
			})
	}

	var subscriberEmails []string
	for _, user := range subscribedUsers {
			subscriberEmails = append(subscriberEmails, user.Email)
	}

	if err := services.SendCustomEmailToSubscribers(subscriberEmails, title, content); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": "Internal Server Error",
			})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Emails sent to subscribers successfully",
	})
}

func GetAllUserData(c *fiber.Ctx) error{
	db := database.GetDB()
	users, err := models.GetAllUsers(db)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})

	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "User succesfully retrieved",
		"users": users,
	})
}

func BanUser(c *fiber.Ctx) error {
	userID := c.Params("id") 
	userIDUint, err := strconv.ParseUint(userID, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	db := database.GetDB()

	user, err := models.GetUserByID(db, uint(userIDUint))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	user.IsBanned = true

	db.Save(&user)
	users, err := models.GetAllUsers(db)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})

	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "User banned successfully",
		"users": users,
	})
}

func UnbanUser(c *fiber.Ctx) error {
	userID := c.Params("id") 
	userIDUint, err := strconv.ParseUint(userID, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	db := database.GetDB()

	user, err := models.GetUserByID(db, uint(userIDUint))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	user.IsBanned = false

	db.Save(&user)

	users, err := models.GetAllUsers(db)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})

	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "User unbanned successfully",
		"users": users,
	})

}

