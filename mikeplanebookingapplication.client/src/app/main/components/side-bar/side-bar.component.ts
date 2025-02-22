import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';

var misc:any ={
    sidebar_mini_active: true
}

@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SideBarComponent implements OnInit, OnDestroy {

  public isCollapsed = true;

  menus: any = {
    airports: {
      isToggled: false
    },
    planes: {
      isToggled: false
    },
    flights: {
      isToggled: false
    },
    passenger_bookings: {
      isToggled: false
    }
  }

  constructor() {

  }

  ngOnInit() {
    
  }

  toggle(stateName: string) {
    if(typeof this.menus[stateName] !== 'undefined') {
      this.menus[stateName].isToggled = !this.menus[stateName].isToggled;
    }
  }

  ngOnDestroy() {

  }
}
