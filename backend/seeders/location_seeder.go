package seeders

import (
	"fmt"

	"github.com/eldrian/go-fiber-postgres/models"
	"gorm.io/gorm"
)

func LocationSeeder(db *gorm.DB) {
	countries := []models.Country{
		{CountryName: "United States", CountryCode: "US"},
		{CountryName: "United Kingdom", CountryCode: "GB"},
		{CountryName: "France", CountryCode: "FR"},
		{CountryName: "Germany", CountryCode: "DE"},
		{CountryName: "China", CountryCode: "CN"},
		{CountryName: "Japan", CountryCode: "JP"},
		{CountryName: "India", CountryCode: "IN"},
		{CountryName: "Brazil", CountryCode: "BR"},
		{CountryName: "Australia", CountryCode: "AU"},
		{CountryName: "Canada", CountryCode: "CA"},
		{CountryName: "Russia", CountryCode: "RU"},
		{CountryName: "South Africa", CountryCode: "ZA"},
		{CountryName: "Mexico", CountryCode: "MX"},
		{CountryName: "South Korea", CountryCode: "KR"},
		{CountryName: "Italy", CountryCode: "IT"},
		{CountryName: "Spain", CountryCode: "ES"},
		{CountryName: "Argentina", CountryCode: "AR"},
		{CountryName: "Nigeria", CountryCode: "NG"},
		{CountryName: "Saudi Arabia", CountryCode: "SA"},
		{CountryName: "Turkey", CountryCode: "TR"},
		{CountryName: "Finland", CountryCode: "FI"},
	}

	for i := range countries {
		db.Create(&countries[i])
	}

	cities := []models.City{
		{CityName: "New York City", CountryID: countries[0].ID},
		{CityName: "Los Angeles", CountryID: countries[0].ID},
		{CityName: "Chicago", CountryID: countries[0].ID},
		{CityName: "London", CountryID: countries[1].ID},
		{CityName: "Manchester", CountryID: countries[1].ID},
		{CityName: "Birmingham", CountryID: countries[1].ID},
		{CityName: "Paris", CountryID: countries[2].ID},
		{CityName: "Marseille", CountryID: countries[2].ID},
		{CityName: "Lyon", CountryID: countries[2].ID},
		{CityName: "Berlin", CountryID: countries[3].ID},
		{CityName: "Munich", CountryID: countries[3].ID},
		{CityName: "Hamburg", CountryID: countries[3].ID},
		{CityName: "Beijing", CountryID: countries[4].ID},
		{CityName: "Shanghai", CountryID: countries[4].ID},
		{CityName: "Guangzhou", CountryID: countries[4].ID},
		{CityName: "Tokyo", CountryID: countries[5].ID},
		{CityName: "Osaka", CountryID: countries[5].ID},
		{CityName: "Kyoto", CountryID: countries[5].ID},
		{CityName: "Delhi", CountryID: countries[6].ID},
		{CityName: "Mumbai", CountryID: countries[6].ID},
		{CityName: "Kolkata", CountryID: countries[6].ID},
		{CityName: "São Paulo", CountryID: countries[7].ID},
		{CityName: "Rio de Janeiro", CountryID: countries[7].ID},
		{CityName: "Brasília", CountryID: countries[7].ID},
		{CityName: "Sydney", CountryID: countries[8].ID},
		{CityName: "Melbourne", CountryID: countries[8].ID},
		{CityName: "Brisbane", CountryID: countries[8].ID},
		{CityName: "Toronto", CountryID: countries[9].ID},
		{CityName: "Vancouver", CountryID: countries[9].ID},
		{CityName: "Montreal", CountryID: countries[9].ID},
		{CityName: "Moscow", CountryID: countries[10].ID},
		{CityName: "Saint Petersburg", CountryID: countries[10].ID},
		{CityName: "Novosibirsk", CountryID: countries[10].ID},
		{CityName: "Cape Town", CountryID: countries[11].ID},
		{CityName: "Johannesburg", CountryID: countries[11].ID},
		{CityName: "Pretoria", CountryID: countries[11].ID},
		{CityName: "Mexico City", CountryID: countries[12].ID},
		{CityName: "Guadalajara", CountryID: countries[12].ID},
		{CityName: "Monterrey", CountryID: countries[12].ID},
		{CityName: "Seoul", CountryID: countries[13].ID},
		{CityName: "Busan", CountryID: countries[13].ID},
		{CityName: "Incheon", CountryID: countries[13].ID},
		{CityName: "Rome", CountryID: countries[14].ID},
		{CityName: "Milan", CountryID: countries[14].ID},
		{CityName: "Naples", CountryID: countries[14].ID},
		{CityName: "Madrid", CountryID: countries[15].ID},
		{CityName: "Barcelona", CountryID: countries[15].ID},
		{CityName: "Valencia", CountryID: countries[15].ID},
		{CityName: "Buenos Aires", CountryID: countries[16].ID},
		{CityName: "Cordoba", CountryID: countries[16].ID},
		{CityName: "Rosario", CountryID: countries[16].ID},
		{CityName: "Lagos", CountryID: countries[17].ID},
		{CityName: "Abuja", CountryID: countries[17].ID},
		{CityName: "Kano", CountryID: countries[17].ID},
		{CityName: "Riyadh", CountryID: countries[18].ID},
		{CityName: "Jeddah", CountryID: countries[18].ID},
		{CityName: "Mecca", CountryID: countries[18].ID},
		{CityName: "Istanbul", CountryID: countries[19].ID},
		{CityName: "Ankara", CountryID: countries[19].ID},
		{CityName: "Izmir", CountryID: countries[19].ID},
		{CityName: "Helsinki", CountryID: countries[20].ID},
		{CityName: "Espooo", CountryID: countries[20].ID},
		{CityName: "Tampere", CountryID: countries[20].ID},
	}

	for i := range cities {
		db.Create(&cities[i])
	}

	fmt.Println("Data inserted successfully")
}
