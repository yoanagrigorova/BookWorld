import React from 'react';
import "./Book.css"
import { getBook, addComment, rateBook, checkSession, changeRating, getUsers, sendNotification, deleteComment,
addToFavorite, addToRead, addToWish, getFavorites, getRead, getWished,
removeFavorite, removeRead, removeWish } from "../actions/index";
import { connect } from "react-redux";
import HoverRating from "./HoverRating"
import M from 'materialize-css';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:2324";


const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        users: state.users
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getBook: id => dispatch(getBook(id)),
        addComment: data => dispatch(addComment(data)),
        rateBook: data => dispatch(rateBook(data)),
        checkSession: () => dispatch(checkSession()),
        changeRating: (data) => dispatch(changeRating(data)),
        getUsers: () => dispatch(getUsers()),
        sendNotification: (data) => dispatch(sendNotification(data)),
        deleteComment: (id) => dispatch(deleteComment(id)),
        addToFavorite: (id) => dispatch(addToFavorite(id)),
        getFavorites: () => dispatch(getFavorites()),
        removeFavorite: (id) => dispatch(removeFavorite(id)),
        addToRead: (id) => dispatch(addToRead(id)),
        getRead: () => dispatch(getRead()),
        removeRead: (id) => dispatch(removeRead(id)),
        addToWish: (id) => dispatch(addToWish(id)),
        getWished: () => dispatch(getWished()),
        removeWish: (id) => dispatch(removeWish(id))
    };
}

