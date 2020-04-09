import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import {MdBookmarkBorder, MdBookmark} from 'react-icons/md';
import {FaChevronDown, FaChevronUp} from 'react-icons/fa';
import	{
			FacebookIcon, 
			TwitterIcon, 
			EmailIcon, 
			FacebookShareButton, 
			TwitterShareButton, 
			EmailShareButton
		} 
from 'react-share';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BounceLoader from 'react-spinners/BounceLoader';
import CommentBox from './commentbox.js';

var key = 0;

class DetailedPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			articlePath: this.props.match.params.pathId,
			isLoaded: false,
			articleData: {},
			cardLengthClass: 'card-truncated',
			descriptionLengthClass: 'detailed-description-truncated',
			button: <FaChevronDown/>,
			bookmark: <MdBookmarkBorder/>,
			bookmarkStatus: false,
			host: this.props.host
		};
		//this.getArticleData = this.getArticleData.bind(this);
		this.populatePage = this.populatePage.bind(this);
		this.toggleArticleLength = this.toggleArticleLength.bind(this);
		this.toggleBookmark = this.toggleBookmark.bind(this);
		this.updateWhichPage = this.updateWhichPage.bind(this);
	}

	componentDidMount() {
		this.updateWhichPage();
		var endpoint = this.state.host + 'detailedArticleInfo?id=' + this.state.articlePath;
		console.log(endpoint);
		//var data = {};
		fetch(endpoint)
			.then(res => res.json())
			.then(
				(result) => {
					for(let i = 0; i < localStorage.length; i++) {
						if(localStorage.key(i) === this.state.articlePath) {
							console.log(localStorage.key(i));
							this.setState({
								bookmark: <MdBookmark/>,
								bookmarkStatus: true
							});
						}
					}
					console.log(result);
					this.setState({
						isLoaded: true,
						articleData: result
					});
				}
			);
		
	}

	updateWhichPage() {
		this.props.updateWhichPage();
	}

	toggleArticleLength() {
		if(this.state.cardLengthClass === 'card-truncated') {
			this.setState({
				cardLengthClass: 'card-long',
				descriptionLengthClass: 'detailed-description-long',
				button: <FaChevronUp/>
			}, () => console.log('CHANGED TO CARD LONG'));
		}
		else {
			this.setState({
				cardLengthClass: 'card-truncated',
				descriptionLengthClass: 'detailed-description-truncated',
				button: <FaChevronDown/>
			});
		}
	}

	toggleBookmark(data, source) {
		var title = source === 'guardian' ? data.webTitle : data.headline.main;
		if(this.state.bookmarkStatus === false) {
			this.setState({
				bookmark: <MdBookmark/>,
				bookmarkStatus: true
			}, () => toast("Saving " + title));
			localStorage.setItem(this.state.articlePath, JSON.stringify({'data': data, 'source': source}));
		}
		else {
			this.setState({
				bookmark: <MdBookmarkBorder/>,
				bookmarkStatus: false
			}, () => toast("Removing " + title));
			localStorage.removeItem(this.state.articlePath);
		}
	}

	populatePage(articleData, source) {
		//while(this.state.articleData === {}) {
		//}
		var page = [];
		var title = '';
		var date = '';
		var imgArr = [];
		var img = '';
		var description = '';
		var url = ''
		var dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};
		if(source === 'guardian') {
			//console.log('HELLO');
			//console.log(articleData, source);
			title = articleData.webTitle;
			date = new Date(Date.parse(articleData.webPublicationDate));
			imgArr = articleData.blocks.main ? articleData.blocks.main.elements[0].assets : [];
			img = 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png';
			url = articleData.webUrl;
			console.log(url);
			if(imgArr.length > 0) {
				img = imgArr[imgArr.length - 1].file;
			}
			description = articleData.blocks.body[0].bodyHtml;
			page.push(<Card.Title key='1'>{title}</Card.Title>);
			page.push(<Card.Body key='2'>
							<div className='detailedCardHeader'>
								<p>{date.toLocaleDateString("en-US", dateOptions)}</p>
								<div className='socialIcons'>
									<OverlayTrigger
								        key='emailTooltip'
								        placement='top'
								        overlay={
								          <Tooltip id='tooltip-top'>
								            Email
								          </Tooltip>
								        }
								    >
										<EmailShareButton url={url} subject='#CSCI_571_NewsApp'><EmailIcon size={18} round={true}/></EmailShareButton>
									</OverlayTrigger>
									<OverlayTrigger
								        key='twitterTooltip'
								        placement='top'
								        overlay={
								          <Tooltip id='tooltip-top'>
								            Twitter
								          </Tooltip>
								        }
								    >
										<TwitterShareButton url={url} hashtags={['CSCI_571_NewsApp']}><TwitterIcon size={18} round={true}/></TwitterShareButton>
									</OverlayTrigger>
									<OverlayTrigger
								        key='fbTooltip'
								        placement='top'
								        overlay={
								          <Tooltip id='tooltip-top'>
								            Facebook
								          </Tooltip>
								        }
								    >
										<FacebookShareButton url={url} hashtag='#CSCI_571_NewsApp'><FacebookIcon size={18} round={true}/></FacebookShareButton>
									</OverlayTrigger>
								</div>
								<div className='bookmark'>
									<OverlayTrigger
								        key='bookmarkTooltip'
								        placement='top'
								        overlay={
								          <Tooltip id='tooltip-top'>
								            Bookmark
								          </Tooltip>
								        }
								    >
										<button onClick={() => this.toggleBookmark(articleData, source)}>{this.state.bookmark}</button>
									</OverlayTrigger>
									<ToastContainer hideProgressBar={true} autoClose={1500}/>
								</div>
							</div>
							<div className='img-and-details'>
								<div className='card-image'>
									<img src={img} alt=''/>
								</div>
								<div className={this.state.descriptionLengthClass} 
									dangerouslySetInnerHTML={{ __html: description }} />
								<button className='detailedArticleButton' onClick={() => this.toggleArticleLength()}>{this.state.button}</button>
							</div>
						</Card.Body>);
			key++;
			return page;
		}
		else {
			articleData = articleData[0];
			title = articleData.headline.main;
			date = new Date(Date.parse(articleData.pub_date));
			imgArr = articleData.multimedia;
			img = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg';
			for(let i = 0; i < imgArr.length; i++) {
				if(imgArr[i].width >= 2000) {
					img = 'https://nytimes.com/' + imgArr[i].url;
					break;
				}
			}
			description = articleData.abstract;
			url = articleData.web_url;
			page.push(<Card.Title>{title}</Card.Title>);
			//<button className='detailedArticleButton' onClick={() => this.toggleArticleLength()}>{this.state.button}</button>
			page.push(<Card.Body>
							<div className='detailedCardHeader'>
								<p>{date.toLocaleDateString("en-US", dateOptions)}</p>
								<div className='socialIcons'>
									<OverlayTrigger
								        key='emailTooltip'
								        placement='top'
								        overlay={
								          <Tooltip id='tooltip-top'>
								            Email
								          </Tooltip>
								        }
								    >
										<EmailShareButton url={url} subject='#CSCI_571_NewsApp'><EmailIcon size={18} round={true}/></EmailShareButton>
									</OverlayTrigger>
									<OverlayTrigger
								        key='twitterTooltip'
								        placement='top'
								        overlay={
								          <Tooltip id='tooltip-top'>
								            Twitter
								          </Tooltip>
								        }
								    >
										<TwitterShareButton url={url} hashtags={['CSCI_571_NewsApp']}><TwitterIcon size={18} round={true}/></TwitterShareButton>
									</OverlayTrigger>
									<OverlayTrigger
								        key='fbTooltip'
								        placement='top'
								        overlay={
								          <Tooltip id='tooltip-top'>
								            Facebook
								          </Tooltip>
								        }
								    >
										<FacebookShareButton url={url} hashtag='#CSCI_571_NewsApp'><FacebookIcon size={18} round={true}/></FacebookShareButton>
									</OverlayTrigger>
								</div>
								<div className='bookmark'>
									<OverlayTrigger
								        key='bookmarkTooltip'
								        placement='top'
								        overlay={
								          <Tooltip id='tooltip-top'>
								            Bookmark
								          </Tooltip>
								        }
								    >
										<button onClick={() => this.toggleBookmark(articleData, source)}>{this.state.bookmark}</button>
									</OverlayTrigger>
									<ToastContainer hideProgressBar={true} autoClose={1500}/>
								</div>
							</div>
							<div className='img-and-details'>
								<div className='card-image'>
									<img src={img}/>
								</div>
								<div className={this.state.descriptionLengthClass} 
									dangerouslySetInnerHTML={{ __html: description }} />
							</div>
						</Card.Body>);
			console.log(articleData);
			return page;
		}
	}


	render() {
		while(!this.state.isLoaded) {
			return (
				<div>
					<BounceLoader color='#243058'/>
					<div className='loading'>Loading</div>
				</div>
			);
		}
		const {articlePath, cardLengthClass, articleData} = this.state;
		var data = articleData;
		console.log(data);
		var source = data.webUrl ? 'guardian' : 'nyt';
		return(
			<div>
			<div className='detailedPage'>
				<Card key={articlePath} className={cardLengthClass}>
					{this.populatePage(data, source)}
				</Card>
				<CommentBox id={this.state.articlePath}/>
			</div>
			</div>
		);
		
	}
}

export default DetailedPage;