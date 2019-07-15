import React, {Component} from 'react';
import * as d3 from "d3";


export default class Linechart extends Component {

constructor(props) {
  super(props);
}

drawChart() {
console.log(this.props.dailyQuote)
}

componentDidMount() {
   this.drawChart();
 }

  render() {
  return (
    <div>
    <svg height="500" width="80%" fill="red">
    SVG HERE
    </svg>
    </div>

  )


  }



}
