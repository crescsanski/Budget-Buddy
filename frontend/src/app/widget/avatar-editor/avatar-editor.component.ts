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

  hat: AvatarEditor;
  glasses: AvatarEditor;
  accessory: AvatarEditor;
  colorOptions: string[];
  color: string;


  constructor() { 

    this.currentAvatar = './../../../assets/accessories/blueCap-blueGlasses@4x.png'

    this.colorOptions = [
      'Red', 'Blue'
    ]

    this.hatOptions = [
      {name: 'Cap', item: 'blueCap'},
      {name: 'Top Hat', item: 'topHat'},
      {name: 'Flower', item: 'flower'},
      {name: 'None', item: 'none'},
    ]

    this.glassesOptions = [
      {name: 'Glasses', item: 'glasses'},
      {name: 'No Glasses', item: 'none'}

    ]

    this.accessoryOptions = [
      {name: 'None', item: 'none'},
      {name: 'Bow Tie', item: 'bowtie'}
    ]


  }

  ngOnInit(): void {
  }

  pickPicture(){
    this.currentAvatar = './../../../assets/accessories/'

    if(this.color == 'Red'){

      if(this.hat.item == 'cap'){

        if(this.glasses.item == 'glasses'){
          if(this.accessory.item == 'bowtie'){
            //red hat, glassess, bowtie
            this.currentAvatar += 'redCap-redGlasses-redBowtie@4x.png'
          } else {
            //red hat, glasses, no accessory
            this.currentAvatar += 'redCap-redGlasses@4x.png'
          }
        }

        else {
          //red hat, no glasses 
          if(this.accessory.item == 'bowtie'){
            //red hat, glassess, bowtie
            this.currentAvatar += 'redCap-redGlasses-redBowtie@4x.png'
          } else {
            //red hat, glasses, no accessory
            this.currentAvatar += 'redCap-redGlasses@4x.png'
          }

        }

      }
    }

  }

}
