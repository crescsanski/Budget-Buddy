import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-letter-grade',
  templateUrl: './letter-grade.component.html',
  styleUrls: ['./letter-grade.component.scss', './../small-widget/small-widget.component.scss']
})
export class LetterGradeComponent implements OnInit {

  budgetScore: string = '';
  status: string = "error loading report card";


  constructor() { }

  ngOnInit(): void {
    //fetch budget score via api
    this.budgetScore = 'A+'
    this.getMessage()
  }

  getMessage(){
    if (this.budgetScore.includes('A')) {
      this.status = "Great Job! Keep up the good work!";
    } else if (this.budgetScore.includes('B')) {
      this.status = "Nice Job! Keep following your budget!";
    } else if (this.budgetScore.includes('C')) {
      this.status = "Keep going! Try making small changes to help you save!";
    } else if (this.budgetScore.includes('D')) {
      this.status = "Needs improvement. Maybe we should rethink our budget plan";
    } else if (this.budgetScore.includes('F')) {
      this.status = "Oh no! Maybe we should rethink our finances. Try using the 20-30-50 rule!"
    } else {
      this.status = "Unable to retrieve status."
    }
  }

}
