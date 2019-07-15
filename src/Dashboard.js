import React, {Component} from 'react';
import axios from 'axios';
import * as d3 from "d3";
import './App.css';
import StockNews from './StockNews';

 export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stock:"amd",
      dailyQuote:[],
      news:[],
      duration:'1y',
      chartType: 'close',
      selectedDay:'03152018-today'
    }
  }



componentDidMount() {

  axios
  .get(`https://sandbox.iexapis.com/stable/stock/${this.state.stock}/chart/${this.state.duration}?token=Tpk_f198e8a5eaef43fe95377a5313964a26`)
  .then((response) => {
    this.setState({
      dailyQuote: response.data
    })
    this.drawChart()
  });

  axios
.get(`https://stocknewsapi.com/api/v1?tickers=${this.state.stock}&items=10&date=${this.state.selectedDay}&token=v10wyepxlic9sbnqddzo2rvtlpaqz2rsaquiqxiy`)
.then((response) => {
  this.setState({
    news: response.data.data
  })
  console.log(this.state.news);
})


}



changeDuration(e) {
  let updatedDuration = e.target.value;
  this.axiosGet(updatedDuration)
}

axiosGet(updatedDuration) {
  console.log(updatedDuration);
  axios
  .get(`https://sandbox.iexapis.com/stable/stock/${this.state.stock}/chart/${updatedDuration}?token=Tpk_f198e8a5eaef43fe95377a5313964a26`)
  .then((response) => {
    this.setState({
      dailyQuote: response.data,
      duration: updatedDuration
    })
     this.drawChart()
  })
}

changeChartType(e) {
  let updatedChartType = e.target.value;
  this.setState({
    chartType: updatedChartType
  }, () => {this.drawChart()}
)
}

handleClick(formattedDate) {
  let object = formattedDate.date;
  this.setState({
  selectedDay: object
  })
  console.log(`${object}-today`);
}


stockSearch(e) {
  if (e.key === 'Enter') {
    let search = e.target.value


      axios
      .get(`https://sandbox.iexapis.com/stable/stock/${search}/chart/${this.state.duration}?token=Tpk_f198e8a5eaef43fe95377a5313964a26`)
      .then((response) => {
        this.setState({
          dailyQuote: response.data,
          stock: search
        })
        console.log(this.state.dailyQuote)

      })
      .catch((err) => {
      console.log(err, "get not working", "searchResult:", this.state.searchResult);
    })
    axios
  .get(`https://stocknewsapi.com/api/v1?tickers=${this.state.stock}&items=10&date=${this.state.selectedDay}&token=v10wyepxlic9sbnqddzo2rvtlpaqz2rsaquiqxiy`)
  .then((response) => {
    this.setState({
      news: response.data.data
    })
    console.log(this.state.news);
    this.componentDidMount()

  })

      }

  }


 drawChart() {
   let data = this.state.dailyQuote;
   let chartType = this.state.chartType;

   let margin = {top: 150, right: 30, bottom: 30, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    d3
      .select("svg")
      .remove()

   let svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
             "translate(" + margin.left + "," + margin.top + ")");



    let x = d3.scaleTime()
        .domain(d3.extent(data, d => { return d3.timeParse("%Y-%m-%d")(d.date) }))
        .range([ 0, width ]);


    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))



    let y = d3.scaleLinear()
              .domain([0, d3.max(data, d => { return d[this.state.chartType] })])
              .range([ height, 0 ]);

    svg.append("g")
        .call(d3.axisLeft(y));


    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .transition()
        .duration(1500)
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x( d => { return x(d3.timeParse("%Y-%m-%d")(d.date)) })
        .y( d => { return y(d[this.state.chartType]) })
                             )

        var bisect = d3.bisector(function(d) { return d.x; }).left;


  let toolTip = svg.append("g")
       .attr("class", "tooltip")
       .style("opacity", 1)
           .append('text')
             .style("opacity", 0)
             .attr("text-anchor", "left")
             .attr("alignment-baseline", "middle")

   svg.selectAll("dot")
      .data(data)
      .enter().append("circle")
      .attr("r", 8)
      .attr("cx", d => { return x(d3.timeParse("%Y-%m-%d")(d.date)); })
      .attr("cy", d => { return y(d[this.state.chartType]); })
      .attr('fill', 'none')
      .attr('stroke', 'transparent')
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", d => {
        let formattedDate = d3.timeParse("%Y-%m-%d")(d.date);
        console.log(formattedDate, d.date);
      //  this.handleClick(d3.timeParse("%D%M%Y")(d.date)); // my react method
        })


function mouseout() {
      toolTip.style("opacity", 0);
}

function mouseover() {
  let x0 = x.invert(d3.mouse(this)[0]);
  let formatDate = d3.timeFormat("%b, %d %Y")(x0);
  let y0 = y.invert(d3.mouse(this)[1]);
        toolTip
          .transition()
            .duration(200)
            .style("opacity", .9);
        toolTip
        .html(`${formatDate}, ${chartType}: ${d3.format(",.4r")(y0)}`)
        .attr("x", x(x0))
        .attr("y", y(y0) - 50)
        .attr('height', '50px')
        .attr('width', '50px')

}



}


render() {
  return(
    <div>
        <h1>Search for a Stock Symbol</h1>

        <input onKeyDown ={this.stockSearch.bind(this)}></input>

            <button className="duration-selection" value="1m" onClick= {this.changeDuration.bind(this)}>1 Month</button>
            <button className="duration-selection" value="6m" onClick= {this.changeDuration.bind(this)}>6 Months</button>
            <button className="duration-selection" value = "1y" onClick= {this.changeDuration.bind(this)}>1 Year</button>
            <button className="duration-selection" value="5y" onClick= {this.changeDuration.bind(this)}>5 Years</button>
          <div className="col-md-12" >
            <button className="chart-type green" value="high" onClick = {this.changeChartType.bind(this)}>High</button>
            <button className="chart-type red" value="low" onClick = {this.changeChartType.bind(this)}>Low</button>
            <button className="chart-type blue" value="volume" onClick = {this.changeChartType.bind(this)}>Volume</button>
          </div>
          <div id="chart-area"> </div>
          <h2 className="symbol">{this.state.stock} - {this.state.duration}</h2>
          <h2>{this.state.chartType}</h2>

          <div className="col-md-12 news">
          <h1>Recent News:</h1>

          {this.state.news.map((article) => {
            return (
                <StockNews article = {article} key={article.date} />
                        )
                }) }
          </div>


  </div>

    )
  }
}
