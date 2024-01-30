package services

import (
	// "encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/eldrian/go-fiber-postgres/database"
	"github.com/eldrian/go-fiber-postgres/models"
	"github.com/go-gomail/gomail"
	"gorm.io/gorm"
)

const (
	senderEmail = "travelohi00@gmail.com"
	senderPassword = "wiwzfmlvpcwihlhs"
	smtpAddress = "smtp.gmail.com"
	smtpPort = 587
)

func ReadHTMLFromFile(filePath string) (string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	stat, err := file.Stat()
	if err != nil {
		return "", fmt.Errorf("failed to get file stat: %w", err)
	}

	content := make([]byte, stat.Size())
	_, err = file.Read(content)
	if err != nil {
		return "", fmt.Errorf("failed to read file content: %w", err)
	}

	return string(content), nil
}

func SendRegistrationEmail(email string) error {
	htmlContent, err := ReadHTMLFromFile("/Users/eldrian/Documents/aslab/DG23-2/TPA/Web/backend/EmailTemplates/Registration/registration.html")

	if err != nil {
		log.Fatalf("Error reading HTML file: %v", err)
		return err
	}

	m := gomail.NewMessage()
	m.SetHeader("From", senderEmail)
	m.SetHeader("To", email)

	m.SetHeader("Subject", "Registration Successful")
	m.SetBody("text/html", htmlContent)

	d := gomail.NewDialer(smtpAddress, smtpPort, senderEmail, senderPassword)

	if err := d.DialAndSend(m); err != nil {
		log.Printf("Error sending registration email: %v", err)
		return err
	} else {
			log.Printf("Registration email sent successfully to %s", email)
			return nil
	}
}

func SendOTPEmail(email string, otp string) error {
	htmlContent, err := ReadHTMLFromFile("/Users/eldrian/Documents/aslab/DG23-2/TPA/Web/backend/EmailTemplates/OTP/otp.html")

	if err != nil {
		log.Fatalf("Error reading HTML file: %v", err)
		return err
	}

	htmlContent = strings.Replace(htmlContent, "{{OTP_PLACEHOLDER}}", otp, -1)
	htmlContent = strings.Replace(htmlContent, "{{.CurrentDate}}", time.Now().Format("2 January 2006"), -1)

	m := gomail.NewMessage()
	m.SetHeader("From", senderEmail)
	m.SetHeader("To", email)

	m.SetHeader("Subject", "Login via OTP")
	m.SetBody("text/html", htmlContent)

	d := gomail.NewDialer(smtpAddress, smtpPort , senderEmail, senderPassword)

	if err := d.DialAndSend(m); err != nil {
		log.Printf("Error sending registration email: %v", err)
		return err
	} else {
			log.Printf("Registration email sent successfully to %s", email)
			return nil
	}

}

func IsEmailPresent(email string) bool {
	db := database.GetDB()

	var user models.Users
	result := db.Where("email = ?", email).First(&user)

	return !errors.Is(result.Error, gorm.ErrRecordNotFound)
}