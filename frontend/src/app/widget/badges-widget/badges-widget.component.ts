import { Component, OnInit } from '@angular/core';
import { Badge } from 'src/app/models/badge';
import { AuthService } from 'src/app/services/auth.service';
import { BadgesEarnedService } from 'src/app/services/badgesEarned.service';

@Component({
  selector: 'app-badges-widget',
  templateUrl: './badges-widget.component.html',
  styleUrls: ['./badges-widget.component.scss', './../small-widget/small-widget.component.scss']
})
export class BadgesWidgetComponent implements OnInit {
  badges!: Badge[];

  constructor(baEar: BadgesEarnedService, au: AuthService) { 

    let userId = au.currentUserValue.user_id;
    baEar.getBadgesEarned(userId).subscribe(
      (res) =>
      {
        this.badges = res
      });

  }

  ngOnInit(): void {
    //TODO: use http request to retrieve user's badges (using mock data for testing purposes)
    /*
    this.badges = [
      {badge_id: 1, badge_name: 'Savvy Saver', badge_description: 'Tracked spending for one week'},
      {badge_id: 2, badge_name: 'Beginner Budget', badge_description: 'Made first budget'},
      {badge_id: 3, badge_name: 'Receipt Recorder', badge_description: 'Scanned first receipt'}
    ]
    */
  }

}
