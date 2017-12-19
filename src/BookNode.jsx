import React, { Component } from "react"
//TODO replace fixed width & height
const noCoverUrl = 'http://via.placeholder.com/128x193?text=No%20Cover';

class BookNode extends Component {

    onActionSelected = (event) => {
        const { data } = this.props;
        const { target } = event;
        if (!event) return;
        this.props.onActionSelected(data, target.value);
    }

    render() {
        const { data, shelfId } = this.props
        const thumbnail = data && data.imageLinks ?
            data.imageLinks.thumbnail : noCoverUrl;
        if (!data) return null;
        return (
            <div className="book">
                <div className="book-top">
                    <div className="book-cover" style={{
                            width: 128,
                            height: 193,
                        }}>
                        <img src={thumbnail} alt="Thumbnail"
                            style={{
                                width: 'inherit',
                                height: 'inherit'
                            }}
                        />
                    </div>
                    <div className="book-shelf-changer">
                        <select onChange={this.onActionSelected} value={shelfId}>
                            <option value="none" disabled>
                                Move to...
                            </option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>
                <div className="book-title">{data.title}</div>
                <div className="book-authors">{data.authors && data.authors.join(', ')}</div>
            </div>
        );
    }
}

export default BookNode;