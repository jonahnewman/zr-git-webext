import { START_BRANCH_LIST_UPDATE, BRANCH_LIST_UPDATE_SUCCESS, START_BRANCH_CHANGE, BRANCH_CHANGE_SUCCESS, repoDirectory } from '../../constants'
import * as git from 'isomorphic-git'

function startBranchListUpdate (payload) {
  // console.log('starting branch list update')
  return {
    type: START_BRANCH_LIST_UPDATE,
    ...payload
  }
}

function branchListUpdateSuccess (payload) {
  // console.log(`successfully updated branch list to ${payload.branchList}`)
  return {
    type: BRANCH_LIST_UPDATE_SUCCESS,
    ...payload
  }
}

function startBranchChange (payload) {
  // console.log(`starting change to branch ${payload.branchName}`)
  return {
    type: START_BRANCH_CHANGE,
    ...payload
  }
}

function branchChangeSuccess (payload) {
  // console.log(`successfully changed to branch ${payload.branchName}`)
  return {
    type: BRANCH_CHANGE_SUCCESS,
    ...payload
  }
}

export function changeBranch (payload) {
  const branchName = payload.branchName
  console.log(`switching to branch ${branchName}`)
  return async function (dispatch) {
    dispatch(startBranchChange({ branchName: branchName }))
    // console.log('changeBranch thunk started')
    await git.fetch({ dir: repoDirectory, ref: branchName, depth: 5, corsProxy: 'https://cors.isomorphic-git.org', url: payload.repoUrl }).then(
      (success) => {
        return success
      }, error => {
        console.log(`fetch failed with error ${error}`)
        throw error
      }
    )
    return git.checkout({ dir: repoDirectory, ref: branchName }).then(
      (success) => {
        dispatch(branchChangeSuccess({ branchName: branchName }))
        return success
      }, error => {
        console.log(`checkout failed with error ${error}`)
        throw error
      }
    )
  }
}

export function updateBranches (payload) {
  const manual = payload.manual
  return async function (dispatch, getState) {
    dispatch(startBranchListUpdate({ manual: manual }))
    return git.listBranches({ dir: repoDirectory, remote: 'origin' }).then(
      async branches => {
        const branchesUpdated = branches.filter(word => word !== 'HEAD')
        dispatch(branchListUpdateSuccess({ branchList: branchesUpdated, manual: manual }))
        console.log(`branchList updated to ${branchesUpdated}`)
        return branches
      }, error => {
        console.log(`updateBranches failed with error ${error}`)
        throw error
      }
    )
  }
}

export function updateBranchesThunk (payload) {
  console.log('updateBranchesThunk called')
  return updateBranches
}
