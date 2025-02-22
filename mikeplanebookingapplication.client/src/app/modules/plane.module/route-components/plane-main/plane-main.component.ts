import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Plane } from 'src/app/infrastructure/data.module/models/plane';
import { PlaneService } from 'src/app/infrastructure/data.module/services/plane.service';
import { UtilitiesService } from 'src/app/infrastructure/data.module/services/utilities.service';
import * as _ from 'underscore';
import { PlaneInfoModalComponent } from '../../components/plane-info-modal/plane-info-modal.component';

@Component({
  selector: 'app-plane-main',
  templateUrl: './plane-main.component.html',
  styleUrls: ['./plane-main.component.scss']
})
export class PlaneMainComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  viewListenerFn!: () => void;
  planeList: Plane[] = [];
  
  constructor(
    private planeApi: PlaneService,
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

        let source: Plane[] = [];
        this.planeApi.GetPlanes().subscribe(
          (resp) => {
            if (resp != null) {
              for (let x of resp) {
                source.push({
                  code: x.code,
                  airline: x.airline,
                  model: x.model,
                  id: x.id
                });
              }

              this.planeList = resp;
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
        { data: 'code' },
        { data: 'airline' },
        { data: 'model' },
        { data: 'id',
          render: function (data, type, row, meta) {
            return `<button class="btn btn-info btn-sm edit-plane" id="${row.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-plane" id="${row.id}">Delete</button>`;
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
      if (event.target.classList.contains('edit-plane')) {
        const data = this.planeList.find(i => i.id == event.target.id);
        if (data) {
          this.openPlaneDialog(1, data, 'Edit Plane');
        }
        else {
          this.util.ShowNotificationMessage("An error occured.", "error");
        }
      }
      //Delete listener
      else if (event.target.classList.contains('delete-plane')) {
        const data = this.planeList.find(i => i.id == event.target.id);

        this.util.ShowMessageBoxPrompt("Are you sure you want to delete "+ data?.airline +"?")?.then((response)=>{
          if (!response?.dismiss) {
            this.planeApi.DeletePlane(event.target.id).subscribe(
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

  AddPlane() {
    this.openPlaneDialog(0, {
      id: 0,
      code: '',
      airline: '',
      model: '',
    }, 'Add Plane');
  }

  openPlaneDialog(mode: number, data: Plane, title: string) {
    this.modalRef.dismissAll();
    const modalRef = this.modalRef.open(PlaneInfoModalComponent, { windowClass: 'edit-plane-modal-holder', backdrop: 'static' });
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
