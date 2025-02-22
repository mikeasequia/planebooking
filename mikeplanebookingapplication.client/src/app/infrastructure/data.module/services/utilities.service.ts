import { Injectable } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import swal from 'sweetalert2';

@Injectable()
export class UtilitiesService {
  constructor(
    private toastr: ToastrService
  ) { }

  ShowNotificationMessage(message: any, type = 'success', title = '', from = 'top', align = 'right') {
    if (type == 'success') {

      this.toastr.success(
        message,
        title,
        {
          timeOut: 5000,
          closeButton: false,
          positionClass: "toast-" + from + "-" + align
        }
      );
    }
    else if (type == 'error') {
      this.toastr.error(
        message,
        title,
        {
          timeOut: 5000,
          closeButton: false,
          positionClass: "toast-" + from + "-" + align
        }
      );
    }
  }

  ShowMessageBoxPrompt(message: any = "", title = "", type = 'confirm', confirm = "Confirm", cancel = "Cancel") {
    switch (type) {
      case 'confirm':
        return swal({
          title: `<i class="fas fa-exclamation-circle"></i>${title}`,
          confirmButtonClass: "btn btn-success ",
          cancelButtonClass: "btn btn-danger",
          confirmButtonText: confirm,
          cancelButtonText: cancel,
          showConfirmButton: true,
          showCancelButton: true,
          buttonsStyling: false,
          customClass: 'swal-custom-class',
          animation: true,
          html: `<p>${message}</p>`,
          allowOutsideClick: false
        }).catch(swal.noop);
      default:
        return swal({
          title: `<i class="fa fa-exclamation-circle"></i>${title}`,
          confirmButtonClass: "btn btn-success ",
          cancelButtonClass: "btn btn-danger",
          confirmButtonText: confirm,
          showConfirmButton: true,
          showCancelButton: false,
          buttonsStyling: false,
          customClass: 'swal-custom-class',
          animation: true,
          html: `<p>${message}</p>`,
          allowOutsideClick: false
        }).catch(swal.noop);
    }
  }
}
