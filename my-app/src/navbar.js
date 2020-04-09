import React, {Component} from 'react';
import {Nav, Navbar, Form, FormControl} from "react-bootstrap";
import {Link} from 'react-router-dom';
import {MdShare, MdBookmarkBorder, MdBookmark} from 'react-icons/md';
import Select from 'react-select';
import AsyncSelect, {makeAsyncSelect} from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';
import _ from 'lodash';
import {
  withRouter
} from 'react-router-dom';
//AUTOSUGGEST KEY: 295892d4ab4649d5b99cf93f690c076b

function debounce(func, wait, immediate) {
  var timeout;
  return function executedFunction() {
    var context = this;
    var args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
	
    timeout = setTimeout(later, wait);
	
    if (callNow) func.apply(context, args);
  };
};

const searchApiKey = '295892d4ab4649d5b99cf93f690c076b';
class NavbarIdx extends Component {
	constructor(props) {
		super(props);
		this.state = {
			source: this.props.source,
			selectedPage: this.props.whichPage,
			checked: this.props.source === 'guardian',
			bookmark: <MdBookmarkBorder/>,
			bookmarkChecked: false,
			searchValue: '',
			searchDropdown: []
		};
		this.updateNewsSource = this.updateNewsSource.bind(this);
		this.updateWhichPage = this.updateWhichPage.bind(this);
		this.styleLink = this.styleLink.bind(this);
		this.toggleBookmark = this.toggleBookmark.bind(this);
		this.autosuggest = this.autosuggest.bind(this);
		this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
		this.handleSubmitSearchClick = this.handleSubmitSearchClick.bind(this);
		this.renderSearchPage = this.renderSearchPage.bind(this);
		this.autosuggestArray = this.autosuggestArray.bind(this);
		this.timeout = this.timeout.bind(this);
		this.renderBookmarkPage = this.renderBookmarkPage.bind(this);
		this.renderToggleNewsSources = this.renderToggleNewsSources.bind(this);
	}

	componentDidUpdate(prevProps) {
		if(prevProps.source !== this.props.source) {
			this.setState({
				source: this.props.source,
				selectedPage: this.props.whichPage
			});
		}
		if(prevProps.whichPage !== this.props.whichPage) {
			this.setState({
				selectedPage: this.props.whichPage
			});
		}
	}

	toggleBookmark() {
		if(this.state.bookmarkChecked === false) {
			this.setState({
				bookmark: <MdBookmark/>,
				bookmarkChecked: true
			});
			this.renderBookmarkPage();
		}
		else {
			this.setState({
				bookmark: <MdBookmarkBorder/>,
				bookmarkChecked: false
			});
		}
	}

	autosuggestArray(json, input) {
		var arr = [];
		arr.push({value: input, label: input});
		for(let i = 0; i < json.suggestionGroups[0].searchSuggestions.length; i++) {
			arr.push({value: json.suggestionGroups[0].searchSuggestions[i].query, label: json.suggestionGroups[0].searchSuggestions[i].displayText});
		}
		return arr;
	}

	timeout(ms) {
	    return new Promise(resolve => setTimeout(resolve, ms));
	}

	async autosuggest(e) {
		console.log('autosuggest', e);
		await this.timeout(1000);
		const response = 
		await fetch("https://api.cognitive.microsoft.com/bing/v7.0/suggestions?q=" + e, 
		{
			headers: {'Ocp-Apim-Subscription-Key': searchApiKey}
		});
		const json = await response.json();
		const arr = await this.autosuggestArray(json, e);
		return arr;
		/*.then(r => r.json())
		.then((json) => {
			var searchQArray = json.suggestionGroups[0].searchSuggestions;
			console.log(searchQArray);
			var arr = [];
			for(let i = 0; i < searchQArray.length; i++) {
				arr.push({value: searchQArray[i].query, label: searchQArray[i].displayText});
			}
			return arr;
			/*this.setState({ 
				searchValue: e,
				searchDropdown: arr 
			});
		});*/
	}

	updateNewsSource(source) {
		this.setState({
			checked: source !== 'guardian'
		});
		this.props.updateNewsSource(source);
	}

	handleSubmitSearch(e) {
		if(e.keyCode == 13) {
			console.log(e.target.value);
			console.log('form submitted!!!', this.state.searchValue);
			//this.props.history.push('/search');
			this.renderSearchPage(e.target.value);
		}
	}

