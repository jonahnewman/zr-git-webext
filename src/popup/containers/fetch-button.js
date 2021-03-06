import React from 'react'
import { connect } from 'react-redux'
import { startFetch } from '../action-creators/fetch-commit'
import { branchDefault } from '../../constants'

class FetchButton extends React.Component {
  constructor (props) {
    super(props)
    this.handleFetch = this.handleFetch.bind(this)
  }

  handleFetch () {
    this.props.startFetch()
  }

  render () {
    if (this.props.currentBranch === branchDefault) {
      return (
        null
      )
    }
    return (
      <div>
        <button className='fetch-replace' onClick={this.handleFetch} disabled={this.props.locked}>
          Fetch and replace
        </button>
      </div>
    )
  }
}

export default connect(
  state => ({
    locked: state.status.locked,
    currentBranch: state.branches.currentBranch
  }),
  { startFetch }
)(FetchButton)
