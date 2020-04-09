import React, {Component} from 'react';
import commentBox from 'commentbox.io';

class CommentBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.id
		};
	}
	componentWillUnmount() {
		this.removeCommentBox();
	}
	componentDidMount() {
		this.removeCommentBox = commentBox('5675072811433984-proj', {
			className: 'commentbox',
			defaultBoxId: this.state.id,
			tlcParam: 'tlc'
		});
	}
	render() {
		return(<div className="commentbox"/>);
	}
}

export default CommentBox;