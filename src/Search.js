import React, {Component} from 'react'
import Book from './Book'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'

class Search extends Component {
    state = {
        booksFound: false,
        query: '',
        books: []
      }

    updateQuery = (query) => {
    this.setState({ query, booksFound: true })

    if (!query) {
        this.setState({ books: [], booksFound: false })
        return
    }
    BooksAPI.search(query).then(result => {
        if (result && !result.error) {
            const books = result.map(bok => {
                bok.shelf = this.getShelf(bok)
            return bok
            });
            this.setState({ books: books, booksFound: true })
        } else {
            this.setState({ books: [], booksFound: false })
        }
        })
    }
    getShelf = (book) => {
        for (const bok of this.props.Searched) {
            if (bok.id === book.id) return bok.shelf
        }
    
        return 'none'
        }

    
render(){
    const { query, books, booksFound } = this.state

return(
    <div className='search-books'>
    <div className='search-books-bar'>
      <Link className='close-search' to='/'>Close</Link>
      <div className='search-books-input-wrapper'>
        <input
          value={query}
          type='text'
          placeholder='Search by title or author'
          onChange={event => this.updateQuery(event.target.value)} />
      </div>
    </div>
    <div className='search-books-results'>
      {((query && booksFound) || (!query && !booksFound)) ? (
        <ol className='books-grid'>
          {books.map(book => (
            <li key={book.id}>
              <Book
                book={book}
                changeShelf={this.props.onSearch} />
            </li>
          ))}
        </ol>
      ) : (
        <div className='search-book-results-empty'>
          ....Not Found :( 
        </div>
      )}
    </div>
  </div>
)
}
}
export default Search
