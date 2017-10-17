import React, { Component } from "react"
import { Link } from "react-router-dom"
import * as BooksAPI from "./BooksAPI"
import BookNode from "./BookNode"

class SearchPage extends Component {
    state = {
        books: null,
        valueToSearch: ""
    }

    queryUpdated = async (valueToSearch) => {
        const books = await BooksAPI.search(valueToSearch);
        if (!books) return;
        if (books.error) {
            console.error(books.error);
        } else {
            this.setState({
                books
            });
        }
    }

    onValueChange = (event) => {
        const valueToSearch = event.target.value;
        this.setState({ valueToSearch });
        setTimeout(() => {
            this.queryUpdated(valueToSearch);
        }, 200);
    }

    render() {
        const { books } = this.state
        const { shelves } = this.props
        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <a className="close-search"
                        onClick={() => this.props.history.push("/")}>
                        Close
                    </a>
                    <div className="search-books-input-wrapper">
                        <input
                          type="text"
                          placeholder="Search by title or author"
                          value={this.state.query}
                          onChange={this.onValueChange}
                        />
                    </div>
                </div>
                <div className="search-books-results">
                    <div>
                        <Link to="/">Back to main page</Link>
                    </div>
                    <ol className="books-grid">
                        {books && books.length &&
                            books.map(book => (
                                <BookNode
                                    key={book.id}
                                    data={book}
                                    shelfId={shelves[book.id] || 'none'}
                                    onActionSelected={this.props.onActionSelected}
                                />
                            )
                        )}
                    </ol>
                </div>
            </div>
        )
    }
}

export default SearchPage;