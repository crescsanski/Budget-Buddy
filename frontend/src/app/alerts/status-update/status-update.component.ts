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
  value1: number;
  value2: number;
  curExper: number;
  requiredExper: number;
  origPerc: number;
  targetPerc1: number;
  target1: number;
  target2: number;
  gainedLevel: boolean = false;
  targetPerc2: number;
  curLevel: number;
  origExper: number;
  needed1: number;
  needed2: number;
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
      this.target2 = this.curExper
      this.needed2 = this.challServ.levProgress.required_experience
      this.targetPerc2 = this.curExper / this.needed2 * 100
    }
    else
    {
      this.target1 = this.curExper
      this.targetPerc1 = this.curExper / this.needed1 * 100
    }

    this.value1 = Math.round(this.challServ.preLev_Prog.experience_points / this.challServ.preLev_Prog.required_experience * 100)
    this.value2 = 0

    let interval = setInterval(() => {
      this.value1 = this.value1 + 1;
      if (this.value1 >= this.targetPerc1) {
          this.value1 = Math.round(this.targetPerc1);
      }
  }, 70);

  if (this.gainedLevel)
  {
      let interval2 = setInterval(() => {
        this.value2 = this.value2 + 1;
        if (this.value2 >= this.targetPerc2) {
            this.value2 = Math.round(this.targetPerc2);
        }
    }, 70);
  }


  
  }

}
