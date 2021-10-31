
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  pageLabel: String = '';
  currentPage: String = '';
  settings: MenuItem[] = [];


  constructor() { 
   this.currentPage = 'Dashboard';
  }

  ngOnInit(): void {
    this.settings = [
      {label: 'New', icon: 'pi pi-fw pi-plus'},
      {label: 'Open', icon: 'pi pi-fw pi-download'},
      {label: 'Undo', icon: 'pi pi-fw pi-refresh'}
  ];
  }

  onNotify(page:string) {
    this.currentPage = page;
  }





}
