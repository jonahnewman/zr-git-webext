import * as git from 'isomorphic-git'
import '@babel/polyfill'

import { fs, recursiveObjectPrinter } from '../index'
import { START_FETCH_REPLACE, FETCH_REPLACE_FAILURE, FETCH_REPLACE_SUCCESS, repoDirectory, proxyUrl, ZRCodePath } from '../../constants'
import { setDoc } from '../content-scripts/set-editor-text'

function startFetchReplace (payload) {
  // console.log('clone starting in background')
  return {
    type: START_FETCH_REPLACE,
    ...payload
  }
}

function fetchReplaceFailure (payload) {
  // console.log('clone starting in background')
  return {
    type: FETCH_REPLACE_FAILURE,
    ...payload
  }
}

function fetchReplaceSuccess (payload) {
  // console.log('clone starting in background')
  return {
    type: FETCH_REPLACE_SUCCESS,
    ...payload
  }
}

export function fetchReplace () {
  return async function (dispatch, getState) {
    dispatch(startFetchReplace())
    await dispatch(fetch())
    await dispatch(checkout())
    let editorContents = await fs.promises.readFile(repoDirectory + '/' + ZRCodePath, { encoding: 'utf8' }, (err, data) => { if (err) throw err }).then((success) => {
      console.log('file read succeeded')
      return success
    }, (error) => {
      console.log(`file read failed with error ${error}`)
      dispatch(fetchReplaceFailure())
      throw error
    })
    const logOutput = await git.log({ dir: repoDirectory, depth: 2, ref: getState().branches.currentBranch })
    console.log('git log output for sha checking:')
    for (let i = 0; i < logOutput.length; i++) {
      console.log(`commit ${i} is ${recursiveObjectPrinter(logOutput[i])}`)
    }
    const sha = logOutput[0].oid
    editorContents = `// { "sha": "${sha}" } \n` + editorContents
    await setDoc(editorContents).then((success) => {
      console.log('setDoc succeeded')
      return success
    }, (error) => {
      console.log(`setDoc failed with error ${error}`)
      dispatch(fetchReplaceFailure())
      throw error
    })
    dispatch(fetchReplaceSuccess())
  }
}

function fetch () {
  console.log('fetching')
  return async function (dispatch, getState) {
    console.log(`fetching with params ${recursiveObjectPrinter({ dir: repoDirectory, corsProxy: proxyUrl, url: getState().repoSelect.repoUrl, ref: getState().branches.currentBranch })}`)
    return git.fetch({ dir: repoDirectory, corsProxy: proxyUrl, url: getState().repoSelect.repoUrl, ref: getState().branches.currentBranch }).then((success) => {
      console.log('fetch succeeded')
      return success
    }, (error) => {
      console.log(`fetch failed with error ${error}`)
      dispatch(fetchReplaceFailure())
      throw error
    })
  }
}

function checkout () {
  console.log('checking out')
  return async function (dispatch, getState) {
    return git.checkout({ dir: repoDirectory, ref: getState().branches.currentBranch }).then((success) => {
      console.log('checkout succeeded')
      return success
    }, (error) => {
      console.log(`checkout failed with error ${error}`)
      dispatch(fetchReplaceFailure())
      throw error
    })
  }
}
