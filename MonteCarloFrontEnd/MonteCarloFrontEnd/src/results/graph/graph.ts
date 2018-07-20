import { Chart } from "chart.js";
import { collapse } from "../collapse/collapse"
import { bindable } from "aurelia-framework";
import { inject } from 'aurelia-framework';

export class Graph {

  table: collapse;
  @bindable title;
  @bindable number;
  @bindable percentile = 10;
  @bindable currentPercentile = 10;
  currentTableData;
  myChart;
  distribution;

  populateGraph() {
    var labels = [];
    var year = (new Date()).getFullYear();
    for (var i = 0; i < this.distribution[0].amount.length; i++) {
      labels.push(+year + +i);
    }
    var data = [];
    for (var i = 0; i < 9; i++) {
      data.push(this.distribution[i].amount);
    }
    this.createChart(labels, data, this.title);
    this.displayData(this.currentPercentile);
  }

  selectPercentileData(percentile) {
    this.constructTableData(this.distribution[percentile].amount, this.distribution[percentile].withdrawal, this.distribution[percentile].growth);
  }

  constructTableData(amount, withdrawal, growth) {
    var newTableData = [];
    var year = (new Date()).getFullYear();
    for (var i = 0; i < amount.length; i++) {
      newTableData[i] =
        {
          'year': +year + +i,
          'amount': amount[i],
          'withdrawal': withdrawal[i],
          'growth': (growth[i]*100).toFixed(2)+"%"
        }
    }
    this.currentTableData = newTableData;
  }
  displayData(percentile) {
    this.currentPercentile = Math.floor((+percentile) / +10) * +10;
    this.selectPercentileData(Math.floor((+percentile - +1) / +10));
    //console.log(this.currentTableData);
    this.table.updateData(this.currentTableData);
  }

  createChart(inLabels, inData, title) {
    var tempData = [];
    for (var i = 0; i < inData.length; i++) {
      tempData.push({
        fill: false,
        borderColor: "red",
        data: inData[i]
      })
    }
    var data = {
      labels: inLabels,
      datasets: tempData
    }
    var options = {
      responsive: false,
      legend: { display: false },
      title: {
        display: true,
        text: title
      }
    }
if(this.myChart){
 this.myChart.destroy();
}
    const element: any = document.getElementById("myChart" + this.number);
      this.myChart=new  Chart(element.getContext('2d'), {
      type: 'line',
      data: data,
      options: options
    });
  }

  inputData(distribution) {
    console.log(distribution);
    this.currentTableData = distribution[0].amount;
    this.distribution = distribution;

   
    this.populateGraph();
  }
}
