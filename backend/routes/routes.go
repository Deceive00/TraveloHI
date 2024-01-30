package routes

import (
	"github.com/eldrian/go-fiber-postgres/controllers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")
	// Auth
	api.Post("/login", controllers.LoginController)
	api.Post("/register", controllers.RegisterController)
	api.Get("/getuser", controllers.GetUser)
	api.Post("/logout", controllers.Logout)
	api.Post("/send-otp", controllers.SendOTP)
	api.Post("/verify-otp", controllers.VerifyOTP)
	
	// Forgot Password
	resetPW := api.Group("/reset-password")
	resetPW.Post("/verify-forgot-pw-email", controllers.ForgotPasswordController)
	resetPW.Post("/verify-security-answer", controllers.ValidateSecurityAnswerController)
	resetPW.Post("/verify-new-password", controllers.SavePassword)

}