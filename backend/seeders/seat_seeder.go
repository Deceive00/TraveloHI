package seeders

import (
	"fmt"
	"strconv"

	"github.com/eldrian/go-fiber-postgres/models"
	"gorm.io/gorm"
)
func SeatSeeders(db *gorm.DB) {
	var airplanes []models.Airplanes
	db.Find(&airplanes)

	var seats []models.Seats

	for _, airplane := range airplanes {
			for i := 1; i <= airplane.SeatRow; i++ {
					var seatClassID uint
					if i <= 2 {
							seatClassID = 3 
					} else if i <= 5 {
							seatClassID = 2 
					} else {
							seatClassID = 1 
					}

					for j := 0; j < airplane.SeatColumn; j++ {
							seatNumber := strconv.Itoa(i) + string('A'+j) 
							seat := models.Seats{
									SeatNumber:  seatNumber,
									IsAvailable: true,
									AirplaneID:  airplane.ID,
									SeatClassID: seatClassID,
							}
							if err := db.Create(&seat).Error; err != nil {
									fmt.Println("Error creating seat:", err)
									return
							}
							seats = append(seats, seat)
					}
			}
	}
	fmt.Println("Seats created successfully")
}
