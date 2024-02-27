package seeders

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/eldrian/go-fiber-postgres/models"
	"gorm.io/gorm"
)

func AirplaneSeeder(db *gorm.DB) {
	var airlines []models.Airlines
	db.Find(&airlines)
	col := []int{6, 10}
	var airplanes []models.Airplanes
	for _, airline := range airlines {
		for i := 0; i < 8; i++ {
			airplaneName := fmt.Sprintf("%s %d", getRandomManufacturer(), rand.Intn(900) + 100,)
			airplane := models.Airplanes{
				AirplaneName: airplaneName,
				IsAvailable:  true,
				AirlineID:    airline.ID,
				SeatRow: rand.Intn(15) + 40,
				SeatColumn: col[rand.Intn(len(col))],
			}
			airplanes = append(airplanes, airplane)
		}
	}

	for i := range airplanes {
		db.Create(&airplanes[i])
	}

	fmt.Println("Airplane data inserted successfully")
}

func getRandomManufacturer() string {
	manufacturers := []string{"Boeing", "Airbus"}
	rand.Seed(time.Now().UnixNano())
	return manufacturers[rand.Intn(len(manufacturers))]
}
