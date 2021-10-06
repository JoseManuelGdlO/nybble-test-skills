import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { WeatherService } from '../../providers/weather-service/weather-service';
import { ResultsPage } from '../results/results';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  whater = [];
  taxes = [];

  inputInoviceNumber = '';
  inputNet = '';
  inputTotal = '';
  selectTax = '-1';
  taxToAadd = '';

  constructor(
    public navCtrl: NavController,
    public weatherService: WeatherService,
    public toastController: ToastController,
    public dataProvider: DataProvider
    ) {

  }
  ngOnInit(): void {
    this.getWhaterTime();
  }

  async getWhaterTime() {
    const response = await this.weatherService.getWeather();
    const weathers = response.filter(element => element.dt_txt.includes('12:00:00'));

    for(const wather of weathers) {
      this.whater.push(
        { day: wather.dt_txt,
          feel: wather.main.feels_like,
          temp: wather.main.temp,
          max: wather.main.temp_max,
          min: wather.main.temp_min });
    }
    
  }

  calculate(){

    if(!this.checkInputs()) {
      this.inputTotal = '';
      return;
    }

    const net = parseInt(this.inputNet);
    const tax = parseInt(this.selectTax);

    let result = 1 + tax / 100;
    result = net * result;

    result = Math.round((result) * 100) / 100;

    this.inputTotal = result.toString()

    this.taxToAadd = (result - net).toString();

  }


  checkInputs(): boolean {
    
    if(this.inputInoviceNumber.length === 0 ||
      this.inputNet.length === 0 ||
      this.selectTax === '-1') {
      return false;
    }

    return true;
  }

  addTax() {
    if(!this.checkInputs()) {
      this.presentToast('Fill all inputs')
      return;
    }

    this.dataProvider.taxes.push(
      { invoiceNumber: this.inputInoviceNumber,
        net: this.inputNet,
        taxPersent: this.selectTax,
        tax: this.taxToAadd,
        total: this.inputTotal
      } );
    
      this.clearTax();
  }

  clearTax() {
    this.inputInoviceNumber = '';
    this.inputNet = '';
    this.selectTax = '-1';
    this.inputTotal = '';
  }

  removeTax(index) {
    this.dataProvider.taxes.splice(index, 1);
  }

  goToResults() {
    this.navCtrl.push(ResultsPage);
  }


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


}
