import React from 'react';
import "./WishList.css"
import {
    removeFavorite, addToWish, removeWish, addToRead, removeRead, checkSession,
    getWished, getRead, getFavorites, addToFavorite
} from "../actions/index";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import M from 'materialize-css';

const mapStateToProps = state => {
    return {
        wishes: state.wish,
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
        getRead: user => dispatch(getRead(user)),
        addToFavorites: data => dispatch(addToFavorite(data))
    };
}

class WishList extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            wishes: [],
            currentUser: props.currentUser ? props.currentUser : null,
            loaded: false
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

        if (!props.wishes.length) {
            props.getWished().then((data) => {
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
                    wishes: [...data.data].sort((a, b) => {
                        if (a.title < b.title) return -1;
                        if (a.title > b.title) return 1;
                        return 0;
                    }),
                    loaded: true
                })
            })
        }

    }

    componentDidMount() {
        if (this.props.wishes.length) {
            this.props.wishes.forEach(book => {
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
                wishes: [...this.props.wishes].sort((a, b) => {
                    if (a.title < b.title) return -1;
                    if (a.title > b.title) return 1;
                    return 0;
                }),
                loaded: true
            })
        }
    }

    removeFromFavorites = (bookID) => {
        let data = {
            bookID: bookID
        }
        let self = this;
        this.props.removeFavorite(data).then(data => {
            if (data.data.result && data.data.result === 'success') {
                let dummy = [...self.state.wishes]
                dummy.forEach(book => {
                    if (book._id === bookID) {
                        book.favorite = false
                    }
                })

                self.setState({
                    wishes: [...dummy]
                })
            }
            this.props.getFavorites();
        })
    }

    removeFromWishList = (bookID) => {
        let data = {
            bookID: bookID
        }
        let self = this;
        this.props.removeWish(data).then(data => {
            if (data.data.result && data.data.result === 'success') {
                this.props.getWished(this.state.currentUser.id).then(wished => {
                    wished.data.forEach(book => {
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
                        wishes: [...wished.data]
                    })
                })
            }
        })
    }

    addToFavorites = (bookID) => {
        let data = {
            bookID: bookID
        }
        let self = this;
        this.props.addToFavorites(data).then(data => {
            if (data.data.result && data.data.result === 'success') {
                let dummy = [...self.state.wishes]
                dummy.forEach(book => {
                    if (book._id === bookID) {
                        book.favorite = true
                    }
                })

                self.setState({
                    wishes: [...dummy]
                })
            }
            this.props.getFavorites()
        })
    }

    addToReadList = (bookID) => {
        let data = {
            bookID: bookID
        }
        let self = this;
        this.props.addToRead(data).then(data => {
            if (data.data.result && data.data.result === 'success') {
                let dummy = [...self.state.wishes]
                dummy.forEach(book => {
                    if (book._id === bookID) {
                        book.read = true
                    }
                })

                self.setState({
                    wishes: [...dummy]
                })
            }
            this.props.getRead(this.state.currentUser.id)
        })
    }

    removeFromReadList = (bookID) => {
        let data = {
            bookID: bookID
        }
        let self = this;
        this.props.removeRead(data).then(data => {
            if (data.data.result && data.data.result === 'success') {
                let dummy = [...self.state.wishes]
                dummy.forEach(book => {
                    if (book._id === bookID) {
                        book.read = false
                    }
                })

                self.setState({
                    wishes: [...dummy]
                })
            }
            this.props.getRead(this.state.currentUser.id)
        })
    }

    handleMouseOver = (event) => {
        M.Tooltip.init(event.target).open();
    }

    handleMouseOut = (event) => {
        M.Tooltip.init(event.target).close();
    }

    render() {
        return (
            <div className="wishList">
                <h2> My Wish List</h2>
                <div className=" row">
                    {
                        this.state.wishes.map((book) => {
                            return (
                                <div className="col s12 m6 l4" key={book._id}>
                                    <div className="card horizontal">
                                        <div className="card-image">
                                            <img src={book.image} />
                                        </div>
                                        <span className="card-stacked">
                                            <span className="card-content">

                                                <i className="material-icons addFavorite tooltipped" data-position="left" onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseOut} data-tooltip="Remove from Wish List" onClick={() => this.removeFromWishList(book._id)}>cancel</i>
                                                <Link to={`/book/${book._id}`} className="card-title activator grey-text text-darken-4">{book.title}</Link>
                                                <p>Authors: {book.authors.map((author) => <span key={author}>{author} <br /></span>)}</p>
                                            </span>
                                            <div className="card-action">
                                                {
                                                    book.favorite ?
                                                        <span><a className="tooltipped" data-position="top" onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseOut} onClick={() => this.removeFromFavorites(book._id)} data-tooltip="Remove from Favorites">Favorites</a> <i className="material-icons check">check</i></span>
                                                        :
                                                        <a className="tooltipped" data-position="top" onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseOut} onClick={() => this.addToFavorites(book._id)} data-tooltip="Add to Favorites">Favorites</a>
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
                        this.state.loaded && this.state.wishes.length === 0 &&
                            <div className="noResult">
                                <div className="row">
                                    <i className="large material-icons prefix col s12">mood_bad</i>
                                    <p>Seems empty go to the <Link to="/catalog">Catalog</Link> to find books.</p>
                                </div>
                            </div> 
                            
                    }
                </div>
            </div>

        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WishList)