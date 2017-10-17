import React from "react";
import { Route } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import SearchPage from "./SearchPage";
import BookNode from "./BookNode";

const BOOK_CASE = {
    CurrentlyReading: "currentlyReading",
    WantToRead: "wantToRead",
    Read: "read",
    title: {
        currentlyReading: "Currently Reading",
        wantToRead: "Want To Read",
        read: "Read"
    }
};

class MyReads extends React.Component {
    state = {
        books: [],
        shelves: {},
    }

    componentDidMount() {
        this.fetchAllBooks();
    }

    fetchAllBooks = async () => {
        const booksData = await BooksAPI.getAll();
        if(!booksData) return;
        if (booksData.error) {
            console.error(booksData.error);
        } else {
            const result = {};
            for (let book of booksData) {
                result[book.id] = book.shelf;
            }

            this.setState({
                shelves: result,
                books: booksData
            });
        }
    }

    onActionSelected = (book, shelfId) => {
        this.setState(prevState => {
            const { books: prevBooks, shelves } = prevState;
            const newBook = {...book, shelf: shelfId};
            BooksAPI.update(newBook, shelfId);
            let allBooks = prevBooks.filter(prevBook => prevBook.id !== book.id);
            if (book) {
                shelves[book.id] = shelfId;
            }
            if (shelfId !== 'none') {
                allBooks = allBooks.concat([newBook]);
            }
            return {
                books: allBooks,
                shelves
            };
        });
    }

    render() {
        const { shelves } = this.state;
        return (
            <div className="app">
                <Route path="/" exact render={this.renderList} />
                <Route
                    path="/search"
                    render={({ history }) => (
                        <SearchPage
                            shelves={shelves}
                            history={history}
                            onActionSelected={this.onActionSelected}
                        />
                    )}
                />
            </div>
        );
    }

    getBookShelves(shelfToSearch) {
        return this.state.books.filter(
            book => book.shelf === shelfToSearch
        );
    }

    renderBookcase(shelf) {
        const { shelves } = this.state;
        return (
            <div className="bookshelf">
                <h2 className="bookshelf-title">{BOOK_CASE['title'][shelf]}</h2>
                <div className="bookshelf-books">
                    <ol className="books-grid">
                        {this.getBookShelves(shelf).map(book => (
                            <li key={book.id}>
                                <BookNode
                                    data={book}
                                    shelfId={shelves[book.id]}
                                    onActionSelected={this.onActionSelected}
                                />
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        );
    }

    renderList = ({ history }) => {
        return (
            <div className="list-books">
                <div className="list-books-title">
                    <h1>MyReads</h1>
                </div>
                <div className="list-books-content">
                    <div>
                        {this.renderBookcase(BOOK_CASE['CurrentlyReading'])}
                        {this.renderBookcase(BOOK_CASE['WantToRead'])}
                        {this.renderBookcase(BOOK_CASE['Read'])}
                    </div>
                </div>
                <div className="open-search">
                    <a onClick={() => history.push("/search")}>
                        Add a book
                    </a>
                </div>
            </div>
        );
    }
}

export default MyReads