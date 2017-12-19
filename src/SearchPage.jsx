import React, { Component } from "react"
import { Link } from "react-router-dom"
import * as BooksAPI from "./BooksAPI"
import BookNode from "./BookNode"

class SearchPage extends Component {
    state = {
        books: null,
        valueToSearch: "",
        queryHasError: false
    }

    queryUpdated = async (valueToSearch) => {
        const books = await BooksAPI.search(valueToSearch);
        if (!books || books.error) {
            if (books && books.error) console.error(books.error);
            this.setState({
                books: null,
                queryHasError: true
            });
        } else {
            this.setState({
                books,
                queryHasError: false
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
        const { books, queryHasError } = this.state
        const { shelves } = this.props
        console.log('books', books);
        console.log('queryHasError', queryHasError);
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
                        {queryHasError && <span>No results were found for your search.</span>}
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