import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, tileLayer, marker } from 'leaflet';
import * as L from 'leaflet';
import { Sender } from '../../class/sender';
import { AuthService } from '../../service/auth.service';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {


  private map: L.Map
  private locations: any
  private currentLocation: any
  public senders: Sender[] = []

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
    console.log(this.router.url)
  }

  private getUser(){
    this.auth.getUser().subscribe(data =>{
      if (data){
        localStorage.setItem('userid', data.receiverid + "")
        this.username = data.username
        console.log(data)
        console.log(localStorage.getItem('userid'))
      }
    });
  }

  private getCurrentLocation() {
    //this.senders.push(new Sender(0, 'Jakob', 'Hocheneder'))
    //this.senders.push(new Sender(1, 'Maximilian', 'Grabner'))
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

   // var marker = new L.Marker(new L.LatLng(51.5, -0.09));

    var mymarker = L.marker([48.16667, 14.03333], {draggable: true}).addTo(this.map);

    /*L.popup().setLatLng([48.16680, 14.03333])
    .setContent('<p>Hello world!<br />This is a nice popup.</p>')
    .openOn(this.map);*/

    mymarker.bindPopup('<p>You are here</p>')

    tiles.addTo(this.map);
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
