import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Airport } from 'src/app/infrastructure/data.module/models/airport';
import { AirportService } from 'src/app/infrastructure/data.module/services/airport.service';
import { AirportInfoModalComponent } from '../../components/airport-info-modal/airport-info-modal.component';
import { UtilitiesService } from 'src/app/infrastructure/data.module/services/utilities.service';
import * as _ from 'underscore';
import { QueryParam } from 'src/app/infrastructure/data.module/models/queryParam';
import { PaginatedResult } from 'src/app/infrastructure/data.module/models/paginatedResult';

@Component({
  selector: 'app-airport-main',
  templateUrl: './airport-main.component.html',
  styleUrls: ['./airport-main.component.scss']
})
export class AirportMainComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  viewListenerFn!: () => void;
  airportList: Airport[] = [];
  
  constructor(
    private airportApi: AirportService,
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
      ordering: true, //false
      stateSave: false,
      searching: true, //false
      searchDelay: 5000,
      ajax: (dataTablesParameters: any, callback) => {

        let source: Airport[] = [];
        //this.airportApi.GetAirports().subscribe(
        //    (resp) => {
        //      if (resp != null) {
        //        for (let x of resp) {
        //          source.push({
        //            name: x.name,
        //            address: x.address,
        //            id: x.id
        //          });
        //        }
  
        //        this.airportList = resp;
        //      }
  
        //      callback({
        //        data: source,
        //        draw: dataTablesParameters.draw,
        //        recordsFiltered: resp.length,
        //        recordsTotal: resp.length
        //      });
        //    }
        //  );
        

         let pageNum = 0;
         let column = "0";
         let isDesc = false;
         let recordsFilteredNum = 0;

         if (dataTablesParameters.start !== 0) {
           pageNum = (dataTablesParameters.start / dataTablesParameters.length) + 1;
         }

         if (dataTablesParameters.order.length > 0) {
           column = dataTablesParameters.order[0].column.toString();
           isDesc = dataTablesParameters.order[0].dir == "desc";
         }

         const payload: QueryParam = {
           search: dataTablesParameters.search.value,
           column: column,
           isDesc: isDesc,
           pageNumber: dataTablesParameters.start === 0 ? 1 : pageNum,
           pageSize: dataTablesParameters.length
         }

         this.airportApi.GetAirportsByPaging(payload).subscribe(
           (resp: PaginatedResult<Airport>) => {
             if (resp != null) {
               for (let x of resp.items) {
                 source.push({
                   name: x.name,
                   address: x.address,
                   id: x.id
                 });
               }

               this.airportList = resp.items;
             }

             recordsFilteredNum = dataTablesParameters.search.value === '' ? resp.totalItems : resp.totalItems;

             callback({
               data: source,
               draw: dataTablesParameters.draw,
               recordsFiltered: recordsFilteredNum,
               recordsTotal: resp.totalItems
             });
           }
         );
      },
      columns: [
        { data: 'name' },
        { data: 'address' },
        { data: 'id',
          render: function (data, type, row, meta) {
            return `<button class="btn btn-info btn-sm edit-airport" id="${row.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-airport" id="${row.id}">Delete</button>`;
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
      order: [[0, "desc"]],
      columnDefs: [
        //width
        {
          targets: [0, 1],
          width: '20%'
        }, {
          targets: [2],
          width: '10%'
        },

        //no sort
        { orderable: false, targets: "no-sort" },
      ]
    };
  }

  ngAfterViewInit() {
    this.viewListenerFn = this.renderer.listen('document', 'click', (event) => {
      //Edit listener
      if (event.target.classList.contains('edit-airport')) {
        const data = this.airportList.find(i => i.id == event.target.id);
        if (data) {
          this.openAirportDialog(1, data, 'Edit Airport');
        }
        else {
          this.util.ShowNotificationMessage("An error occured.", "error");
        }
      }
      //Delete listener
      else if (event.target.classList.contains('delete-airport')) {
        const data = this.airportList.find(i => i.id == event.target.id);

        this.util.ShowMessageBoxPrompt("Are you sure you want to delete "+ data?.name +"?")?.then((response)=>{
          if (!response?.dismiss) {
            this.airportApi.DeleteAirport(event.target.id).subscribe(
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

  AddAirport() {
    this.openAirportDialog(0, {
      id: 0,
      name: '',
      address: ''
    }, 'Add Airport');
  }

  openAirportDialog(mode: number, data: Airport, title: string) {
    this.modalRef.dismissAll();
    const modalRef = this.modalRef.open(AirportInfoModalComponent, { windowClass: 'edit-airport-modal-holder', backdrop: 'static' });
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
