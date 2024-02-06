package seeders

import (
	"fmt"

	"github.com/eldrian/go-fiber-postgres/models"
	"gorm.io/gorm"
)
func AirportSeeder(db *gorm.DB) {
	// Retrieve cities
	cities := []models.City{}
	db.Find(&cities)

	// Seed airports
	airports := []models.Airports{
		{AirportCode: "JFK", AirportName: "John F. Kennedy International Airport", CityID: cities[0].ID},
		{AirportCode: "LAX", AirportName: "Los Angeles International Airport", CityID: cities[1].ID},
		{AirportCode: "ORD", AirportName: "O'Hare International Airport", CityID: cities[2].ID},
		{AirportCode: "LHR", AirportName: "Heathrow Airport", CityID: cities[3].ID},
		{AirportCode: "MAN", AirportName: "Manchester Airport", CityID: cities[4].ID},
		{AirportCode: "BHX", AirportName: "Birmingham Airport", CityID: cities[5].ID},
		{AirportCode: "PEK", AirportName: "Beijing Capital International Airport", CityID: cities[6].ID},
		{AirportCode: "PVG", AirportName: "Shanghai Pudong International Airport", CityID: cities[7].ID},
		{AirportCode: "CAN", AirportName: "Guangzhou Baiyun International Airport", CityID: cities[8].ID},
		{AirportCode: "HND", AirportName: "Tokyo Haneda Airport", CityID: cities[9].ID},
		{AirportCode: "KIX", AirportName: "Kansai International Airport", CityID: cities[10].ID},
		{AirportCode: "DEL", AirportName: "Indira Gandhi International Airport", CityID: cities[11].ID},
		{AirportCode: "BOM", AirportName: "Chhatrapati Shivaji Maharaj International Airport", CityID: cities[12].ID},
		{AirportCode: "CCU", AirportName: "Netaji Subhas Chandra Bose International Airport", CityID: cities[13].ID},
		{AirportCode: "GRU", AirportName: "São Paulo/Guarulhos–Governador André Franco Montoro International Airport", CityID: cities[14].ID},
		{AirportCode: "GIG", AirportName: "Rio de Janeiro/Galeão–Antônio Carlos Jobim International Airport", CityID: cities[15].ID},
		{AirportCode: "BSB", AirportName: "Brasília International Airport", CityID: cities[16].ID},
		{AirportCode: "SYD", AirportName: "Sydney Kingsford Smith Airport", CityID: cities[17].ID},
		{AirportCode: "MEL", AirportName: "Melbourne Airport", CityID: cities[18].ID},
		{AirportCode: "BNE", AirportName: "Brisbane Airport", CityID: cities[19].ID},
		{AirportCode: "YYZ", AirportName: "Toronto Pearson International Airport", CityID: cities[20].ID},
		{AirportCode: "YVR", AirportName: "Vancouver International Airport", CityID: cities[21].ID},
		{AirportCode: "YUL", AirportName: "Montréal–Pierre Elliott Trudeau International Airport", CityID: cities[22].ID},
		{AirportCode: "SVO", AirportName: "Sheremetyevo International Airport", CityID: cities[23].ID},
		{AirportCode: "LED", AirportName: "Pulkovo Airport", CityID: cities[24].ID},
		{AirportCode: "OVB", AirportName: "Tolmachevo Airport", CityID: cities[25].ID},
		{AirportCode: "CPT", AirportName: "Cape Town International Airport", CityID: cities[26].ID},
		{AirportCode: "JNB", AirportName: "O.R. Tambo International Airport", CityID: cities[27].ID},
		{AirportCode: "PTA", AirportName: "Wonderboom Airport", CityID: cities[28].ID},
		{AirportCode: "MEX", AirportName: "Benito Juárez International Airport", CityID: cities[29].ID},
		{AirportCode: "GDL", AirportName: "Don Miguel Hidalgo y Costilla International Airport", CityID: cities[30].ID},
		{AirportCode: "MTY", AirportName: "General Mariano Escobedo International Airport", CityID: cities[31].ID},
		{AirportCode: "ICN", AirportName: "Incheon International Airport", CityID: cities[32].ID},
		{AirportCode: "PUS", AirportName: "Gimhae International Airport", CityID: cities[33].ID},
		{AirportCode: "ICN", AirportName: "Incheon International Airport", CityID: cities[34].ID},
		{AirportCode: "FCO", AirportName: "Leonardo da Vinci–Fiumicino Airport", CityID: cities[35].ID},
		{AirportCode: "LIN", AirportName: "Milan Linate Airport", CityID: cities[36].ID},
		{AirportCode: "NAP", AirportName: "Naples International Airport", CityID: cities[37].ID},
		{AirportCode: "MAD", AirportName: "Adolfo Suárez Madrid–Barajas Airport", CityID: cities[38].ID},
		{AirportCode: "BCN", AirportName: "Barcelona–El Prat Airport", CityID: cities[39].ID},
		{AirportCode: "VLC", AirportName: "Valencia Airport", CityID: cities[40].ID},
		{AirportCode: "EZE", AirportName: "Ministro Pistarini International Airport", CityID: cities[41].ID},
		{AirportCode: "COR", AirportName: "Ingeniero Aeronáutico Ambrosio L.V. Taravella International Airport", CityID: cities[42].ID},
		{AirportCode: "ROS", AirportName: "Islas Malvinas International Airport", CityID: cities[43].ID},
		{AirportCode: "LOS", AirportName: "Murtala Muhammed International Airport", CityID: cities[44].ID},
		{AirportCode: "ABV", AirportName: "Nnamdi Azikiwe International Airport", CityID: cities[45].ID},
		{AirportCode: "KAN", AirportName: "Mallam Aminu Kano International Airport", CityID: cities[46].ID},
		{AirportCode: "RUH", AirportName: "King Khalid International Airport", CityID: cities[47].ID},
		{AirportCode: "JED", AirportName: "King Abdulaziz International Airport", CityID: cities[48].ID},
		{AirportCode: "MED", AirportName: "Prince Mohammad bin Abdulaziz International Airport", CityID: cities[49].ID},
		{AirportCode: "IST", AirportName: "Istanbul Airport", CityID: cities[50].ID},
		{AirportCode: "ESB", AirportName: "Ankara Esenboğa Airport", CityID: cities[51].ID},
		{AirportCode: "ADB", AirportName: "İzmir Adnan Menderes Airport", CityID: cities[52].ID},
		{AirportCode: "HEL", AirportName: "Helsinki-Vantaa Airport", CityID: cities[53].ID},
		{AirportCode: "HEL", AirportName: "Helsinki-Vantaa Airport", CityID: cities[54].ID},
		{AirportCode: "TMP", AirportName: "Tampere-Pirkkala Airport", CityID: cities[55].ID},
	}

	for i := range airports {
		db.Create(&airports[i])
	}

	fmt.Println("Airports data inserted successfully")
}
