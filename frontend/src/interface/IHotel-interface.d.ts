interface Facility {
  ID: string;
  facilityName: string;
}

interface Hotel{
  hotelId: string | undefined;
  hotelName: string;
  hotelDescription: string;
  overallRating: number;
  cleanlinessRating: number;
  comfortnessRating: number;
  locationRating: number;
  serviceRating:number;
  hotelAddress: string;
  hotelImage: string[];
  city: string;
  hotelStar: int;
  country: string;
}

interface Room{
  gotBreakfast: boolean;
  gotFreeWifi: boolean;
  isRefundable: boolean;
  isReschedulable: boolean;
  isSmoking: boolean;
  roomCapacity: int;
  roomName: string | undefined;
  roomPrice: number;
  totalRoom: number;
  roomSize: number;
  roomBed: string;
  roomPicture: string[];
  hotelId: int;
  roomTypeId: int;
}
