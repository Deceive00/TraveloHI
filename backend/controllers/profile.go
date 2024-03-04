package controllers

import (
	"log"
	"strconv"
	"time"

	"github.com/eldrian/go-fiber-postgres/database"
	"github.com/eldrian/go-fiber-postgres/models"
	"github.com/eldrian/go-fiber-postgres/services"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func UpdateProfileController(c *fiber.Ctx) error {

	type UpdateProfileRequest struct {
		FirstName      string `json:"firstName"`
		LastName       string `json:"lastName"`
		Email          string `json:"email"`
		DateOfBirth    string `json:"dob"`
		Gender         string `json:"gender"`
		ProfilePicture string `json:"profilePicture"`
		IsSubscribe    bool   `json:"isSubscribe"`
		Address        string `json:"address"`
		PhoneNumber    string `json:"phoneNumber"`
	}
	var requestBody UpdateProfileRequest

	if err := c.BodyParser(&requestBody); err != nil {
		log.Printf("Error parsing request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Request Body",
		})
	}
	if requestBody.DateOfBirth == "" || requestBody.Gender == "" || requestBody.ProfilePicture == "" || requestBody.FirstName == "" || requestBody.LastName == "" || requestBody.Email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Please fill all the fields",
		})
	}
	if requestBody.PhoneNumber != ""{
		if _, err := strconv.Atoi(requestBody.PhoneNumber); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": "Phone number must contain only numeric digits",
			})
	}
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

	userID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "User ID not found in context",
		})
	}
	db := database.GetDB()

	var existingUser models.Users
	if err := db.First(&existingUser, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "User not found",
			})
		}
		log.Printf("Error querying user: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	existingUser.FirstName = requestBody.FirstName
	existingUser.LastName = requestBody.LastName
	existingUser.Email = requestBody.Email
	existingUser.DateOfBirth = requestBody.DateOfBirth
	existingUser.Gender = requestBody.Gender
	existingUser.ProfilePicture = requestBody.ProfilePicture
	existingUser.IsSubscribe = requestBody.IsSubscribe

	log.Println(existingUser)

	if err := db.Save(&existingUser).Error; err != nil {
		log.Printf("Error updating user: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Profile updated successfully",
	})
}

func AddCreditCardController(c *fiber.Ctx) error {
	type AddCreditCardRequest struct {
		AccountName   string `json:"accountName"`
		AccountNumber string `json:"accountNumber"`
		BankName      string `json:"bankName"`
		CVV           string `json:"cvv"`
	}

	var requestBody AddCreditCardRequest
	if err := c.BodyParser(&requestBody); err != nil {
		log.Printf("Error parsing request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Request Body",
		})
	}

	if requestBody.AccountName == "" || requestBody.AccountNumber == "" || requestBody.BankName == "" || requestBody.CVV == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Please fill all the fields",
		})
	}

	userID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "User ID not found in context",
		})
	}

	db := database.GetDB()

	var existingCreditCard models.CreditCards
	if err := db.Where("account_number = ? AND bank_name = ?", requestBody.AccountNumber, requestBody.BankName).First(&existingCreditCard).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Account number for this bank already exists",
		})
	}
	newCreditCard := models.CreditCards{
		AccountName:   requestBody.AccountName,
		AccountNumber: requestBody.AccountNumber,
		BankName:      requestBody.BankName,
		CVV:           requestBody.CVV,
	}

	if err := db.Create(&newCreditCard).Error; err != nil {
		log.Printf("Error creating credit card: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	userCreditCard := models.UserCreditCards{
		UserID:       userID,
		CreditCardID: newCreditCard.ID,
	}

	if err := db.Create(&userCreditCard).Error; err != nil {
		log.Printf("Error creating user-credit card relationship: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Credit card added successfully",
		"data":    newCreditCard,
	})
}

type CreditCardResponse struct {
	ID            uint   `json:"id"`
	BankName      string `json:"bankName"`
	CVV           string `json:"cvv"`
	AccountName   string `json:"accountName"`
	AccountNumber string `json:"accountNumber"`
}

func GetCreditCard(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "User ID not found in context",
		})
	}
	db := database.GetDB()
	var creditCards []CreditCardResponse
	if err := db.Model(&models.CreditCards{}).
		Joins("INNER JOIN user_credit_cards ON credit_cards.id = user_credit_cards.credit_card_id").
		Where("user_credit_cards.user_id = ?", userID).
		Select("credit_cards.id, credit_cards.bank_name, credit_cards.cvv, credit_cards.account_name, credit_cards.account_number").
		Find(&creditCards).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error fetching credit cards",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"creditCards": creditCards,
	})

}

// RemoveCreditCardController removes a credit card associated with the authenticated user.
// @Summary Remove credit card
// @Description Removes the specified credit card associated with the authenticated user.
// @Security ApiKeyAuth
// @Tags Credit Cards
// @Param id path integer true "Credit Card ID" Format(int64) Example(1)
// @Success 200 {object} SuccessResponse "Credit card removed successfully"
// @Failure 400 {object} ErrorResponse "Bad request"
// @Failure 404 {object} ErrorResponse "Credit card not found"
// @Failure 500 {object} ErrorResponse "Internal Server Error"
// @Router /api/delete-credit-card/{id} [delete]
func RemoveCreditCardController(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "User ID not found in context",
		})
	}

	creditCardIDStr := c.Params("id")
	creditCardID, err := strconv.ParseUint(creditCardIDStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid credit card ID",
		})
	}

	db := database.GetDB()

	var creditCard models.CreditCards
	if err := db.Unscoped().Where("id = ?", creditCardID).First(&creditCard).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Credit card not found",
			})
		}
		log.Printf("Error querying credit card: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if err := db.Unscoped().Delete(&creditCard).Error; err != nil {
		log.Printf("Error deleting credit card: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	var remainingCreditCards []models.CreditCards

	if err := db.Table("credit_cards").
		Select("credit_cards.id as id, bank_name, cvv, account_name, account_number").
		Joins("INNER JOIN user_credit_cards ON credit_cards.id = user_credit_cards.credit_card_id").
		Where("user_credit_cards.user_id = ?", userID).
		Find(&remainingCreditCards).Error; err != nil {
		log.Printf("Error fetching remaining credit cards: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}
	var creditCardResponses []CreditCardResponse

	for _, card := range remainingCreditCards {
		creditCardResponses = append(creditCardResponses, CreditCardResponse{
			ID:            card.ID,
			BankName:      card.BankName,
			CVV:           card.CVV,
			AccountName:   card.AccountName,
			AccountNumber: card.AccountNumber,
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message":              "Credit card removed successfully",
		"remainingCreditCards": creditCardResponses,
	})
}
