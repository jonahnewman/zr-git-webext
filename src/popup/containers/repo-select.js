import React from 'react'
import { connect } from 'react-redux'
import { changeRepo } from '../action-creators/repo-select'

class RepoSelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = { input: '' }
    this.handleRepoChange = this.unboundHandleRepoChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleKeyPress (event) {
    if (event.keyCode === 13) {
      this.handleRepoChange()
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeyPress)
  }
  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyPress)
  }

  unboundHandleRepoChange () {
    this.props.changeRepo({ repoUrl: this.state.input })
    this.setState({ input: '' })
  }

  updateInput (input) {
    this.setState({ input })
  }

  render () {
    return (
      <div>
        <input
          onChange={e => this.updateInput(e.target.value)}
          value={this.state.input}
        />
        <button className='change-repo' onClick={this.handleRepoChange}>
          Change Repo
        </button>
      </div>
    )
  }
}

export default connect(
  null,
  { changeRepo }
)(RepoSelect)
