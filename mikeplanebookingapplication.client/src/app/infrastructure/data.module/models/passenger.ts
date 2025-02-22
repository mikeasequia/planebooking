export interface Passenger {
    id: number
    name: string;
    flight: Flight;
}

export interface Flight {
    id: number;
    flight: string;
}