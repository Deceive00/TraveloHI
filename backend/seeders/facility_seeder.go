package seeders

import (
	"math/rand"
	"fmt"
	"time"

	"github.com/eldrian/go-fiber-postgres/models"
	"gorm.io/gorm"
)
func shuffleFacilities(facilities []models.Facilities) []models.Facilities {
	rand.Seed(time.Now().UnixNano()) 
	shuffled := make([]models.Facilities, len(facilities)) 
	perm := rand.Perm(len(facilities))
	for i, randIndex := range perm {
			shuffled[randIndex] = facilities[i] 
	}
	return shuffled
}

func HotelFacilitiesSeeder(db *gorm.DB){
	var hotels []models.Hotels
	db.Find(&hotels)
	var facilities []models.Facilities
	db.Find(&facilities)
	var hotelFacilities []models.HotelFacilities

	for _, hotel := range hotels {
		numFacilities := rand.Intn(4) + 5
		shuffledFacilities := shuffleFacilities(facilities)
		selectedFacilities := shuffledFacilities[:numFacilities]
		for _, facility := range selectedFacilities {
			hotelFacilities = append(hotelFacilities, models.HotelFacilities{
				HotelID:    hotel.ID,
				FacilityID: facility.ID,
			})
		}
	}

	for _, hf := range hotelFacilities {
		db.Create(&hf)
	}

	fmt.Println("Hotel facility associations inserted successfully")
}

func FacilitiesSeeder(db *gorm.DB) {
	facilities := []models.Facilities{
		{FacilityName: "Semi open & outdoor restaurant"},
		{FacilityName: "Bar/Lounge"},
		{FacilityName: "Cafe"},
		{FacilityName: "Gym"},
		{FacilityName: "Swimming Pool"},
		{FacilityName: "Laundry Service"},
		{FacilityName: "Meeting Rooms"},
		{FacilityName: "AC"},
		{FacilityName: "Spa"},
		{FacilityName: "Playground"},
		{FacilityName: "Jacuzzi"},
		{FacilityName: "Sauna"},
		{FacilityName: "Tennis Court"},
		{FacilityName: "Airport Shuttle"},
		{FacilityName: "Pet-Friendly"},
		{FacilityName: "24-Hour Front Desk"},
		{FacilityName: "Parking"},
		{FacilityName: "Elevator"},
		{FacilityName: "Public Computer"},
		{FacilityName: "Water Purification System"},
	}

	for i := range facilities {
		db.Create(&facilities[i])
	}

	fmt.Println("Facility data inserted successfully")
}
