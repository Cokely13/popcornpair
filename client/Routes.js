// import React, {Component, Fragment} from 'react'
// import {connect} from 'react-redux'
// import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
// // import { Login, Signup } from './components/AuthForm';
// import Login  from './components/Login';
// import Signup from './components/Signup';
// import Home from './components/Home';
// import {me} from './store'
// import RateMovie from './components/RateMovie';
// import FriendsList from './components/FriendsList';
// import Match from './components/Match';
// import Watched from './components/Watched';
// import MovieDetail from './components/MovieDetail';
// import Random from './components/Random';
// import Profile from './components/Profile';
// import UserDetail from './components/userDetail';
// import Rejected from './components/Rejected';
// import Recommendations from './components/Recommendations';
// import Search from './components/Search';
// import Watchlist from './components/Watchlist';
// import FriendRecs from './components/FriendRecs';
// import AddMovie from './components/AddMovie';
// import Users from './components/Users';
// import Algorithm from './components/Algorithm';
// import PrivateRoute from './components/PrivateRoute';

// /**
//  * COMPONENT
//  */
// class Routes extends Component {
//   componentDidMount() {
//     this.props.loadInitialData()
//   }

//   render() {
//     const {isLoggedIn} = this.props

//     return (
//       <div>
//         {isLoggedIn ? (
//           <Switch>
//             <Route path="/home" component={Home} />
//             <Route exact path="/profile" component={Profile} />
//             <Route exact path="/users" component={Users} />
//             <Route exact path="/watchlist" component={Watchlist} />
//             <Route exact path="/rate" component={RateMovie} />
//             <Route exact path="/match/:userId" component={Match} />
//             <Route exact path="/random/:userId" component={Random} />
//             <Route exact path="/list" component={FriendsList} />
//             <Route exact path="/watched" component={Watched} />
//             <Route exact path="/rejected" component={Rejected} />
//             <Route exact path="/search" component={Search} />
//             <Route exact path="/algorithm" component={Algorithm} />
//             <Route exact path="/recommendations" component={FriendRecs} />
//             <Route path="/movies/:movieId" component={MovieDetail} />
//             <Route exact path="/users/:userId" component={UserDetail} />
//             {/* <Route path="/recommendations" component={Recommendations} /> */}
//             <Route path="/addmovie" component={AddMovie} />
//             <Redirect to="/home" />
//           </Switch>
//         ) : (
//           <Switch>
//             <Route path='/' exact component={ Login } />
//             <Route path="/login" component={Login} />
//             <Route path="/signup" component={Signup} />
//           </Switch>
//         )}
//       </div>
//     )
//   }
// }

// /**
//  * CONTAINER
//  */
// const mapState = state => {
//   return {
//     // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
//     // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
//     isLoggedIn: !!state.auth.id
//   }
// }

// const mapDispatch = dispatch => {
//   return {
//     loadInitialData() {
//       dispatch(me())
//     }
//   }
// }

// // The `withRouter` wrapper makes sure that updates are not blocked
// // when the url changes
// export default withRouter(connect(mapState, mapDispatch)(Routes))

// src/Routes.js

// src/Routes.js

// src/Routes.js

// src/Routes.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import { me } from './store';
import RateMovie from './components/RateMovie';
import FriendsList from './components/FriendsList';
import Match from './components/Match';
import Watched from './components/Watched';
import MovieDetail from './components/MovieDetail';
import Random from './components/Random';
import Profile from './components/Profile';
import UserDetail from './components/UserDetail';
import Rejected from './components/Rejected';
import Recommendations from './components/Recommendations';
import Search from './components/Search';
import Watchlist from './components/Watchlist';
import FriendRecs from './components/FriendRecs';
import AddMovie from './components/AddMovie';
import Users from './components/Users';
import Algorithm from './components/Algorithm';
import PrivateRoute from './components/PrivateRoute';

class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    return (
      <div>
        <Switch>
          {/* Public Routes */}
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Home} />
          <Route exact path="/signup" component={Home} />

          {/* Protected Routes */}
          <PrivateRoute exact path="/home" component={Home} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/users" component={Users} />
          <PrivateRoute exact path="/watchlist" component={Watchlist} />
          <PrivateRoute exact path="/rate" component={RateMovie} />
          <PrivateRoute exact path="/match/:userId" component={Match} />
          <PrivateRoute exact path="/random/:userId" component={Random} />
          <PrivateRoute exact path="/list" component={FriendsList} />
          <PrivateRoute exact path="/watched" component={Watched} />
          <PrivateRoute exact path="/rejected" component={Rejected} />
          <PrivateRoute exact path="/search" component={Search} />
          <PrivateRoute exact path="/algorithm" component={Algorithm} />
          <PrivateRoute exact path="/recommendations" component={FriendRecs} />
          <PrivateRoute path="/movies/:movieId" component={MovieDetail} />
          <PrivateRoute exact path="/users/:userId" component={UserDetail} />
          <PrivateRoute path="/addmovie" component={AddMovie} />

          {/* Fallback Route */}
          <Route path="*" component={() => <h2>404 Not Found</h2>} />
        </Switch>
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = state => ({
  isLoggedIn: !!state.auth.id,
});

const mapDispatch = dispatch => ({
  loadInitialData() {
    dispatch(me());
  }
});

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));
