package database

import (
	"fmt"
	"log"
	"os"

	"github.com/eldrian/go-fiber-postgres/models"
	// "github.com/eldrian/go-fiber-postgres/seeders"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Config struct {
	Host     string
	Port     string
	Password string
	User     string
	DBName   string
	SSLMode  string
}

var db *gorm.DB

func GetDB() *gorm.DB {
	return db
}

func init() {

	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	config := &Config{
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		Password: os.Getenv("DB_PASS"),
		User:     os.Getenv("DB_USER"),
		SSLMode:  os.Getenv("DB_SSLMODE"),
		DBName:   os.Getenv("DB_NAME"),
	}
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		config.Host, config.Port, config.User, config.Password, config.DBName, config.SSLMode)

	var errDB error

	db, errDB = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if errDB != nil {
		log.Fatal("could not load the database")
	}

	// Migration
	err = models.MigrateUsers(db)
	if err != nil {
		log.Fatal("error migrating users")
	}
	err = models.MigrateOTP(db)
	if err != nil {
		log.Fatal("error migrating otp")
	}
	err = models.MigrateCreditCards(db)
	if err != nil {
		log.Fatal("error migrating cc")
	}
	err = models.MigrateLocations(db)
	if err != nil {
		log.Fatal("error migrating location")
	}
	err = models.MigrateAirports(db)
	if err != nil {
		log.Fatal("error migrating airport")
	}
	err = models.MigrateHotels(db)
	if err != nil {
		log.Fatal("error migrating hotel")
	}
	err = models.MigratePromotions(db)

	if err != nil {
		log.Fatal("error migrating promotion")
	}
	err = models.MigrateHotelReview(db)

	if err != nil {
		log.Fatal("error migrating hotel review")
	}

	// Seeders
	// seeders.SeedUsers(db)
	// seeders.LocationSeeder(db)
	// seeders.AirportSeeder(db)
	// seeders.HotelSeeder(db)
	// seeders.FacilitiesSeeder(db)
	// seeders.HotelFacilitiesSeeder(db)
	// seeders.HotelRoomSeeder(db)
	// seeders.ReviewSeeder(db)
}
