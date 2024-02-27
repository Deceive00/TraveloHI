package seeders

import (
	"fmt"

	"github.com/eldrian/go-fiber-postgres/models"
	"gorm.io/gorm"
)

func AirlineSeeder(db *gorm.DB) {
	airlines := []models.Airlines{
		{AirlineName: "Garuda Indonesia", AirlineImage: "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/airlines%2Fgaruda-indonesia.png?alt=media&token=34aedd7c-e932-4b1a-a7b6-a11e7526da3b", AirlineCode: "GA"},
		{AirlineName: "Lion Air", AirlineImage: "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/airlines%2Flion-air.png?alt=media&token=e82b04a5-d2bf-46f9-905b-6d446814ceaa", AirlineCode: "LA"},
		{AirlineName: "Singapore Airlines", AirlineImage: "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/airlines%2Fsq.png?alt=media&token=70d75938-4e13-4aa4-9719-f77008dd3990", AirlineCode: "SQ"},
		{AirlineName: "Air Asia", AirlineImage: "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/airlines%2Fairasia.png?alt=media&token=1b128300-69f7-462b-bff5-cb80d79e9284", AirlineCode: "QZ"},
		{AirlineName: "Citilink", AirlineImage: "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/airlines%2Fcitilink.png?alt=media&token=73d6759b-d7d4-4844-a314-fb53ef5a9ada", AirlineCode: "QG"},
		{AirlineName: "Etihad Airways", AirlineImage: "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/airlines%2Fetihardairways.png?alt=media&token=8f0bc3f0-7117-4820-8241-89d6c65d5e23", AirlineCode: "EA"},
	}

	for i := range airlines {
		db.Create(&airlines[i])
	}

	fmt.Println("Airlines data inserted successfully")
}
