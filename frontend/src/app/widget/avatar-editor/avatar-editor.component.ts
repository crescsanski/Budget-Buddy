import { AvatarEditor } from './../../models/avatarEditor';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-avatar-editor',
  templateUrl: './avatar-editor.component.html',
  styleUrls: ['./avatar-editor.component.scss']
})
export class AvatarEditorComponent implements OnInit {
  currentAvatar: string = ''
  hatOptions: AvatarEditor[];
  glassesOptions: AvatarEditor[];
  accessoryOptions: AvatarEditor[];

  hat: string;
  glasses: string;
  accessory: string;
  str: string;


  constructor() { 

    this.currentAvatar = './../../../assets/accessories/default.png'
    this.str = "hi"

    this.hatOptions = [
      {name: 'None', item: 'none'},
      {name: 'Cap', item: 'cap'},
      {name: 'Top Hat', item: 'hat'},
      {name: 'Flower', item: 'flower'},
    ]

    this.glassesOptions = [
      {name: 'None', item: 'none'},
      {name: 'Blue Glasses', item: 'bGlasses'},
      {name: 'Red Glasses', item: 'rGlasses'},
    ]

    this.accessoryOptions = [
      {name: 'None', item: 'none'},
      {name: 'Bow Tie', item: 'bowtie'}
    ]


  }

  ngOnInit(): void {
  }

  pickPicture(){
    console.log("updating avatar")
    console.log(this.hat)

    this.str = ""

    if(this.hat != "none") {
      this.str += this.hat
    }

    if(this.glasses != "none") {
      if(this.str.length > 0){
        this.str += "-"
      }
      this.str += this.glasses
    }

    if(this.accessory != "none") {
      if(this.str.length > 0){
        this.str += "-"
      }
      this.str += this.accessory
    }

    if(this.str.length > 0){
      this.str = "./../../../assets/accessories/" + this.str + ".png"
    }

    console.log(this.str)

    this.currentAvatar = this.str
   

  }

}