class Book extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            book: null,
            comments: [],
            commentText: "",
            currentUser: props.currentUser ? props.currentUser : null,
            rating: 0,
            userHasRated: false,
            search: "",
            users: [],
            usersFilter: []
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

        props.getBook(props.match.params.id).then((data) => {
            let book = data.data.book[0];
            // let hasRated = book.ratings.some(r => r.user.id === this.state.currentUser.id)
            if(this.state.currentUser.favorites.find(id => id === book._id)){
                book.favorite = true
            }
            if(this.state.currentUser.wish.find(id => id === book._id)){
                book.wish = true
            }
            if(this.state.currentUser.read.find(id => id === book._id)){
                book.read = true
            }
            this.setState({
                book: book,
                comments: data.data.comments,
                rating: book.rating,
                userHasRated: book.ratings.some(r => r.user.id === this.state.currentUser.id)
            })
            M.Dropdown.init(this.dropdown, {constrainWidth: false})
        })

        const socket = socketIOClient(ENDPOINT);
        socket.on("newComment", data => {
            if (data.book === this.state.book._id) {
                M.toast({ html: `There is a new comment!` })
                this.setState({
                    comments: [...this.state.comments, data]
                })
            }
        });

        socket.on("deletedComment", data => {
            if (this.state.comments.find(c => c._id === data._id)) {
                let dummy = [...this.state.comments].filter(c => c._id !== data._id)
                this.setState({
                    comments: [...dummy]
                })
            }
        });
    }

    componentDidMount() {
        this.props.getUsers().then(data => {
            this.setState({
                users: data.data.filter(u => u.id !== this.state.currentUser.id && u.role !== "admin"),
                usersFilter: data.data.filter(u => u.id !== this.state.currentUser.id && u.role !== "admin")
            })
        })
    }

    zoom = (event) => {
        M.Materialbox.init(event.target).open();
        event.target.width = 250;
    }

    handleChange = (event) => {
        this.setState({ [event.target.id]: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.commentText.length) {
            let data = {
                username: this.state.currentUser.username,
                book: this.state.book._id,
                text: this.state.commentText
            }

            this.props.addComment(data).then(comment => {
                let comments = [...this.state.comments, comment.data]
                this.setState({
                    comments: comments,
                    commentText: ""
                })
            })
        }

    }

    getRatingValue = (value, callback) => {
        let data = {
            bookID: this.state.book._id,
            stars: value
        }
        this.props.rateBook(data).then(book => {
            let ratings = book.data.ratings;
            let five = ratings.filter(r => r.stars === 5).length;
            let four = ratings.filter(r => r.stars === 4).length;
            let three = ratings.filter(r => r.stars === 3).length;
            let two = ratings.filter(r => r.stars === 2).length;
            let one = ratings.filter(r => r.stars === 1).length;

            let rating = (5 * five + 4 * four + 3 * three + 2 * two + 1 * one) / (five + four + three + two + one)
            this.setState({
                book: book.data,
                rating: rating.toPrecision(2),
                userHasRated: true
            })
            let data = {
                bookID: this.state.book._id,
                rating: rating.toPrecision(2)
            }
            this.props.changeRating(data)
            return callback(rating.toPrecision(2));
        })
    }

    handleMouseOver = (event) => {
        M.Tooltip.init(event.target).open();
    }

    handleSearchChange = (event) => {
        this.setState({ [event.target.id]: event.target.value });
        let dummy = [...this.state.users].filter(user =>
            user.username.toLowerCase().split(" ").some(word => word.startsWith(event.target.value.toLowerCase())) ||
            user.email.toLowerCase().startsWith(event.target.value.toLowerCase()));
        this.setState({
            usersFilter: [...dummy]
        })
    }

    sendRecommendation = (user) => {
        let data = {
            userID: user.id,
            book: this.state.book
        }
        this.props.sendNotification(data);
        M.Modal.init(this.recommendModal).close()
        M.toast({ html: `Recommendation sent to ${user.username}` })
    }

    componentDidUpdate() {
        if (this.state.book && this.state.book._id !== window.location.pathname.split('/')[2]) {
            this.props.getBook(window.location.pathname.split('/')[2]).then((data) => {
                let book = data.data.book[0];
                this.setState({
                    book: book,
                    comments: data.data.comments,
                    rating: book.rating,
                    userHasRated: book.ratings.some(r => r.user.id === this.state.currentUser.id)
                })
            })
        }
    }

    handleMouseOver = (event) => {
        M.Tooltip.init(event.target).open();
    }

    deleteComment = (id) => {
        this.props.deleteComment(id).then(data => {
            let dummy = [...this.state.comments].filter(c => c._id !== id);
            this.setState({
                comments: [...dummy]
            })
        })
    }

    addToFavorites = () => {
        let data = {
            bookID: this.state.book._id
        }
        this.props.addToFavorite(data).then(data => {
            let book = this.state.book;
            book.favorite = true;
            this.setState({
                book: book
            })
            this.props.getFavorites()
        })
    }

    removeFromFavorites = () => {
        let data = {
            bookID: this.state.book._id
        }
        this.props.removeFavorite(data).then(data => {
            let book = this.state.book;
            book.favorite = false;
            this.setState({
                book: book
            })
            this.props.getFavorites()
        })
    }

    addToRead = () => {
        let data = {
            bookID: this.state.book._id
        }
        this.props.addToRead(data).then(data => {
            let book = this.state.book;
            book.read = true;
            this.setState({
                book: book
            })
            this.props.getRead()
        })
    }

    removeFromRead = () => {
        let data = {
            bookID: this.state.book._id
        }
        this.props.removeRead(data).then(data => {
            let book = this.state.book;
            book.read = false;
            this.setState({
                book: book
            })
            this.props.getRead()
        })
    }

    addToWish = () => {
        let data = {
            bookID: this.state.book._id
        }
        this.props.addToWish(data).then(data => {
            let book = this.state.book;
            book.wish = true;
            this.setState({
                book: book
            })
            this.props.getWished()
        })
    }

    removeFromWish = () => {
        let data = {
            bookID: this.state.book._id
        }
        this.props.removeWish(data).then(data => {
            let book = this.state.book;
            book.wish = false;
            this.setState({
                book: book
            })
            this.props.getWished()
        })
    }

    render() {
        return (
            <div className="bookContainer">
                {
                    this.state.book ?
                        <div className="book row">
                            <div className="img col s12 m12 l2">
                                <img className="materialboxed" onClick={this.zoom} width="250" src={this.state.book.image} />
                                <br/>
                                    <a ref={(dropdown) => { this.dropdown = dropdown }} className='dropdown-trigger btn' href='' onClick={(e)=> e.preventDefault()} data-target='dropdown1'>Add to</a>
                                    <ul id='dropdown1' className='dropdown-content' style={{width: "148px !important"}}>
                                        {
                                        this.state.book.favorite ? 
                                        <li onClick={this.removeFromFavorites}><a style={{display:"inline-flex"}}>Favorites<i className="material-icons">check</i></a></li> 
                                        : 
                                        <li onClick={this.addToFavorites}><a>Favorites</a></li>
                                        }
                                        {
                                        this.state.book.wish ? 
                                        <li onClick={this.removeFromWish}><a style={{display:"inline-flex"}}>Wish list<i className="material-icons">check</i></a></li> 
                                        : 
                                        <li onClick={this.addToWish}><a>Wish list</a></li>
                                        }
                                        {
                                        this.state.book.read ? 
                                        <li onClick={this.removeFromRead}><a style={{display:"inline-flex"}}>Read<i className="material-icons">check</i></a></li>
                                        : 
                                        <li onClick={this.addToRead}><a>Read</a></li>
                                        }
                                        
                                        
                                    </ul>
                            </div>
                            <div className="info col s6 offset-s2">
                                <div className="row">
                                    <h4 className="col s11">{this.state.book.title}</h4>
                                    <span className="recommend-book col s1"><i className="material-icons tooltipped" onClick={() => M.Modal.init(this.recommendModal).open()} data-position="left" onMouseOver={this.handleMouseOver} data-tooltip="Recommend">share</i></span>
                                </div>
                                <p><span className="fieldName">Authors:</span> {this.state.book.authors.map((author, index) => <span key={index}>{author}{this.state.book.authors[index + 1] ? "," : ""} </span>)}</p>
                                {
                                    this.state.userHasRated ?
                                        <div className="row">
                                            <Rating className="col s2.1" name="disabled" value={parseFloat(this.state.rating)} disabled />
                                            <Box className="col s1">{parseFloat(this.state.rating)}</Box>
                                        </div> :
                                        <HoverRating state={{ rating: this.state.rating, sendValue: this.getRatingValue }} />
                                }
                                <p><span className="fieldName">Categories:</span> {this.state.book.categories.sort().map((category, index) => <span key={index}>{category}{this.state.book.categories[index + 1] ? "," : ""} </span>)}</p>
                                <p className="fieldName">Description:</p>
                                <p>{this.state.book.description}</p>
                            </div>
                        </div>
                        : ""
                }

                <div id="modal1" className="modal" ref={(recommendModal) => { this.recommendModal = recommendModal }}>
                    <div className="modal-content">
                        <h4 className="center">Recommend Book</h4>
                        <div className="input-field col col s6 m4 l4 offset-l5 offset-m3">
                            <i className="material-icons prefix">search</i>
                            <input id="search" type="text" className="validate" value={this.state.search}
                                onChange={this.handleSearchChange} />
                            <label htmlFor="search">Search Users</label>
                        </div>
                        <div>
                            <ul className="users">
                                {this.state.usersFilter.map(user => <li key={user.id} onClick={() => this.sendRecommendation(user)}><img alt="" src={user.photo} width="25px" height="25px" style={{ verticalAlign: "middle" }} /> {user.username} ({user.email})</li>)}
                            </ul>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <a href="#!" className="modal-close btn-flat">Done</a>
                    </div>
                </div>

                {
                    this.state.book ?
                        <div className="commentsContainer">
                            <h3 className="fieldName center">Comments</h3>
                            <div className="comments row">
                                <ul className="collection col s8 offset-s2">
                                    {

                                        this.state.comments.map((comment) => {
                                            return (
                                                <li className="collection-item avatar col s12" key={comment._id}>
                                                    {this.state.currentUser.role === "admin" &&
                                                        <i id="deleteComment" className="material-icons tooltipped" onClick={() => this.deleteComment(comment._id)} data-position="left" onMouseOver={this.handleMouseOver} data-tooltip="Delete comment">delete</i>}
                                                    <img src="https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png" alt="" className="circle" />
                                                    <span className="title fieldName">{comment.username}</span>
                                                    <p>{comment.text}</p>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                            <div className="addComment">
                                <div className="row">
                                    <form className="col s8 offset-s2" onSubmit={this.handleSubmit}>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <textarea id="commentText" className="materialize-textarea" value={this.state.commentText}
                                                    onChange={this.handleChange}></textarea>
                                                <label htmlFor="commentText">Add Comment</label>
                                            </div>
                                            <div className="col s6 offset-s4">
                                                <button className="btn waves-effect waves-light center" type="submit" name="action">Add Comment
                                                <i className="material-icons right">send</i>
                                                </button>
                                            </div>

                                        </div>
                                    </form>
                                </div>
                            </div>

                        </div>
                        : ""
                }

            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Book)