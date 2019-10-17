import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Select from 'react-select'
import { changeBranch, reloadBranches } from '../action-creators/branches'

class BranchSelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = { selectedBranch: '' }
    this.handleBranchChange = this.handleBranchChange.bind(this)
    this.handleBranchReload = this.handleBranchReload.bind(this)
  }

  handleBranchChange (option) {
    let branchName = option.value
    this.setState({ selectedBranch: branchName })
    let repoUrl = this.props.repoUrl
    console.log(`dispatching branch change to branch ${branchName}`)
    this.props.changeBranch({ branchName: branchName, repoUrl: repoUrl })
  }

  handleBranchReload () {
    console.log('reloading branches')
    this.props.reloadBranches()
  }

  render () {
    let selectOptions = []
    for (let i = 0; i < this.props.branchList.length; i++) {
      selectOptions.push({ value: this.props.branchList[i], label: this.props.branchList[i] })
    }
    if (this.props.repoUrl === 'default') {
      return (
        null
      )
    }
    return (
      <div>
        <h3>{ this.props.updating ? 'Updating branches...' : (this.props.switching ? 'Switching branch...' : `Current branch is ${this.props.currentBranch}`) }</h3>
        <Select /* defaultValue={{ value: 'master', label: 'master' }} */ isClearable isSearchable options={selectOptions} onChange={this.handleBranchChange} />
        <button className='change-repo' onClick={this.handleBranchReload}>
          Reload Branches
        </button>
      </div>
    )
  }
}

export default connect(
  state => ({
    currentBranch: state.branches.currentBranch,
    branchList: state.branches.branchList,
    switching: state.branches.switching,
    updating: state.branches.updating,
    repoUrl: state.repoSelect.repoUrl
  }),
  {
    changeBranch,
    reloadBranches
  }
)(BranchSelect)
