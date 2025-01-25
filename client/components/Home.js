import React from 'react'
import {connect} from 'react-redux'
import RateMovie from './RateMovie';

/**
 * COMPONENT
 */
export const Home = props => {
  const {username} = props

  return (
    <div>
      <RateMovie/>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    username: state.auth.username
  }
}

export default connect(mapState)(Home)
