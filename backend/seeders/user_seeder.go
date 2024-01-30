// seeders/user_seeder.go
package seeders

import (
	"log"

	"github.com/eldrian/go-fiber-postgres/models"
	"gorm.io/gorm"
)

func SeedUsers(db *gorm.DB) {
	users := []models.Users{
	}

	for _, user := range users {
		err := db.Create(&user).Error
		if err != nil {
			log.Fatalf("Error seeding users: %v", err)
		}
	}

	log.Println("Users seeded successfully")
}
