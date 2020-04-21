import React from 'react';
import "./Login.css"
import { login } from "../actions/index";
import { connect } from "react-redux";

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

        console.log(props)

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state)

        let data = {
            email: this.state.email,
            password: this.state.password
        }
        this.props.login(data).then((data) => {
            console.log(this.props)
            console.log(data)
            window.localStorage.setItem("currentUser", JSON.stringify(data.data))
            this.props.update(data);
            this.props.history.push("/");
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