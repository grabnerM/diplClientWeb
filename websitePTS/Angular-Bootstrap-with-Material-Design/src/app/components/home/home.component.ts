import { Component, AfterViewInit } from '@angular/core';
<<<<<<< Updated upstream
import { map, tileLayer, marker } from 'leaflet';
=======
import { Router } from '@angular/router';
import * as L from 'leaflet';
>>>>>>> Stashed changes
import { Sender } from '../../class/sender';
import { AuthService } from '../../service/auth.service';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

<<<<<<< Updated upstream
  private map: any
=======
  islogin: boolean = true

  private map: L.Map
>>>>>>> Stashed changes
  private locations: any
  private currentLocation: any
  public senders: Sender[] = []

  constructor (
    private authService: AuthService,
    private httpService: HttpService
  ) { }
  
  ngAfterViewInit(): void {
    this.getCurrentLocation()
    this.initMap()
  }

  private getCurrentLocation() {
    this.senders.push(new Sender(0, 'Jakob', 'Hocheneder'))
    this.senders.push(new Sender(1, 'Maximilian', 'Grabner'))
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
    this.authService.logout()
  }

}
