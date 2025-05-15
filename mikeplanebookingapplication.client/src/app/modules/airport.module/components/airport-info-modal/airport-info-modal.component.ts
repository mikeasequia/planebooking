import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AirportService } from "src/app/infrastructure/data.module/services/airport.service";
import { Airport } from "src/app/infrastructure/data.module/models/airport";
import { ComponentBase } from "src/app/common/component-base";
import { UtilitiesService } from "src/app/infrastructure/data.module/services/utilities.service";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  templateUrl: "./airport-info-modal.component.html",
  styleUrls: ["./airport-info-modal.component.scss"]
})

export class AirportInfoModalComponent extends ComponentBase implements OnInit, OnDestroy {

  dataSource!: ListData;
  info!: boolean;

  title = '';
  mode!: number;
  airportInfo!: Airport;
  airportForm!: FormGroup;
  initialFormValues!: FormGroup;

  override IS_BUSY!: boolean;
  
  hasChanges = false;
  private destroy$ = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private airportService: AirportService,
    private util: UtilitiesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.info = false;
    
    if (this.dataSource != null) {
      this.title = this.dataSource.title;
      this.mode = this.dataSource.mode;
      this.airportInfo = this.dataSource.data;
    }

    this.airportForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(1)]],
      Address: ['', [Validators.required, Validators.minLength(1)]]
    });
    
    if (this.mode == 1) {
      this.airportForm.controls["Name"].setValue((this.airportInfo.name).toString());
      this.airportForm.controls["Address"].setValue((this.airportInfo.address).toString());
    }

    //deep copy the object to compare from previous value
    this.initialFormValues = JSON.parse(JSON.stringify(this.airportForm.value));

    this.airportForm.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(f => {
      if (JSON.stringify(this.initialFormValues) != JSON.stringify(this.airportForm.value)) {
        this.hasChanges = true;
      }
      else {
        this.hasChanges = false;
      }
    });
  }

  submit() {
    const data = this.airportForm.value;
    
    if (this.airportForm.invalid || !this.hasChanges) {
      this.util.ShowNotificationMessage("An error occured.", "error");
      return;
    }

    this.info = true;
    let payload: any;

    //Add Airport
    if (this.mode == 0) { 
      this.IS_BUSY = true;
      payload = {
        name: data.Name,
        address: data.Address,
      }

      try {
        this.airportService.AddAirport(payload)
          .pipe(takeUntil(this.destroy$))
          .subscribe(response => {
            this.airportInfo = payload;
            this.util.ShowNotificationMessage("Successfully added new airport!", "success", "");
            this.activeModal.close('OK');
          },
          (err) => {
            let errmsg = "An error occured.";

            if (err) {
              //Bad request
              if(err.status == 400) errmsg = err.error.error;
            }

            this.util.ShowNotificationMessage(errmsg, "error");
          }
        );

      } catch (e) {
        console.log(e);
      }
    }

    //Update Airport
    if (this.mode == 1 && this.airportInfo != null) { 
      this.IS_BUSY = true;

      const payload: Airport = {
        id: this.airportInfo.id,
        name: data.Name,
        address: data.Address
      }

      try {
        this.airportService.UpdateAirport(payload)
          .pipe(takeUntil(this.destroy$))
          .subscribe(response => {
            this.airportInfo = payload;
            this.util.ShowNotificationMessage("Successfully updated information!", "success", "");
            //this.pubsub.Broadcast("OnIsBusy", false);
            this.activeModal.close('OK');
          },
          (err) => {
            let errmsg = "An error occured.";

            if (err) {
              //Bad request
              if (err.status == 400) errmsg = err.error.error;
            }

            this.util.ShowNotificationMessage(errmsg, "error");
          }
        );

      } catch (e) {
        console.log(e);
      }
    

    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

export class ListData {
  title!: string; // title of the Modal
  mode!: number; // 0 = Add Airport, 1 = Update Airport
  data!: Airport; // Airport data
}
