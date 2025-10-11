import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { UtilitiesService } from "./utilities.service";

@Injectable()
export class SharedService {
    constructor(
        private util: UtilitiesService
    ) {}

    // Add shared methods or properties here
    handleResponseError(err: any, form?: FormGroup<any>): void {
        let errmsg = "An error occured.";

        if (err) {
            // API Response with validation errors
            if (err.status == 400 || err.status == 404) {
                const apiErrors = err.error?.errors;
                if (apiErrors && form) {
                    Object.keys(apiErrors).forEach(field => {
                    if (form.controls[field]) {
                        // Set the first error message as a form error
                        form.controls[field].setErrors({
                        apiError: apiErrors[field][0]
                        });
                    }
                    });
                }

                errmsg = err.error?.title || err.error.error;
            }
        }

        this.util.ShowNotificationMessage(errmsg, "error");
    }
}