import React from 'react';
import "./Favorites.css"
import { getFavorites } from "../actions/index";
import { connect } from "react-redux";
import M from 'materialize-css';
import { Link } from "react-router-dom"
import { removeFavorite, addToWish, removeWish, addToRead, removeRead, checkSession,
getWished, getRead } from "../actions/index";


const mapStateToProps = state => {
    return {
        favorites: state.favorites,
        currentUser: state.currentUser
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getFavorites: user => dispatch(getFavorites(user)),
        removeFavorite: data => dispatch(removeFavorite(data)),
        addToWish: data => dispatch(addToWish(data)),
        removeWish: data => dispatch(removeWish(data)),
        addToRead: data => dispatch(addToRead(data)),
        removeRead: data => dispatch(removeRead(data)),
        checkSession: () => dispatch(checkSession()),
        getWished: user => dispatch(getWished(user)),
        getRead: user => dispatch(getRead(user))
    };
}

class Favorites extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            favorites: [],
            currentUser: props.currentUser ? props.currentUser : null,
            loaded:false
        }

        if (!props.currentUser) {
            props.checkSession().then(data => {
                if (data.data) {
                    this.setState({
                        currentUser: data.data
                    })
                }
            })
        }

        if (!props.favorites.length) {
            props.getFavorites().then((data) => {
                data.data.forEach(book => {
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
                    favorites: [...data.data].sort((a, b) => {
                        if(a.title < b.title) return -1;
                        if(a.title > b.title) return 1;
                        return 0;
                    }),
                    loaded:true
                })
            })
        }

    }

    componentDidMount() {
        if (this.props.favorites.length) {
            this.props.favorites.forEach(book => {
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
                favorites: [...this.props.favorites].sort((a, b) => {
                    if(a.title < b.title) return -1;
                    if(a.title > b.title) return 1;
                    return 0;
                }),
                loaded:true
            })
        }
        // M.FormSelect.init(this.dropdown);
    }

    handleMouseOver = (event) => {
        M.Tooltip.init(event.target).open();
    }

    handleMouseOut = (event) => {
        M.Tooltip.init(event.target).close();
    }

    removeFromFavorites = (bookID) => {
        let data = {
            userID: this.state.currentUser.id,
            bookID: bookID
        }
        let self = this;
        this.props.removeFavorite(data).then(data => {
            if (data.data.result && data.data.result === 'success') {
                this.props.getFavorites(this.state.currentUser.id).then(favorites => {
                    favorites.data.forEach(book => {
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
                    self.setState({
                        favorites: [...favorites.data]
                    })
                })
            }
            this.props.getFavorites();
            // M.Tooltip.init(this.tooltip).close();
        })
    }

    addToWishList = (bookID) => {
        // console.log(bookID);
        let data = {
            // userID: this.state.currentUser.id,
            bookID: bookID
        }
        let self = this;
        this.props.addToWish(data).then(data => {
            if (data.data.result && data.data.result === 'success') {
                let dummy = [...self.state.favorites]
                dummy.forEach(book => {
                    if (book._id === bookID) {
                        book.wish = true
                    }
                })

                self.setState({
                    favorites: [...dummy]
                })
            }
            this.props.getWished(this.state.currentUser.id)
        })
    }

    removeFromWishList = (bookID) => {
        let data = {
            // userID: this.state.currentUser.id,
            bookID: bookID
        }
        let self = this;
        this.props.removeWish(data).then(data => {
            if (data.data.result && data.data.result === 'success') {
                let dummy = [...self.state.favorites]
                dummy.forEach(book => {
                    if (book._id === bookID) {
                        book.wish = false
                    }
                })

                self.setState({
                    favorites: [...dummy]
                })
            }
            this.props.getWished(this.state.currentUser.id)
        })
    }

    addToReadList = (bookID) => {
        let data = {
            // userID: this.state.currentUser.id,
            bookID: bookID
        }
        let self = this;
        this.props.addToRead(data).then(data => {
            if (data.data.result && data.data.result === 'success') {
                let dummy = [...self.state.favorites]
                dummy.forEach(book => {
                    if (book._id === bookID) {
                        book.read = true
                    }
                })

                self.setState({
                    favorites: [...dummy]
                })
            }
            this.props.getRead(this.state.currentUser.id)
        })
    }

    removeFromReadList = (bookID) => {
        let data = {
            // userID: this.state.currentUser.id,
            bookID: bookID
        }
        let self = this;
        this.props.removeRead(data).then(data => {
            if (data.data.result && data.data.result === 'success') {
                let dummy = [...self.state.favorites]
                dummy.forEach(book => {
                    if (book._id === bookID) {
                        book.read = false
                    }
                })

                self.setState({
                    favorites: [...dummy]
                })
            }
            this.props.getRead(this.state.currentUser.id)
        })
    }

    render() {
        return (
            <div className="favorites">
                <h2> My Favorite Books</h2>
                <div className=" row">
                    {
                        this.state.favorites.map((book) => {
                            return (
                                <div className="col s12 m6 l4" key={book._id}>
                                    <div className="card horizontal">
                                        <div className="card-image">
                                            <img src={book.image} />
                                        </div>
                                        <span className="card-stacked">
                                            <span className="card-content">
                                                {!book.favorite ?
                                                    <i className="material-icons addFavorite tooltipped" ref = {(tooltip) => { this.tooltip = tooltip }} onClick={() => this.addToFavorites(book._id)} data-position="left" onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseOut} data-tooltip="Add to Favorites">favorite_border</i>
                                                    :
                                                    <i className="material-icons addFavorite tooltipped" data-position="left" onMouseOver={this.handleMouseOver} data-tooltip="Remove from Favorites" onClick={() => this.removeFromFavorites(book._id)}>favorite</i>
                                                }
                                                <Link to={`/book/${book._id}`} className="card-title activator grey-text text-darken-4">{book.title}</Link>
                                                <p>Authors: {book.authors.map((author) => <span key={author}>{author} <br /></span>)}</p>
                                            </span>
                                            <div className="card-action">
                                                {
                                                    book.wish ?
                                                        <span><a className="tooltipped" data-position="top" onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseOut} onClick={() => this.removeFromWishList(book._id)} data-tooltip="Remove from Wish List">Whish list</a> <i className="material-icons check">check</i></span>
                                                        :
                                                        <a className="tooltipped" data-position="top" onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseOut} onClick={() => this.addToWishList(book._id)} data-tooltip="Add to Wish List">Whish list</a>
                                                }
                                                {
                                                    book.read ?
                                                        <span><a className="tooltipped" data-position="top" onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseOut} onClick={() => this.removeFromReadList(book._id)} data-tooltip="Remove from Read">Read</a> <i className="material-icons check">check</i></span>
                                                        :
                                                        <a className="tooltipped" data-position="top" onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseOut} onClick={() => this.addToReadList(book._id)} data-tooltip="Add to Read">Read</a>
                                                }
                                            </div>
                                        </span>
                                    </div>
                                </div>
                            )

                        })
                    }
                    {
                        this.state.loaded && this.state.favorites.length === 0 ?
                            <div className="noResult">
                                <div className="row">
                                    <i className="large material-icons prefix col s12">mood_bad</i>
                                    <p>Seems empty go to the <Link to="/catalog">Catalog</Link> to find books.</p>
                                </div>
                            </div> : ""
                    }
                </div>
            </div>

        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites)