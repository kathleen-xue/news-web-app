import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import NewsCard from './newscard.js';
import BounceLoader from 'react-spinners/BounceLoader';

var nytSections = new Set(['world', 'politics', 'business', 'technology', 'sports']);
var guardianSections = new Set(['world', 'politics', 'business', 'technology', 'sport']);

class SearchPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			query: this.props.match.params.query,
			host: this.props.host,
			nytData: [],
			guardianData: [],
			cards: [],
			isLoaded: false
		};
		this.renderSearchCards = this.renderSearchCards.bind(this);
	}

	renderSearchCards() {
		var nyt = this.state.nytData;
		var guardian = this.state.guardianData;

		var img = '';
		var url = '';
		var title = '';
		var appPath = '';
		var description = '';
		var date = '';
		var section = '';
		var buttonName = '';

		var cards = [];

		for(let i = 0; i < nyt.length; i++) {
			title = nyt[i].headline.main;
			section = nyt[i].news_desk;
			if(section === '') {
				section = 'none';
			}
			date = nyt[i].pub_date.substring(0,10);
			img = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg';
			for(let j = 0; j < nyt[i].multimedia.length; j++) {
				var media = nyt[i].multimedia;
				if(media[j].width >= 2000) {
					img = 'http://nytimes.com/' + media[j].url;
				}
			}
			url = nyt[i].web_url;
			appPath = nyt[i].pathId;
			buttonName = 'other-button';
			if(nytSections.has(section.toLowerCase())) {
				buttonName = section + '-button';
			}
			cards.push(
				<NewsCard 
					key={i*2} 
					key1={i*2} 
					img={img} 
					title={title}
					description={description}
					date={date}
					section={section}
					buttonName={buttonName}
					source='nyt'
					url={url} 
					reactAppUrl={appPath}
					className='searchResultCard'
				/>
			);
		}

		for(let i = 0; i < guardian.length; i++) {
			title = guardian[i].webTitle;
			section = guardian[i].sectionId;
			if(section === '') {
				section = 'none';
			}
			date = guardian[i].webPublicationDate.substring(0, 10);
			url = guardian[i].webUrl;
			appPath = guardian[i].pathId;
			buttonName = 'other-button';
			if(guardianSections.has(section.toLowerCase())) {
				buttonName = section + '-button';
			}
			img = 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png';
			var imgArr1 = guardian[i].blocks.main ? guardian[i].blocks.main.elements[0].assets : [];
			var imgArrLen1 = imgArr1.length;
			if(imgArrLen1 > 0) {
				img = imgArr1[imgArrLen1-1].file;
			}
			cards.push(
				<NewsCard 
					key={i*2+1} 
					key1={i*2+1} 
					img={img} 
					title={title}
					description={description}
					date={date}
					section={section}
					buttonName={buttonName}
					source='guardian'
					url={url} 
					reactAppUrl={appPath}
					className='searchResultCard'
				/>
			);
		}
		//Object.assign(this.state, { cards: cards });
		this.setState({
			cards: cards,
			isLoaded: true
		}, () => console.log(this.state.cards));
		return;
	}

	componentDidUpdate(props) {
		if(this.props.match.params.query !== props.match.params.query) {
			console.log(this.props.match.params.query, props.match.params.query);
			this.setState({
				query: this.props.match.params.query,
				isLoaded: false
			}, () => {
				var endpoint = this.state.host + 'searchResults?query=' + this.props.match.params.query;
				var data = {};
				fetch(endpoint)
					.then(res => res.json())
					.then(
						(result) => {
							console.log(result);
							this.setState({
								nytData: result.nytData,
								guardianData: result.guardianData
							}, () => this.renderSearchCards());
						}
					);
				}	
			);
		}
		/*, */
		
		//return this.renderSearchCards();
	}

	componentDidMount() {
		var endpoint = this.state.host + 'searchResults?query=' + this.state.query;
		var data = {};
		fetch(endpoint)
			.then(res => res.json())
			.then(
				(result) => {
					console.log(result);
					this.setState({
						nytData: result.nytData,
						guardianData: result.guardianData
					}, () => this.renderSearchCards());
				}
			);
		return;
	}

	render() {
		const {query, host, cards, isLoaded} = this.state;
		//console.log(query);
		//console.log(host)
		while(!isLoaded) {
			return (
				<div>
				<BounceLoader color='#243058'/>
				<div className='loading'>Loading</div>
				</div>
			);
		}
		return(
			<div className='searchPageResults'>
				<h2>Results</h2>
				<div className='searchResultCards'>
					{cards}
				</div>
			</div>
		);
	}
}

export default SearchPage;