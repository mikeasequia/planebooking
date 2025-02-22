import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiBaseService } from "./api-base.service";
import { AppConfigService } from "src/app/common/app-config.service";
import { Passenger } from "../models/passenger";

@Injectable()
export class PassengerService extends ApiBaseService
{
    constructor(private appConfig: AppConfigService, private http: HttpClient) 
    {
        super(appConfig);
    }

    public GetPassengers() {
        return this.http.get(`${this.BASE_URL()}/api/passengerbooking`)
        .pipe(map((response) => <Passenger[]>response));
    }

    public AddPassenger(passenger: Passenger) {
        const payload = {
            "name": passenger.name,
            "flightId": passenger.flight.id
        };

        return this.http.post(`${this.BASE_URL()}/api/passengerbooking`, payload);
    }

    public UpdatePassenger(passenger: Passenger) {
        const payload = {
            "name": passenger.name,
            "flightId": passenger.flight.id
        };

        return this.http.put(`${this.BASE_URL()}/api/passengerbooking/`+ passenger.id, payload);
    }

    public DeletePassenger(id: number) {
        return this.http.delete(`${this.BASE_URL()}/api/passengerbooking/` + id );
    }
}
