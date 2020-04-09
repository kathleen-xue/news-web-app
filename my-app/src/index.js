import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
//import {BrowserRouter, Route, Switch} from 'react-router-dom';
//import DetailedPage from './detailedpage.js';

//const apiHost = 'http://localhost:8080/';

/*function populateArticleUrls() {
	let routes = [];
	fetch(apiHost + 'getAllDetailedArticlePaths')
	  .then(res =>res.json())
	  .then(
	    (result) => {
	      for(let i = 0; i < result.data.length; i++) {
	        routes.push(<Route exact path={'/' + result.data[i]} component={DetailedPage}/>);
	      }
	    }
	  );
  	console.log(routes);
	return routes;
}*/

ReactDOM.render(
	<App/>, 
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
