//import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import Bookshelf from './Bookshelf'
import Search from './Search'



class BooksApp extends Component {
  state = {
    books: []
  }
  componentDidMount() {
    BooksAPI.getAll().then(books => {this.setState({ books })})
  }

  changeShelf = (book, shelf) => {
    BooksAPI.update(book, shelf).then(() => {
      const books = this.state.books.map(bok => {
        if (bok.id === book.id) {
          bok.shelf = shelf 
        }
        return bok
      })
      if (books.filter(bok => bok.id === book.id).length === 0) {
        book.shelf = shelf
        books.push(book)
      }

      this.setState({ books })
    });
  }
  renderBooksList = () => {
    const SHELVES = [
      ['Currently Reading', 'currentlyReading'],
      ['Want to Read', 'wantToRead'],
      ['Read', 'read']
    ] 
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        { SHELVES.map((shelf, index) => (
          <Bookshelf
            key={index}
            changeShelf={this.changeShelf}
            shelfName={shelf[0]}
            books={this.state.books.filter(bok => bok.shelf === shelf[1])} />
        ))}
        <div className="open-search">
          <Link to='/search'><button className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</button></Link>
        </div>
      </div>
    );
}
render() {
  return (
    <div>
      <Route exact path='/' render={this.renderBooksList}/>
      <Route path='/search' render={({ history }) => (
        <Search
          Searched={this.state.books}
          onASearch={(book, shelf) => {
            this.changeShelf(book, shelf)
            history.push('/')
          }}
        />
      )}/>
    </div>
  )
}
}

export default BooksApp
