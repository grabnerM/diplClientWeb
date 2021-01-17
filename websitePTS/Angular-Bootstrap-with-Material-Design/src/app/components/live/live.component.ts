import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Sender } from 'src/app/class/sender';
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
  private locations: any
  private currentLocation: any
  public senders: Sender[] = []

  public websocket: WebSocket;
  public wsUri: string;

  osrm_url = 'http://195.128.100.64:5000/route/v1';


  public username = ""

  constructor (
    private auth: AuthService,
    private httpService: HttpService,
    private router: Router
  ) { }
  
  ngAfterViewInit(): void {
    this.getCurrentLocation()
    this.initMap()
    this.getUser()

    this.wsUri = 'ws://localhost:3000/ws/todo/' + localStorage.getItem('userid');
    this.websocket = new WebSocket(this.wsUri);
    this.websocket.onopen = (evt) => console.log('Websocket Opened');


    this.websocket.onmessage = (evt) => {
      console.log(evt.data);
      if (evt.data === 'Data changed'+localStorage.getItem('userid')) {
        this.getCurrentLocation()
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

  private getCurrentLocation() {
    this.httpService.getSenderForReceiver(localStorage.getItem('userid')).subscribe(data =>{
      if (data){
        this.senders = data;
      }
    })
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

    L.Routing.control({
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
    }).addTo(this.map);
  }

  public getLocations() {
    this.httpService.getLocations().subscribe( locations => {
      this.locations = locations
    })

    this.setLocations()
  }

  private setLocations() {
    for (let mark of this.locations) {
      L.marker(mark).addTo(this.map)
    }
  }

  public logOut() {
    this.auth.logout()
  }
}
