import React, { Component } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import TimeframeSelector from './TimeframeSelector';
import html2canvas from 'html2canvas';
import dayjs from 'dayjs';
import '../styles/index.css'

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filteredData: [],
      timeframe: 'daily',
    };
  }

  componentDidMount() {
    axios.get(`${process.env.PUBLIC_URL}/data.json`)
      .then(response => {
        console.log('Data received:', response.data);
        this.setState({ data: response.data }, this.filterData);
      })
      .catch(error => {
        if (error.response) {
          console.error("Server responded with error status:", error.response.status, error.response.data);
        } else if (error.request) {
          console.error("Request was made but no response received:", error.request);
        } else {
          console.error("Error setting up the request:", error.message);
        }
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.data !== this.state.data || prevState.timeframe !== this.state.timeframe) {
      this.filterData();
    }
  }

  filterData = () => {
    const { data, timeframe } = this.state;

    const filterDataByTimeframe = (data, timeframe) => {
      if (timeframe === 'daily') {
        return data;
      }

      const groupedData = {};
      data.forEach(item => {
        const date = dayjs(item.timestamp);
        let key;

        if (timeframe === 'weekly') {
          key = date.startOf('week').format('YYYY-MM-DD');
        } else if (timeframe === 'monthly') {
          key = date.startOf('month').format('YYYY-MM');
        }

        if (!groupedData[key]) {
          groupedData[key] = { timestamp: key, value: 0, count: 0 };
        }

        groupedData[key].value += item.value;
        groupedData[key].count += 1;
      });

      return Object.values(groupedData).map(item => ({
        timestamp: item.timestamp,
        value: item.value / item.count,
      }));
    };

    this.setState({ filteredData: filterDataByTimeframe(data, timeframe) });
  };

  handleClick = (data) => {
    alert(`You clicked on ${data.activeLabel}`);
  };

  handleExport = () => {
    const chart = document.querySelector('.recharts-wrapper');
    html2canvas(chart).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'chart.png';
      link.click();
    });
  };

  setTimeframe = (timeframe) => {
    this.setState({ timeframe });
  };

  render() {
    return (
      <div className="chart-container">
        <div className="containerdivs">
          <TimeframeSelector onSelect={this.setTimeframe} />
          <button onClick={this.handleExport}>Export as PNG</button>
        </div>
        <ResponsiveContainer width="110%" height={400} className="ourchart">
          <LineChart data={this.state.filteredData} onClick={this.handleClick}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Chart;
