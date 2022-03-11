import { Trophy } from './../../models/trophy';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-trophies',
  templateUrl: './trophies.component.html',
  styleUrls: ['./trophies.component.scss', './../small-widget/small-widget.component.scss']
})
export class TrophiesComponent implements OnInit {

  trophies: Trophy[];

  constructor(au: AuthService) { 

    let userId = au.currentUserValue.user_id;
    //TODO: retrieve trophies from api

    this.trophies = [
    {trophy_id: 1, trophy_name: 'Savvy Saver', trophy_description: 'Tracked spending the most for one month'},
    {trophy_id: 2, trophy_name: 'First Place', trophy_description: 'Beat your friends at a challenge'},
    ]

  }
  ngOnInit(): void {
  }

}
