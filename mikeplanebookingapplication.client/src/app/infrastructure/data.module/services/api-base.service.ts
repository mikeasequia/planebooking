import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/common/app-config.service';

@Injectable()
export class ApiBaseService {

  private API_VERSION = "";

  constructor(private evn: AppConfigService) {

  }


  protected BASE_URL(appendVersion: boolean = false): string {

    if (appendVersion) {
      if (this.evn.IS_PRODUCTION) {
        if (this.evn.IS_TEST) {
          return `${this.evn.END_POINTS.PRODUCTION.TEST_API}/${this.API_VERSION}`;
        }
        else {
          return `${this.evn.END_POINTS.PRODUCTION.MAIN_API}/${this.API_VERSION}`;

        }
      }
      else {
        return `${this.evn.END_POINTS.LOCALHOST.MAIN_API}/${this.API_VERSION}`;
      }
    }
    else {
      if (this.evn.IS_PRODUCTION) {
        if (this.evn.IS_TEST) {
          return this.evn.END_POINTS.PRODUCTION.TEST_API;
        }
        else {
          return this.evn.END_POINTS.PRODUCTION.MAIN_API;
        }
      }

      else
        return this.evn.END_POINTS.LOCALHOST.MAIN_API;
    }


  }
}
