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
		var id = this.state.id;
		console.log(id);
		this.removeCommentBox = commentBox('5675072811433984-proj', {
			createBoxUrl(boxId, pageLocation) {
				console.log(boxId);
				pageLocation.search = id; // removes query string!
        		pageLocation.hash = boxId;
        		return id;
    		},
		});
	}
	render() {
		return(<div className="commentbox" id={this.state.id}/>);
	}
}

export default CommentBox;