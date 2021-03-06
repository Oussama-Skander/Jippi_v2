import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../http.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css'],
})
export class AddItemComponent implements OnInit {
  constructor(private _http: HttpService) {}
  public imagePath;
  imgURL: any;
  itemName: string = '';
  itemPrice: any = 0;
  itemDescription: string = '';
  itemImage: any;
  itemRating: any = 0;
  companyID: any = parseInt(localStorage.comapnyId);
  selectedCategory: string = 'clothing';
  selectedKind: string = 'Male';
  listKind = ['Male', 'Female', 'Kids'];
  url: any;
  itemId: any;
  kind = {
    clothing: [] = ['Male', 'Female', 'Kids'],
    electronics: [] = [
      'Camera & Photo',
      'Computers',
      'Wearable Technology',
      'Cell Phones',
    ],
    Outdoor: [] = ['camping', 'Hunting and fishing', 'Biking', 'Rock Climbing'],
    Toys: [] = [
      'Action figures',
      'Animals',
      'Cars and radio controlled',
      'Creative toys',
      'Dolls',
    ],
  };

  ngOnInit(): void {}
  show() {
    console.log('AddItemComponent -> itemName', this.itemName);
    console.log('Addthis.ItemComponent -> this.itemPrice', this.itemPrice);
    console.log(
      'Addthis.ItemComponent -> this.itemDescription',
      this.itemDescription
    );
    console.log('Addthis.ItemComponent -> this.itemImage', this.itemImage);
    console.log('Addthis.ItemComponent -> this.itemRating', this.itemRating);
    console.log('AddItemComponent -> ngOnInit ->this.company', this.companyID);
    console.log(
      'AddItemComponent -> ngOnInit ->this.selectedCategory',
      this.selectedCategory
    );
    console.log(
      'AddItemComponent -> selectKindHandler -> this.selectedKind',
      this.selectedKind
    );
  }

  selectCategoryHandler(event: any) {
    this.selectedCategory = event.target.value;
    this.listKind = this.kind[this.selectedCategory];
    this.selectedKind = this.listKind[0];
  }

  selectKindHandler(event: any) {
    this.selectedKind = event.target.value;
  }

  chooseAnImage(event) {
    this.itemImage = event.target.files[0];
    console.log('this.itemImage===========<<<', this.itemImage);
  }

  preview(files) {
    if (files.length === 0) {
      return;
    }
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

  saveItem() {
    if (
      this.itemName === '' ||
      this.itemPrice === 0 ||
      this.itemImage === undefined
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text:
          'Please fill all the fealds and add an image for a better chance to sell your item',
      });
      return;
    } else {
      const formData = new FormData();
      formData.append('itemName', this.itemName);
      formData.append('itemPrice', this.itemPrice);
      formData.append('itemDescription', this.itemDescription);
      formData.append('itemImage', this.itemImage);
      formData.append('itemRating', this.itemRating);
      formData.append('companyID', this.companyID);
      formData.append('selectedCategory', this.selectedCategory);
      formData.append('selectedKind', this.selectedKind);

      return this._http.postAddItem(formData).subscribe((res) => {
        this.itemId = res['id'];
        Swal.fire({
          icon: 'success',
          title: 'Done',
          text: `this item is added to your shop`,
        });
      });
    }
  }
}
