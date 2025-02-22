import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ComponentBase } from "src/app/common/component-base";
import { UtilitiesService } from "src/app/infrastructure/data.module/services/utilities.service";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Plane } from "src/app/infrastructure/data.module/models/plane";
import { PlaneService } from "src/app/infrastructure/data.module/services/plane.service";

@Component({
  templateUrl: "./plane-info-modal.component.html",
  styleUrls: ["./plane-info-modal.component.scss"]
})

export class PlaneInfoModalComponent extends ComponentBase implements OnInit, OnDestroy {

  dataSource!: ListData;
  info!: boolean;

  title = '';
  mode!: number;
  planeInfo!: Plane;
  planeForm!: FormGroup;
  initialFormValues!: FormGroup;

  override IS_BUSY!: boolean;
  
  hasChanges = false;
  private destroy$ = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private planeService: PlaneService,
    private util: UtilitiesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.info = false;
    
    if (this.dataSource != null) {
      this.title = this.dataSource.title;
      this.mode = this.dataSource.mode;
      this.planeInfo = this.dataSource.data;
    }

    this.planeForm = this.fb.group({
      Code: ['', [Validators.required, Validators.minLength(1)]],
      Airline: ['', [Validators.required, Validators.minLength(1)]],
      Model: ['', [Validators.required, Validators.minLength(1)]]
    });
    
    if (this.mode == 1) {
      this.planeForm.controls["Code"].setValue((this.planeInfo.code).toString());
      this.planeForm.controls["Airline"].setValue((this.planeInfo.airline).toString());
      this.planeForm.controls["Model"].setValue((this.planeInfo.model).toString());
    }

    //deep copy the object to compare from previous value
    this.initialFormValues = JSON.parse(JSON.stringify(this.planeForm.value));

    this.planeForm.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(f => {
      if (JSON.stringify(this.initialFormValues) != JSON.stringify(this.planeForm.value)) {
        this.hasChanges = true;
      }
      else {
        this.hasChanges = false;
      }
    });
  }

  submit() {
    const data = this.planeForm.value;
    
    if (this.planeForm.invalid || !this.hasChanges) {
      this.util.ShowNotificationMessage("An error occured.", "error");
      return;
    }

    this.info = true;
    let payload: any;

    //Add Plane
    if (this.mode == 0) { 
      this.IS_BUSY = true;
      payload = {
        code: data.Code,
        airline: data.Airline,
        model: data.Model,
      }

      try {
        this.planeService.AddPlane(payload)
          .pipe(takeUntil(this.destroy$))
          .subscribe(response => {
            this.planeInfo = payload;
            this.util.ShowNotificationMessage("Successfully added new plane!", "success", "");
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

    //Update Plane
    if (this.mode == 1 && this.planeInfo != null) { 
      this.IS_BUSY = true;

      const payload: Plane = {
        id: this.planeInfo.id,
        code: data.Code,
        airline: data.Airline,
        model: data.Model,
      }

      try {
        this.planeService.UpdatePlane(payload)
          .pipe(takeUntil(this.destroy$))
          .subscribe(response => {
            this.planeInfo = payload;
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

export class ListData {
  title!: string; // title of the Modal
  mode!: number; // 0 = Add Plane, 1 = Update Plane
  data!: Plane; // Plane data
}
