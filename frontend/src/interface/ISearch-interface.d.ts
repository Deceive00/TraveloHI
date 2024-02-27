interface HotelSearch {
  id: string | undefined;
  hotelName: string;
  hotelDescription: string;
  overallRating: number;
  cleanlinessRating: number;
  comfortnessRating: number;
  locationRating: number;
  serviceRating: number;
  hotelAddress: string;
  hotelStar: number;
  hotelPicture: string[];
  rooms: Room[];
  facilities: Facility[];
}