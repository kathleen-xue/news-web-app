//NYT KEY: okflgGpEbDypkihhKQ9MYRqg6xz6dELs
//GUARDIAN KEY: c2c4cdab-bf2e-47b6-94a1-77a23a74bab6
var express = require('express');
var app = express();
var fs = require("fs");
const cors = require('cors');
const fetch = require('node-fetch');
var bodyParser = require('body-parser');

const nytKey = 'okflgGpEbDypkihhKQ9MYRqg6xz6dELs';
const guardianKey = 'c2c4cdab-bf2e-47b6-94a1-77a23a74bab6';

var detailedArticles = {};
const nytPages = ['home', 'world', 'politics', 'business', 'technology', 'sports'];
const guardianPages = ['world', 'politics', 'business', 'technology', 'sport'];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/:page/:id', cors(), function (req, res) {
	//console.log(req.params);
	let url = '';
	let settings = {method: "Get"};
	let jsonRes = {};

	if(req.params.id == 'nyt') {
		url = 'https://api.nytimes.com/svc/topstories/v2/' + req.params.page + '.json?api-key=' + nytKey;
		fetch(url, settings)
	   	.then(r => r.json())
	   	.then((json) => {
	   		fillDetailedArticlePathsArray(json.results, 'nyt');
	   		res.send(json);
	   	});
	}
	else if(req.params.id == 'guardian') {
		if(req.params.page == 'home') {
			url = 'https://content.guardianapis.com/search?api-key=' + guardianKey + '&section=(sport|business|technology|politics)&show-blocks=all';
		}
		else {
			url = 'https://content.guardianapis.com/' + req.params.page + '?api-key=' + guardianKey + '&show-blocks=all';
		}
		fetch(url, settings)
	   	.then(r => r.json())
	   	.then((json) => {
	   		fillDetailedArticlePathsArray(json.response.results, 'guardian');
	   		res.send(json.response);
	   	});
	}
});

function fillDetailedArticlePathsArray(art, source) {
	//console.log(art);
	if(source === 'guardian') {
		for(let i = 0; i < art.length; i++) {
			var id = art[i].id.replace(/-|\//g,'');
			detailedArticles[id] = art[i];
			detailedArticles[id].pathId = id;
			detailedArticles[id].source = source;
			//console.log(detailedArticles[id]);
		}
	}
	else {
		console.log(art[0].pathId);
		for(let i = 0; i < art.length; i++) {
			var id = art[i].uri.substring(14);
			id = id.replace(/\//g,'');
			detailedArticles[id] = art[i];
			detailedArticles[id].source = source;
			detailedArticles[id].pathId = id;
			//console.log(art[i]);
		}
	}
}

app.get('/getAllDetailedArticlePaths', cors(), function(req, res) {
	var keys = [];
	for(var k in detailedArticles) {
		keys.push(k);
	}
	var result = {data: keys};
	//console.log(result);
	res.send(result);
});

app.get('/detailedArticleInfo', cors(), function(req, res) {
	//console.log('hELLO');
	//onsole.log(req.query.id);
	var apiUrl = '';
	var settings = {method: 'Get'};
	if(detailedArticles[req.query.id].source === 'guardian') {
		var articleId = detailedArticles[req.query.id].id;
		apiUrl = 'https://content.guardianapis.com/'+ articleId + '?api-key='+ guardianKey + '&show-blocks=all';
		fetch(apiUrl, settings)
			.then(r => r.json())
			.then((json) => {
				res.send(json.response.content);
			});
	}
	else {
		console.log('hello');
		console.log(detailedArticles[req.query.id]);
		var webUrl = '';
		if(detailedArticles[req.query.id].hasOwnProperty('url')) {
			webUrl = detailedArticles[req.query.id].url;
		}
		else {
			webUrl = detailedArticles[req.query.id].web_url;
		}
		apiUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("' + webUrl + '")&api-key=' + nytKey;
		fetch(apiUrl, settings)
			.then(r => r.json())
			.then((json) => {
				//console.log(json);
				res.send(json.response.docs);
			});
	}
});	

app.get('/searchResults', cors(), function(req, res) {
	var query = req.query.query;
	var guardianSearch = 'https://content.guardianapis.com/search?q='+ query +'&api-key=' + guardianKey + '&show-blocks=all';
	var nytSearch = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + query + '&api-key=' + nytKey;
	var settings = {method: 'Get'};
	var nytResponse = [];
	var guardianResponse = [];
	
	const urls = [
		guardianSearch,
		nytSearch
	];
	Promise.all(urls.map(url =>
	  fetch(url, settings)
	    .then(r => r.json())                 
	    .then((json) => {
	    	if(json.response.hasOwnProperty('docs')) {
	    		//console.log(json.response.docs);
	    		nytResponse = json.response.docs;
	    		//console.log(response);
	    	}
	    	else {
	    		//console.log(json.response.results);
	    		guardianResponse = json.response.results;
	    		//console.log(response);
	    	}
	    })
	))
	.then(data => {
		for(let i = 0; i < nytResponse.length; i++) {
			nytResponse[i].pathId = nytResponse[i].uri.substring(14).replace(/\//g,'');
		}
		for(let i = 0; i < guardianResponse.length; i++) {
			guardianResponse[i].pathId = guardianResponse[i].id.replace(/-|\//g,'');
		}
		fillDetailedArticlePathsArray(nytResponse, 'nyt');
		fillDetailedArticlePathsArray(guardianResponse, 'guardian');
	   res.send({'nytData' : nytResponse, 'guardianData': guardianResponse});
	});
});
/*
app.post('/addArticleToPathsList', cors(), function(req, res) {
	var data = req.body.data;
	var id = req.body.id;
	detailedArticles[id] = data;
}); 
*/
var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})