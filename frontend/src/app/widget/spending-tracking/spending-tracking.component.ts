import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-spending-widget',
  templateUrl: './spending-tracking.component.html',
  styleUrls: ['./spending-tracking.component.scss']
})
export class SpendingTrackingComponent implements OnInit {
  @Input() image: string | undefined;
  @Input() title: string = '';
  @Input() subtitle: string | undefined;
  @Input() smallSize: boolean = false;
  form: FormGroup = <FormGroup>{};
  imageUrl: string ='';
  catOptions!: Category[];
  
  constructor(private fb: FormBuilder, private cs: CategoryService) 
  { 
    this.cs.getCategories().subscribe(
      (cats: Category[]) => 
      {
        this.catOptions = cats;
      }
    )
  }

  ngOnInit(): void {
    this.form = this.fb.group({
        date: ['', Validators.required],
        cost: ['', Validators.required],
        category: ['', Validators.required],
  });
  }

  onSubmit()
  {
    
  }

      // convenience getter for easy access to form fields
      get f() { return this.form.controls; }


}
