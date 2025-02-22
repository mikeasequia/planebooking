import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ComponentBase } from "src/app/common/component-base";
import { UtilitiesService } from "src/app/infrastructure/data.module/services/utilities.service";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Passenger } from "src/app/infrastructure/data.module/models/passenger";
import { PassengerService } from "src/app/infrastructure/data.module/services/passenger.service";
import { FlightService } from "src/app/infrastructure/data.module/services/flight.service";
import { Flight } from "src/app/infrastructure/data.module/models/flight";

@Component({
  templateUrl: "./passenger-info-modal.component.html",
  styleUrls: ["./passenger-info-modal.component.scss"]
})

export class PassengerInfoModalComponent extends ComponentBase implements OnInit, OnDestroy {

  dataSource!: ListData;
  info!: boolean;
  title = '';
  mode!: number;
  passengerInfo!: Passenger;
  passengerForm!: FormGroup;
  initialFormValues!: FormGroup;
  override IS_BUSY!: boolean;
  hasChanges = false;
  private destroy$ = new Subject<boolean>();
  flightList!: Flight[];

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private passengerService: PassengerService,
    private flightService: FlightService,
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
      this.passengerInfo = this.dataSource.data;
    }

    //initialize the form and validations
    this.passengerForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(1)]],
      FlightId: ['', [Validators.required]]
    });
    
    //check if mode is Update then populate the form
    if (this.mode == 1) {
      this.passengerForm.controls["Name"].setValue((this.passengerInfo.name).toString());
      this.passengerForm.controls["FlightId"].setValue((this.passengerInfo.flight.id).toString());
    }

    //deep copy the object to compare from previous value
    this.initialFormValues = JSON.parse(JSON.stringify(this.passengerForm.value)); 
    this.passengerForm.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(f => {
      if (JSON.stringify(this.initialFormValues) != JSON.stringify(this.passengerForm.value)) {
        this.hasChanges = true;
      }
      else {
        this.hasChanges = false;
      }
    });
  }

  initializeSelections() {

    //Get Flight data to be populated in the Flight selection
    try {
      this.IS_BUSY = true;
      this.flightService.GetFlights()
        .pipe(takeUntil(this.destroy$))
        .subscribe(response => {
          this.flightList = response;
        }, err => {
          this.util.ShowNotificationMessage("An error occured!", "error");
          this.IS_BUSY = false;
        });
    } catch (e) {
      console.log(e);
    }
  }

  submit() {
    const data = this.passengerForm.value;
    
    if (this.passengerForm.invalid || !this.hasChanges) {
      this.util.ShowNotificationMessage("An error occured.", "error");
      return;
    }

    this.info = true;

    //Add Passenger
    if (this.mode == 0) { 
      this.IS_BUSY = true;
      const flight = this.flightList.find(a => a.id == data.FlightId);
      console.log(flight);

      if (flight) {
        const payload: Passenger = {
          id: this.passengerInfo.id,
          name: data.Name,
          flight: flight,
        }

        try {
          this.passengerService.AddPassenger(payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
              this.passengerInfo = payload;
              this.util.ShowNotificationMessage("Successfully added new passenger!", "success", "");
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

    //Update Passenger
    if (this.mode == 1 && this.passengerInfo != null) { 
      this.IS_BUSY = true;

      const flight = this.flightList.find(a => a.id == data.FlightId);

      if (flight) {
        const payload: Passenger = {
          id: this.passengerInfo.id,
          name: data.Name,
          flight: flight,
        }
  
        try {
          this.passengerService.UpdatePassenger(payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
              this.passengerInfo = payload;
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
  mode!: number; // 0 = Add Passenger, 1 = Update Passenger
  data!: Passenger; // Passenger data
}
