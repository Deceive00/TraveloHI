interface ITickets{
  Flight: IFlight;
  FlightSchedule: IFlightSchedule;
  ID: int;
  Seat: ISeats;
  addOnBaggageWeight: number;
  flightId: int;
  flightScheduleId: int;
  seatId: int;
  status: string;
  userId: int;
}

interface IHotelCarts{
  ID: int;
  Room: Room;
  checkInDate: string;
  checkOutDate: string;
  hotelId: int;
  isPaid: boolean;
  roomId: int;
  totalRooms: number;
  userId: int;
  Hotel: Hotel;
}

interface IFlightCarts {
  flightId: number;
  Tickets: ITickets[];
}