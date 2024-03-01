package controllers

import (
	"log"
	"time"

	"github.com/eldrian/go-fiber-postgres/database"
	"github.com/eldrian/go-fiber-postgres/models"
	"github.com/gofiber/fiber/v2"
)

func InsertHotelCart(c *fiber.Ctx) error {
	var requestBody struct {
		CheckInDate  string `json:"checkInDate"`
		CheckOutDate string `json:"checkOutDate"`
		TotalRooms   int    `json:"totalRooms"`
		HotelID      uint   `json:"hotelId"`
		RoomTypeID   uint   `json:"roomTypeId"`
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
	if err := db.Where("hotel_id = ? AND id = ?", requestBody.HotelID, requestBody.RoomTypeID).Find(&hotelRoom).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Room not found",
		})
	}
	if requestBody.TotalRooms <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Please insert the total room you want to insert!",
		})
	}
	if hotelRoom.TotalRoom-requestBody.TotalRooms < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "There are no room available",
		})
	}
	var existingHotelCart models.HotelCart
	if err := db.Where("check_in_date = ? AND check_out_date = ? AND hotel_id = ? AND room_type_id = ? AND user_id = ?",
		requestBody.CheckInDate, requestBody.CheckOutDate, requestBody.HotelID, requestBody.RoomTypeID, userID).First(&existingHotelCart).Error; err == nil {
			existingHotelCart.TotalRooms = existingHotelCart.TotalRooms + requestBody.TotalRooms
			if err := db.Save(&existingHotelCart).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": "Internal Server Error",
				})
			}
			return c.Status(fiber.StatusOK).JSON(fiber.Map{
				"message": "Success inserting to cart",
			})
	}else{
		cart := models.HotelCart{
			UserID:       userID,
			HotelID:      requestBody.HotelID,
			RoomTypeID:   requestBody.RoomTypeID,
			TotalRooms:   requestBody.TotalRooms,
			CheckInDate:  requestBody.CheckInDate,
			CheckOutDate: requestBody.CheckOutDate,
			IsPaid: false,
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

		if !seat.IsAvailable{
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "The seat is already booked!",
			})
		}
		var existingTicket models.Tickets
		if err := db.Where("flight_id = ? AND seat_id = ? AND flight_schedule_id = ?",
			req.FlightID, req.SeatID, req.FlightScheduleID).First(&existingTicket).Error; err == nil {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"error": "Flight is on the cart!",
			})
		}

		ticket := models.Tickets{
			FlightID:           uint(req.FlightID),
			AddOnBaggageWeight: req.AddOnBaggageWeight,
			Status:             "Cart",
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
	if err := db.Preload("Hotel").Preload("Room.Hotels").Where("user_id = ? AND is_paid = ?", userID, false).Find(&hotelCarts).Error; err != nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "There is no data to be checked out yet",
		})
	}

	var flightCarts []models.Tickets
	if err := db.Preload("Seat.SeatClass").Preload("Seat.Airplane").Preload("Flight").Preload("FlightSchedule.FlightRoute.DepartureAirport.City.Country").Preload("FlightSchedule.FlightRoute.ArrivalAirport.City.Country").Preload("FlightSchedule.Airplane.Airline.").Where("user_id = ? AND status = ?", userID, "Cart").Find(&flightCarts).Error; err != nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "There is no data to be checked out yet",
		})
	}
	flightCartMap := make(map[uint][]models.Tickets)

	for _, flight := range flightCarts {
			flightCartMap[flight.FlightID] = append(flightCartMap[flight.FlightID], flight)
	}
	
	var flightResponse []struct {
			FlightID uint            `json:"flightId"`
			Tickets  []models.Tickets 
	}
	
	for flightID, tickets := range flightCartMap {
			flightResponse = append(flightResponse, struct {
					FlightID uint            `json:"flightId"`
					Tickets  []models.Tickets 
			}{
					FlightID: flightID,
					Tickets:  tickets,
			})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"hotelCarts": hotelCarts,
		"flightCarts": flightResponse,
	})
}

func UpdateHotelCarts(c *fiber.Ctx) error{
	var requestBody struct{
		CheckInDate string `json:"checkInDate"`
		CheckOutDate string `json:"checkOutDate"`
		TotalRooms int `json:"totalRooms"`
		ID 				int `json:"id"`
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
		"message" : "Checkout success updated",
	})
}