	handleSubmitSearchClick(value) {
		var e = window.event;
		console.log('form submitted!!!!', value.value);
		this.renderSearchPage(value.value);
		//e.preventDefault();
	}

	renderBookmarkPage() {
		this.props.renderBookmarkPage();
	}

	renderSearchPage(value) {
		this.props.history.push('/search/' + value);
		//this.props.renderSearchPage(value);
	}

	updateWhichPage(e, pg) {
		console.log(pg);
		this.props.updateWhichPage(pg);
	}

	styleLink(className) {
		if(className.includes(this.props.whichPage)) {
			return "selectedNav";
		}
		else {
			return "unselectedNav";
		}
	}

	renderToggleNewsSources() {
		var pages = new Set(['home/', 'world/', 'politics/', 'business/', 'technology/', 'sports/']);
		if(pages.has(this.state.selectedPage)) {
			return(
				<div>
				<div className='toggleNewsContainer'>
				    <p className='newsSourceLabel'>NYTimes</p>
			    </div>
				    <label className='toggleSwitch'>
				    	<input type='checkbox' onClick={() => this.updateNewsSource(this.state.source)} value={this.state.source} checked={this.state.checked}/>
				    	<span className='toggleSlider'/>
				    </label>
			    <div className='toggleNewsContainer'>
				    <p className='newsSourceLabel'>Guardian</p>
			    </div>
			    </div>
		    );
		}
		else {
			return;
		}
	}

	render() {

		const {source, searchDropdown, searchValue} = this.state;
		//var updateNewsSource = this.props.updateNewsSource(source);
		//<FormControl type="text" placeholder="Search" className="mr-sm-2" value={this.state.searchValue} onChange={this.autosuggest} />
		/*
		<CreatableSelect 
			    		onInputChange={this.autosuggest}
			    		options={this.searchDropdown}
			    		autosize={false}
			    		height='20px'
			    		placeholder='Enter keyword...'
			    		defaultValue={searchValue}
			    		className='navbarSearch'
			    		classNamePrefix='navbarSearch'
			    		isSearchable={true}
			    		onChange={this.handleSubmitSearchClick}
			    		onKeyDown={(e) => this.handleSubmitSearch(e)}
		    		/>
		*/
		return(
			  <Navbar className='nav-bg-gradient' bg="dark" variant="dark" fixed="top">
			    <Form inline onSubmit={this.handleSubmitSearch}>
			    	<AsyncSelect
			        	cacheOptions
			        	defaultOptions
			        	loadOptions={_.debounce(this.autosuggest, 1000, {leading: true})}
			        	placeholder='Enter keyword...'
			        	classNamePrefix='navbarSearch'
			        	className='navbarSearch'
			        	isSearchable={true}
			        	onChange={(e) => this.handleSubmitSearchClick(e)}
			        	onKeyDown={(e) => this.handleSubmitSearch(e)}
			      	/>
			    </Form>
			    <Nav className="mr-auto">
			      <Nav.Link onClick={(e) => this.updateWhichPage(e, 'home/')} className={this.styleLink('home/')}><Link to='/home'>Home</Link></Nav.Link>
			      <Nav.Link onClick={(e) => this.updateWhichPage(e, 'world/')} className={this.styleLink('world/')}><Link to='/world'>World</Link></Nav.Link>
			      <Nav.Link onClick={(e) => this.updateWhichPage(e, 'politics/')} className={this.styleLink('politics/')}><Link to='/politics'>Politics</Link></Nav.Link>
			      <Nav.Link onClick={(e) => this.updateWhichPage(e, 'business/')} className={this.styleLink('business/')}><Link to='/business'>Business</Link></Nav.Link>
			      <Nav.Link onClick={(e) => this.updateWhichPage(e, 'technology/')} className={this.styleLink('technology/')}><Link to='/technology'>Technology</Link></Nav.Link>
			      <Nav.Link onClick={(e) => this.updateWhichPage(e, 'sports/')} className={this.styleLink('sports/')}><Link to='/sports'>Sports</Link></Nav.Link>
			    </Nav>
			    <div className='navbarBookmark'><a href='/bookmarks'><button onClick={() => this.toggleBookmark()}>{this.state.bookmark}</button></a></div>
			    {this.renderToggleNewsSources()}
			  </Navbar>
		);
	}
}

export default withRouter(NavbarIdx);