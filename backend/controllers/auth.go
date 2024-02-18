package controllers

import (
	"log"
	"strconv"
	"strings"
	"time"
	"unicode"

	"github.com/dgrijalva/jwt-go"
	"github.com/eldrian/go-fiber-postgres/database"
	"github.com/eldrian/go-fiber-postgres/models"
	"github.com/eldrian/go-fiber-postgres/services"
	"github.com/gofiber/fiber/v2"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func isStrongPassword(password string) bool {
	hasUpperCase := false
	hasLowerCase := false
	hasNumber := false
	hasSpecialSymbol := false

	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpperCase = true
		case unicode.IsLower(char):
			hasLowerCase = true
		case unicode.IsDigit(char):
			hasNumber = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecialSymbol = true
		}
	}
	return hasUpperCase && hasLowerCase && hasNumber && hasSpecialSymbol

}

func isValidSecurityQuestion(question string) bool {
	options := []string{
		"What is your favorite childhood pet's name?",
		"In which city were you born?",
		"What is the name of your favorite book or movie?",
		"What is the name of the elementary school you attended?",
		"What is the model of your first car?",
	}
	for _, opt := range options {
		if question == opt {
			return true
		}
	}
	return false
}

func RegisterController(c *fiber.Ctx) error {
	type RegistrationRequest struct {
		FirstName            string                    `json:"firstName"`
		LastName             string                    `json:"lastName"`
		Email                string                    `json:"email"`
		DateOfBirth          string                    `json:"dob"`
		Gender               string                    `json:"gender"`
		Password             string                    `json:"password"`
		ConfirmationPassword string                    `json:"confirmationPassword"`
		SecurityQuestions    []models.SecurityQuestion `json:"securityQuestions"`
		ProfilePicture       string                    `json:"profilePicture"`
		IsSubscribe          bool                      `json:"isSubscribe"`
	}
	var requestBody RegistrationRequest

	if err := c.BodyParser(&requestBody); err != nil {
		log.Printf("Error parsing request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Request Body",
		})
	}

	if len(requestBody.FirstName) < 5 || len(requestBody.LastName) < 5 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "First name and last name must be more than 5 characters",
		})
	}
	if !services.ValidateEmailFormat(requestBody.Email) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email format is not valid",
		})
	}
	dob, err := time.Parse("2006-01-02", requestBody.DateOfBirth)
	if err != nil || dob.After(time.Now().AddDate(-13, 0, 0)) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User age must be more than or equal to 13 years",
		})
	}

	if requestBody.Gender != "Male" && requestBody.Gender != "Female" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid gender",
		})
	}

	if len(requestBody.Password) < 8 || len(requestBody.Password) > 30 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Password must be between 8 and 30 characters",
		})
	}

	if !isStrongPassword(requestBody.Password) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special symbol",
		})
	}

	if requestBody.ConfirmationPassword != requestBody.Password {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Password is not the same as confirmation password!",
		})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(requestBody.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	for _, sq := range requestBody.SecurityQuestions {
		if !isValidSecurityQuestion(sq.Questions) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid security question",
			})
		}
	}

	newUser := models.Users{
		FirstName:         requestBody.FirstName,
		LastName:          requestBody.LastName,
		Email:             requestBody.Email,
		DateOfBirth:       requestBody.DateOfBirth,
		Gender:            requestBody.Gender,
		Password:          string(hashedPassword),
		IsBanned:          false,
		IsSubscribe:       requestBody.IsSubscribe,
		SecurityQuestions: requestBody.SecurityQuestions,
		ProfilePicture:    requestBody.ProfilePicture,
		IsLoggedIn:        false,
	}

	db := database.GetDB()

	if err := db.Create(&newUser).Error; err != nil {
		log.Printf("Error creating user: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}
	if err := services.SendRegistrationEmail(newUser.Email); err != nil {
		log.Printf("Email gagal")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{

			"error": "Internal Server Error",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Registration Succesfully",
	})
}

const SecretKey = "secret"

func LoginController(c *fiber.Ctx) error {
	type LoginRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	var requestBody LoginRequest

	if err := c.BodyParser(&requestBody); err != nil {
		log.Printf("Error parsing request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Request Body",
		})
	}

	if requestBody.Email == "" || requestBody.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email and password are required",
		})
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

	if user.IsBanned {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User is banned",
		})
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(requestBody.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}
	currentTime := time.Now().Unix()
	log.Println(currentTime)

	if currentTime < user.LoggedInExpiry {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "User is logged in in another place",
		})
	}

	if user.IsLoggedIn {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "User is logged in in another place",
		})
	}
	
	db := database.GetDB()
	expiryTime := time.Now().Add(time.Hour * 24).Unix()
	user.LoggedInExpiry = expiryTime
	user.IsLoggedIn = true

	if err := db.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: expiryTime,
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

	return c.JSON(fiber.Map{
		"message": "success",
	})

}

