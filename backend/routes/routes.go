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
	api.Post("/logout", middleware.AuthMiddleware,controllers.Logout)
	api.Post("/send-otp", controllers.SendOTP)
	api.Post("/verify-otp", controllers.VerifyOTP)
	api.Post("/update-profile", middleware.AuthMiddleware, controllers.UpdateProfileController)
	api.Post("/add-credit-card", middleware.AuthMiddleware, controllers.AddCreditCardController)
	api.Get("/get-credit-card", middleware.AuthMiddleware, controllers.GetCreditCard)
	api.Delete("/delete-credit-card/:id", middleware.AuthMiddleware, controllers.RemoveCreditCardController)
	api.Get("/get-all-promotions", middleware.AuthMiddleware, controllers.GetAllPromotionsForUser)
	// Forgot Password
	resetPW := api.Group("/reset-password")
	resetPW.Post("/verify-forgot-pw-email", controllers.ForgotPasswordController)
	resetPW.Post("/verify-security-answer", controllers.ValidateSecurityAnswerController)
	resetPW.Post("/verify-new-password", controllers.SavePassword)

	// Admin
	admin := api.Group("/admin")
	admin.Get("/validate-admin-credentials", middleware.AdminMiddleware, controllers.GetAdminAuthorization)
	admin.Post("/send-newsletter", middleware.AdminMiddleware, controllers.SendCustomEmailToSubscribersController)
	admin.Put("/ban/:id", middleware.AdminMiddleware,controllers.BanUser)
	admin.Put("/unban/:id",middleware.AdminMiddleware ,controllers.UnbanUser)
	admin.Get("/get-all-users", middleware.AdminMiddleware, controllers.GetAllUserData)
	admin.Get("/get-all-city", middleware.AdminMiddleware, controllers.GetAllCity)
	admin.Get("/get-all-facility", middleware.AdminMiddleware, controllers.GetAllFacility)
	admin.Post("/insert-hotel", middleware.AdminMiddleware, controllers.AddHotelController)
	admin.Post("/insert-promotions", middleware.AdminMiddleware, controllers.AddPromotionController)
	admin.Get("/get-all-promotions", middleware.AdminMiddleware, controllers.GetAllPromotions)
	admin.Put("/update-promotion", middleware.AdminMiddleware, controllers.UpdatePromotionController)
	// Search
	api.Get("/search-name", controllers.GetSearchResult)
	api.Get("/search", controllers.GetSearchPageData)

	// Home
	api.Get("/get-recommendation-hotel", controllers.GetRecommendationHotel)
	api.Get("/get-hotel-by-id/:id", controllers.GetHotelByID)

}

