import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { Routeposition } from 'src/app/class/routeposition';
import { Senderroute } from 'src/app/class/senderroute';
import { HttpService } from 'src/app/service/http.service';
import { formatDate } from "@angular/common";
import { LOCALE_ID } from "@angular/core";
import { Inject } from '@angular/core';

@Component({
  selector: 'app-route-card',
  templateUrl: './route-card.component.html',
  styleUrls: ['./route-card.component.scss']
})
export class RouteCardComponent implements AfterViewInit, OnInit{

  private map: L.Map
  private bigmap: L.Map

  @Input()
  route: Senderroute

  bigmapid: string

  routepositions: Routeposition[]

  starttime: string = ""
  endtime: string = ""

  positions = []
  osrm_url = 'http://195.128.100.64:5000/route/v1';

  

  constructor(
    private http: HttpService,
    @Inject( LOCALE_ID ) private localID: string ) {
    
  }
  ngOnInit(): void {
    this.bigmapid = 'big'+this.route.routeid
    this.starttime = this.route.starttime+''
    this.endtime = this.route.endtime+''
  }

  ngAfterViewInit(): void {
    this.initMap()
    this.getRoute()
  }

  delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async bigmapinit(){
    console.log("bigmapinit")

    await this.delay(600);

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
      console.log(data)
      this.routepositions = data
      this.positions = []
      for(var i = 0; i<this.routepositions.length; i++){
        this.positions.push(L.latLng(this.routepositions[i].lat, this.routepositions[i].lng))
      }
      let l = this.positions.length
      L.Routing.control({
        routeWhileDragging: false,
        show: false,
        router: new L.Routing.OSRMv1({
          serviceUrl: this.osrm_url
        }),
        addWaypoints: false,
        plan: L.Routing.plan(this.positions,{
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
      console.log(data)
      this.routepositions = data
      this.positions = []
      for(var i = 0; i<this.routepositions.length; i++){
        this.positions.push(L.latLng(this.routepositions[i].lat, this.routepositions[i].lng))
      }
      let lid = this.localID
      let times = data
      let lb = this.positions.length
      L.Routing.control({
        routeWhileDragging: false,
        show: false,
        router: new L.Routing.OSRMv1({
          serviceUrl: this.osrm_url
        }),
        addWaypoints: false,
        plan: L.Routing.plan(this.positions,{
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
              })}).bindPopup("<p>"+formatDate(times[j].time, 'dd.MM.yyyy HH:mm:ss', lid)+"</p>")
            }
          }
        })
    }).addTo(this.bigmap);
    })
    
    
  }
  
}
