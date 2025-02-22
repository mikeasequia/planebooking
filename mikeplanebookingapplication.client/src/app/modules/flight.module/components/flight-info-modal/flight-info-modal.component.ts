import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ComponentBase } from "src/app/common/component-base";
import { UtilitiesService } from "src/app/infrastructure/data.module/services/utilities.service";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Flight } from "src/app/infrastructure/data.module/models/flight";
import { FlightService } from "src/app/infrastructure/data.module/services/flight.service";
import { AirportService } from "src/app/infrastructure/data.module/services/airport.service";
import { PlaneService } from "src/app/infrastructure/data.module/services/plane.service";
import { Airport } from "src/app/infrastructure/data.module/models/airport";
import { Plane } from "src/app/infrastructure/data.module/models/plane";

@Component({
  templateUrl: "./flight-info-modal.component.html",
  styleUrls: ["./flight-info-modal.component.scss"]
})


export class FlightInfoModalComponent extends ComponentBase implements OnInit, OnDestroy {

  dataSource!: ListData;
  info!: boolean;
  title = '';
  mode!: number;
  flightInfo!: Flight;
  flightForm!: FormGroup;
  initialFormValues!: FormGroup;
  override IS_BUSY!: boolean;
  hasChanges = false;
  private destroy$ = new Subject<boolean>();
  airportList!: Airport[];
  planeList!: Plane[];

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private flightService: FlightService,
    private airportService: AirportService,
    private planeService: PlaneService,
    private util: UtilitiesService,
  ) {
    super();
  }

  ngOnInit(): void {

    this.initializeSelections();

    this.info = false;
    
    if (this.dataSource != null) {
      this.title = this.dataSource.title;
      this.mode = this.dataSource.mode;
      this.flightInfo = this.dataSource.data;
    }

    //initialize the form and validations
    this.flightForm = this.fb.group({
      Flight: ['', [Validators.required, Validators.minLength(1)]],
      AirportId: ['', [Validators.required]],
      PlaneId: ['', [Validators.required]],
      Pilot: ['', [Validators.required]]
    });
    
    //check if mode is Update then populate the form
    if (this.mode == 1) {
      this.flightForm.controls["Flight"].setValue((this.flightInfo.flight).toString());
      this.flightForm.controls["AirportId"].setValue((this.flightInfo.airport.id).toString());
      this.flightForm.controls["PlaneId"].setValue((this.flightInfo.plane.id).toString());
      this.flightForm.controls["Pilot"].setValue((this.flightInfo.pilot).toString());
    }

    //deep copy the object to compare from previous value
    this.initialFormValues = JSON.parse(JSON.stringify(this.flightForm.value)); 
    this.flightForm.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(f => {
      if (JSON.stringify(this.initialFormValues) != JSON.stringify(this.flightForm.value)) {
        this.hasChanges = true;
      }
      else {
        this.hasChanges = false;
      }
    });

    console.log(this.flightForm);
  }

  initializeSelections() {

    //Get Airport data to be populated in the Airport selection
    try {
      this.IS_BUSY = true;
      this.airportService.GetAirports()
        .pipe(takeUntil(this.destroy$))
        .subscribe(response => {
          this.airportList = response;
        }, err => {
          this.util.ShowNotificationMessage("An error occured!", "error");
          this.IS_BUSY = false;
        });
    } catch (e) {
      console.log(e);
    }

    //Get Plane data to be populated in the Plane selection
    try {
      this.IS_BUSY = true;
      this.planeService.GetPlanes()
        .pipe(takeUntil(this.destroy$))
        .subscribe(response => {
          this.planeList = response;
        }, err => {
          this.util.ShowNotificationMessage("An error occured!", "error");
          this.IS_BUSY = false;
        });
    } catch (e) {
      console.log(e);
    }
  }

  submit() {
    const data = this.flightForm.value;
    
    if (this.flightForm.invalid || !this.hasChanges) {
      this.util.ShowNotificationMessage("An error occured.", "error");
      return;
    }

    this.info = true;

    //Add Flight
    if (this.mode == 0) { 
      this.IS_BUSY = true;

      const airport = this.airportList.find(a => a.id == data.AirportId);
      const plane = this.planeList.find(a => a.id == data.PlaneId);

      console.log(data);
      if (airport && plane) {
        const payload: Flight = {
          id: this.flightInfo.id,
          flight: data.Flight,
          airport: airport,
          plane: plane,
          pilot: data.Pilot
        }

        try {
          this.flightService.AddFlight(payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
              this.flightInfo = payload;
              this.util.ShowNotificationMessage("Successfully added a new flight!", "success", "");
              this.activeModal.close('OK');
            },
            (err) => {
              let errmsg = "An error occured.";

              if (err) { 
                if(err.status == 400) errmsg = err.error; //Bad request
              }

              this.util.ShowNotificationMessage(errmsg, "error");
            }
          );

        } catch (e) {
          console.log(e);
        }
      }
    }

    //Update Flight
    if (this.mode == 1 && this.flightInfo != null) { 
      this.IS_BUSY = true;

      const airport = this.airportList.find(a => a.id == data.AirportId);
      const plane = this.planeList.find(a => a.id == data.PlaneId);

      if (airport && plane) {
        const payload: Flight = {
          id: this.flightInfo.id,
          flight: data.Flight,
          airport: airport,
          plane: plane,
          pilot: data.Pilot
        }
  
        try {
          this.flightService.UpdateFlight(payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
              this.flightInfo = payload;
              this.util.ShowNotificationMessage("Successfully updated information!", "success", "");
              //this.pubsub.Broadcast("OnIsBusy", false);
              this.activeModal.close('OK');
            },
            (err) => {
              let errmsg = "An error occured.";

              if (err) { 
                if(err.status == 400) errmsg = err.error; //Bad request
              }

              this.util.ShowNotificationMessage(errmsg, "error");
            }
          );
  
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

export class ListData {
  title!: string; // title of the Modal
  mode!: number; // 0 = Add Flight, 1 = Update Flight
  data!: Flight; // Flight data
}
