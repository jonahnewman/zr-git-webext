import { tokenDefault, nameDefault, emailDefault, SET_USER_INFO, DELETE_USER_INFO } from '../../constants'
import { recursiveObjectPrinter } from '..'

const defaultSubstate = {
  token: tokenDefault,
  name: nameDefault,
  email: emailDefault
}

export default (state = defaultSubstate, action) => {
  const output = state
  switch (action.type) {
    case SET_USER_INFO:
      output.token = action.token
      output.name = action.name
      output.email = action.email
      break
    case DELETE_USER_INFO:
      output.token = tokenDefault
      output.name = nameDefault
      output.email = emailDefault
      break
  }
  return output
}
