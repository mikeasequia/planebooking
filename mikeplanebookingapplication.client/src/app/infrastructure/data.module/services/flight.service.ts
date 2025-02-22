import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Flight } from "../models/flight";
import { ApiBaseService } from "./api-base.service";
import { AppConfigService } from "src/app/common/app-config.service";

@Injectable()
export class FlightService extends ApiBaseService
{
    constructor(private appConfig: AppConfigService, private http: HttpClient) 
    {
        super(appConfig);
    }

    public GetFlights() {
        return this.http.get(`${this.BASE_URL()}/api/flight`)
        .pipe(map((response) => <Flight[]>response));
    }

    public AddFlight(flight: Flight) {
        const payload = {
            "flight": flight.flight,
            "airportId": flight.airport.id,
            "planeId": flight.plane.id,
        };

        return this.http.post(`${this.BASE_URL()}/api/flight`, payload);
    }

    public UpdateFlight(flight: Flight) {
        const payload = {
            "flight": flight.flight,
            "airportId": flight.airport.id,
            "planeId": flight.plane.id,
        };

        return this.http.put(`${this.BASE_URL()}/api/flight/`+ flight.id, payload);
    }

    public DeleteFlight(id: number) {
        return this.http.delete(`${this.BASE_URL()}/api/flight/` + id );
    }
}