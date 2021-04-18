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
/*
  Autor: Jakob Hocheneder
  Titel: Live Ansicht Component
  Beschreibung:
*/
export class LiveComponent implements AfterViewInit {

  private map: L.Map
  private locations: L.Marker[] = []

  public websocket: WebSocket;
  public wsUri: string;

  public route

  osrm_url = 'http://195.128.100.64:5000/route/v1';
  username = ""
  public listHead = ""

  public tasks: Task[] = []

  positions = []
  routepositions: Routeposition[] = []

  isRouteShowing = false
  currentTask: Task

  constructor (
    private auth: AuthService,
    private httpService: HttpService,
    private router: Router,
    @Inject( LOCALE_ID ) private localID: string 
  ) { }
  
  /**
   * Initialisierung der Map und Verbindung zum WebSocket
   */
  ngAfterViewInit(): void {
    this.getTasks()
    this.initMap()
    this.getUser()
    this.getLocations()

    this.wsUri = 'ws://195.128.100.64:3000/' + localStorage.getItem('userid');
    this.websocket = new WebSocket(this.wsUri);
    this.websocket.onopen = (evt) => console.log('Websocket Opened');


    this.websocket.onmessage = (evt) => {
      console.log(evt.data);
      if (evt.data === 'Data changed '+localStorage.getItem('userid')) {
        this.getTasks()
        if(this.isRouteShowing){
          this.getRoute(this.currentTask)
        } else{
          this.getLocations()
        }
      }
    };

    this.websocket.onerror = (evt) => console.log('Websocket Error');

    this.websocket.onclose = (evt) => console.log('Websocket Closed');
  }

  /**
   * Informationen der Benutzers vom Server abfragen
   */
  private getUser(){
    this.auth.getUser().subscribe(data =>{
      if (data){
        localStorage.setItem('userid', data.receiverid + "")
        this.username = data.username
        this.setHeadlineToUsername()
      }
    });
  }

  /**
   * Username in Überschrift schreiben
   */
  setHeadlineToUsername(){
    this.listHead = "Aktuelle Tasks von "+this.username
  }

  /**
   * Alle offenen Tasks vom Server abfragen
   */
  private getTasks() {
    this.httpService.getOpenTasks().subscribe(data => {
      console.log(data)
      this.tasks = data
    })
  }

  /**
   * Aktuelle Positionen der Kuriere abfragen und in der Map einzeichnen
   */
  public getLocations() {
    this.isRouteShowing = false
    this.routepositions = []
    this.httpService.getLocations().subscribe( data => {
      this.removeMarkers()
      for (let i = 0; i<data.length; i++){
        let m = L.marker(L.latLng(data[i].lat, data[i].lng), {draggable: false, icon: L.icon({
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

  /**
   * Alle Marker der Map entfernen
   */
  public removeMarkers(){
    if(this.route){
      console.log("removed route")
      this.map.removeControl(this.route)
      this.route = undefined
    }
    
    for(let j = 0; j<this.locations.length; j++){
      this.map.removeLayer(this.locations[j])
    }
    this.locations = []
  }

  /**
   * Map erstellen
   */
  private initMap(): void {
    this.map = new L.Map('map', {
      center: [ 48.16667, 14.03333 ],
      zoom: 10
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

  }

  /**
   * Route von einem Auftrag abfragen und in der Map einzeichnen
   * @param t 
   */
  public getRoute(t: Task){
    this.isRouteShowing = true
    this.currentTask = t
    this.listHead = "Route des Tasks: " + t.title
    this.httpService.getRouteByTask(t.taskid).subscribe(data=>{

      this.removeMarkers();

      console.log(data)

      this.routepositions = data
      this.positions = []
      for(var i = 0; i<this.routepositions.length; i++){
        this.positions.push(L.latLng(this.routepositions[i].lat, this.routepositions[i].lng))
      }

      let j = 0
      for(var i = 0; i<this.routepositions.length; i++){
        this.httpService.getAddressFromLatLng(this.routepositions[i].lat, this.routepositions[i].lng).subscribe(data => {
          console.log(data.address.town)
          console.log(i)
          console.log(this.routepositions[i])
          this.routepositions[j].road = data.address.road
          if(data.address.town){
            this.routepositions[j].town = data.address.town
          }else if(data.address.village){
            this.routepositions[j].town = data.address.village
          }
          j++
        })
      }
      

      let lid = this.localID
      let times = data
      let lb = this.positions.length
      this.route = L.Routing.control({
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
}
