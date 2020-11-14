import { Component, AfterViewInit } from '@angular/core';
import { map, tileLayer, marker } from 'leaflet';
import { Senderroute } from '../class/senderroute';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements AfterViewInit {

  private map: any
  constructor(private http: HttpService) { }

  alphas = ["1","2","3","4","5","6","7"]

  routes: Senderroute[];

  ngAfterViewInit(): void {
    this.getOldRoutes()
  }

  /*private initMap(): void {
    this.map = map('map', {
      center: [ 48.16667, 14.03333 ],
      zoom: 10
    });
    const tiles = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }*/

  public getOldRoutes(){

    this.http.findOldRoutes(localStorage.getItem('userid')).subscribe(data=>{
      this.routes = data;
      console.log(data)
    })
  }

}
