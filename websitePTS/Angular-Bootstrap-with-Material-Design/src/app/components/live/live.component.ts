import { formatDate } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Routeposition } from 'src/app/class/routeposition';
import { Task } from 'src/app/class/task';
import { AuthService } from 'src/app/service/auth.service';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements AfterViewInit {
  private startpoint
  private endpoint

  private map: L.Map
  private locations: L.Marker[] = []
  private currentLocation: any

  public websocket: WebSocket;
  public wsUri: string;

  osrm_url = 'http://195.128.100.64:5000/route/v1';

  public username = ""

  public tasks: Task[] = []

  positions = []
  routepositions: Routeposition[]

  constructor (
    private auth: AuthService,
    private httpService: HttpService,
    private router: Router,
    @Inject( LOCALE_ID ) private localID: string 
  ) { }
  
  ngAfterViewInit(): void {
    this.getTasks()
    this.initMap()
    this.getUser()
    this.getLocations()

    this.wsUri = 'ws://localhost:3000/' + localStorage.getItem('userid');
    this.websocket = new WebSocket(this.wsUri);
    this.websocket.onopen = (evt) => console.log('Websocket Opened');


    this.websocket.onmessage = (evt) => {
      console.log(evt.data);
      if (evt.data === 'Data changed '+localStorage.getItem('userid')) {
        this.getTasks()
        this.getLocations()
      }
    };

    this.websocket.onerror = (evt) => console.log('Websocket Error');

    this.websocket.onclose = (evt) => console.log('Websocket Closed');
  }

  private getUser(){
    this.auth.getUser().subscribe(data =>{
      if (data){
        localStorage.setItem('userid', data.receiverid + "")
        this.username = data.username
      }
    });
  }

  private getTasks() {
    this.httpService.getOpenTasks().subscribe(data => {
      console.log(data)
      this.tasks = data
    })
  }

  public getLocations() {
    this.httpService.getLocations().subscribe( data => {
      this.removeMarkers()
      for (let i = 0; i<data.length; i++){
        let m = L.marker(L.latLng(data[i].lat, data[i].lng), {draggable: true, icon: L.icon({
          iconSize: [ 25, 41 ],
          iconAnchor: [ 13, 41 ],
          iconUrl: 'assets/marker-icon.png',
          shadowUrl: 'assets/marker-shadow.png'
        })}).bindPopup('<p>'+data[i].username+'<br>'+data[i].title+'</p>')

        this.locations.push(m)
      }
      for(let j = 0; j<this.locations.length; j++){
        this.map.addLayer(this.locations[j])
      }
    })

  }

  public removeMarkers(){
    for(let j = 0; j<this.locations.length; j++){
      this.map.removeLayer(this.locations[j])
    }
    this.locations = []
  }

  private setLocations() {
    /*for (let mark of this.locations) {
      L.marker(mark).addTo(this.map)
    }*/
  }

  private initMap(): void {
    this.map = new L.Map('map', {
      center: [ 48.16667, 14.03333 ],
      zoom: 10
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    /*L.popup().setLatLng([48.16680, 14.03333])
    .setContent('<p>Hello world!<br />This is a nice popup.</p>')
    .openOn(this.map);*/

    let positions = [L.latLng(48.138435, 14.004268), L.latLng(48.155429, 14.036327)]

    tiles.addTo(this.map);

    /*L.Routing.control({
      router: new L.Routing.OSRMv1({
        serviceUrl: this.osrm_url
      }),
      showAlternatives: false,
      fitSelectedRoutes: false,
      addWaypoints: false,
      show: false,
      routeWhileDragging: true,
      plan: L.Routing.plan(positions,{
        createMarker: function(j, waypoint) {
          if (j == 0) {
            this.startpoint = L.marker(waypoint.latLng, {draggable: true, icon: L.icon({
              iconSize: [ 25, 41 ],
              iconAnchor: [ 13, 41 ],
              iconUrl: 'assets/marker-icon.png',
              shadowUrl: 'assets/marker-shadow.png'
            })}).bindPopup('<p>Start</p>')
            return this.startpoint
          } else if (j == 1) {
            this.endpoint = L.marker(waypoint.latLng, {draggable: true, icon: L.icon({
              iconSize: [ 25, 41 ],
              iconAnchor: [ 13, 41 ],
              iconUrl: 'assets/marker-icon.png',
              shadowUrl: 'assets/marker-shadow.png'
            })}).bindPopup('<p>End</p>')
            return this.endpoint
          }
        }
      })
    }).addTo(this.map);*/
  }

  public getRoute(id: number){
      this.httpService.getRouteByTask(id).subscribe(data=>{

        this.removeMarkers();

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
      }).addTo(this.map);
    })
  }

  public logOut() {
    this.auth.logout()
  }
}
