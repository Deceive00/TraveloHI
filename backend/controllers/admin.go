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
// SendCustomEmailToSubscribersController sends a custom email to all subscribed users.
// @Summary Send Custom Email to Subscribers
// @Description Sends a custom email to all subscribed users with the provided title and content.
// @Accept json
// @Produce json
// @Tags Email
// @Security ApiKeyAuth
// @Param title body string true "Title of the email" Example: "New Updates"
// @Param content body string true "Content of the email" Example: "Check out our latest blog post!"
// @Success 200 {object} SuccessResponse "Emails sent to subscribers successfully"
// @Failure 400 {object} ErrorResponse "Bad request"
// @Failure 500 {object} ErrorResponse "Internal Server Error"
// @Router /api/admin/send-newsletter [post]
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
	log.Print(requestBody)
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

func GetAllUserData(c *fiber.Ctx) error {
	db := database.GetDB()
	users, err := models.GetAllUsers(db)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})

	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "User succesfully retrieved",
		"users":   users,
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
	if user.Email == "travelohi00@gmail.com" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot ban yourself"})
	}
	user.IsBanned = true

	db.Save(&user)
	users, err := models.GetAllUsers(db)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})

	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "User banned successfully",
		"users":   users,
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
	if user.Email == "travelohi00@gmail.com" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot ban yourself"})
	}
	user.IsBanned = false

	db.Save(&user)

	users, err := models.GetAllUsers(db)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})

	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "User unbanned successfully",
		"users":   users,
	})

}

type CityInfo struct {
	CityID    uint   `json:"cityId"`
	CountryID uint   `json:"countryId"`
	FullName  string `json:"fullName"`
}

func GetAllCity(c *fiber.Ctx) error {
	db := database.GetDB()
	var cities []models.City
	var cityInfos []CityInfo

	if err := db.Find(&cities).Error; err != nil {
		log.Printf("Error fetching cities: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	for _, city := range cities {
		var country models.Country
		if err := db.First(&country, city.CountryID).Error; err != nil {
			log.Printf("Error fetching country for city ID %d: %v", city.ID, err)
			continue
		}
		fullName := city.CityName + ", " + country.CountryName
		cityInfos = append(cityInfos, CityInfo{
			CityID:    city.ID,
			CountryID: country.ID,
			FullName:  fullName,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Cities retrieved successfully",
		"cities":  cityInfos,
	})
}

func GetAllFacility(c *fiber.Ctx) error {
	db := database.GetDB()
	var facilities []models.Facilities

	if err := db.Find(&facilities).Error; err != nil {
		log.Printf("Error fetching cities: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	return c.Status(fiber.StatusOK).JSON(facilities)
}

func AddHotelController(c *fiber.Ctx) error {
	db := database.GetDB()
	type Room struct {
		RoomName        string          `json:"roomName"`
		RoomPrice       float64         `json:"roomPrice"`
		RoomCapacity    int             `json:"roomCapacity"`
		IsRefundable    bool            `json:"isRefundable"`
		IsSmoking       bool            `json:"isSmoking"`
		IsReschedulable bool            `json:"isReschedulable"`
		GotBreakfast    bool            `json:"gotBreakfast"`
		GotFreeWifi     bool            `json:"gotFreeWifi"`
		RoomPicture     models.Pictures `json:"roomPicture" gorm:"type:json"`
		TotalRoom       int             `json:"totalRooms"`
	}

	type AddHotelRequest struct {
		HotelName        string          `json:"hotelName"`
		CityID           uint            `json:"cityId"`
		FacilityID       []int           `json:"facilityId"`
		HotelAddress     string          `json:"hotelAddress"`
		HotelDescription string          `json:"hotelDescription"`
		HotelRating      float64         `json:"hotelRating"`
		HotelPicture     models.Pictures `json:"hotelPicture" gorm:"type:json"`
		Rooms            []Room          `json:"rooms" gorm:"type:json"`
	}

	var requestBody AddHotelRequest

	if err := c.BodyParser(&requestBody); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid JSON format",
		})
	}
	if requestBody.HotelName == "" || requestBody.HotelAddress == "" || len(requestBody.Rooms) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Hotel name, hotel address, and at least one room are required",
		})
	}

	if len(requestBody.FacilityID) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Please choose a facility",
		})
	}
	if models.IsDuplicateHotelName(db, requestBody.HotelName) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Hotel name already exists",
		})
	}

	if len(requestBody.HotelPicture) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Please insert hotel images!",
		})
	}

	for _, room := range requestBody.Rooms {

		if room.RoomName == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Please fill all the fields!",
			})
		} else if room.RoomCapacity <= 0 || room.RoomPrice <= 0 || room.TotalRoom <= 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Please fill all the fields!",
			})
		} else if len(room.RoomPicture) == 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Please insert room pictures!",
			})
		}
	}
	hotel := models.Hotels{
		HotelName:        requestBody.HotelName,
		HotelDescription: requestBody.HotelDescription,
		HotelAddress:     requestBody.HotelAddress,
		HotelRating:      0,
		CityID:           requestBody.CityID,
		HotelPicture:     requestBody.HotelPicture,
	}
	if err := db.Create(&hotel).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create hotel",
		})
	}

	for _, room := range requestBody.Rooms {
		hotelRoom := models.HotelRooms{
			HotelID:         hotel.ID,
			RoomName:        room.RoomName,
			RoomPrice:       room.RoomPrice,
			RoomCapacity:    room.RoomCapacity,
			IsRefundable:    room.IsRefundable,
			IsSmoking:       room.IsSmoking,
			IsReschedulable: room.IsReschedulable,
			GotBreakfast:    room.GotBreakfast,
			GotFreeWifi:     room.GotFreeWifi,
			RoomPicture:     room.RoomPicture,
			TotalRoom:       room.TotalRoom,
		}

		if err := db.Create(&hotelRoom).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create room",
			})
		}
	}

	for _, facilityID := range requestBody.FacilityID {
		hotelFacility := models.HotelFacilities{
			HotelID:    hotel.ID,
			FacilityID: uint(facilityID),
		}
		if err := db.Create(&hotelFacility).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to associate facilities with hotel",
			})
		}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Hotel created successfully",
	})

}

