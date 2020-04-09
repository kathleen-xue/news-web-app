import React, {Component} from 'react';
import BounceLoader from 'react-spinners/BounceLoader';
import NewsCard from './newscard.js';

//const host = 'http://localhost:3000';

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			source: this.props.source,
			pageContent: this.props.pageContent,
			whichPage: this.props.whichPage,
			isLoaded: this.props.isLoaded
		};
		this.populatePage = this.populatePage.bind(this);
		this.updatePageContent = this.updatePageContent.bind(this);
		this.show = false;
		this.toggleShow = this.toggleShow.bind(this);
	}

	componentDidMount() {
		this.updatePageContent();
	}

	componentDidUpdate(prevProps) {
		if(this.props.source !== prevProps.source && this.props.pageContent !== prevProps.pageContent) {
			this.setState({
				source: this.props.source,
				pageContent: this.props.pageContent,
				isLoaded: this.props.isLoaded,
				whichPage: this.props.whichPage
			});
		}
		else {
			if(this.props.isLoaded !== prevProps.isLoaded) {
				this.setState({
					isLoaded: false
				}, () => {
					this.setState({
						source: this.props.source,
						pageContent: this.props.pageContent,
						isLoaded: this.props.isLoaded,
						whichPage: this.props.whichPage
					}, () => this.populatePage());
				});
				
			}
			else if(this.props.whichPage !== prevProps.whichPage) {
				this.setState({
					isLoaded: false
				}, () => {
					this.setState({
						source: this.props.source,
						pageContent: this.props.pageContent,
						isLoaded: this.props.isLoaded,
						whichPage: this.props.whichPage
					}, () => this.populatePage());
				});
				
			}
		}
	}

	updatePageContent() {
		this.props.updatePageContent();
	}

	toggleShow() {
		this.setState({
			modalShow: true
		});
	}

	populatePage() {
		let page = [];
		var pageContent = this.props.pageContent;
		console.log(pageContent);
		if(this.props.source === 'nyt') {
			for(let i = 0; i < pageContent.length; i++) {
				//console.log(pageContent[i]);
				var buttonName = 'other-button';
				if(pageContent[i].section === 'world' || pageContent[i].section === 'politics' 
					|| pageContent[i].section === 'business' || pageContent[i].section === 'technology'
					|| pageContent[i].section === 'sports' || pageContent[i].section === 'sport') {
					buttonName = pageContent[i].section + '-button';
				}
				var imgArr = pageContent[i].multimedia;
				var imgURL = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg';
				if(imgArr !== null) {
					for(let j = 0; j < imgArr.length; j++) {
						if(imgArr[j].width >= 2000) {
							imgURL = imgArr[j].url;
							break;
						}
					}
				}
				var reactAppPath = '/' + pageContent[i].uri.substring(14);

				/*page.push(
					<Route path={reactAppPath} exact>
						<NewsCard
							key={i} 
							key1={i} 
							img={imgURL} 
							title={pageContent[i].title}
							description={pageContent[i].abstract}
							date={pageContent[i].published_date.substring(0,10)}
							section={pageContent[i].section}
							buttonName={buttonName}
							source={this.props.source}
							url={pageContent[i].url} 
							reactAppUrl={reactAppPath}
							/>
					</Route>
				);*/
				page.push(
					<NewsCard 
						key={i} 
						key1={i} 
						img={imgURL} 
						title={pageContent[i].title}
						description={pageContent[i].abstract}
						date={pageContent[i].published_date.substring(0,10)}
						section={pageContent[i].section}
						buttonName={buttonName}
						source={this.props.source}
						url={pageContent[i].url} 
						reactAppUrl={reactAppPath}
					/>
				);
			}
		}
		else {
			//console.log(pageContent);
			for(let i = 0; i < pageContent.length; i++) {
				var buttonName1 = 'other-button';
				if(pageContent[i].sectionId === 'world' || pageContent[i].sectionId === 'politics' 
					|| pageContent[i].sectionId === 'business' || pageContent[i].sectionId === 'technology'
					|| pageContent[i].sectionId === 'sports' || pageContent[i].sectionId === 'sport') {
					buttonName1 = pageContent[i].sectionId + '-button';
				}
				var imgArr1 = pageContent[i].blocks.main ? pageContent[i].blocks.main.elements[0].assets : [];
				var imgArrLen1 = imgArr1.length;
				var imgURL1 = 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png';
				if(imgArrLen1 > 0) {
					imgURL1 = imgArr1[imgArrLen1-1].file;
				}
				var reactAppPath = '/' + pageContent[i].pathId;
				/*page.push(
					<Route path={reactAppPath} exact>
						<NewsCard
							key={i}
							key1={i} 
							img={imgURL1} 
							title={pageContent[i].webTitle}
							description={pageContent[i].blocks.body[0].bodyTextSummary}
							date={pageContent[i].webPublicationDate.substring(0,10)}
							section={pageContent[i].sectionId}
							buttonName={buttonName1}
							source={this.props.source}
							url={pageContent[i].webUrl}
							reactAppUrl={reactAppPath}
						/>
					</Route>
				);*/
				page.push(
					<NewsCard
						key={i}
						key1={i} 
						img={imgURL1} 
						title={pageContent[i].webTitle}
						description={pageContent[i].blocks.body[0].bodyTextSummary}
						date={pageContent[i].webPublicationDate.substring(0,10)}
						section={pageContent[i].sectionId}
						buttonName={buttonName1}
						source={this.props.source}
						url={pageContent[i].webUrl}
						reactAppUrl={reactAppPath}
					/>
				);
			}
		}
		return page;
	}

	render() {
		const {pageContent, isLoaded} = this.state;
		while(!this.props.isLoaded || pageContent == null || this.props.isLoaded !== isLoaded) {
			//this.props.updatePageContent();
			return (
				<div>
				<BounceLoader color='#243058'/>
				<div className='loading'>Loading</div>
				</div>
			);
		}
		return(
			<div className='homePage'>
				{this.populatePage()}
			</div>
		);
	}
}

export default HomePage;