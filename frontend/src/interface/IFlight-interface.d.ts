interface IFlightData{
  Flight: IFlight;
  FlightSchedules: IFlightSchedule[];
  Seats: ISeats[][];

}
interface ISeats{
  ID: int;
  seatNumber: string;
  isAvailable: boolean;
  SeatClass: ISeatClass;
  Airplane: IAirplane;
}

interface ISeatClass{
  ID: string;
  seatClass: string;
	mutliplier: number;
}

interface IFlight{
  "ID": int,
  "flightPrice": number,
  "isTransit": boolean,
  "isIncludeBaggage": boolean,
  "baggageMaxWeight": number,
  "cabinMaxWeight": number,
}

interface IFlightSchedule{
  ID: int;
  FlightRoute: IFlightRoute;
  arrivalTime: Date;
  departureTime: Date;
  Airplane: IAirplane;
}
interface IAirplane{
  ID: int;
  "airplaneName": string;
  "isAvailable": boolean;
  seatRow: number;
  seatColumn: number;
  Airline: IAirline;
}
interface IFlightRoute{
  ID: int;
  "duration": number,
  DepartureAirport: IAirport;
  ArrivalAirport: IAirport;
  flightRouteCode: string;
}

interface ICity{
  ID: int;
  cityName: string;
  Country: ICountry;
}
interface IAirline{
  "ID": int,
  "airlineName": string,
  "airlineImage": string,
  "airlineCode": string,
}
interface ICountry{
  ID: int;
  countryName: string;
}

