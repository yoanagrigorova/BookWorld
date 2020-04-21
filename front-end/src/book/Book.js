import React from 'react';
import "./Book.css"
import { getBook, addComment } from "../actions/index";
import { connect } from "react-redux";
import HoverRating from "./HoverRating"
import M from 'materialize-css';
import Rating from '@material-ui/lab/Rating';


const mapStateToProps = state => {
    return { favorites: state.favorites };
};

function mapDispatchToProps(dispatch) {
    return {
        getBook: id => dispatch(getBook(id)),
        addComment: data => dispatch(addComment(data))
    };
}

class Book extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            book: null,
            comments: [],
            commentText: "",
            currentUser: JSON.parse(window.localStorage.getItem("currentUser"))
        }
        props.getBook(props.match.params.id).then((data) => {
            this.setState({
                book: data.data.book[0],
                comments: data.data.comments
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
                                <h4>{this.state.book.title}</h4>
                                <p><span className="fieldName">Authors:</span> {this.state.book.authors.map((author, index) => <span key={index}>{author}{this.state.book.authors[index + 1] ? "," : ""} </span>)}</p>
                                <HoverRating />
                                <p className="fieldName">Description:</p>
                                <p>{this.state.book.description}</p>
                            </div>
                        </div>
                        : ""
                }

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