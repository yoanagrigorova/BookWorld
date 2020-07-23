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
import Favorites from "./favorites/Favorites"
import WishList from "./wishList/WishList"
import Read from "./read/Read"
import Catalog from "./catalog/Catalog"
import Book from "./book/Book"
import AddBook from "./book/AddBook"
import { connect } from 'react-redux';
import M from 'materialize-css';
import { Provider } from 'react-redux'
import store from "./store";
import { checkSession, signOut, getNotifications, markAsRead } from "./actions/index"
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:2323";

const mapStateToProps = state => {
  return { currentUser: state.currentUser };
};

function mapDispatchToProps(dispatch) {
  return {
    checkSession: () => dispatch(checkSession()),
    signOut: () => dispatch(signOut()),
    getNotifications: () => dispatch(getNotifications()),
    markAsRead: (id) => dispatch(markAsRead(id))
  };
}

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: props.currentUser ? props.currentUser : null,
      openNotifications: false,
      notifications: [],
      redirect:false
    }

    if (!props.currentUser) {
      props.checkSession().then(user => {
        if (user && !user.data.msg) {
          this.setState({
            currentUser: user.data
          })
          this.props.getNotifications().then(notifications => {
            this.setState({
              notifications: notifications.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            })
          })
          M.Dropdown.init(this.dropdown);
          M.Sidenav.init(this.sidenav);
        }

      })
    }

    const socket = socketIOClient(ENDPOINT);
    socket.on("notification", data => {
      if (data.reciever === this.state.currentUser.id) {
        M.toast({ html: `You have a new notification!` })
        let dummy = [...this.state.notifications, data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        this.setState({
          notifications: [...dummy]
        })
      }

    });

  }

  update = (data) => {
    this.props.checkSession().then(user => {
      if (user && !user.data.msg) {
        this.setState({
          currentUser: user.data
        })
        this.props.getNotifications().then(notifications => {
          this.setState({
            notifications: notifications.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          })
        })
        M.Dropdown.init(this.dropdown);
        M.Sidenav.init(this.sidenav);
      }
    })
  }

  signOut = () => {
    this.props.signOut().then(() => {
      this.setState({
        currentUser: null
      })
    })
  }

  componentDidMount() {
    M.Dropdown.init(this.dropdown);
  }

  toggleNotifications = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      openNotifications: !this.state.openNotifications
    })
  }

  markRead = (e, id) => {
    e.stopPropagation();
    if (!this.state.notifications.find(n => n._id === id).read) {
      this.props.markAsRead(id).then(data => {
        let index = this.state.notifications.findIndex(n => n._id === id);
        let dummy = [...this.state.notifications];
        dummy[index].read = true;
        this.setState({
          notifications: [...dummy]
        })
      })
    }
  }

  close = (e) => {
    this.setState({
      openNotifications: false
    })
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <nav>
              <div className="nav-wrapper">
                <Link to={this.state.currentUser ? "/catalog": "/login"} className="brand-logo">BookWorld</Link>
                <a href="" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                {
                  this.state.currentUser && this.state.currentUser.role === "user" &&
                  <React.Fragment>
                    <ul className="left hide-on-med-and-down">
                      <li>
                        <div className="chip">
                          <img src={this.state.currentUser.photo} alt="Contact Person" />
                          {this.state.currentUser.username}
                        </div>
                      </li>
                      <li onClick={this.toggleNotifications}><a id="toggleNotigications" href="">Notifications <span className="new badge">{this.state.notifications.filter(a => !a.read).length}</span></a></li>
                    </ul>
                    <ul className="right hide-on-med-and-down">
                      <li><Link to="/favorites">Favorites</Link></li>
                      <li><Link to="/wish">Wish list</Link></li>
                      <li><Link to="/read">Read</Link></li>
                      <li><Link to="/catalog">Catalog</Link></li>
                      <li><Link to="/login" onClick={this.signOut}>Sign Out</Link></li>
                    </ul>
                  </React.Fragment>
                }

                {
                  this.state.currentUser && this.state.currentUser.role === "admin" &&
                  <React.Fragment>
                    <ul className="left hide-on-med-and-down">
                      <li>
                        <div className="chip">
                          <img src={this.state.currentUser.photo} alt="Contact Person" />
                          {this.state.currentUser.username}
                        </div>
                      </li>
                      <li onClick={this.toggleNotifications}><a id="toggleNotigications" href="">Notifications <span className="new badge">{this.state.notifications.filter(a => !a.read).length}</span></a></li>
                    </ul>
                    <ul className="right hide-on-med-and-down">
                      <li><Link to="/catalog">Catalog</Link></li>
                      <li><Link to="/addBook">Add Book</Link></li>
                      <li><a onClick={this.signOut}>Sign Out</a></li>
                    </ul>
                  </React.Fragment>
                }

                {
                  !this.state.currentUser &&
                  <ul className="right hide-on-med-and-down">
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/registration">Registration</Link></li>
                  </ul>
                }

              </div>
            </nav>

            <div className="notifications" id="notificationsContainer" hidden={!this.state.openNotifications}>
              <h5>Notifications <i className="material-icons" id="closeNotifications" onClick={this.close}>close</i></h5>
              {!this.state.notifications.length &&
                <h6>No notifications</h6>}
              <ul>
                {this.state.notifications.map(notification =>
                  <li style={{ background: !notification.read ? "#a3cae0" : "#d2e2e1", cursor: "pointer" }} key={notification._id} onClick={(e) => this.markRead(e, notification._id)}>
                    User <span style={{ fontWeight: "bold" }}>{notification.sender.username}</span> has recommended you the book
                  <Link to={"/book/" + notification.book._id}> {notification.book.title} </Link>
                  </li>
                )}
              </ul>
            </div>

            {
              this.state.currentUser && this.state.currentUser.role === "user" &&
              <ul className="sidenav" id="mobile-demo" ref={(sidenav) => { this.sidenav = sidenav }}>
                <li>
                  <div className="chip">
                    <img src={this.state.currentUser.photo} alt="Contact Person" />
                    {this.state.currentUser.username}
                  </div>
                </li>
                <li onClick={this.toggleNotifications}><a href="">Notifications <span className="new badge">{this.state.notifications.filter(a => !a.read).length}</span></a></li>
                <li><Link to="/favorites">Favorites</Link></li>
                <li><Link to="/wish">Wish list</Link></li>
                <li><Link to="/read">Read</Link></li>
                <li><Link to="/catalog">Catalog</Link></li>
                <li><a onClick={this.signOut}>Sign Out</a></li>
              </ul>

            }

            {
              this.state.currentUser && this.state.currentUser.role === "admin" &&
              <ul className="sidenav" id="mobile-demo" ref={(sidenav) => { this.sidenav = sidenav }}>
                <li>
                  <div className="chip">
                    <img src={this.state.currentUser.photo} alt="Contact Person" />
                    {this.state.currentUser.username}
                  </div>
                </li>
                <li onClick={this.toggleNotifications}><a href="">Notifications <span className="new badge">{this.state.notifications.filter(a => !a.read).length}</span></a></li>
                <li><Link to="/catalog">Catalog</Link></li>
                <li><a onClick={this.signOut}>Sign Out</a></li>
              </ul>
            }

            {
              !this.state.currentUser &&
              <ul className="sidenav" id="mobile-demo" ref={(sidenav) => { this.sidenav = sidenav }}>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/registration">Registration</Link></li>
                <Route exact path="/">
                  {this.state.currentUser ? <Redirect to="/catalog" /> : <Redirect to="/login" />}
              </Route>
              </ul>
            }
            {
              this.state.currentUser &&
              <Switch>
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
                <Route exact path="/">
                  {this.state.currentUser ? <Redirect to="/catalog" /> : <Redirect to="/login" />}
              </Route>
              </Switch>
            }
            {
              this.state.currentUser && this.state.currentUser.role === "admin" &&
              <Switch>
                <Route exact path="/addBook" component={AddBook} >
                </Route>
                <Route exact path="/">
                  {this.state.currentUser ? <Redirect to="/catalog" /> : <Redirect to="/login" />}
                </Route>
              </Switch>
            }
            {
              !this.state.currentUser &&
              <Switch>
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
