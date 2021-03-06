import React from 'react';
import "./Login.css"
import { login } from "../actions/index";
import { connect } from "react-redux";
import M from 'materialize-css';

const mapStateToProps = state => {
    return { currentUser: state.currentUser };
};

function mapDispatchToProps(dispatch) {
    return {
        login: user => dispatch(login(user))
    };
}
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();

        let data = {
            password: this.state.password,
            email: this.state.email
        }
        this.props.login(data).then((data) => {
            if (data.data.result === 'success') {
                this.props.update(data);
                this.props.history.push("/catalog");
            }else{
                M.toast({ html: `Wrong user credentials!` })
            }
        })
    }

    render() {
        return (
            <div className="login">
                <div className="row" className="container">
                    <h4>Login</h4>
                    <form className="col s12" onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="input-field col s10 offset-s1">
                                <input id="email" type="email" className="validate" value={this.state.email}
                                    onChange={this.handleChange} />
                                <label htmlFor="email">Email</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s10 offset-s1">
                                <input id="password" type="password" className="validate" value={this.state.password}
                                    onChange={this.handleChange} />
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                        <button className="btn waves-effect waves-light" type="submit" name="action">Submit
                            <i className="material-icons right">send</i>
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);