import React, {Component} from 'react';
import axios from 'axios';


export default class StockNews extends Component {
  constructor(props) {
    super(props);

  }




  render() {
    return (
    <div className = "article col-md-4">
      <a href={this.props.article.news_url} target="_blank" rel="noopener noreferrer">
      <img className= "article-photo" src={this.props.article.image_url}/>
        <h3>{this.props.article.type}: {this.props.article.title}</h3>
        <h5 className="article-subheading">{this.props.article.source_name} | {this.props.article.date} | <strong className = {this.props.article.sentiment} > {this.props.article.sentiment}</strong> </h5>
        <p>{this.props.article.text} <br/>Read Article...</p>
      </a>
    </div>

    )

  }

}
