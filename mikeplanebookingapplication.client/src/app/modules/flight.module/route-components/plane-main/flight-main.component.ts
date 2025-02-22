import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Flight } from 'src/app/infrastructure/data.module/models/flight';
import { FlightService } from 'src/app/infrastructure/data.module/services/flight.service';
import { UtilitiesService } from 'src/app/infrastructure/data.module/services/utilities.service';
import * as _ from 'underscore';
import { FlightInfoModalComponent } from '../../components/flight-info-modal/flight-info-modal.component';

@Component({
  selector: 'app-flight-main',
  templateUrl: './flight-main.component.html',
  styleUrls: ['./flight-main.component.scss']
})
export class FlightMainComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  viewListenerFn!: () => void;
  flightList: Flight[] = [];
  
  constructor(
    private flightApi: FlightService,
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
        
        let source: FlightTable[] = [];
        this.flightApi.GetFlights().subscribe(
          (resp: Flight[]) => {
            if (resp != null) {
              for (let x of resp) {
                source.push({
                  flight: x.flight,
                  airport: x.airport?.name,
                  plane: x.plane?.airline,
                  pilot: x.pilot,
                  id: x.id
                });
              }

              this.flightList = resp;
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
        { data: 'flight' },
        { data: 'airport' },
        { data: 'plane' },
        { data: 'pilot' },
        { data: 'id',
          render: function (data, type, row, meta) {
            return `<button class="btn btn-info btn-sm edit-flight" id="${row.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-flight" id="${row.id}">Delete</button>`;
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
          targets: [0],
          width: '20%'
        },{
          targets: [1, 2],
          width: '30%'
        }, {
          targets: [3],
          width: '20%'
        }
      ]
    };
  }

  ngAfterViewInit() {
    this.viewListenerFn = this.renderer.listen('document', 'click', (event) => {
      //Edit listener
      if (event.target.classList.contains('edit-flight')) {
        const data = this.flightList.find(i => i.id == event.target.id);
        if (data) {
          this.openFlightDialog(1, data, 'Edit Flight');
        }
        else {
          this.util.ShowNotificationMessage("An error occured.", "error");
        }
      }
      //Delete listener
      else if (event.target.classList.contains('delete-flight')) {
        const data = this.flightList.find(i => i.id == event.target.id);

        this.util.ShowMessageBoxPrompt("Are you sure you want to delete "+ data?.flight +"?")?.then((response)=>{
          if (!response?.dismiss) {
            this.flightApi.DeleteFlight(event.target.id).subscribe(
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

  AddFlight() {
    this.openFlightDialog(0, {
      id: 0,
      flight: '',
      airport: {address: '', id: 0, name: ''},
      plane: { id: 0, code: '', airline: '', model: '' },
      pilot: '',
    }, 'Add Flight');
  }

  openFlightDialog(mode: number, data: Flight, title: string) {
    this.modalRef.dismissAll();
    const modalRef = this.modalRef.open(FlightInfoModalComponent, { windowClass: 'edit-flight-modal-holder', backdrop: 'static' });
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

export interface FlightTable {
  id: number;
  flight: string;
  airport: string;
  plane: string;
  pilot: string;
}
