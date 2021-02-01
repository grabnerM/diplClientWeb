import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { Senderroute } from '../class/senderroute';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements AfterViewInit {

  constructor(private http: HttpService) { }

  routes: Senderroute[];

  ngAfterViewInit(): void {
    this.getOldRoutes()
  }

  public getOldRoutes(){

    this.http.findOldRoutes(localStorage.getItem('userid')).subscribe(data=>{
      console.log(data)
      this.routes = data;
    })
    
  }
  
}
