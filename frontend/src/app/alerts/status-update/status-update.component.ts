import { Component, Input, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Challenge } from 'src/app/models/Challenge';
import { ChallengesService } from 'src/app/services/challenges.service';

@Component({
  selector: 'app-status-update',
  templateUrl: './status-update.component.html',
  styleUrls: ['./status-update.component.scss']
})
export class StatusUpdateComponent implements OnInit {

  completedChallenge: Challenge

  
  constructor(private challServ: ChallengesService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) { 
    this.completedChallenge = this.config.data.completedChallenge
  }

  ngOnInit(): void {
    this.completedChallenge.rewardPoints
  }

}
