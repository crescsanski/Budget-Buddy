import { AvatarEditor } from './../../models/avatarEditor';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';


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

  @Output() avatarUpdate = new EventEmitter<string>();  

  hat: string;
  glasses: string;
  accessory: string;
  str: string;


  constructor() { 

    //TODO: These 4 values need to be saved with the user's data
    this.currentAvatar = './../../../assets/accessories/default.png'
    this.hat = 'none'
    this.glasses = 'none'
    this.accessory = 'none'


    this.str = "hi"

    this.hatOptions = [
      {name: 'Cap', item: 'cap', image:'./../../../assets/accessories/options/cap.png' },
      {name: 'Top Hat', item: 'hat', image:'./../../../assets/accessories/options/hat.png'},
      {name: 'Flower', item: 'flower', image:'./../../../assets/accessories/options/flower.png'},
      {name: 'None', item: 'none'},
    ]

    this.glassesOptions = [
      {name: 'Blue Glasses', item: 'bGlasses', image:'./../../../assets/accessories/options/bGlasses.png'},
      {name: 'Red Glasses', item: 'rGlasses', image:'./../../../assets/accessories/options/rGlasses.png'},
      {name: 'None', item: 'none'},
    ]

    this.accessoryOptions = [
      {name: 'Bow Tie', item: 'bowtie', image:'./../../../assets/accessories/options/bowtie.png'},
      {name: 'None', item: 'none'},
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
    } else {
      this.str = './../../../assets/accessories/default.png'
    }

    console.log(this.str)

    this.currentAvatar = this.str

    //this.avatarUpdate.emit(this.currentAvatar)
   

  }

  setHat(newHat: string){
    this.hat = newHat
    this.pickPicture()
  }

  setGlasses(newGlasses: string){
    this.glasses = newGlasses
    this.pickPicture()
  }

  setAccessory(newAccessory: string){
    this.accessory = newAccessory
    this.pickPicture()
  }

  updateAvatar() {
    console.log("click")
    this.avatarUpdate.emit(this.currentAvatar)
  }

}
