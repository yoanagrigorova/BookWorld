import React from 'react';
import "./WishList.css"
import { getWished } from "../actions/index";
import { connect } from "react-redux";

const mapStateToProps = state => {
    return { books: state.books };
};

function mapDispatchToProps(dispatch) {
    return {
        getWished: user => dispatch(getWished(user))
    };
}

class WishList extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            wishes: [],
            currentUser: JSON.parse(window.localStorage.getItem("currentUser"))
        }
        props.getWished(this.state.currentUser.id).then((data) => {
            console.log(data)
            this.setState({
                wishes: [...data.data]
            })
        })
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
                                        <div className="card-stacked">
                                            <div className="card-content">
                                                <span className="card-title activator grey-text text-darken-4"><span className="title">{book.title}</span><i className="material-icons right">cancel</i></span>
                                                <p>Authors: {book.authors.map((author)=> <span key={author}>{author}, </span>)}</p>
                                            </div>
                                            <div className="card-action">
                                                <a href="#">Add to favorites</a>
                                                <a href="#">Add to read</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )

                        })
                    }
                </div>
            </div>

        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WishList)