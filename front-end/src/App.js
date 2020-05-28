import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Login from "./login/Login";
import Registration from "./registration/Registration"
import Home from "./home/Home"
import Favorites from "./favorites/Favorites"
import WishList from "./wishList/WishList"
import Read from "./read/Read"
import Catalog from "./catalog/Catalog"
import Book from "./book/Book"
import { connect } from 'react-redux';
import M from 'materialize-css';
import { Provider } from 'react-redux'
import store from "./store";
import { checkSession, signOut } from "./actions/index"
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:5000";

const mapStateToProps = state => {
  return { currentUser: state.currentUser };
};

function mapDispatchToProps(dispatch) {
  return {
    checkSession: () => dispatch(checkSession()),
    signOut: () => dispatch(signOut())
  };
}

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: props.currentUser ? props.currentUser : null
    }

    console.log(this.props)
    if (!props.currentUser) {
      props.checkSession().then(data => {
        console.log(data)
        if (data) {
          this.setState({
            currentUser: data.data
          })
          M.Dropdown.init(this.dropdown)
        }

      })
    }

    const socket = socketIOClient(ENDPOINT);
    // console.log(socket)
    // socket.on("FromAPI", data => {
    //   console.log(data)
    // });

  }

  update = (data) => {
    this.setState({
      currentUser: data.data
    })
  }

  signOut = () => {
    this.props.signOut().then(() => {
      this.setState({
        currentUser: null
      })
      return <Redirect to='/login' />
    })
  }

  componentDidMount() {
    M.Sidenav.init(this.sidenav);
    M.Dropdown.init(this.dropdown)
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <nav>
              <div className="nav-wrapper">
                <Link to="/" className="brand-logo">BookWorld</Link>
                <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                {
                  this.state.currentUser ?
                    <React.Fragment>
                      <ul className="left hide-on-med-and-down">
                        <li>
                          <div className="chip">
                            <img src={this.state.currentUser.photo} alt="Contact Person" />
                            {this.state.currentUser.username}
                         </div>
                        </li>
                        <li><a href="">Notifications <span className="new badge">4</span></a></li>
                        <li><Link to="/favorites">Find Friends</Link></li>
                      </ul>
                      <ul className="right hide-on-med-and-down">
                        <li><Link to="/favorites">Favorites</Link></li>
                        <li><Link to="/wish">Wish list</Link></li>
                        <li><Link to="/read">Read</Link></li>
                        <li><Link to="/catalog">Catalog</Link></li>
                        <li><a onClick={this.signOut}>Sign Out</a></li>
                      </ul>
                    </React.Fragment>
                    :
                    <ul className="right hide-on-med-and-down">
                      <li><Link to="/login">Login</Link></li>
                      <li><Link to="/registration">Registration</Link></li>
                    </ul>
                }

              </div>
            </nav>

            {
              this.state.currentUser ?
                <ul className="sidenav" id="mobile-demo" ref={(sidenav) => { this.sidenav = sidenav }}>
                  <li><Link to="/favorites">Favorites</Link></li>
                  <li><Link to="/wish">Wish list</Link></li>
                  <li><Link to="/read">Read</Link></li>
                  <li><Link to="/catalog">Catalog</Link></li>
                  <li><a onClick={this.signOut}>Sign Out</a></li>
                </ul> :
                <ul className="sidenav" id="mobile-demo" ref={(sidenav) => { this.sidenav = sidenav }}>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/registration">Registration</Link></li>
                </ul>
            }

            {
              this.state.currentUser ?

                <Switch>
                  <Route exact path="/" component={Home} >
                  </Route>
                  <Route path="/favorites" component={Favorites}>
                  </Route>
                  <Route path="/wish" component={WishList}>
                  </Route>
                  <Route path="/read" component={Read}>
                  </Route>
                  <Route path="/catalog" component={Catalog}>
                  </Route>
                  <Route path="/book/:id" component={Book}>
                  </Route>
                </Switch>
                : <Switch>

                  <Route path="/registration" render={(props) => <Registration {...props} update={this.update} />}>
                  </Route>
                  <Route path="/login" render={(props) => <Login {...props} update={this.update} />}>
                  </Route>
                  {/* <Route from="/*" to="/login"> </Route> */}
                </Switch>

            }
          </div>
        </Router>
      </Provider>


    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(App);
