package routes

import (
	"github.com/eldrian/go-fiber-postgres/controllers"
	"github.com/eldrian/go-fiber-postgres/middleware"
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
	api.Post("/update-profile", middleware.AuthMiddleware, controllers.UpdateProfileController)
	api.Post("/add-credit-card", middleware.AuthMiddleware, controllers.AddCreditCardController)
	api.Get("/get-credit-card", middleware.AuthMiddleware, controllers.GetCreditCard)
	api.Delete("/delete-credit-card/:id", middleware.AuthMiddleware, controllers.RemoveCreditCardController)
	// Forgot Password
	resetPW := api.Group("/reset-password")
	resetPW.Post("/verify-forgot-pw-email", controllers.ForgotPasswordController)
	resetPW.Post("/verify-security-answer", controllers.ValidateSecurityAnswerController)
	resetPW.Post("/verify-new-password", controllers.SavePassword)

	// Admin
	admin := api.Group("/admin")
	admin.Post("/send-newsletter", controllers.SendCustomEmailToSubscribersController);
	admin.Put("/ban/:id", controllers.BanUser)
	admin.Put("/unban/:id", controllers.UnbanUser)
	admin.Get("/get-all-users", controllers.GetAllUserData)
}