import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
/*
  Autor: Jakob Hochender
  Titel: About Component
  Beschreibung: About Seite
*/
export class AboutComponent implements OnInit {

  token: number;

  constructor() { }

  ngOnInit(): void {
  }

}
