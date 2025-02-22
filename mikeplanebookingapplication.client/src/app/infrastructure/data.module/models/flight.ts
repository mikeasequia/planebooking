import { Airport } from "./airport";
import { Plane } from "./plane";

export interface Flight {
    id: number;
  flight: string;
  pilot: string;
    airport: Airport;
    plane: Plane;
}
