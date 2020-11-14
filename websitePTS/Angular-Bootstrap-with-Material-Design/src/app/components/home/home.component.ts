import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
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

  islogin: boolean = true

  private map: any
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
    this.auth.logout()
  }
}
