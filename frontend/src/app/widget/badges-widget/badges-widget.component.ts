import { Component, OnInit } from '@angular/core';
import { Badge } from 'src/app/models/badge';
import { BadgesEarned } from 'src/app/models/badgesEarned';
import { AuthService } from 'src/app/services/auth.service';
import { BadgesEarnedService } from 'src/app/services/badgesEarned.service';

@Component({
  selector: 'app-badges-widget',
  templateUrl: './badges-widget.component.html',
  styleUrls: ['./badges-widget.component.scss', './../small-widget/small-widget.component.scss']
})
export class BadgesWidgetComponent implements OnInit {
  badges!: Badge[];
  displayBadges: Badge[];
  allVisible = false;

  constructor(baEar: BadgesEarnedService, au: AuthService) { 

    let userId = au.currentUserValue.user_id;

    this.badges = baEar.earnedBadges;

    this.displayBadges = this.badges.slice(0, 3)


  }

  ngOnInit(): void {
  }

  viewAll(){
    this.allVisible = true;
  }

}
