import { Component, OnInit } from '@angular/core';
import { Badge } from 'src/app/models/badge';
import { BadgesEarned } from 'src/app/models/badgesEarned';
import { AuthService } from 'src/app/services/auth.service';
import { BadgesEarnedService } from 'src/app/services/badgesEarned.service';
import { ChallengesService } from 'src/app/services/challenges.service';

@Component({
  selector: 'app-badges-widget',
  templateUrl: './badges-widget.component.html',
  styleUrls: ['./badges-widget.component.scss', './../small-widget/small-widget.component.scss']
})
export class BadgesWidgetComponent implements OnInit {
  badges!: Badge[];
  allVisible = false;

  constructor(private chaServ: ChallengesService, au: AuthService) { 

    let userId = au.currentUserValue.user_id;


    this.badges = chaServ.challenges.filter(val => val.completion_date != null && val.no_badge == false)
      .map(val => (<Badge>{badge_name: val.badge_name, badge_description: val.description}))
  }

  ngOnInit(): void {
  }

  viewAll(){
    this.allVisible = true;
  }

}
