// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
            "name": "API Support",
            "email": "fiber@swagger.io"
        },
        "license": {
            "name": "Apache 2.0",
            "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/api/admin/send-newsletter": {
            "post": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Sends a custom email to all subscribed users with the provided title and content.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Email"
                ],
                "summary": "Send Custom Email to Subscribers",
                "parameters": [
                    {
                        "description": "Title of the email",
                        "name": "title",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "description": "Content of the email",
                        "name": "content",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Emails sent to subscribers successfully",
                        "schema": {
                            "$ref": "#/definitions/controllers.SuccessResponse"
                        }
                    },
                    "400": {
                        "description": "Bad request",
                        "schema": {
                            "$ref": "#/definitions/controllers.ErrorResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/controllers.ErrorResponse"
                        }
                    }
                }
            }
        },
        "/api/admin/update-promotion": {
            "put": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Updates an existing promotion with the provided details.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Promotions"
                ],
                "summary": "Update Promotion",
                "parameters": [
                    {
                        "description": "Request Body",
                        "name": "requestBody",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/controllers.UpdatePromotionRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Promotion updated successfully",
                        "schema": {
                            "$ref": "#/definitions/controllers.SuccessResponse"
                        }
                    },
                    "400": {
                        "description": "Bad request",
                        "schema": {
                            "$ref": "#/definitions/controllers.ErrorResponse"
                        }
                    },
                    "404": {
                        "description": "Promotion code does not exist",
                        "schema": {
                            "$ref": "#/definitions/controllers.ErrorResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/controllers.ErrorResponse"
                        }
                    }
                }
            }
        },
        "/api/delete-credit-card/{id}": {
            "delete": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Removes the specified credit card associated with the authenticated user.",
                "tags": [
                    "Credit Cards"
                ],
                "summary": "Remove credit card",
                "parameters": [
                    {
                        "type": "integer",
                        "format": "int64",
                        "example": 1,
                        "description": "Credit Card ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Credit card removed successfully",
                        "schema": {
                            "$ref": "#/definitions/controllers.SuccessResponse"
                        }
                    },
                    "400": {
                        "description": "Bad request",
                        "schema": {
                            "$ref": "#/definitions/controllers.ErrorResponse"
                        }
                    },
                    "404": {
                        "description": "Credit card not found",
                        "schema": {
                            "$ref": "#/definitions/controllers.ErrorResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/controllers.ErrorResponse"
                        }
                    }
                }
            }
        },
        "/api/search-name": {
            "get": {
                "description": "Retrieve search results for countries, cities, and hotels based on a search term",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Search"
                ],
                "summary": "Get search results",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Search term",
                        "name": "term",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/controllers.SearchResultResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/controllers.ErrorResponse"
                        }
                    }
                }
            }
        },
        "/api/send-otp": {
            "post": {
                "description": "Sends a one-time password (OTP) to the provided email address.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Authentication"
                ],
                "summary": "Send OTP",
                "parameters": [
                    {
                        "description": "Request body containing the email address",
                        "name": "request_body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/controllers.OTPRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Otp sent successfully",
                        "schema": {
                            "$ref": "#/definitions/controllers.SuccessResponse"
                        }
                    },
                    "400": {
                        "description": "Bad request",
                        "schema": {
                            "$ref": "#/definitions/controllers.ErrorResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/controllers.ErrorResponse"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "controllers.CityResult": {
            "type": "object",
            "properties": {
                "cityId": {
                    "type": "integer"
                },
                "cityName": {
                    "type": "string"
                }
            }
        },
        "controllers.CountryResult": {
            "type": "object",
            "properties": {
                "countryId": {
                    "type": "integer"
                },
                "countryName": {
                    "type": "string"
                }
            }
        },
        "controllers.ErrorResponse": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string"
                }
            }
        },
        "controllers.HotelResult": {
            "type": "object",
            "properties": {
                "hotelId": {
                    "type": "integer"
                },
                "hotelName": {
                    "type": "string"
                }
            }
        },
        "controllers.OTPRequest": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "string"
                }
            }
        },
        "controllers.SearchResultResponse": {
            "type": "object",
            "properties": {
                "cities": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/controllers.CityResult"
                    }
                },
                "countries": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/controllers.CountryResult"
                    }
                },
                "hotels": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/controllers.HotelResult"
                    }
                }
            }
        },
        "controllers.SuccessResponse": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string"
                }
            }
        },
        "controllers.UpdatePromotionRequest": {
            "type": "object",
            "properties": {
                "promotionCode": {
                    "type": "string"
                },
                "promotionEndDate": {
                    "type": "string"
                },
                "promotionImage": {
                    "type": "string"
                },
                "promotionName": {
                    "type": "string"
                },
                "promotionPercentage": {
                    "type": "integer"
                },
                "promotionStartDate": {
                    "type": "string"
                },
                "promotionType": {
                    "type": "string"
                }
            }
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "localhost:8080",
	BasePath:         "/",
	Schemes:          []string{},
	Title:            "Travelohi API Documentation",
	Description:      "This is a Travelohi API Documentation",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
