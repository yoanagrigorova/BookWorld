import React from 'react';
import "./Read.css"
import { connect } from "react-redux";
import { Link } from "react-router-dom"
import {
    removeFavorite, addToWish, removeWish, addToRead, removeRead, checkSession,
    getWished, getRead, getFavorites, addToFavorite
} from "../actions/index";
import M from 'materialize-css';

const mapStateToProps = state => {
    return {
        read: state.read,
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

class Read extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            read: [],
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

        if (!props.read.length) {
            props.getRead(this.state.currentUser.id).then((data) => {
                data.data.forEach(book => {
                    if (this.state.currentUser.favorites.indexOf(book._id) !== -1) {
                        book.favorite = true
                    }
                })
                this.setState({
                    read: [...data.data]
                })
            })
        }
    }

    componentDidMount() {
        if (this.props.read.length) {
            this.props.read.forEach(book => {
                if (this.state.currentUser.favorites.indexOf(book._id) !== -1) {
                    book.favorite = true
                }else{
                    book.favorite = false
                }
            })
            this.setState({
                read: [...this.props.read]
            })
        }
    }

    handleMouseOver = (event) => {
        M.Tooltip.init(event.target).open();
    }

    handleMouseOut = (event) => {
        M.Tooltip.init(event.target).close();
    }

    removeFromRead = (bookID) => {
        let data = {
            // userID: this.state.currentUser.id,
            bookID: bookID
        }
        let self = this;
        this.props.removeRead(data).then(data => {
            if (data.data.result && data.data.result === 'success') {
                this.props.getRead(this.state.currentUser.id).then(read => {
                    read.data.forEach(book => {
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
                        read: [...read.data]
                    })
                })
            }
            this.props.getFavorites();
            // M.Tooltip.init(this.tooltip).close();
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
                let dummy = [...self.state.read]
                dummy.forEach(book => {
                    if (book._id === bookID) {
                        book.favorite = false
                    }
                })
                self.setState({
                    read: [...dummy]
                })
            }
            this.props.getFavorites()
        })
    }

    addToFavorites = (bookID) => {
        let data = {
            // userID: this.state.currentUser.id,
            bookID: bookID
        }
        let self = this;
        this.props.addToFavorites(data).then(data => {
            if (data.data.result && data.data.result === 'success') {
                let dummy = [...self.state.read]
                dummy.forEach(book => {
                    if (book._id === bookID) {
                        book.favorite = true
                    }
                })

                self.setState({
                    read: [...dummy]
                })
            }
            this.props.getFavorites()
        })
    }

    render() {
        return (
            <div className="read">
                <h2> My Read Books</h2>
                <div className=" row">
                    {
                        this.state.read.map((book) => {
                            return (
                                <div className="col s12 m6 l4" key={book._id}>
                                    <div className="card horizontal">
                                        <div className="card-image">
                                            <img src={book.image} />
                                        </div>
                                        <span className="card-stacked">
                                            <span className="card-content">

                                                <i className="material-icons addFavorite tooltipped" data-position="left" onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseOut} data-tooltip="Remove from Read" onClick={() => this.removeFromRead(book._id)}>cancel</i>
                                                <Link to={`/book/${book._id}`} className="card-title activator grey-text text-darken-4">{book.title}</Link>
                                                <p>Authors: {book.authors.map((author) => <span key={author}>{author} <br /></span>)}</p>
                                            </span>
                                            <div className="card-action">
                                                {
                                                    book.favorite ?
                                                        <a className="tooltipped" data-position="top" onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseOut} onClick={() => this.removeFromFavorites(book._id)} data-tooltip="Remove from Favorites">Remove from Favorites</a>
                                                        :
                                                        <a className="tooltipped" data-position="top" onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseOut} onClick={() => this.addToFavorites(book._id)} data-tooltip="Add to Favorites">Add to Favorites</a>
                                                }
                                            </div>
                                        </span>
                                    </div>
                                </div>
                            )

                        })
                    }

                    {
                        this.state.read.length === 0 ?
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

export default connect(mapStateToProps, mapDispatchToProps)(Read)