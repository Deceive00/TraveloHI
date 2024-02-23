package seeders

import (
	"fmt"

	"github.com/eldrian/go-fiber-postgres/models"
	"gorm.io/gorm"
)

func ReviewSeeder(db *gorm.DB) {
	reviews := []models.HotelReview{
		{
			HotelID:           1,
			UserID:            8,
			CleanlinessRating: 4,
			LocationRating:    5,
			ComfortnessRating: 4,
			ServiceRating:     3,
			OverallRating:     5,
			IsAnonymous:       false,
			ReviewDescription: "The room is very big!, Good services! So clean, comfortable, and safe",
		},
		{
			HotelID:           1,
			UserID:            5,
			CleanlinessRating: 2,
			LocationRating:    5,
			ComfortnessRating: 4,
			ServiceRating:     3,
			OverallRating:     5,
			IsAnonymous:       true,
			ReviewDescription: "Sangat bagus bagus bagus bagus bagus bagus bagus bagus bagus bagus bagus bagus bagus bagus bagus bagus bagus bagus",
		},
	}
	for i := range reviews {
		db.Create(&reviews[i])
	}
	fmt.Println("Review inserted successfully")
}
