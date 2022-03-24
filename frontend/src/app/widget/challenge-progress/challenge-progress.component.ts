import { ChallengePackage } from './../../models/challengePackage';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-challenge-progress',
  templateUrl: './challenge-progress.component.html',
  styleUrls: ['./challenge-progress.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class ChallengeProgressComponent implements OnInit {

  challenges: any[] //will be of type ChallengePackage (but too complicated to implement w/out just retrieving data)

  constructor() {
      //TO DO: implement w/ API
      this.challenges = [
        {
          challenge__challenge_completion_amount: 7,
          challenge_value_label: 'days',
          challenge__challenge_description: 'Track spending every day for one week',
          challenge__challenge_is_active: true,
          challenge__challenge_name: "Daily Tracker",
          challenge__challenge_start_amount: 0,
          challenge__challenge_time_given: 7,
          user_challenge_current_amount: 5,
          currentProgress: Math.floor((5 / 7) * 100),
          user_challenge_completion_date: "3/27/22"
        },
        {
          challenge__challenge_completion_amount: 4,
          challenge_value_label: 'weeks',
          challenge__challenge_description: 'Stay 25% under budget each week for one month',
          challenge__challenge_is_active: true,
          challenge__challenge_name: "Savvy Saver",
          challenge__challenge_start_amount: 0,
          challenge__challenge_time_given: 31,
          user_challenge_current_amount: 1,
          currentProgress: Math.floor((1 / 4) * 100),
          user_challenge_completion_date: "4/12/22"
        }
      ]
   }

  ngOnInit(): void {

  }

  

}
