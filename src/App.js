import React from 'react';
import './App.css';
import Chart from './Chart.component';

class App extends React.Component {
  state = {
    lineChartData: {
      labels: [],
      datasets: [
        {
          type: "line",
          label: "BTC-USD PRICE",
          backgroundColor: "rgba(0,153,255,0.6)",
          
          lineTension: 0,
          data: []
        }
      ]
    },
    lineChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: true
      },
      legend:{
        display:true,
        position:'right'
    }
      
    }
  };

  componentDidMount(){
       this.socket=new WebSocket('wss://ws-feed.pro.coinbase.com');
       this.socket.onopen = ()=>{
         console.log('Connection Opened');

         var json = JSON.stringify({
           "type": "subscribe",
           "channels": [{ "name": "ticker",
           "product_ids": ["ETH-USD"] }]
         })
         this.socket.send(json);
       }

       this.socket.onmessage= (event)=>{
        const value = JSON.parse(event.data);

        const previousDataSet = this.state.lineChartData.datasets[0];
        const currentDataSet = { ...previousDataSet };
        currentDataSet.data.push(value.price);



        const latestChartData = {
          ...this.state.lineChartData,
          datasets: [currentDataSet],
          labels: this.state.lineChartData.labels.concat(
            new Date().toLocaleTimeString()
          )
        };

        this.setState({ lineChartData: latestChartData });


       }
  }

  componentWillUnmount() {
    this.socket.close();
  }
  render(){
    return(
      
      <div className='graphData'>BTC-USD Price Real Time Data
        <Chart
          data={this.state.lineChartData}
          options={this.state.lineChartOptions}
        />
      </div>
    )
  }
}

export default App;
