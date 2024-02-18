package seeders

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/eldrian/go-fiber-postgres/models"
	"gorm.io/gorm"
)

func HotelSeeder(db *gorm.DB) {
	rand.Seed(time.Now().UnixNano())
	var cities []models.City
	db.Find(&cities)
	hotels := []models.Hotels{
		{
			HotelName:        "Hilton Luxury Hotel",
			HotelDescription: "Experience unparalleled luxury at Hilton Luxury Hotel. Our hotel offers a sophisticated and opulent ambiance with top-notch amenities. Indulge in the comfort of our spacious rooms, savor exquisite cuisine at our fine dining restaurants, and rejuvenate your senses at our world-class spa. Your stay with us promises to be a memorable and lavish experience.",
			HotelAddress:     "123 Elegant Street",
			HotelRating:      rand.Float64() * 5,
			CityID:           cities[0].ID,
			HotelPicture:     models.Pictures{"https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fhilton%2Fhilton0.png?alt=media&token=fc997a3b-2eb9-49fe-b057-904841620be1", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fhilton%2Fhilton1.png?alt=media&token=773ccb6d-6bf3-4f94-90a3-ea7b514f72e4", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fhilton%2Fhilton2.png?alt=media&token=9a8ef082-9948-4922-b709-d6ac0f93fe07", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fhilton%2Fhilton3.png?alt=media&token=5660967b-70ea-43f8-b6f6-0e14b36fab0d", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fhilton%2Fhilton4.png?alt=media&token=f27182ae-fedb-4f81-bc9a-8a0a496473fb", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fhilton%2Fhilton5.png?alt=media&token=5202ba17-ba03-460b-9177-5fa7169fa82a", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fhilton%2Fhilton6.png?alt=media&token=8b60d2cc-ffc2-4308-a81f-d7343632d49b", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fhilton%2Fhilton7.png?alt=media&token=6d380dff-560f-4ec3-9f58-a5e23600d69e", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fhilton%2Fhilton8.png?alt=media&token=2485da9f-cafc-4256-848a-fa1926027aa2"},
		},
		{
			HotelName:        "Tentrem Suites",
			HotelDescription: "Welcome to Tentrem Suites, where affordability meets comfort. Our hotel is designed to provide you with a cozy and relaxing stay. Whether you're traveling for business or leisure, our well-appointed rooms and friendly service ensure a pleasant experience. Discover true hospitality without breaking the bank at Tentrem Suites.",
			HotelAddress:     "456 Cozy Avenue",
			HotelRating:      rand.Float64() * 5,
			CityID:           cities[4].ID,
			HotelPicture:     models.Pictures{"https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Ftentrem%2Ftentrem1.png?alt=media&token=1a98b851-d747-4619-8e4f-604d925a1d54", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Ftentrem%2Ftentrem2.png?alt=media&token=109828f0-e56b-458b-9d95-5a0c5a029ff1", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Ftentrem%2Ftentrem3.png?alt=media&token=72b3eaf0-f586-417e-8092-c79594531b45", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Ftentrem%2Ftentrem4.png?alt=media&token=d702bde2-1016-4ecc-9e43-da83a076af33", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Ftentrem%2Ftentrem5.png?alt=media&token=d6bf72b0-048f-4548-95fe-562d80c67b6d", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Ftentrem%2Ftentrem6.png?alt=media&token=678ae74e-d7c8-472b-9bdf-610ee9de067b", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Ftentrem%2Ftentrem7.png?alt=media&token=4efee8e4-5d94-436c-8edc-deb0f532a8a9"},
		},
		{
			HotelName:        "Swissbel Resort",
			HotelDescription: "Immerse yourself in the beauty of nature at Swissbel Resort. Perched along the oceanfront, our resort offers breathtaking views and a serene atmosphere. Enjoy the sound of the waves, relax by the pool, and savor delectable cuisine at our seaside restaurant. Swissbel Resort is the perfect destination for a tranquil and rejuvenating getaway.",
			HotelAddress:     "789 Oceanfront Road",
			HotelRating:      rand.Float64() * 5,
			CityID:           cities[8].ID,
			HotelPicture:     models.Pictures{"https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fswissbel%2Fswissbel.png?alt=media&token=26cf7ab7-dd6d-4c41-9f58-3f2489a3b21f", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fswissbel%2Fswissbel1.png?alt=media&token=9bedde53-f692-4485-9684-f253dd05205c", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fswissbel%2Fswissbel2.png?alt=media&token=01e774f0-844b-4884-be35-6504bf9a0255", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fswissbel%2Fswissbel4.png?alt=media&token=550e276c-c778-40c8-917a-98ec73e6f580", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fswissbel%2Fswissbel5.png?alt=media&token=3aa9f79c-60ba-429f-b3a2-f886d6fbac16", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fswissbel%2Fswissbel6.png?alt=media&token=f400a7cc-be2e-494f-8fe3-6e541d07bf5d", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fswissbel%2Fswissbel7.png?alt=media&token=cb2768af-4a6b-4fc7-b4f4-7d00c99e2adb", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fswissbel%2Fswissbel3.png?alt=media&token=731e7083-2029-4937-a165-927f62796f45"},
		},
		{
			HotelName:        "Mountain Retreat",
			HotelDescription: "Embark on a journey to serenity at Mountain Retreat. Nestled in the heart of the mountains, our retreat is a haven of tranquility. Experience the crisp mountain air, explore scenic trails, and unwind in our cozy cabins. Whether you seek adventure or relaxation, Mountain Retreat offers an idyllic escape from the hustle and bustle of daily life.",
			HotelAddress:     "101 Mountainview Lane",
			HotelRating:      rand.Float64() * 5,
			CityID:           cities[13].ID,
			HotelPicture:     models.Pictures{"https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fmountain%2Fmountain1.png?alt=media&token=2c1c1037-df61-4288-88ed-8245596563bd", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fmountain%2Fmountain2.png?alt=media&token=23ed8cbe-c154-49ff-8533-4e93b4352adc", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fmountain%2Fmountain3.png?alt=media&token=f34b0b27-87f6-444b-96ed-6613184de51b", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fmountain%2Fmountain4.png?alt=media&token=005dcc30-316a-4b4b-8c9f-867f9b653a5b", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fmountain%2Fmountain5.png?alt=media&token=0aa312ea-4a04-48cb-bc4b-4a38876be064", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fmountain%2Fmountain6.png?alt=media&token=acbef695-fef9-4c52-8c2b-35f44f64f29e", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fmountain%2Fmountain7.png?alt=media&token=e14730ce-aa01-47fa-b53c-6ad417195d99", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fmountain%2Fmountain8.png?alt=media&token=479da7db-8acf-4ecd-a91d-b5c9b34c0d8f"},
		},
		{
			HotelName:        "Kempinski Luxurious Hotel",
			HotelDescription: "Discover the convenience of City Center Inn, strategically located in the bustling heart of the city. Our inn provides easy access to major attractions, shopping centers, and entertainment hubs. With comfortable accommodations and proximity to urban amenities, City Center Inn is the ideal choice for both business and leisure travelers.",
			HotelAddress:     "555 Central Avenue",
			HotelRating:      rand.Float64() * 5,
			CityID:           cities[17].ID,
			HotelPicture:     models.Pictures{"https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fkempinski%2Fkempinski1.png?alt=media&token=6a6f80ce-238c-4696-ad97-16634db176d4", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fkempinski%2Fkempinski2.png?alt=media&token=4396e58f-a7ca-4cec-a9bf-9abdcbb5e34c", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fkempinski%2Fkempinski3.png?alt=media&token=354b0bd0-3ed8-4bbe-8577-4ebf3465f251", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fkempinski%2Fkempinski4.png?alt=media&token=183f6a3b-2e9a-4a0e-9202-85aa7525df45", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fkempinski%2Fkempinski5.png?alt=media&token=c0468d76-6185-4a71-86ba-b0ad75d597c1", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fkempinski%2Fkempinski6.png?alt=media&token=03485b5b-2c8d-478c-8355-9a2ab907958e", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fkempinski%2Fkempinski7.png?alt=media&token=6d6d1f24-788e-4cf5-a145-6ade60e98f86", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fkempinski%2Fkempinski8.png?alt=media&token=08dd4d47-9edd-4a00-b9e8-3890f6d28c08"},
		},
		{
			HotelName:        "Halim Luxurious Hotel",
			HotelDescription: "Discover the convenience of City Center Inn, strategically located in the bustling heart of the city. Our inn provides easy access to major attractions, shopping centers, and entertainment hubs. With comfortable accommodations and proximity to urban amenities, City Center Inn is the ideal choice for both business and leisure travelers.",
			HotelAddress:     "555 Central Avenue",
			HotelRating:      rand.Float64() * 5,
			CityID:           cities[17].ID,
			HotelPicture:     models.Pictures{"https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fhalim%2Fhalim1.png?alt=media&token=d018818f-4f62-4f80-b436-f66635c18717", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fhalim%2Fhalim2.png?alt=media&token=96b8a656-7bc9-41ff-907f-99315b2030a4", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fhalim%2Fhalim3.png?alt=media&token=1b87610e-48bb-4a87-8ed0-aef059599e3e", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fhalim%2Fhalim4.png?alt=media&token=3acb52e1-48fb-4e1e-a834-4073a4acafe1", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fhalim%2Fhalim5.png?alt=media&token=17c4db23-7846-4d49-afcb-2e192bf3fd89", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fhalim%2Fhalim6.png?alt=media&token=fe46cb4d-2790-4522-a58f-234b949af51e", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fhalim%2Fhalim7.png?alt=media&token=8929df95-d443-47a5-9650-fce7b4fd5a64", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fhalim%2Fhalim8.png?alt=media&token=d1663cd3-9cb3-4b16-ae7c-9b21d5ae10e3"},
		},
		{
			HotelName:        "Seaview Resort",
			HotelDescription: "Experience the beauty of the sea from your room",
			HotelAddress:     "789 Coastal Drive",
			HotelRating:      rand.Float64() * 5,
			CityID:           cities[22].ID,
			HotelPicture:     models.Pictures{"https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview1.png?alt=media&token=bf8eed00-5f9f-4a7b-9ad0-30f7f84488a7", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview2.png?alt=media&token=ec15d996-0356-44c9-b097-5746878c1b6e", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview3.png?alt=media&token=5f2b23db-0cb3-4da5-b984-61dfb931c990", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview4.png?alt=media&token=fb8546f0-bad2-4998-8b1e-6aacb407d39e", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview5.png?alt=media&token=32f08169-bf65-439d-8ae1-1a9974d5232f", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview6.png?alt=media&token=0aef5fcc-ff36-4e24-bfa4-8855e5a4d6b9", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview7.png?alt=media&token=3fe62536-509f-4420-9447-ff0194140efd", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview8.png?alt=media&token=c56fa822-3185-4518-a7e3-69f4613c2e46"},
		},
	}

	for i := range hotels {
		db.Create(&hotels[i])
	}

	fmt.Println("Hotel data inserted successfully")
}

func HotelRoomSeeder(db *gorm.DB) {
	// Define room data
	rooms := []models.HotelRooms{
			{
					RoomName:        "Luxury Standard Room",
					RoomPrice:       100.0,
					RoomCapacity:    2,
					IsRefundable:    true,
					IsSmoking:       false,
					IsReschedulable: true,
					GotBreakfast:    true,
					GotFreeWifi:     true,
					RoomPicture:     models.Pictures{"https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview1.png?alt=media&token=bf8eed00-5f9f-4a7b-9ad0-30f7f84488a7", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview2.png?alt=media&token=ec15d996-0356-44c9-b097-5746878c1b6e", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview3.png?alt=media&token=5f2b23db-0cb3-4da5-b984-61dfb931c990", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview4.png?alt=media&token=fb8546f0-bad2-4998-8b1e-6aacb407d39e", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview5.png?alt=media&token=32f08169-bf65-439d-8ae1-1a9974d5232f", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview6.png?alt=media&token=0aef5fcc-ff36-4e24-bfa4-8855e5a4d6b9", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview7.png?alt=media&token=3fe62536-509f-4420-9447-ff0194140efd", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview8.png?alt=media&token=c56fa822-3185-4518-a7e3-69f4613c2e46"},
					TotalRoom:       100,
			},
			{
					RoomName:        "Suprior Deluxe Room",
					RoomPrice:       150.0,
					RoomCapacity:    4,
					IsRefundable:    true,
					IsSmoking:       false,
					IsReschedulable: true,
					GotBreakfast:    true,
					GotFreeWifi:     true,
					RoomPicture:     models.Pictures{"https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview1.png?alt=media&token=bf8eed00-5f9f-4a7b-9ad0-30f7f84488a7", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview2.png?alt=media&token=ec15d996-0356-44c9-b097-5746878c1b6e", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview3.png?alt=media&token=5f2b23db-0cb3-4da5-b984-61dfb931c990", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview4.png?alt=media&token=fb8546f0-bad2-4998-8b1e-6aacb407d39e", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview5.png?alt=media&token=32f08169-bf65-439d-8ae1-1a9974d5232f", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview6.png?alt=media&token=0aef5fcc-ff36-4e24-bfa4-8855e5a4d6b9", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview7.png?alt=media&token=3fe62536-509f-4420-9447-ff0194140efd", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview8.png?alt=media&token=c56fa822-3185-4518-a7e3-69f4613c2e46"},
					TotalRoom:       150,
			},
			{
					RoomName:        "Suite",
					RoomPrice:       250.0,
					RoomCapacity:    6,
					IsRefundable:    true,
					IsSmoking:       false,
					IsReschedulable: true,
					GotBreakfast:    true,
					GotFreeWifi:     true,
					RoomPicture:     models.Pictures{"https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview1.png?alt=media&token=bf8eed00-5f9f-4a7b-9ad0-30f7f84488a7", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview2.png?alt=media&token=ec15d996-0356-44c9-b097-5746878c1b6e", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview3.png?alt=media&token=5f2b23db-0cb3-4da5-b984-61dfb931c990", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview4.png?alt=media&token=fb8546f0-bad2-4998-8b1e-6aacb407d39e", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview5.png?alt=media&token=32f08169-bf65-439d-8ae1-1a9974d5232f", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview6.png?alt=media&token=0aef5fcc-ff36-4e24-bfa4-8855e5a4d6b9", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview7.png?alt=media&token=3fe62536-509f-4420-9447-ff0194140efd", "https://firebasestorage.googleapis.com/v0/b/dg-travelohi.appspot.com/o/hotel%2Fhilton%2FhotelImages%2Fseaview%2Fseaview8.png?alt=media&token=c56fa822-3185-4518-a7e3-69f4613c2e46"},
					TotalRoom:       130,
			},
	}

	var hotels []models.Hotels
	db.Find(&hotels)

	for _, hotel := range hotels {
			for _, room := range rooms {
					room.HotelID = hotel.ID
					db.Create(&room)
			}
	}

	fmt.Println("Hotel room data inserted successfully")
}
