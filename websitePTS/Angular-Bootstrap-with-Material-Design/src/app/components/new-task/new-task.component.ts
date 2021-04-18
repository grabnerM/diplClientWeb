import { Component, AfterViewInit } from '@angular/core';
  import { Router } from '@angular/router';
  import { map, tileLayer, marker } from 'leaflet';
  import * as L from 'leaflet';
  import { Sender } from '../../class/sender';
  import { AuthService } from '../../service/auth.service';
  import { HttpService } from '../../service/http.service';
  import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AfterContentInit } from '@angular/core';
import { Task } from 'src/app/class/task';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
/*
  Autor: Jakob Hocheneder
  Titel: Neuen Auftrag erstellen
  Beschreibung: Component zum erstellen eines neuen Auftrags
*/
export class NewTaskComponent implements AfterContentInit{

  public title: string
  public description: string
  public startpoint = L.latLng(48.138435, 14.004268)
  public endpoint = L.latLng(48.155429, 14.036327)

  public addressStart: string;
  public addressEnd: string;

  private route: L.Routing.Control

  private map: L.Map
  private locations: any
  public senders: Sender[] = []

  osrm_url = 'http://195.128.100.64:5000/route/v1';


  public username = ""

  constructor (
    private auth: AuthService,
    private httpService: HttpService,
    private router: Router
  ) { }
  
  /**
   * Initialisierung der Map nach laden der Website
   */
  ngAfterContentInit(): void {
    this.initMap()
    this.getUser()
  }

  /**
   * Informationen der Benutzers vom Server abfragen
   */
  private getUser(){
    this.auth.getUser().subscribe(data =>{
      if (data){
        localStorage.setItem('userid', data.receiverid + "")
        this.username = data.username
      }
    });
  }

  /**
   * Initialisierung der Map
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

    let positions = [L.latLng(48.138435, 14.004268), L.latLng(48.155429, 14.036327)]

    tiles.addTo(this.map);

    this.route = L.Routing.control({
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

    console.log(this.route.getWaypoints[0])
  }

  /**
   * Logout
   */
  public logOut() {
    this.auth.logout()
  }

  /**
   * Erstellen des Auftrags
   */
  public save(){
    let task: Task = new Task()

    task.startlat = this.getLat(0)
    task.startlng = this.getLng(0)

    task.endlat = this.getLat(1)
    task.endlng = this.getLng(1)
    task.status = -1
    task.receiverid = localStorage.getItem("userid")
    task.description = this.description
    task.title = this.title
    
    this.httpService.createTask(task).subscribe( data => {
      console.log(data)
      this.router.navigate(["live"])
    })
  }

  /**
   * Latitide der per Drag & Drop erstellten Wegpunkte bekommen
   * @param i Id des Wegpunktes
   */
  public getLat(i:number){
    if(this.route){
      return Math.round(this.route.getPlan().getWaypoints()[i].latLng.lat * 1000000)/1000000
    }

    return 0
  }

  /**
   * Longitude der per Drag & Drop erstellten Wegpunkte bekommen
   * @param i Id des Wegpunktes
   */
  public getLng(i){
    if(this.route){
      return Math.round(this.route.getPlan().getWaypoints()[i].latLng.lng * 1000000)/1000000
    }

    return 0
  }

  /**
   * Latitide und Longitide von per Textfeld eingegebenen Startpunkt bekommen
   */
  public searchStart(){
    this.httpService.getLatLngFromAddress(this.addressStart).subscribe(data => {
      if(data[0]){
        this.startpoint = L.latLng(+data[0].lat, +data[0].lon)

        this.route.setWaypoints([this.startpoint, L.latLng(this.getLat(1), this.getLng(1))])

      } else {
        console.log("error")
      }
      
    })
  }

  /**
   * Latitide und Longitide von per Textfeld eingegebenen Endpunkt bekommen
   */
  public searchEnd(){
    this.httpService.getLatLngFromAddress(this.addressEnd).subscribe(data => {
      if(data[0]){
        this.endpoint = L.latLng(+data[0].lat, +data[0].lon)

        this.route.setWaypoints([L.latLng(this.getLat(0), this.getLng(0)), this.endpoint])

      } else {
        console.log("error")
      }
      
    })
  }

}
  


