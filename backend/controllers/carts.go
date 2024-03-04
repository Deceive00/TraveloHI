package controllers

import (
	"log"
	"time"

	"github.com/eldrian/go-fiber-postgres/database"
	"github.com/eldrian/go-fiber-postgres/models"
	"github.com/eldrian/go-fiber-postgres/services"
	"github.com/gofiber/fiber/v2"
)

func InsertHotelCart(c *fiber.Ctx) error {
	var requestBody struct {
		CheckInDate  string `json:"checkInDate"`
		CheckOutDate string `json:"checkOutDate"`
		TotalRooms   int    `json:"totalRooms"`
		HotelID      uint   `json:"hotelId"`
		RoomId       uint   `json:"roomId"`
	}
	userID := c.Locals("userID").(uint)
	if err := c.BodyParser(&requestBody); err != nil {
		log.Printf("Error parsing request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Request Body",
		})
	}
	checkInDate, err := time.Parse("2006-01-02", requestBody.CheckInDate)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Check-In Date Format",
		})
	}

	checkOutDate, err := time.Parse("2006-01-02", requestBody.CheckOutDate)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Check-Out Date Format",
		})
	}

	if checkInDate.Equal(checkOutDate) || checkInDate.After(checkOutDate) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Check-Out Date must be after Check-In Date and not the same",
		})
	}

	if checkInDate.Before(time.Now()) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Check-In Date cannot be in the past",
		})
	}

	if checkOutDate.Before(time.Now()) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Check-In Date cannot be in the past",
		})
	}
	db := database.GetDB()
	var hotelRoom models.HotelRooms
	if err := db.Where("hotel_id = ? AND id = ?", requestBody.HotelID, requestBody.RoomId).Find(&hotelRoom).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Room not found",
		})
	}
	if requestBody.TotalRooms <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Please insert the total room you want to insert!",
		})
	}
	log.Print(hotelRoom.TotalRoom)
	if hotelRoom.TotalRoom-requestBody.TotalRooms < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "There are no room available",
		})
	}
	var existingHotelCart models.HotelCart
	if err := db.Where("check_in_date = ? AND check_out_date = ? AND hotel_id = ? AND room_id = ? AND user_id = ?",
		requestBody.CheckInDate, requestBody.CheckOutDate, requestBody.HotelID, requestBody.RoomId, userID).First(&existingHotelCart).Error; err == nil {
		existingHotelCart.TotalRooms = existingHotelCart.TotalRooms + requestBody.TotalRooms
		if err := db.Save(&existingHotelCart).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Success inserting to cart",
		})
	} else {
		log.Print(requestBody.RoomId)
		cart := models.HotelCart{
			UserID:       userID,
			HotelID:      requestBody.HotelID,
			RoomID:       requestBody.RoomId,
			TotalRooms:   requestBody.TotalRooms,
			CheckInDate:  requestBody.CheckInDate,
			CheckOutDate: requestBody.CheckOutDate,
			IsPaid:       false,
		}

		if err := db.Create(&cart).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success inserting to cart",
	})
}

func InsertFlightCart(c *fiber.Ctx) error {
	var requestBody []struct {
		SeatID             uint `json:"seatId"`
		FlightID           uint `json:"flightId"`
		AddOnBaggageWeight int  `json:"addOnBaggageWeight"`
		FlightScheduleID   uint `json:"flightScheduleId"`
	}
	if err := c.BodyParser(&requestBody); err != nil {
		log.Printf("Error parsing request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Request Body",
		})
	}
	db := database.GetDB()

	for _, req := range requestBody {
		userID := c.Locals("userID").(uint)
		if req.SeatID <= 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Please choose a seat!",
			})
		}
		if req.FlightID <= 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Please choose a flight!",
			})
		}
		if req.FlightScheduleID <= 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Please choose a flight!",
			})
		}

		var seat models.Seats
		if err := db.Where("id = ?", req.SeatID).First(&seat).Error; err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Seat not found!",
			})
		}

		if !seat.IsAvailable {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "The seat is already booked!",
			})
		}
		var existingTicket models.Tickets
		if err := db.Where("flight_id = ? AND seat_id = ? AND flight_schedule_id = ? AND status = ?",
			req.FlightID, req.SeatID, req.FlightScheduleID, "unpaid").First(&existingTicket).Error; err == nil {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"error": "Flight is on the cart!",
			})
		}

		ticket := models.Tickets{
			FlightID:           uint(req.FlightID),
			AddOnBaggageWeight: req.AddOnBaggageWeight,
			Status:             "unpaid",
			UserID:             userID,
			SeatID:             req.SeatID,
			FlightScheduleID:   req.FlightScheduleID,
		}

		if err := db.Create(&ticket).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success inserting to cart",
	})
}

