
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
// import UserDetail from './components/UserDetail';
import Rejected from './components/Rejected';
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
          {/* <PrivateRoute exact path="/users/:userId" component={UserDetail} /> */}
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
