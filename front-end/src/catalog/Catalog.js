import React from 'react';
import "./Catalog.css"
import { addToFavorite } from "../actions/index";
import {
    getBooks, removeFavorite, addToWish, removeWish, addToRead, removeRead, getFavorites,
    getRead, getWished, checkSession
} from "../actions/index";
import {
    Link
} from "react-router-dom";
import { connect } from "react-redux";
import M from 'materialize-css';


const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        books: state.books
    };
};

function mapDispatchToProps(dispatch) {
    return {
        addToFavorite: data => dispatch(addToFavorite(data)),
        getBooks: user => dispatch(getBooks(user)),
        removeFavorite: data => dispatch(removeFavorite(data)),
        addToWish: data => dispatch(addToWish(data)),
        removeWish: data => dispatch(removeWish(data)),
        addToRead: data => dispatch(addToRead(data)),
        removeRead: data => dispatch(removeRead(data)),
        getFavorites: data => dispatch(getFavorites(data)),
        getRead: data => dispatch(getRead(data)),
        getWished: data => dispatch(getWished(data)),
        checkSession: () => dispatch(checkSession())
    };
}

class Catalog extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            books: [],
            filtered: [],
            search: "",
            categories: [],
            currentUser: props.currentUser ? props.currentUser : null
        }
        if (!props.currentUser) {
            props.checkSession().then(data => {
                if (data) {
                    this.setState({
                        currentUser: data.data
                    })
                }
            })
        }
        if (!props.books.length) {
            props.getBooks("user").then((data) => {
                let categories = []
                data.data.map(book => [...book.categories]).forEach(category => categories.push(...category));
                categories = [...new Set(categories)].sort();
                let books = [...data.data]
                books.forEach(book => {
                    if (this.state.currentUser.favorites.indexOf(book._id) !== -1) {
                        book.favorite = true
                    }
                    if (this.state.currentUser.wish.indexOf(book._id) !== -1) {
                        book.wish = true
                    }
                    if (this.state.currentUser.read.indexOf(book._id) !== -1) {
                        book.read = true
                    }
                })
                this.setState({
                    books: [...books].sort((a, b) => {
                        if(a.title < b.title) return -1;
                        if(a.title > b.title) return 1;
                        return 0;
                    }),
                    filtered: [...books].sort((a, b) => {
                        if(a.title < b.title) return -1;
                        if(a.title > b.title) return 1;
                        return 0;
                    }),
                    categories: [...categories]
                })
                M.FormSelect.init(this.select);
            })
        }
    }

    componentDidMount() {
        if (this.props.books.length) {
            let categories = []
            this.props.books.map(book => [...book.categories]).forEach(category => categories.push(...category));
            categories = [...new Set(categories)].sort();
            let books = [...this.props.books]
            books.forEach(book => {
                if (this.state.currentUser.favorites.indexOf(book._id) !== -1) {
                    book.favorite = true
                } else {
                    book.favorite = false
                }
                if (this.state.currentUser.wish.indexOf(book._id) !== -1) {
                    book.wish = true
                } else {
                    book.wish = false
                }
                if (this.state.currentUser.read.indexOf(book._id) !== -1) {
                    book.read = true
                } else {
                    book.read = false
                }
            })
            this.setState({
                books: [...books].sort((a, b) => {
                    if(a.title < b.title) return -1;
                    if(a.title > b.title) return 1;
                    return 0;
                }),
                filtered: [...books].sort((a, b) => {
                    if(a.title < b.title) return -1;
                    if(a.title > b.title) return 1;
                    return 0;
                }),
                categories: [...categories],
            })
            setTimeout(() => M.FormSelect.init(this.select), 100)
        }
    }

    handleSearchChange = (event) => {
        this.setState({ [event.target.id]: event.target.value });
        let dummy = [...this.state.books].filter(book =>
            book.title.toLowerCase().split(" ").some(word => word.startsWith(event.target.value.toLowerCase())) ||
            book.title.toLowerCase().startsWith(event.target.value.toLowerCase()));
        this.setState({
            filtered: [...dummy]
        })
    }

    handleSelectChange = (event) => {
        if (event.target.value === 'all') {
            this.setState({
                filtered: [...this.state.books]
            })
        } else {
            let dummy = [...this.state.books].filter(book => book.categories.some(cat => cat.toLowerCase() === event.target.value));
            this.setState({
                filtered: [...dummy]
            })
        }

    }

    addToFavorites = (bookID) => {
        let data = {
            email: this.state.currentUser.email,
            bookID: bookID
        }
        let self = this;
        this.props.addToFavorite(data).then(data => {
            if (data.data.result && data.data.result === 'success') {
                let dummy = [...self.state.books]
                dummy.forEach(book => {
                    if (book._id === bookID) {
                        book.favorite = true
                    }
                })

                let dummy2 = [...self.state.filtered]
                dummy2.forEach(book => {
                    if (book._id === bookID) {
                        book.favorite = true
                    }
                })

                self.setState({
                    books: [...dummy],
                    filtered: [...dummy2]
                })
            }
            this.props.getFavorites(this.state.currentUser.id);
            this.props.checkSession();
        })
    }

    removeFromFavorites = (bookID) => {
        let data = {
            userID: this.state.currentUser.id,
            bookID: bookID
        }
        let self = this;
        this.props.removeFavorite(data).then(data => {
            if (data.data.result && data.data.result === 'success') {
                let user = { ...this.state.currentUser };
                let index = user.favorites.indexOf(bookID);
                user.favorites.splice(index, 1);
                let dummy = [...self.state.books]
                dummy.forEach(book => {
                    if (book._id === bookID) {
                        book.favorite = false
                    }
                })

                let dummy2 = [...self.state.filtered]
                dummy2.forEach(book => {
                    if (book._id === bookID) {
                        book.favorite = false
                    }
                })

                self.setState({
                    books: [...dummy],
                    filtered: [...dummy2]
                })
            }

            this.props.getFavorites(this.state.currentUser.id)
            this.props.checkSession();
        })
    }

    addToWishList = (bookID) => {
        let data = {
            userID: this.state.currentUser.id,
            bookID: bookID
        }
        let self = this;
        this.props.addToWish(data).then(data => {
            console.log(data)
            if (data.data.result && data.data.result === 'success') {
                let dummy = [...self.state.books]
                dummy.forEach(book => {
                    if (book._id === bookID) {
                        book.wish = true
                    }
                })

                let dummy2 = [...self.state.filtered]
                dummy2.forEach(book => {
                    if (book._id === bookID) {
                        book.wish = true
                    }
                })

                self.setState({
                    books: [...dummy],
                    filtered: [...dummy2]
                })
            }
            this.props.getWished(this.state.currentUser.id)
        })
    }

    removeFromWishList = (bookID) => {
        let data = {
            userID: this.state.currentUser.id,
            bookID: bookID
        }
        let self = this;
        this.props.removeWish(data).then(data => {
            if (data.data.result && data.data.result === 'success') {
                let user = { ...this.state.currentUser };
                let index = user.wish.indexOf(bookID);
                user.wish.splice(index, 1);
                let dummy = [...self.state.books]
                dummy.forEach(book => {
                    if (book._id === bookID) {
                        book.wish = false
                    }
                })

                let dummy2 = [...self.state.filtered]
                dummy2.forEach(book => {
                    if (book._id === bookID) {
                        book.wish = false
                    }
                })

                self.setState({
                    books: [...dummy],
                    filtered: [...dummy2]
                })
            }
            this.props.getWished(this.state.currentUser.id)
        })
    }

    addToReadList = (bookID) => {
        let data = {
            userID: this.state.currentUser.id,
            bookID: bookID
        }
        let self = this;
        this.props.addToRead(data).then(data => {
            if (data.data.result && data.data.result === 'success') {
                let dummy = [...self.state.books]
                dummy.forEach(book => {
                    if (book._id === bookID) {
                        book.read = true
                    }
                })

                let dummy2 = [...self.state.filtered]
                dummy2.forEach(book => {
                    if (book._id === bookID) {
                        book.read = true
                    }
                })

                self.setState({
                    books: [...dummy],
                    filtered: [...dummy2]
                })
            }
            this.props.getRead(this.state.currentUser.id)
        })
    }

    removeFromReadList = (bookID) => {
        let data = {
            userID: this.state.currentUser.id,
            bookID: bookID
        }
        let self = this;
        this.props.removeRead(data).then(data => {
            if (data.data.result && data.data.result === 'success') {
                let user = { ...this.state.currentUser };
                let index = user.read.indexOf(bookID);
                user.read.splice(index, 1);
                let dummy = [...self.state.books]
                dummy.forEach(book => {
                    if (book._id === bookID) {
                        book.read = false
                    }
                })

                let dummy2 = [...self.state.filtered]
                dummy2.forEach(book => {
                    if (book._id === bookID) {
                        book.read = false
                    }
                })

                self.setState({
                    books: [...dummy],
                    filtered: [...dummy2]
                })
            }
            this.props.getRead(this.state.currentUser.id)
        })
    }

    handleMouseOver = (event) => {
        M.Tooltip.init(event.target).open();
    }

    render() {
        return (
            <span className="catalog">
                <h2> All Books</h2>
                <div className="row">
                    <div className="input-field col s6 m4 l3">
                        <select ref={(select) => { this.select = select }} onChange={this.handleSelectChange}>
                            <option value="all" defaultValue>All</option>
                            {
                                this.state.categories.map((category, i) => <option value={category.toLowerCase()} key={i}>{category}</option>)
                            }
                        </select>
                        <label>Select Book Category</label>
                    </div>
                    <div className="input-field col col s6 m4 l4 offset-l5 offset-m3">
                        <i className="material-icons prefix">search</i>
                        <input id="search" type="text" className="validate" value={this.state.search}
                            onChange={this.handleSearchChange} />
                        <label htmlFor="search">Search Books</label>
                    </div>
                </div>
                <span className=" row">
                    {
                        this.state.filtered.map((book) => {
                            return (
                                <span className="col s12 m6 l4" key={book._id}>
                                    <span className="card horizontal">
                                        <div className="card-image">
                                            <img src={book.image} />
                                        </div>
                                        <span className="card-stacked">
                                            <span className="card-content">
                                                {this.state.currentUser.role === "user" &&
                                                    (!book.favorite ?
                                                        <i className="material-icons addFavorite tooltipped" onClick={() => this.addToFavorites(book._id)} data-position="left" onMouseOver={this.handleMouseOver} data-tooltip="Add to Favorites">favorite_border</i>
                                                        :
                                                        <i className="material-icons addFavorite tooltipped" data-position="left" onMouseOver={this.handleMouseOver} data-tooltip="Remove from Favorites" onClick={() => this.removeFromFavorites(book._id)}>favorite</i>)
                                                }

                                                <Link to={`/book/${book._id}`} className="card-title activator grey-text text-darken-4">{book.title}</Link>
                                                <p>Authors: {book.authors.map((author) => <span key={author}>{author} <br /></span>)}</p>
                                            </span>
                                            {
                                                this.state.currentUser.role === "user" &&
                                                <div className="card-action">
                                                    {
                                                        book.wish ?
                                                         <span>  <a className="tooltipped" data-position="top" onMouseOver={this.handleMouseOver} onClick={() => this.removeFromWishList(book._id)} data-tooltip="Remove from Wish List">Whish list</a> <i className="material-icons check">check</i> </span>
                                                            :
                                                            <a className="tooltipped" data-position="top" onMouseOver={this.handleMouseOver} onClick={() => this.addToWishList(book._id)} data-tooltip="Add to Wish List">Whish list</a>
                                                    }
                                                    {
                                                        book.read ?
                                                            <span> <a className="tooltipped" data-position="top" onMouseOver={this.handleMouseOver} onClick={() => this.removeFromReadList(book._id)} data-tooltip="Remove from Read">Read</a><i className="material-icons check">check</i></span>
                                                            :
                                                            <a className="tooltipped" data-position="top" onMouseOver={this.handleMouseOver} onClick={() => this.addToReadList(book._id)} data-tooltip="Add to Read">Read</a>
                                                    }
                                                </div>
                                            }
                                        </span>
                                    </span>
                                </span>
                            )

                        })
                    }
                    {
                        this.state.filtered.length === 0 && this.state.books.length ?
                            <div className="noResult">
                                <div className="row">
                                    <i className="large material-icons prefix col s12">mood_bad</i>
                                    <p>Search showed no results.</p>
                                </div>
                            </div> : ""
                    }
                </span>
            </span>

        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Catalog)