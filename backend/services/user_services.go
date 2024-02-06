package services

import (
	"log"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
)
const SecretKey = "secret"
func GetUserID(c *fiber.Ctx) string {
	cookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(t *jwt.Token) (interface{}, error) {
			return []byte(SecretKey), nil
	})

	if err != nil {
		log.Fatal("Error parsing jwt tokens")
		return ""
	}

	claims := token.Claims.(*jwt.StandardClaims)

	return claims.Issuer
}
