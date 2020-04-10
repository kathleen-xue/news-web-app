import React, {Component} from 'react';
import {EmailShareButton, FacebookShareButton, TwitterShareButton, FacebookIcon, EmailIcon, TwitterIcon} from 'react-share';
import Modal from 'react-bootstrap/Modal';

class ShareModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: this.props.modalTitle,
			body: this.props.modalBody,
			url: this.props.url,
			show: this.props.show,
			key: this.props.key1
		};
		//this.modalHide = this.modalHide.bind(this);
	}

	componentDidUpdate(prevProps) {
		if(prevProps.show !== this.props.show) {
			this.setState({
				show: this.props.show
			});
		}
	}

	render() {
		const {title, url, show, key} = this.state;
		return(
			<Modal key={key} show={show} onHide={this.props.onHide} style={{opacity:1}}>
				  <Modal.Header closeButton>
				    <Modal.Title>{title}</Modal.Title>
				  </Modal.Header>

				  <Modal.Body>
				    <p>Share via</p>
				    <ul className='socialIcons'>
					    <li><FacebookShareButton url={url} hashtag='#CSCI_571_NewsApp'><FacebookIcon round={true}/></FacebookShareButton></li>
					    <li><TwitterShareButton url={url} hashtags={['CSCI_571_NewsApp']}><TwitterIcon round={true}/></TwitterShareButton></li>
					    <li><EmailShareButton url={url} subject='#CSCI_571_NewsApp'><EmailIcon round={true}/></EmailShareButton></li>
				    </ul>
				  </Modal.Body>
			</Modal>
		);
	}
}

export default ShareModal;