import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Plane } from "../models/plane";
import { ApiBaseService } from "./api-base.service";
import { AppConfigService } from "src/app/common/app-config.service";
import { QueryParam } from "../models/queryParam";
import { PaginatedResult } from "../models/paginatedResult";

@Injectable()
export class PlaneService extends ApiBaseService
{
    constructor(private appConfig: AppConfigService, private http: HttpClient) 
    {
        super(appConfig);
    }

    public GetPlanes() {
        return this.http.get(`${this.BASE_URL()}/api/plane`)
        .pipe(map((response) => <Plane[]>response));
    }

    public GetPlanesByPaging(payload: QueryParam) {
        return this.http.get(`${this.BASE_URL()}/api/plane/GetAllByPaging`, {
            params: {
                search: payload.search,
                column: payload.column,
                isDesc: payload.isDesc,
                pageNumber: payload.pageNumber,
                pageSize: payload.pageSize
            }
        })
        .pipe(map((response) => <PaginatedResult<Plane>>response));
    }

    public AddPlane(plane: Plane) {
        const payload = {
            "code": plane.code,
            "airline": plane.airline,
            "model": plane.model,
        };

        return this.http.post(`${this.BASE_URL()}/api/plane`, payload);
    }

    public UpdatePlane(plane: Plane) {
        const payload = {
            "code": plane.code,
            "airline": plane.airline,
            "model": plane.model,
        };

        return this.http.put(`${this.BASE_URL()}/api/plane/`+ plane.id, payload);
    }

    public DeletePlane(id: number) {
        return this.http.delete(`${this.BASE_URL()}/api/plane/` + id );
    }
}