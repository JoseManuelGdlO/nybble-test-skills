import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the ResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage implements OnInit {

  taxes = [];

  totalNet = 0;
  totalTax = 0;
  total = 0;

  constructor(
    public navCtrl: NavController,
    public dataProvider: DataProvider
    ) {
  }

  ngOnInit(): void {
    for(const tax of this.dataProvider.taxes) {
      this.totalNet = (parseInt(tax.net) + this.totalNet);
      this.totalTax = (parseInt(tax.tax) + this.totalTax);
      this.total = (parseInt(tax.total) + this.total);
    }
    
  }

  delete() {
    this.dataProvider.taxes = [];
    this.navCtrl.popToRoot();
  }

}
