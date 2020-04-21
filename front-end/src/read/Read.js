import React from 'react';
import "./Read.css"
import { getRead } from "../actions/index";
import { connect } from "react-redux";

const mapStateToProps = state => {
    return { books: state.books };
};

function mapDispatchToProps(dispatch) {
    return {
        getRead: user => dispatch(getRead(user))
    };
}

class Read extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            read: [],
            currentUser: JSON.parse(window.localStorage.getItem("currentUser"))
        }
        props.getRead(this.state.currentUser.id).then((data) => {
            this.setState({
                read: [...data.data]
            })
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
                                        <div className="card-stacked">
                                            <div className="card-content">
                                                <span className="card-title activator grey-text text-darken-4"><span className="title">{book.title}</span><i className="material-icons right">cancel</i></span>
                                                <p>Authors: {book.authors.map((author)=> <span key={author}>{author}, </span>)}</p>
                                            </div>
                                            <div className="card-action">
                                                <a href="#">Add to favorites</a>
                                            </div>
                                        </div>
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
                                    <p>Search showed no results.</p>
                                </div>
                            </div> : ""
                    }
                </div>
            </div>

        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Read)