package services

import (
	// "encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/eldrian/go-fiber-postgres/database"
	"github.com/eldrian/go-fiber-postgres/models"
	"github.com/go-gomail/gomail"
	"gorm.io/gorm"
)

const (
	senderEmail    = "travelohi00@gmail.com"
	senderPassword = "wiwzfmlvpcwihlhs"
	smtpAddress    = "smtp.gmail.com"
	smtpPort       = 587
)

func ReadHTMLFromFile(filename string) (string, error) {
	currentDir, err := os.Getwd()
	if err != nil {
		return "", fmt.Errorf("failed to get current working directory: %w", err)
	}

	fullPath := filepath.Join(currentDir, filename)

	file, err := os.Open(fullPath)
	if err != nil {
		return "", fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	content, err := ioutil.ReadAll(file)
	if err != nil {
		return "", fmt.Errorf("failed to read file content: %w", err)
	}

	return string(content), nil
}
func SendRegistrationEmail(email string) error {
	htmlContent, err := ReadHTMLFromFile("EmailTemplates/Registration/registration.html")

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
	htmlContent, err := ReadHTMLFromFile("EmailTemplates/OTP/otp.html")

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

	d := gomail.NewDialer(smtpAddress, smtpPort, senderEmail, senderPassword)

	if err := d.DialAndSend(m); err != nil {
		log.Printf("Error sending registration email: %v", err)
		return err
	} else {
		log.Printf("Registration email sent successfully to %s", email)
		return nil
	}

}

func SendCustomEmailToSubscribers(emails []string, title, content string) error {
	htmlContent, err := ReadHTMLFromFile("EmailTemplates/Subscription/subscription.html")

	if err != nil {
		log.Fatalf("Error reading HTML file: %v", err)
		return err
	}

	htmlContent = strings.Replace(htmlContent, "{{TITLE_PLACEHOLDER}}", title, -1)
	htmlContent = strings.Replace(htmlContent, "{{CONTENT_PLACEHOLDER}}", content, -1)
	for _, email := range emails {
		m := gomail.NewMessage()
		m.SetHeader("From", senderEmail)
		m.SetHeader("To", email)

		m.SetHeader("Subject", title)
		m.SetBody("text/html", htmlContent)

		d := gomail.NewDialer(smtpAddress, smtpPort, senderEmail, senderPassword)

		if err := d.DialAndSend(m); err != nil {
			log.Printf("Error sending email to %s: %v", email, err)
			return err
		} else {
			log.Printf("Email sent successfully to %s", email)
			return nil
		}
	}
	return nil
}

func IsEmailPresent(email string) bool {
	db := database.GetDB()

	var user models.Users
	result := db.Where("email = ?", email).First(&user)

	return !errors.Is(result.Error, gorm.ErrRecordNotFound)
}


func ValidateEmailFormat(email string) bool {
    pattern := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
    regexpPattern := regexp.MustCompile(pattern)
		print(regexpPattern.MatchString((email)))
    return regexpPattern.MatchString(email)
}