func GetCarts(c *fiber.Ctx) error {
	db := database.GetDB()
	userID := c.Locals("userID").(uint)
	var hotelCarts []models.HotelCart
	if err := db.Preload("Hotel").Preload("Room").Where("user_id = ? AND is_paid = ?", userID, false).Find(&hotelCarts).Error; err != nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "There is no data to be checked out yet",
		})
	}

	if len(hotelCarts) > 0 {
		for i, h := range hotelCarts {
			var room models.HotelRooms
			if err := db.Where("id = ?", h.RoomID).Find(&room).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": "Internal Server Error",
				})
			}
			h.Room = room
			hotelCarts[i].Room = room
		}
	}

	var flightCarts []models.Tickets
	if err := db.Preload("Seat.SeatClass").Preload("Seat.Airplane").Preload("Flight").Preload("FlightSchedule.FlightRoute.DepartureAirport.City.Country").Preload("FlightSchedule.FlightRoute.ArrivalAirport.City.Country").Preload("FlightSchedule.Airplane.Airline.").Where("user_id = ? AND status = ?", userID, "unpaid").Find(&flightCarts).Error; err != nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "There is no data to be checked out yet",
		})
	}
	flightCartMap := make(map[uint][]models.Tickets)

	for _, flight := range flightCarts {
		flightCartMap[flight.FlightID] = append(flightCartMap[flight.FlightID], flight)
	}

	var flightResponse []struct {
		FlightID uint `json:"flightId"`
		Tickets  []models.Tickets
	}

	for flightID, tickets := range flightCartMap {
		flightResponse = append(flightResponse, struct {
			FlightID uint `json:"flightId"`
			Tickets  []models.Tickets
		}{
			FlightID: flightID,
			Tickets:  tickets,
		})
	}
	
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"hotelCarts":  hotelCarts,
		"flightCarts": flightResponse,
	})
}

func UpdateHotelCarts(c *fiber.Ctx) error {
	var requestBody struct {
		CheckInDate  string `json:"checkInDate"`
		CheckOutDate string `json:"checkOutDate"`
		TotalRooms   int    `json:"totalRooms"`
		ID           int    `json:"id"`
	}
	if err := c.BodyParser(&requestBody); err != nil {
		log.Printf("Error parsing request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Request Body",
		})
	}
	var existingHotelCart models.HotelCart
	db := database.GetDB()
	checkInDate, err := time.Parse("2006-01-02", requestBody.CheckInDate)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Check-In Date Format",
		})
	}

	checkOutDate, err := time.Parse("2006-01-02", requestBody.CheckOutDate)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Check-Out Date Format",
		})
	}

	if checkInDate.Equal(checkOutDate) || checkInDate.After(checkOutDate) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Check-Out Date must be after Check-In Date and not the same",
		})
	}

	if checkInDate.Before(time.Now()) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Check-In Date cannot be in the past",
		})
	}

	if checkOutDate.Before(time.Now()) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Check-In Date cannot be in the past",
		})
	}
	if requestBody.TotalRooms <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Please insert the total room you want to insert!",
		})
	}
	if err := db.Where("id = ?", requestBody.ID).Find(&existingHotelCart).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Please input valid ID!",
		})
	}

	existingHotelCart.CheckInDate = requestBody.CheckInDate
	existingHotelCart.CheckOutDate = requestBody.CheckOutDate
	existingHotelCart.TotalRooms = requestBody.TotalRooms

	if err := db.Save(&existingHotelCart).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Checkout success updated",
	})
}

func GetUserCreditCards(c *fiber.Ctx) error {
	db := database.GetDB()
	userID := c.Locals("userID").(uint)
	var userCreditCards []models.UserCreditCards
	if err := db.Where("user_id =?", userID).Find(&userCreditCards).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}
	var creditCard []models.CreditCards
	for _, cc := range userCreditCards {
		var card models.CreditCards
		if err := db.Where("id = ?", cc.CreditCardID).Find(&card).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}
		creditCard = append(creditCard, card)
	}

	return c.Status(fiber.StatusOK).JSON(creditCard)
}

