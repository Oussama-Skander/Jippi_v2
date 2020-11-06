import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LocalService } from '../../../local.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  customersList: any = [];
  companiesList: any = [];
  companyName: string = '';
  callDataCompany: any = false;
  backUpData: any;
  constructor(private _http: HttpService, private local: LocalService) {}

  ngOnInit(): void {
    this.getCompanies();
    this.local.getcompany_Data.subscribe((boo) => (this.callDataCompany = boo));
  }

  ngDoCheck() {
    console.log('cllparent111', this.callDataCompany);
    this.companiesList;
    if (this.callDataCompany) {
      this.getCompanies();
      this.callDataCompany = false;
      console.log('cllparent', this.callDataCompany);
    }
  }

  // BRING ALL THE COMPANIES TO ADMIN INTERFACE.
  getCompanies() {
    this._http.getCompanies().subscribe((data: any) => {
      this.companiesList = data.reverse();
      this.backUpData = this.companiesList;
    });
  }

  // SEARCH FOR A COMPANY BY NAME.
  Search() {
    if (this.companyName === '') {
      this.companiesList = this.backUpData;
    } else {
      this.companiesList = this.companiesList.filter((company) => {
        return company.companyName
          .toLowerCase()
          .match(this.companyName.toLocaleLowerCase());
      });
    }
  }
}
