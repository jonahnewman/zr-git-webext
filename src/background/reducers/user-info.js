import { tokenDefault, nameDefault, emailDefault, SET_USER_INFO } from '../../constants'

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
  }
  return output
}
