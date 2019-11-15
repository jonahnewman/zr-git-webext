import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Select from 'react-select'
import { changeBranch, reloadBranches } from '../action-creators/branches'
import { repoDefault } from '../../constants'
import { branchDefault } from '../../constants'

class BranchSelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = { selectedBranch: '' }
    this.handleBranchChange = this.handleBranchChange.bind(this)
    this.handleBranchReload = this.handleBranchReload.bind(this)
  }

  handleBranchChange (option) {
    const branchName = option.value
    this.setState({ selectedBranch: branchName })
    const repoUrl = this.props.repoUrl
    console.log(`dispatching branch change to branch ${branchName}`)
    this.props.changeBranch({ branchName: branchName, repoUrl: repoUrl })
  }

  handleBranchReload () {
    console.log('reloading branches')
    this.props.reloadBranches()
  }

  render () {
    const selectOptions = []
    for (let i = 0; i < this.props.branchList.length; i++) {
      selectOptions.push({ value: this.props.branchList[i], label: this.props.branchList[i] })
    }
    if (this.props.repoUrl === repoDefault) {
      return (
        null
      )
    }
    return (
      <div>
        <h3>{this.props.updating ? 'Updating branches...' : (this.props.switching ? 'Switching branch...' : (this.props.currentBranch == branchDefault ? 'No branch selected yet' : `Current branch is ${this.props.currentBranch}`))}</h3>
        <Select /*defaultValue={{ value: this.props.currentBranch, label: this.props.currentBranch }}*/ isClearable isSearchable options={selectOptions} onChange={this.handleBranchChange} />
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
