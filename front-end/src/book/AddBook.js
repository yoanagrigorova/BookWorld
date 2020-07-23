import React from "react"
import M from 'materialize-css';
import { createBook } from "../actions/index";
import { connect } from "react-redux";

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        users: state.users
    };
};

function mapDispatchToProps(dispatch) {
    return {
        createBook: data => dispatch(createBook(data)),
    };
}

class AddBook extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            book: {
                title: "",
                image: "",
                authors: [],
                description: "",
                categories: []
            }
        }
    }

    handleChange = (event) => {
        this.setState({
            book: {
                ...this.state.book,
                [event.target.id]: event.target.value
            }
        });
    }

    componentDidMount() {
        M.Chips.init(this.category, {
            placeholder: "Add category",
            secondaryPlaceholder: "+ Category",
            onChipAdd: (chip) => {
                this.setState({
                    book: {
                        ...this.state.book,
                        categories: chip[0].M_Chips.chipsData.map(d => d.tag)
                    }
                })
            },
            onChipDelete: (chip) => {
                this.setState({
                    book: {
                        ...this.state.book,
                        categories: chip[0].M_Chips.chipsData.map(d => d.tag)
                    }
                })
            }
        });

        M.Chips.init(this.authors, {
            placeholder: "Add author",
            secondaryPlaceholder: "+ Author",
            onChipAdd: (chip) => {
                this.setState({
                    book: {
                        ...this.state.book,
                        authors: chip[0].M_Chips.chipsData.map(d => d.tag)
                    }
                })
            },
            onChipDelete: (chip) => {
                this.setState({
                    book: {
                        ...this.state.book,
                        authors: chip[0].M_Chips.chipsData.map(d => d.tag)
                    }
                })
            }
        });
    }

    verify = () =>{
        for(let prop in this.state.book){
            if(!this.state.book[prop].length){
                return false;
            }
        }
        return true;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.verify()){
            this.props.createBook(this.state.book).then(book => {
                this.props.history.push("/catalog")
            })
        }
    }

    render() {
        return (
            <div className="addBook row">
                <h4>Add Book</h4>
                <form className="col s8 offset-s2" onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="input-field col s12">
                            <input id="title" type="text" onChange={this.handleChange} className="validate" />
                            <label htmlFor="title">Title</label>
                        </div>
                        <div className="input-field col s12">
                            <input id="image" type="text" onChange={this.handleChange} className="validate" />
                            <label htmlFor="image">Cover Picture</label>
                        </div>
                        {/* <div className="input-field col s12">
                            <input id="author" type="text" onChange={this.handleChange} className="validate" />
                            <label htmlFor="author">Authors</label>
                        </div> */}
                        <div className="input-field col s12">
                            <div ref={(authors) => this.authors = authors} className="chips chips-placeholder"></div>
                        </div>
                        <div className="input-field col s12">
                            <textarea id="description" onChange={this.handleChange} className="materialize-textarea" />
                            <label htmlFor="description">Description</label>
                        </div>
                        <div className="input-field col s12">
                            <div ref={(category) => this.category = category} className="chips chips-placeholder"></div>
                        </div>
                        <button className="btn waves-effect waves-light" type="submit" name="action">Create
                            <i className="material-icons right">send</i>
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddBook)
