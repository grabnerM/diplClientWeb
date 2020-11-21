import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { Routeposition } from 'src/app/class/routeposition';
import { Senderroute } from 'src/app/class/senderroute';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-route-card',
  templateUrl: './route-card.component.html',
  styleUrls: ['./route-card.component.scss']
})
export class RouteCardComponent implements AfterViewInit, OnInit {

  private map: L.Map
  private bigmap: L.Map

  @Input()
  route: Senderroute

  bigmapid: string

  routepositions: Routeposition[]

  starttime: string = ""
  endtime: string = ""

  positions = []


  constructor(private http: HttpService) {
    
  }
  ngOnInit(): void {
    this.bigmapid = 'big'+this.route.routeid
    this.starttime = new Date(this.route.starttime).toUTCString().slice(0, -3)
    this.endtime = new Date(this.route.endtime).toUTCString().slice(0, -3)
  }

  ngAfterViewInit(): void {
    this.initMap()
    this.getRoute()
    
    
  }

  bigmapinit(){
    this.initMapBig()
    this.getRouteBig()
  }
  

  private initMap(): void {
    this.map = L.map(''+this.route.routeid, {
      center: [ 48.16667, 14.03333 ],
      zoom: 10
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
  }

  private initMapBig(): void {
    this.bigmap = L.map('big'+this.route.routeid, {
      center: [ 48.16667, 14.03333 ],
      zoom: 10
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.bigmap);
  }

  private getRoute(): void{
    this.http.getRoute(this.route.routeid).subscribe(data=>{
      this.routepositions = data
      this.positions = []
      for(var i = 0; i<this.routepositions.length; i++){
        this.positions.push(L.latLng(this.routepositions[i].lat, this.routepositions[i].lng))
      }
      let l = this.positions.length
      L.Routing.control({
        routeWhileDragging: false,
        show: false,
        plan: L.Routing.plan(this.positions,{
          addWaypoints: true,
          createMarker: function(j, waypoint) {
            if (j == 0) {
              return L.marker(waypoint.latLng, {draggable: false, icon: L.icon({
                iconSize: [ 25, 41 ],
                iconAnchor: [ 13, 41 ],
                iconUrl: 'assets/marker-icon.png',
                shadowUrl: 'assets/marker-shadow.png'
              })}).bindPopup('<p>Start</p>')
            } else if (j+1 == l) {
              return L.marker(waypoint.latLng, {draggable: false, icon: L.icon({
                iconSize: [ 25, 41 ],
                iconAnchor: [ 13, 41 ],
                iconUrl: 'assets/marker-icon.png',
                shadowUrl: 'assets/marker-shadow.png'
              })}).bindPopup('<p>End</p>')
            }
          }
        })
    }).addTo(this.map);
    })
    
    
  }

  private getRouteBig(): void{
    this.http.getRoute(this.route.routeid).subscribe(data=>{
      this.routepositions = data
      this.positions = []
      for(var i = 0; i<this.routepositions.length; i++){
        this.positions.push(L.latLng(this.routepositions[i].lat, this.routepositions[i].lng))
      }
      let lb = this.positions.length
      L.Routing.control({
        routeWhileDragging: false,
        show: false,
        plan: L.Routing.plan(this.positions,{
          addWaypoints: true,
          createMarker: function(j, waypoint) {
            if (j == 0) {
              return L.marker(waypoint.latLng, {draggable: false, icon: L.icon({
                iconSize: [ 25, 41 ],
                iconAnchor: [ 13, 41 ],
                iconUrl: 'assets/marker-icon.png',
                shadowUrl: 'assets/marker-shadow.png'
              })}).bindPopup('<p>Start</p>')
            } else if (j+1 == lb) {
              return L.marker(waypoint.latLng, {draggable: false, icon: L.icon({
                iconSize: [ 25, 41 ],
                iconAnchor: [ 13, 41 ],
                iconUrl: 'assets/marker-icon.png',
                shadowUrl: 'assets/marker-shadow.png'
              })}).bindPopup('<p>End</p>')
            } else{
              return L.marker(waypoint.latLng, {draggable: false, icon: L.icon({
                iconSize: [ 25, 41 ],
                iconAnchor: [ 13, 41 ],
                iconUrl: 'assets/marker-icon.png',
                shadowUrl: 'assets/marker-shadow.png'
              })})
            }
          }
        })
    }).addTo(this.bigmap);
    })
    
    
  }
  
}