func GetUser(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	claims := token.Claims.(*jwt.StandardClaims)

	var user models.Users

	database.GetDB().Where("id = ?", claims.Issuer).First(&user)

	return c.JSON(user)
}

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}
	userID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "User ID not found in context",
		})
	}
	db := database.GetDB()
	user, err := models.GetUserByID(db, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "User not found",
		})
	}
	user.IsLoggedIn = false
	user.LoggedInExpiry = -1
	if err := db.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}
	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func ForgotPasswordController(c *fiber.Ctx) error {
	var requestBody struct {
		Email string `json:"email"`
	}

	if err := c.BodyParser(&requestBody); err != nil {
		log.Printf("Error parsing request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Request Body",
		})
	}

	user := models.Users{}
	if err := database.GetDB().Where("email = ?", requestBody.Email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "User not found",
			})
		}
		return err
	}

	if user.IsBanned {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User is banned",
		})
	}

	securityQuestions := make([]string, len(user.SecurityQuestions))
	for i, sq := range user.SecurityQuestions {
		securityQuestions[i] = sq.Questions
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"questions": securityQuestions,
	})
}

func ValidateSecurityAnswerController(c *fiber.Ctx) error {
	var requestBody struct {
		Email    string `json:"email"`
		Answer   string `json:"answer"`
		Question string `json:"question"`
	}

	if err := c.BodyParser(&requestBody); err != nil {
		log.Printf("Error parsing request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Request Body",
		})
	}

	user := models.Users{}
	if err := database.GetDB().Where("email = ?", requestBody.Email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "User not found",
			})
		}
		return err
	}

	var matchedSecurityQuestion *models.SecurityQuestion
	for _, question := range user.SecurityQuestions {
		if strings.EqualFold(requestBody.Answer, question.Answers) && requestBody.Question == question.Questions {
			matchedSecurityQuestion = &question
			break
		}
	}

	if matchedSecurityQuestion == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Incorrect answer",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "success",
	})
}

func SavePassword(c *fiber.Ctx) error {
	var requestBody struct {
		Email                string `json:"email"`
		ConfirmationPassword string `json:"confirmationPassword"`
		NewPassword          string `json:"newPassword"`
	}

	if err := c.BodyParser(&requestBody); err != nil {
		log.Printf("Error parsing request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Request Body",
		})
	}
	log.Println(requestBody)
	user := models.Users{}
	if err := database.GetDB().Where("email = ?", requestBody.Email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "User not found",
			})
		}
		return err
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(requestBody.NewPassword))
	if err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Password cannot be the same as the old one",
		})
	}

	if requestBody.ConfirmationPassword != requestBody.NewPassword {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Confirmation password does not match the new password",
		})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(requestBody.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing new password: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	user.Password = string(hashedPassword)

	if err := database.GetDB().Save(&user).Error; err != nil {
		log.Printf("Error saving new password to the database: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Password updated successfully",
	})
}
