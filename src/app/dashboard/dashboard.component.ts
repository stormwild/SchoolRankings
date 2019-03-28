import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { PagerService } from '../services/pager.service';
import { SchoolService } from '../services/school.service';
import { School } from '../model/school';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [PagerService]
})
export class DashboardComponent implements OnInit {

  
  constructor(private http: HttpClient, private pagerService: PagerService, private schoolService: SchoolService) { }

    // array of all items to be paged
    private allItems = new Array();

    data = [];

    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];

    page = 1;
    geolocationPosition: any;

    ngOnInit() {
      if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
            position => {
                this.geolocationPosition = position,
                    console.log(position);
            },
            error => {
                switch (error.code) {
                    case 1:
                        console.log('Permission Denied');
                        break;
                    case 2:
                        console.log('Position Unavailable');
                        break;
                    case 3:
                        console.log('Timeout');
                        break;
                }
            }
        );
    };

   
        this.getData();
    }

    getData() {
      this.http.get('http://localhost:8000/api/v1/schools')
            .pipe(map((response: any) => response))
            .subscribe((data: any) => {
                // set items to json response
              this.allItems = data;
              this.setPage(1);
            });
    }

    setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.allItems.length, page);

        // get current page of items
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    onSearched(schools: School[]) {
      console.log(schools);
      this.allItems = schools;
      this.setPage(1);
    }


  }

