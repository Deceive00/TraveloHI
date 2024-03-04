package controllers

import (
	"github.com/eldrian/go-fiber-postgres/database"
	"github.com/eldrian/go-fiber-postgres/models"
	"github.com/gofiber/fiber/v2"
)

func GetHistory(c *fiber.Ctx) error {
	db := database.GetDB()
	userID := c.Locals("userID").(uint)
	var hotelCarts []models.HotelCart
	if err := db.Preload("Hotel").Preload("Room").Where("user_id = ? AND is_paid = ?", userID, true).Find(&hotelCarts).Error; err != nil {
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
	if err := db.Preload("Seat.SeatClass").Preload("Seat.Airplane").Preload("Flight").Preload("FlightSchedule.FlightRoute.DepartureAirport.City.Country").Preload("FlightSchedule.FlightRoute.ArrivalAirport.City.Country").Preload("FlightSchedule.Airplane.Airline.").Where("user_id = ? AND (status = ? OR status = ?)", userID, "paid", "expired").Find(&flightCarts).Error; err != nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "There is no history available",
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
