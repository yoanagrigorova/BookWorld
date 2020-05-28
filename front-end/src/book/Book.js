import React from 'react';
import "./Book.css"
import { getBook, addComment, rateBook, checkSession, changeRating, getUsers } from "../actions/index";
import { connect } from "react-redux";
import HoverRating from "./HoverRating"
import M from 'materialize-css';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

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
        getUsers: ()=> dispatch(getUsers())
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
            users: []
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

            this.setState({
                book: book,
                comments: data.data.comments,
                rating: book.rating,
                userHasRated: book.ratings.some(r => r.user.id === this.state.currentUser.id)
            })
        })
    }

    componentDidMount(){
        this.props.getUsers().then(data=>{
            this.setState({
                users: data.data.filter(u => u.id !== this.state.currentUser.id)
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
        // let dummy = [...this.state.books].filter(book =>
        //     book.title.toLowerCase().split(" ").some(word => word.startsWith(event.target.value.toLowerCase())) ||
        //     book.title.toLowerCase().startsWith(event.target.value.toLowerCase()));
        // this.setState({
        //     filtered: [...dummy]
        // })
    }

    sendRecommendation = (user) => {
        console.log(user)
        M.Modal.init(this.recommendModal).close()
        M.toast({html: `Recommendation sent to ${user.username}`})
    }

    render() {
        // const {book} = this.state.book
        return (
            <div className="bookContainer">
                {
                    this.state.book ?
                        <div className="book row">
                            <div className="img col s2">
                                <img className="materialboxed" onClick={this.zoom} width="250" src={this.state.book.image} />
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
                            {this.state.users.map(user=> <li key={user.id} onClick={()=> this.sendRecommendation(user)}><img alt="" src={user.photo} width="25px" height="25px" style={{verticalAlign:"middle"}} /> {user.username} ({user.email})</li>)}
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

                                        this.state.comments.map((comment, index) => {
                                            return (
                                                <li className="collection-item avatar col s12" key={index}>
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