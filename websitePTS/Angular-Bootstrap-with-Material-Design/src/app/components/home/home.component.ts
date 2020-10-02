import { Component, AfterViewInit } from '@angular/core';
import { map, tileLayer, marker } from 'leaflet';
import { Sender } from '../../class/sender';
import { AuthService } from '../../service/auth.service';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

  private map: any
  private locations: any
  private currentLocation: any
  public senders: Array<Sender>

  constructor (
    private authService: AuthService,
    private httpService: HttpService
  ) { }
  
  ngAfterViewInit(): void {
    this.getCurrentLocation()
    this.initMap()
  }

  private getCurrentLocation() {
    /*this.senders.push(0, 'Jakob', 'Hocheneder')
    this.senders.push(1, 'Maximilian', 'Grabner')*/
  }

  private initMap(): void {
    this.map = map('map', {
      center: [ 48.16667, 14.03333 ],
      zoom: 10
    });
    const tiles = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

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
      marker(mark).addTo(this.map)
    }
  }

  public logOut() {
    this.authService.logout()
  }

}