func AddPromotionController(c *fiber.Ctx) error {

	type AddPromotionRequest struct {
		PromotionName       string `json:"promotionName"`
		PromotionType       string `json:"promotionType"`
		PromotionCode       string `json:"promotionCode"`
		PromotionPercentage int    `json:"promotionPercentage"`
		PromotionStartDate  string `json:"promotionStartDate"`
		PromotionEndDate    string `json:"promotionEndDate"`
		PromotionImage      string `json:"promotionImage"`
	}
	var requestBody AddPromotionRequest

	if err := c.BodyParser(&requestBody); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid JSON format",
		})
	}
	db := database.GetDB()
	if requestBody.PromotionName == "" || requestBody.PromotionType == "" || requestBody.PromotionCode == "" || requestBody.PromotionStartDate == "" || requestBody.PromotionEndDate == "" || requestBody.PromotionImage == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Please fill all the fields!",
		})
	}
	if requestBody.PromotionPercentage <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Percentange must be greater than 0!",
		})
	}

	var existingPromotion models.Promotions
	if err := db.Where("promotion_code = ?", requestBody.PromotionCode).First(&existingPromotion).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Promotion code already exists",
		})
	}

	tx := db.Begin()

	newPromotion := models.Promotions{
		PromotionName:       requestBody.PromotionName,
		PromotionType:       requestBody.PromotionType,
		PromotionCode:       requestBody.PromotionCode,
		PromotionPercentage: requestBody.PromotionPercentage,
		PromotionStartDate:  requestBody.PromotionStartDate,
		PromotionEndDate:    requestBody.PromotionEndDate,
		PromotionImage:      requestBody.PromotionImage,
	}

	if err := db.Create(&newPromotion).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create room",
		})
	}

	users, err := models.GetAllUsers(db)
	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve users",
		})
	}

	for _, user := range users {
		userPromotion := models.UserPromotions{
			PromotionID: newPromotion.ID,
			UserID:      user.ID,
			IsUsed:      false,
		}
		if err := tx.Create(&userPromotion).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to associate promotion with user",
			})
		}
	}

	tx.Commit()

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Promotions inserted successfully",
	})
}

func GetAdminAuthorization(c *fiber.Ctx) error {
	_, ok := c.Locals("userID").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Authorized!",
	})
}

func GetAllPromotions(c *fiber.Ctx) error {
	db := database.GetDB()

	var promotions []models.Promotions
	if err := db.Find(&promotions).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "No promotions available",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve promotions",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"promotions": promotions,
	})
}
type UpdatePromotionRequest struct {
	PromotionName       string `json:"promotionName"`
	PromotionType       string `json:"promotionType"`
	PromotionCode       string `json:"promotionCode"`
	PromotionPercentage int    `json:"promotionPercentage"`
	PromotionStartDate  string `json:"promotionStartDate"`
	PromotionEndDate    string `json:"promotionEndDate"`
	PromotionImage      string `json:"promotionImage"`
}

// UpdatePromotionController updates an existing promotion.
// @Summary Update Promotion
// @Description Updates an existing promotion with the provided details.
// @Accept json
// @Produce json
// @Tags Promotions
// @Security ApiKeyAuth
// @Param requestBody body UpdatePromotionRequest true "Request Body"
// @Success 200 {object} SuccessResponse "Promotion updated successfully"
// @Failure 400 {object} ErrorResponse "Bad request"
// @Failure 404 {object} ErrorResponse "Promotion code does not exist"
// @Failure 500 {object} ErrorResponse "Internal Server Error"
// @Router /api/admin/update-promotion [put]
func UpdatePromotionController(c *fiber.Ctx) error {

	
	var requestBody UpdatePromotionRequest
	if err := c.BodyParser(&requestBody); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": "Invalid JSON format",
			})
	}
	
	db := database.GetDB()
	
	var existingPromotion models.Promotions
	if err := db.Where("promotion_code = ?", requestBody.PromotionCode).First(&existingPromotion).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
					"error": "Promotion code does not exist",
			})
	}
	
	existingPromotion.PromotionName = requestBody.PromotionName
	existingPromotion.PromotionType = requestBody.PromotionType
	existingPromotion.PromotionPercentage = requestBody.PromotionPercentage
	existingPromotion.PromotionStartDate = requestBody.PromotionStartDate
	existingPromotion.PromotionEndDate = requestBody.PromotionEndDate
	existingPromotion.PromotionImage = requestBody.PromotionImage
	if err := db.Save(&existingPromotion).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": "Failed to update promotion",
			})
	}
	
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Promotion updated successfully",
	})
}
