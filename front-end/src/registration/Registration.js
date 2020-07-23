import React from 'react';
import "./Registration.css"
import { createUser } from "../actions/index";
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
                username: this.state.username
            }
            this.props.createUser(data).then((data) => {
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
                    setTimeout(()=>{
                        this.props.history.push("/catalog");
                    }, 500)
                }
            })
        } else {
            setTimeout(() => {
                this.setState({
                    pending: false
                })
            }, 1000)
        }
    }

    validate = () => {
        let passwordValidation = new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
        let usernameValidation = new RegExp("^[a-zA-Z0-9]+$");
        let emailValidation =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(emailValidation.test(this.state.email) && usernameValidation.test(this.state.username) && passwordValidation.test(this.state.password)){
            return true;
        }
        return false;

    }

    render() {
        let passwordValidation = new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
        let usernameValidation = new RegExp("^[a-zA-Z0-9]+$");
        let emailValidation =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return (
            <div className="registration">
                <div className=" row container">
                    <h4>Registration</h4>
                    <form className="col s12" onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="input-field col s10 offset-s1">
                                <input id="username" type="text" className={usernameValidation.test(this.state.username)? "valid": "invalid"} required value={this.state.username}
                                    onChange={this.handleChange} />
                                <label htmlFor="username">Username</label>
                                {
                                    this.state.error && this.state.errorKey === 'username' ?
                                     <span className="errorMessage"><i class="small material-icons">report</i> <p> {this.state.errorMessage} </p> </span> : ""
                                }
                                {(this.state.username.length && !usernameValidation.test(this.state.username)) ? <span className="errorMessage"><p> Username should be only letters and numbers. </p> </span> : "" }
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s10 offset-s1">
                                <input id="email" type="email" className={emailValidation.test(this.state.email)? "valid": "invalid"} required value={this.state.email}
                                    onChange={this.handleChange} />
                                <label htmlFor="email">Email</label>
                                {
                                    this.state.error && this.state.errorKey === 'email' ? <span className="errorMessage"><i class="small material-icons">report</i> <p> {this.state.errorMessage} </p> </span> : ""
                                }
                                {
                                    (this.state.email.length && !emailValidation.test(this.state.email)) ? <span className="errorMessage"><p> Email addres is invalid. </p> </span> : "" 
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s10 offset-s1">
                                <input id="password" type="password" className={passwordValidation.test(this.state.password)? "valid": "invalid"} required value={this.state.password}
                                    onChange={this.handleChange} />
                                <label htmlFor="password">Password</label>
                                {
                                    (this.state.password.length && !passwordValidation.test(this.state.password)) ? <span className="errorMessage"> <p> Password should be at least 8 characters with at least one number and special character.</p> </span> : "" 
                                }
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