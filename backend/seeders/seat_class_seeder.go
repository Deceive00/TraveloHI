package seeders

import (
	"fmt"

	"github.com/eldrian/go-fiber-postgres/models"
	"gorm.io/gorm"
)

func SeatClassSeeders(db *gorm.DB){
	seatClass := []models.SeatClass{
		{SeatClass: "Economy", Mutliplier: 1},
		{SeatClass: "Business", Mutliplier: 5},
		{SeatClass: "First Class", Mutliplier: 10},

	}

	for i := range seatClass {
		db.Create(&seatClass[i])
	}

	fmt.Println("Airports data inserted successfully")
}