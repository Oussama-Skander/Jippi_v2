import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../http.service';
import { LocalService } from '../../../../local.service';

@Component({
  selector: 'app-admin-items',
  templateUrl: './admin-items.component.html',
  styleUrls: ['./admin-items.component.css'],
})
export class AdminItemsComponent implements OnInit {
  delete_Item: boolean = false;
  itemsList: any = [];
  itemName: string = '';
  backUpData: any;
  constructor(private _http: HttpService, private local: LocalService) {}

  ngOnInit(): void {
    this.getitems();
    this.local.delete_item.subscribe((boo) => (this.delete_Item = boo));
  }

  ngDoCheck() {
    if (this.delete_Item) {
      this.getitems();
      this.delete_Item = false;
    }
  }

  getitems() {
    return this._http.getItems().subscribe((data: any) => {
      this.itemsList = data.reverse();
      this.backUpData = this.itemsList;
    });
  }

  // SEARCH FOR ITEM BY NAME.
  Search() {
    if (this.itemName === '') {
      this.itemsList = this.backUpData;
    } else {
      this.itemsList = this.itemsList.filter((item) => {
        return item.itemName
          .toLowerCase()
          .match(this.itemName.toLocaleLowerCase());
      });
    }
  }
}
