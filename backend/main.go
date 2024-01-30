// main.go
package main

import (

	// "github.com/eldrian/go-fiber-postgres/database"
	"github.com/eldrian/go-fiber-postgres/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)


func main() {

	app := fiber.New()
	
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173", 
		AllowCredentials: true,
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH",
	
	}))
	
	routes.SetupRoutes(app)
	app.Listen(":8080")
}
