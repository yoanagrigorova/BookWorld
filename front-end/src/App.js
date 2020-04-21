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


const mapStateToProps = state => {
  return { currentUser: state.currentUser };
};

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser : window.localStorage.getItem("currentUser")
    }

  }

  update = (data) => {
    this.setState({
      currentUser: data
    })
  }

  componentDidMount(){
    M.Sidenav.init(this.sidenav);
  }

  render() {
    return (

      <Router>
        <div className="App">
          <nav>
            <div className="nav-wrapper">
              <Link to="/" className="brand-logo">BookWorld</Link>
              <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
              {
                this.state.currentUser ?
                  <ul className="right hide-on-med-and-down">
                    <li><Link to="/favorites">Favorites</Link></li>
                    <li><Link to="/wish">Wish list</Link></li>
                    <li><Link to="/read">Read</Link></li>
                    <li><Link to="/catalog">Catalog</Link></li>
                  </ul> :
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

                <Route path="/registration" component={Registration}>
                </Route>
                <Route path="/login" render={(props)=> <Login {...props} update={this.update} />}>
                </Route>
                {/* <Route from="/*" to="/login"> </Route> */}
              </Switch>

          }
        </div>
      </Router>



    );
  }

}

export default connect(mapStateToProps)(App);
