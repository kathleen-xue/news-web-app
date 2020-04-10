import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import NewsCard from './newscard.js';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BounceLoader from 'react-spinners/BounceLoader';
var nytSections = new Set(['world', 'politics', 'business', 'technology', 'sports']);
var guardianSections = new Set(['world', 'politics', 'business', 'technology', 'sport']);

class BookmarkPage extends Component {
	constructor(props) {
		super(props);
		var ls = [];
		for(let i = 0; i < localStorage.length; i++) {
			ls.push(localStorage.key(i));
		}
		this.state = {
			localStorage: ls,
			cards: [],
			cardIds: [],
			isLoaded: false
		};
		this.renderBookmarkCards = this.renderBookmarkCards.bind(this);
		this.updateLocalStorage = this.updateLocalStorage.bind(this);
		this.updateWhichPage = this.updateWhichPage.bind(this);
	}

	updateWhichPage() {
		this.props.updateWhichPage('bookmark');
	}

	updateLocalStorage(id) {
		console.log('updating local storage...');
		var ls = [];
		var title = '';
		var data = JSON.parse(localStorage.getItem(id));
		if(data.source === 'nyt') {
			console.log(data);
			title = data.data.headline.main;
		}
		else {
			title = data.data.webTitle;
		}
		localStorage.removeItem(id);
		var cards = this.state.cards;
		var cardIds = this.state.cardIds;
		for(let i = 0; i < this.state.cardIds.length; i++) {
			if(this.state.cardIds[i] === id) {
				cards.splice(i,1);
				cardIds.splice(i,1);
			}
		}
		//console.log('REMOVING ID', id);
		for(let i = 0; i < localStorage.length; i++) {
			ls.push(localStorage.key(i));
			//console.log(localStorage.key(i));
		}
		//await this.renderBookmarkCards();
		
		this.setState({
			localStorage: ls,
			cards: cards,
			cardIds: cardIds
		}, () => {
			toast("Removing " + title);
		});
		/*this.setState({
			localStorage: ls
		}, () => {
			this.renderBookmarkCards(); 
		});*/
		return;
	}

	renderBookmarkCards() {
		var cards = [];
		var cardIds = [];
		var ls = this.state.localStorage;
		for(let i = 0; i < localStorage.length; i++) {
			console.log('render bookmark cards', localStorage.key(i));
			var data = JSON.parse(localStorage.getItem(localStorage.key(i)));
			var source = data.source;
			data = data.data;
			var img = '';
			var url = '';
			var title = '';
			var appPath = '/' + localStorage.key(i);
			var description = '';
			var date = '';
			var section = '';
			var buttonName = [];
			console.log('BOOKMARKED', data);
			if(source === 'nyt') {
				var imgArr = data.multimedia;
				img = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg';
				if(imgArr !== null) {
					for(let j = 0; j < imgArr.length; j++) {
						if(imgArr[j].width >= 2000) {
							img = 'http://nytimes.com/' + imgArr[j].url;
							break;
						}
					}
				}
				console.log(data);
				title = data.headline.main;
				section = ['NYTimes', data.section_name];
				date = data.pub_date.substring(0,10);
				url = data.web_url;
				//console.log(url);
				description = data.abstract;
				buttonName.push('nyt-button');
				if(nytSections.has(section[1].toLowerCase())) {
					buttonName.push(section + '-button');
				}
				else {
					buttonName.push('other-button')
				}
				cardIds.push(appPath.substr(1));
				
				cards.push(
					<NewsCard 
						key={i} 
						key1={i} 
						img={img} 
						title={title}
						description={description}
						date={date}
						section={section}
						buttonName={buttonName}
						source='nyt'
						url={url} 
						reactAppUrl={appPath}
						className='bookmarkCard'
						removeBookmarkProps={this.updateLocalStorage}
					/>
				);
			}
			else {
				var imgArr1 = data.blocks.main ? data.blocks.main.elements[0].assets : [];
				var imgArrLen1 = imgArr1.length;
				img = 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png';
				if(imgArrLen1 > 0) {
					img = imgArr1[imgArrLen1-1].file;
				}
				section = data.sectionId;
				description = data.blocks.body[0].bodyTextSummary;
				date = data.webPublicationDate.substring(0,10);
				title = data.webTitle;
				source = 'guardian';
				url = data.webUrl;
				buttonName.push('guardian-button');
				if(guardianSections.has(section.toLowerCase())) {
					buttonName.push(section + '-button');
				}
				else {
					buttonName.push('other-button')
				}
				cardIds.push(appPath.substr(1));
				cards.push(
					<NewsCard 
						key={i} 
						key1={i} 
						img={img} 
						title={title}
						description={description}
						date={date}
						section={['Guardian', section]}
						source='guardian'
						url={url} 
						buttonName={buttonName}
						reactAppUrl={appPath}
						className='bookmarkCard'
						removeBookmarkProps={this.updateLocalStorage}
					/>
				);
			}
		}
		this.setState({
			cards: cards,
			cardIds: cardIds,
			isLoaded: false
		}, () => {this.setState({isLoaded: true});});
		return;
	}

	componentDidMount() {
		this.updateWhichPage();
		return this.renderBookmarkCards();
	}

	render() {
		const {cards, isLoaded} = this.state;
		while(!isLoaded) {
			return (
				<div>
					<BounceLoader color='#243058'/>
					<div className='loading'>Loading</div>
				</div>
			);
		}
		return(
			<div className='bookmarkPageHeader'>
				<h2>Favorites</h2>
				<ToastContainer hideProgressBar={true} autoClose={1500}/>
				<div className='bookmarkCards'>{cards}</div>
			</div>
		);
	}
}

export default BookmarkPage;