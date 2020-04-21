import React from 'react';
import "./Favorites.css"
import { getFavorites } from "../actions/index";
import { connect } from "react-redux";
import M from 'materialize-css';

const mapStateToProps = state => {
    return { favorites: state.favorites };
};

function mapDispatchToProps(dispatch) {
    return {
        getFavorites: user => dispatch(getFavorites(user))
    };
}

class Favorites extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            favorites: [],
            currentUser: JSON.parse(window.localStorage.getItem("currentUser"))
        }
        props.getFavorites(this.state.currentUser.id).then((data) => {
            console.log(data)
            this.setState({
                favorites: [...data.data]
            })
        })
    }

    componentDidMount() {
        M.FormSelect.init(this.dropdown);
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
                                        <div className="card-stacked">
                                            <div className="card-content">
                                                <span className="card-title activator grey-text text-darken-4"><span className="title">{book.title}</span><i className="material-icons right">cancel</i></span>
                                                <p>Authors: {book.authors.map((author)=> <span key={author}>{author}, </span>)}</p>
                                            </div>
                                            <div className="card-action">
                                                <a href="#">Add to wish list</a>
                                                <a href="#">Add to read</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )

                        })
                    }
                    {
                        this.state.favorites.length === 0 ?
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

export default connect(mapStateToProps, mapDispatchToProps)(Favorites)