package controllers

import (
	// "encoding/json"
	"fmt"
	"log"
	"strconv"
	"time"


	"github.com/dgrijalva/jwt-go"
	"github.com/eldrian/go-fiber-postgres/database"
	"github.com/eldrian/go-fiber-postgres/models"
	"github.com/eldrian/go-fiber-postgres/services"
	"github.com/gofiber/fiber/v2"

	"gorm.io/gorm"
)

type OTPRequest struct {
	Email    string `json:"email"`
}

type OTPVerifyRequest struct {
	Email    string `json:"email"`
	Code		 string `json:"code"`
}
// SendOTP sends a one-time password (OTP) to the provided email address.
//
// @Summary Send OTP
// @Description Sends a one-time password (OTP) to the provided email address.
// @Tags Authentication
// @Accept json
// @Produce json
// @Param request_body body OTPRequest true "Request body containing the email address"
// @Success 200 {object} SuccessResponse "Otp sent successfully"
// @Failure 400 {object} ErrorResponse "Bad request"
// @Failure 500 {object} ErrorResponse "Internal Server Error"
// @Router /api/send-otp [post]
func SendOTP(c *fiber.Ctx) error {
	var requestBody OTPRequest
	if err := c.BodyParser(&requestBody); err != nil {
		log.Printf("Error parsing request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Request Body",
		})
	}
	if requestBody.Email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Email is required"})
	}

	otp := services.GenerateOTP()
	err := services.SaveOTP(requestBody.Email, otp)

	if !services.IsEmailPresent(requestBody.Email) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Email not registered"})
	}

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to save OTP"})
	}

	if err := services.SendOTPEmail(requestBody.Email, otp); err != nil {
		log.Printf("Success")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	return c.JSON(fiber.Map{"message": "OTP sent successfully"})
}

func VerifyOTP(c *fiber.Ctx) error {
	var requestBody OTPVerifyRequest

	if err := c.BodyParser(&requestBody); err != nil {
		log.Printf("Error parsing request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Request Body",
		})
	}

	email := requestBody.Email
	code := requestBody.Code

	if email == "" || code == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Email and OTP code are required"})
	}

	err := services.VerifyOTP(email, code)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": fmt.Sprintf("Invalid OTP: %s", err.Error())})
	}
	
	user := models.Users{}
	if err := database.GetDB().Where("email = ?", requestBody.Email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid credentials",
			})
		}
		return err
	}
	log.Println(user)

	if user.IsBanned {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User is banned",
		})
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})

	token, err := claims.SignedString([]byte(SecretKey))

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "could not login",
		})
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: false,
	}

	c.Cookie(&cookie)
	
	return c.JSON(fiber.Map{"message": "OTP verified successfully"})
}
