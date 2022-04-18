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
  curExper: number;
  requiredExper: number;
  targetPerc1: number;
  target1: number;
  gainedLevel: boolean = false;
  curLevel: number;
  origExper: number;
  needed1: number;
  oldLevel: number;
  
  constructor(private challServ: ChallengesService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) { 
    this.completedChallenge = this.config.data.completedChallenge
  }

  ngOnInit(): void {

    this.origExper = this.challServ.preLev_Prog.experience_points
    this.needed1 = this.challServ.preLev_Prog.required_experience
    this.curExper = this.challServ.levProgress.experience_points
    this.oldLevel = this.challServ.preLev_Prog.level
    this.curLevel = this.challServ.levProgress.level

    if (this.curLevel > this.oldLevel)
    {
      this.gainedLevel = true;
      this.targetPerc1 = 100
      this.target1 = this.needed1
    }
    else
    {
      this.target1 = this.curExper
      this.targetPerc1 = this.curExper / this.needed1 * 100
    }

   
  
  }

}