func VerifyPromotionCode(c *fiber.Ctx) error {
	var requestBody struct {
		PromotionCode string `json:"promotionCode"`
	}
	userID := c.Locals("userID").(uint)

	if err := c.BodyParser(&requestBody); err != nil {
		log.Printf("Error parsing request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Request Body",
		})
	}
	if requestBody.PromotionCode == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Please input promotion code!",
		})
	}
	db := database.GetDB()
	var existingPromo models.Promotions
	if err := db.Where("promotion_code ILIKE ?", requestBody.PromotionCode).First(&existingPromo).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Promotion Code Not Found",
		})
	}
	var existingUserPromo models.UserPromotions
	if err := db.Where("promotion_id = ? AND user_id = ? AND is_used = ?", existingPromo.ID, userID, false).First(&existingUserPromo).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "You have used the promo code!",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message":             "Promotion Code Verified",
		"promotionPercentage": existingPromo.PromotionPercentage,
		"id":                  existingPromo.ID,
	})

}
func CheckoutPaymentWallet(c *fiber.Ctx) error {
	var requestBody struct {
		Price        float64 `json:"price"`
		HotelCartIDs []uint  `json:"hotelCartIds"`
		TicketIDs    []uint  `json:"ticketIds"`
		PromotionID  uint    `json:"promotionId"`
	}

	userID := c.Locals("userID").(uint)
	if err := c.BodyParser(&requestBody); err != nil {
		log.Printf("Error parsing request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Request Body",
		})
	}

	db := database.GetDB()

	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			log.Printf("Recovered in CheckoutPaymentWallet: %v", r)
		}
	}()

	var existingUser models.Users
	if err := tx.Where("id = ?", userID).First(&existingUser).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "User Not found",
		})
	}

	if existingUser.WalletCredits < requestBody.Price {
		tx.Rollback()
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Insufficient Balance",
		})
	}

	for _, id := range requestBody.HotelCartIDs {
		var existingHotelCart models.HotelCart
		if err := tx.Where("id =?", id).Find(&existingHotelCart).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}

		existingHotelCart.IsPaid = true
		if err := tx.Save(&existingHotelCart).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}
	}

	for _, id := range requestBody.TicketIDs {
		var existingTicket models.Tickets
		if err := tx.Where("id = ?", id).Find(&existingTicket).Error; err != nil {
			tx.Rollback()

			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}
    if existingTicket.FlightSchedule.DepartureTime.After(time.Now()) {
			existingTicket.Status = "expired"
			if err := db.Save(&existingTicket).Error; err != nil {
					tx.Rollback()
					return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
							"error": "Internal Server Error",
					})
			}
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Flight tickets has expired",
			})
		}
		var bookedSeat models.Seats
		if err := tx.Where("id = ?", existingTicket.SeatID).First(&bookedSeat).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid Seat!",
			})
		}
	
		bookedSeat.IsAvailable = false
		
		if err := tx.Save(&bookedSeat).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}	

		existingTicket.Status = "paid"

		if err := tx.Save(&existingTicket).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}
	}

	if requestBody.PromotionID != 0 {
		var existingUserPromo models.UserPromotions
		if err := tx.Where("promotion_id = ? AND user_id = ?", requestBody.PromotionID, userID).First(&existingUserPromo).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "You have used the promo code!",
			})
		}

		existingUserPromo.IsUsed = true
		if err := tx.Model(&existingUserPromo).Where("promotion_id = ? AND user_id = ?", requestBody.PromotionID, userID).Updates(&existingUserPromo).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}

	}

	existingUser.WalletCredits -= requestBody.Price
	if err := tx.Save(&existingUser).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}
	if err := services.SendPaymentDetailsEmail(existingUser.Email, requestBody); err != nil {
		log.Printf("Error sending payment details email: %v", err)
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Payment Successful",
	})
}

func CheckoutPaymentCard(c *fiber.Ctx) error {
	var requestBody struct {
		Price        float64 `json:"price"`
		HotelCartIDs []uint  `json:"hotelCartIds"`
		CardID uint `json:"cardId"`
		TicketIDs    []uint  `json:"ticketIds"`
		PromotionID  uint    `json:"promotionId"`
	}

	userID := c.Locals("userID").(uint)
	if err := c.BodyParser(&requestBody); err != nil {
		log.Printf("Error parsing request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Request Body",
		})
	}
	db := database.GetDB()

	tx := db.Begin()
	var userCC models.UserCreditCards
	log.Print(userID, requestBody.CardID)
	if err := tx.Where("user_id = ? AND credit_card_id = ?", userID, requestBody.CardID).First(&userCC); err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
      "error": "No Data CC Found",
    })
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			log.Printf("Recovered in CheckoutPaymentWallet: %v", r)
		}
	}()

	for _, id := range requestBody.HotelCartIDs {
		var existingHotelCart models.HotelCart
		if err := tx.Where("id =?", id).Find(&existingHotelCart).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}

		existingHotelCart.IsPaid = true
		if err := tx.Save(&existingHotelCart).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}
	}

	for _, id := range requestBody.TicketIDs {
		var existingTicket models.Tickets
		if err := tx.Where("id = ?", id).Find(&existingTicket).Error; err != nil {
			tx.Rollback()

			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}
		log.Print(existingTicket.FlightSchedule.DepartureTime, time.Now())
    if existingTicket.FlightSchedule.DepartureTime.After(time.Now()) {
			existingTicket.Status = "expired"
			if err := db.Save(&existingTicket).Error; err != nil {
					tx.Rollback()
					return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
							"error": "Internal Server Error",
					})
			}
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Flight tickets has expired",
			})
		}
		var bookedSeat models.Seats
		if err := tx.Where("id = ?", existingTicket.SeatID).First(&bookedSeat).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid Seat!",
			})
		}
		
		bookedSeat.IsAvailable = false
		if err := tx.Model(&bookedSeat).Where("id = ?", existingTicket.SeatID).Updates(&bookedSeat).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}

		existingTicket.Status = "paid"

		if err := tx.Save(&existingTicket).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}
	}

	if requestBody.PromotionID != 0 {
		var existingUserPromo models.UserPromotions
		if err := tx.Where("promotion_id = ? AND user_id = ?", requestBody.PromotionID, userID).First(&existingUserPromo).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "You have used the promo code!",
			})
		}

		existingUserPromo.IsUsed = true
		if err := tx.Model(&existingUserPromo).Where("promotion_id = ? AND user_id = ?", requestBody.PromotionID, userID).Updates(&existingUserPromo).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}

	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Payment Successful",
	})
}

