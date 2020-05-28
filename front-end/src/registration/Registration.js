import React from 'react';
import "./Registration.css"
import { createUser } from "../actions/index";
import  { Redirect } from 'react-router-dom'
import { connect } from "react-redux";

const mapStateToProps = state => {
    return { currentUser: state.currentUser };
};

function mapDispatchToProps(dispatch) {
    return {
        createUser: user => dispatch(createUser(user))
    };
}

class Registration extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            pending: false,
            error: false,
            errorMessage: '',
            errorKey: "",
            // firstName: "",
            // lastName: "",
            email: "",
            password: "",
            username: ""
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.id]: event.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({
            pending: true
        })
        if (this.validate()) {
            let data = {
                email: this.state.email,
                password: this.state.password,
                // lastName: this.state.lastName,
                // firstName: this.state.firstName,
                username: this.state.username
            }
            this.props.createUser(data).then((data) => {
                console.log(data)
                if (data.payload.result === 'error') {
                    this.setState({
                        error: true,
                        errorKey: data.payload.key,
                        errorMessage: data.payload.message,
                        pending: false
                    })
                }

                if (data.payload.result === 'success') {
                    this.props.update(data.payload);
                    this.props.history.push("/");
                }
            })
            //send to home page with signed in user
        } else {
            setTimeout(() => {
                this.setState({
                    pending: false
                })
            }, 1000)
        }
    }

    validate = () => {
        return true;
    }

    render() {
        return (
            <div className="registration">
                <div className=" row container">
                    <h4>Registration</h4>
                    <form className="col s12" onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="input-field col s10 offset-s1">
                                <input id="username" type="text" className="validate" required value={this.state.username}
                                    onChange={this.handleChange} />
                                <label htmlFor="username">Username</label>
                                {
                                    this.state.error && this.state.errorKey === 'username' ?
                                     <span className="errorMessage"><i class="small material-icons">report</i> <p> {this.state.errorMessage} </p> </span> : ""
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s10 offset-s1">
                                <input id="email" type="email" className="validate" required value={this.state.email}
                                    onChange={this.handleChange} />
                                <label htmlFor="email">Email</label>
                                {
                                    this.state.error && this.state.errorKey === 'email' ? <span className="errorMessage"><i class="small material-icons">report</i> <p> {this.state.errorMessage} </p> </span> : ""
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s10 offset-s1">
                                <input id="password" type="password" className="validate" required value={this.state.password}
                                    onChange={this.handleChange} />
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                        {
                            !this.state.pending ?
                                <button className="btn waves-effect waves-light" type="submit" name="action">Submit
                            <i className="material-icons right">send</i>
                                </button> :
                                <div className="preloader-wrapper small active">
                                    <div className="spinner-layer spinner-blue">
                                        <div className="circle-clipper left">
                                            <div className="circle"></div>
                                        </div><div className="gap-patch">
                                            <div className="circle"></div>
                                        </div><div className="circle-clipper right">
                                            <div className="circle"></div>
                                        </div>
                                    </div>

                                    <div className="spinner-layer spinner-red">
                                        <div className="circle-clipper left">
                                            <div className="circle"></div>
                                        </div><div className="gap-patch">
                                            <div className="circle"></div>
                                        </div><div className="circle-clipper right">
                                            <div className="circle"></div>
                                        </div>
                                    </div>

                                    <div className="spinner-layer spinner-yellow">
                                        <div className="circle-clipper left">
                                            <div className="circle"></div>
                                        </div><div className="gap-patch">
                                            <div className="circle"></div>
                                        </div><div className="circle-clipper right">
                                            <div className="circle"></div>
                                        </div>
                                    </div>

                                    <div className="spinner-layer spinner-green">
                                        <div className="circle-clipper left">
                                            <div className="circle"></div>
                                        </div><div className="gap-patch">
                                            <div className="circle"></div>
                                        </div><div className="circle-clipper right">
                                            <div className="circle"></div>
                                        </div>
                                    </div>
                                </div>
                        }
                    </form>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration)