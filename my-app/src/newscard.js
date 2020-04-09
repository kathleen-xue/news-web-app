import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {MdShare} from 'react-icons/md';
import ShareModal from './sharemodal.js';
import {Link} from 'react-router-dom';
import {IoMdTrash} from "react-icons/io";

class NewsCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			key: this.props.key1,
			img: this.props.img,
			title: this.props.title,
			description: this.props.description,
			date: this.props.date,
			section: this.props.section,
			buttonName: this.props.buttonName,
			source: this.props.source,
			url: this.props.url,
			appPath: this.props.reactAppUrl,
			modalShow: false,
			className: this.props.className ? this.props.className : ''
		};
		this.toggleShow = this.toggleShow.bind(this);
		this.removeBookmark = this.removeBookmark.bind(this);
	}

	toggleShow() {
		var show = this.state.modalShow;
		this.setState({
			modalShow: !show
		});
	}

	removeBookmark(id) {
		this.props.removeBookmarkProps(id);
	}

	render() {
		const {key, img, title, description, date, section, buttonName, url, modalShow, appPath, className, source} = this.state;
		if(className === 'bookmarkCard') {
			return(
				<Card key={key} className={className}>
					<Card.Title>
						<div className='cardTitleText'>
						<Link to={'detailedPage' + appPath}>{title}</Link>
						</div>
						<div className='cardTitleButtons'>
							<a onClick={this.toggleShow}><MdShare/></a>
							<ShareModal key1={key + '-modal'} show={modalShow} onHide={this.toggleShow} url={url} modalTitle={title}/>
							<a className='trashIcon' onClick={() => this.removeBookmark(appPath.substr(1))}><IoMdTrash className='trashIcon'/></a>
						</div>
					</Card.Title>

					<Link to={'detailedPage' + appPath}><Card.Img src={img}/></Link>
					<Card.Body>
						<Link to={'detailedPage' + appPath}>
						<div className='footer'>
						<div className='newsDate'>
								<Link to={'detailedPage' + appPath}>
									{date}
								</Link>
						</div>
						<div className='cardButtons'>
							<Button className={buttonName[0]}>{section[0]}</Button>
							<Button className={buttonName[1]}>{section[1]}</Button>
						</div>
						</div>
						</Link>
					</Card.Body>
				</Card>
			);
		}
		else if(className === 'searchResultCard') {
			return(
				<Card key={key} className={className}>
					<Card.Title>
						<div className='cardTitleText'>
						<Link to={'../detailedPage/' + appPath}>{title}</Link>
						</div>
						<div className='cardTitleButtons'>
							<a onClick={this.toggleShow}><MdShare/></a>
							<ShareModal key1={key + '-modal'} show={modalShow} onHide={this.toggleShow} url={url} modalTitle={title}/>
						</div>
					</Card.Title>

					<Link to={'../detailedPage/' + appPath}><Card.Img src={img}/></Link>
					<Card.Body>
						<Link to={'../detailedPage/' + appPath}>
						<div className='footer'>
						<div className='newsDate'>
								<Link to={'../detailedPage' + appPath}>
									{date}
								</Link>
						</div>
						<div className='cardButtons'>
							<Button className={buttonName}>{section}</Button>
						</div>
						</div>
						</Link>
					</Card.Body>
				</Card>
			);
		}
		else {
			return(
				<Card key={key} className={className}>
					<Link to={'detailedPage' + appPath}><Card.Img src={img}/></Link>
					<Card.Body>
						<Card.Title>
							<Link to={'detailedPage' + appPath}>{title}</Link>
							<a onClick={this.toggleShow}><MdShare/></a>
							<ShareModal key1={key + '-modal'} show={modalShow} onHide={this.toggleShow} url={url} modalTitle={title}/>
						</Card.Title>
						<Card.Body>
							<Link to={'detailedPage' + appPath}>
								<div className='newsDescription'>
									{description}
								</div>
							</Link>
						</Card.Body>
						<Link to={'detailedPage' + appPath}>
						<div className='footer'>
						<div className='newsDate'>
								<Link to={'detailedPage' + appPath}>
									{date}
								</Link>
						</div>
						<Button className={buttonName}>{section}</Button>
						</div>
						</Link>
					</Card.Body>
				</Card>
			);
		}
		
	}
}

export default NewsCard;