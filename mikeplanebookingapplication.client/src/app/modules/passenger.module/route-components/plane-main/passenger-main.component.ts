import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { UtilitiesService } from 'src/app/infrastructure/data.module/services/utilities.service';
import { Passenger } from 'src/app/infrastructure/data.module/models/passenger';
import { PassengerService } from 'src/app/infrastructure/data.module/services/passenger.service';
import * as _ from 'underscore';
import { PassengerInfoModalComponent } from '../../components/passenger-info-modal/passenger-info-modal.component';

@Component({
  selector: 'app-passenger-main',
  templateUrl: './passenger-main.component.html',
  styleUrls: ['./passenger-main.component.scss']
})
export class PassengerMainComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  viewListenerFn!: () => void;
  passengerList: Passenger[] = [];
  
  constructor(
    private passengerApi: PassengerService,
    private renderer: Renderer2,
    private modalRef: NgbModal,
    private util: UtilitiesService
  ) {
    
  }

  ngOnInit() {
    this.dtOptions = {

      pagingType: 'simple_numbers',
      serverSide: true,
      processing: true,
      responsive: true,
      ordering: false,
      stateSave: false,
      searching: false,
      ajax: (dataTablesParameters: any, callback) => {
        
        let source: PassengerTable[] = [];
        this.passengerApi.GetPassengers().subscribe(
          (resp: Passenger[]) => {
            if (resp != null) {
              for (let x of resp) {
                source.push({
                  name: x.name,
                  flight: x.flight?.flight,
                  id: x.id
                });
              }

              this.passengerList = resp;
            }

            callback({
              data: source,
              draw: dataTablesParameters.draw,
              recordsFiltered: source.length,
              recordsTotal: source.length
            });
          }
        );
      },
      columns: [
        { data: 'name' },
        { data: 'flight' },
        { data: 'id',
          render: function (data, type, row, meta) {
            return `<button class="btn btn-info btn-sm edit-passenger" id="${row.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-passenger" id="${row.id}">Delete</button>`;
          }
        }
      ],
      language: {
        paginate: {
          first: '',
          previous: '◄',
          next: '►',
          last: ''
        },
        emptyTable: "No records found."
      },
      columnDefs: [
        //width
        {
          targets: [0, 1],
          width: '20%'
        }, {
          targets: [2],
          width: '10%'
        }
      ]
    };
  }

  ngAfterViewInit() {
    this.viewListenerFn = this.renderer.listen('document', 'click', (event) => {
      //Edit listener
      if (event.target.classList.contains('edit-passenger')) {
        const data = this.passengerList.find(i => i.id == event.target.id);
        if (data) {
          this.openPassengerDialog(1, data, 'Edit Passenger Booking');
        }
        else {
          this.util.ShowNotificationMessage("An error occured.", "error");
        }
      }
      //Delete listener
      else if (event.target.classList.contains('delete-passenger')) {
        const data = this.passengerList.find(i => i.id == event.target.id);

        this.util.ShowMessageBoxPrompt("Are you sure you want to delete "+ data?.name +"?")?.then((response)=>{
          if (!response?.dismiss) {
            this.passengerApi.DeletePassenger(event.target.id).subscribe(
              (res) => {
                this.util.ShowNotificationMessage("Deleted successfully.", "success");
                this.refreshDataTable();
              },
              (err) => {
                let errmsg = "An error occured.";
  
                if (err) { 
                  if(err.status == 400) errmsg = err.error; //Bad request
                }
  
                this.util.ShowNotificationMessage(errmsg, "error");
              }
            );
          }
        });
      }
    });
  }

  AddPassenger() {
    this.openPassengerDialog(0, {
      id: 0,
      name: '',
      flight: {flight: '', id: 0}
    }, 'Add Passenger Booking');
  }

  openPassengerDialog(mode: number, data: Passenger, title: string) {
    this.modalRef.dismissAll();
    const modalRef = this.modalRef.open(PassengerInfoModalComponent, { windowClass: 'edit-passenger-modal-holder', backdrop: 'static' });
    modalRef.componentInstance.dataSource = {
        title: title,
        mode: mode,
        data: data
    }
    modalRef.result.then((data) => {
      if (data == 'OK') {
        this.refreshDataTable();
      } 
    });
    modalRef.result.catch((reason) => {
      this.util.ShowNotificationMessage(reason, "error");
    });
  }

  refreshDataTable() {
    this.dtElement?.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(dtInstance.search()).draw(false);
    });
  }

  ngOnDestroy(): void {
    if (this.viewListenerFn) {
      this.viewListenerFn();
    }
  }
}

export interface PassengerTable {
  id: number;
  name: string;
  flight: string;
}