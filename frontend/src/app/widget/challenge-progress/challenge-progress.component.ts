import { Challenge } from '../../models/Challenge';
import { Component, OnInit } from '@angular/core';
import { ChallengesService } from 'src/app/services/challenges.service';
import { TriggerService } from 'src/app/services/trigger.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-challenge-progress',
  templateUrl: './challenge-progress.component.html',
  styleUrls: ['./challenge-progress.component.scss', './../basic-widget/basic-widget.component.scss']
})
export class ChallengeProgressComponent implements OnInit {

  challenges: Challenge[] //will be of type ChallengePackage (but too complicated to implement w/out just retrieving data)

  constructor(private chalServ: ChallengesService, private trigServ: TriggerService, private cp: CurrencyPipe) {
      this.challenges = this.getInProgress(this.chalServ.challenges);

      this.trigServ.challAnnounced$.subscribe(() => this.challenges = this.getInProgress(this.chalServ.challenges))
      //TO DO: implement w/ API

      /*
      this.challenges = [
        {
          goal: 7,
          label: 'days',
          description: 'Track spending every day for one week',
          name: "Daily Tracker",
          start_amount: 0,
          time_given: -1,
          progress: 5,
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
      */
   }

   getInProgress(inven: Challenge[])
   {
     return inven.filter(val => val.is_active && val.completion_date == null).map(val => 
      {
        var prog: any = val.progress
        var goal: any = val.goal
        var label: any = val.label;
        if (val.label == 'dollars')
        {
          prog = this.cp.transform(val.progress)
          goal = this.cp.transform(val.goal)
          label = ""
        }
        return {...val, fracCompl: Math.round(val.fracCompl), displayProg: prog, label: label, displayGoal: goal}
      }
    )
   }

  ngOnInit(): void {

  }

  

}
