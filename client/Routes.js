import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
// import { Login, Signup } from './components/AuthForm';
import Login  from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import {me} from './store'
import RateMovie from './components/RateMovie';
import FriendsList from './components/FriendsList';
import Match from './components/Match';
import Watched from './components/Watched';
import MovieDetail from './components/MovieDetail';
import Random from './components/Random';
import Profile from './components/Profile';
import UserDetail from './components/userDetail';

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props

    return (
      <div>
        {isLoggedIn ? (
          <Switch>
            <Route path="/home" component={Home} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/rate" component={RateMovie} />
            <Route exact path="/match/:userId" component={Match} />
            <Route exact path="/random/:userId" component={Random} />
            <Route exact path="/list" component={FriendsList} />
            <Route exact path="/watched" component={Watched} />
            <Route path="/movies/:movieId" component={MovieDetail} />
            <Route path="/users/:userId" component={UserDetail} />
            <Redirect to="/home" />
          </Switch>
        ) : (
          <Switch>
            <Route path='/' exact component={ Login } />
            {/* <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} /> */}
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
          </Switch>
        )}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))
