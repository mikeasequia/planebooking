import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiBaseService } from "./api-base.service";
import { AppConfigService } from "src/app/common/app-config.service";
import { Airport } from "../models/airport";
import { QueryParam } from "../models/queryParam";
import { PaginatedResult } from "../models/paginatedResult";

@Injectable()
export class AirportService extends ApiBaseService
{
    constructor(private appConfig: AppConfigService, private http: HttpClient) 
    {
        super(appConfig);
    }

    public GetAirports() {
        return this.http.get(`${this.BASE_URL()}/api/airport`)
        .pipe(map((response) => <Airport[]>response));
    }

    public GetAirportsByPaging(payload: QueryParam) {
        return this.http.get(`${this.BASE_URL()}/api/airport/GetAllByPaging`, {
            params: {
                search: payload.search,
                column: payload.column,
                isDesc: payload.isDesc,
                pageNumber: payload.pageNumber,
                pageSize: payload.pageSize
            }
        })
        .pipe(map((response) => <PaginatedResult<Airport>>response));
    }

    public AddAirport(airport: Airport) {
        const payload = {
            "name": airport.name,
            "address": airport.address
        };

        return this.http.post(`${this.BASE_URL()}/api/airport`, payload);
    }

    public UpdateAirport(airport: Airport) {
        const payload = {
            "name": airport.name,
            "address": airport.address
        };

        return this.http.put(`${this.BASE_URL()}/api/airport/`+ airport.id, payload);
    }

    public DeleteAirport(id: number) {
        return this.http.delete(`${this.BASE_URL()}/api/airport/` + id );
    }
}
