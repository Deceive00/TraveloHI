interface Facility {
  id: string;
  name: string;
}

interface Hotel{
  hotelId: string | undefined;
  hotelName: string;
  hotelDescription: string;
  hotelPicture: string;
  hotelRating: number;
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

}
