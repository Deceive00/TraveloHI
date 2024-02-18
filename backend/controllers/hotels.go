package controllers

import (
	"strconv"

	"github.com/eldrian/go-fiber-postgres/database"
	"github.com/eldrian/go-fiber-postgres/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetRecommendationHotel(c *fiber.Ctx) error {
	var hotels []models.Hotels
	db := database.GetDB()
	if err := db.Preload("City.Country").Find(&hotels).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "No hotels available",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve hotels",
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"hotels":  hotels,
	})
}

func GetHotelByID(c *fiber.Ctx) error {
	id := c.Params("id")

	hotelID, err := strconv.Atoi(id)
	if err != nil {
			return err
	}

	db := database.GetDB()
	var hotel models.Hotels
	if err := db.First(&hotel, hotelID).Error; err != nil {
		return err
	}

	var city models.City
	if err := db.Where("id = ?", hotel.CityID).First(&city).Error; err != nil {
		return err
	}

	var country models.Country
	if err := db.Where("id = ?", city.CountryID).First(&country).Error; err != nil {
		return err
	}

	var facilities []models.Facilities
	if err := db.
		Table("hotels").
		Select("facilities.id, facilities.facility_name").
		Joins("JOIN hotel_facilities ON hotels.id = hotel_facilities.hotel_id").
		Joins("JOIN facilities on hotel_facilities.facility_id = facilities.id").
		Where("hotel_facilities.hotel_id = ?", hotelID).
		Find(&facilities).Error; err != nil {
		return err
	}

	var rooms []models.HotelRooms
	if err := db.Where("hotel_id = ?", hotel.ID).Find(&rooms).Error; err != nil {
		return err
	}

	response := struct {
		HotelName        string         `json:"hotelName"`
		HotelDescription string         `json:"hotelDescription"`
		HotelAddress     string         `json:"hotelAddress"`
		HotelRating      float64        `json:"hotelRating"`
		CityName         string         `json:"cityName"`
		CountryName      string         `json:"countryName"`
		Facilities       []FacilityInfo `json:"facilities"`
		Rooms            []RoomInfo     `json:"rooms"`
	}{
		HotelName:        hotel.HotelName,
		HotelDescription: hotel.HotelDescription,
		HotelAddress:     hotel.HotelAddress,
		HotelRating:      hotel.HotelRating,
		CityName:         city.CityName,
		CountryName:      country.CountryName,
		Facilities:       make([]FacilityInfo, len(facilities)),
		Rooms:            make([]RoomInfo, len(rooms)),
	}

	for i, f := range facilities {
		response.Facilities[i] = FacilityInfo{
			ID:           f.ID,
			FacilityName: f.FacilityName,
		}
	}

	for i, r := range rooms {
		response.Rooms[i] = RoomInfo{
			RoomName:        r.RoomName,
			RoomPrice:       r.RoomPrice,
			RoomCapacity:    r.RoomCapacity,
			IsRefundable:    r.IsRefundable,
			IsSmoking:       r.IsSmoking,
			IsReschedulable: r.IsReschedulable,
			GotBreakfast:    r.GotBreakfast,
			GotFreeWifi:     r.GotFreeWifi,
			TotalRoom:       r.TotalRoom,
		}
	}

	return c.JSON(response)
}

type FacilityInfo struct {
	ID           uint   `json:"id"`
	FacilityName string `json:"facilityName"`
}

type RoomInfo struct {
	RoomName        string  `json:"roomName"`
	RoomPrice       float64 `json:"roomPrice"`
	RoomCapacity    int     `json:"roomCapacity"`
	IsRefundable    bool    `json:"isRefundable"`
	IsSmoking       bool    `json:"isSmoking"`
	IsReschedulable bool    `json:"isReschedulable"`
	GotBreakfast    bool    `json:"gotBreakfast"`
	GotFreeWifi     bool    `json:"gotFreeWifi"`
	TotalRoom       int     `json:"totalRoom"`
}
