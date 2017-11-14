import { NavigationActions } from 'react-navigation'
import { PrimaryNav } from '../Navigation/AppNavigation'

const { navigate, reset } = NavigationActions
const { getStateForAction } = PrimaryNav.router

const INITIAL_STATE = getStateForAction(
  navigate({ routeName: 'LoadingScreen' })
)
const NOT_LOGGED_IN_STATE = getStateForAction(
  navigate({ routeName: 'AuthScreen'}))

const AUTH_SUCCESS_STATE = getStateForAction(
  navigate({ routeName: 'AccountsScreen'}))

const LOADING_SCREEN = getStateForAction(
    navigate({ routeName: 'LoadingScreen'}))

// const LOGGED_IN_STATE = getStateForAction(reset({
//   index: 0,
//   actions: [
//     navigate({ routeName: 'LoggedInStack' })
//   ]
// }))

/**
 * Creates an navigation action for dispatching to Redux.
 *
 * @param {string} routeName The name of the route to go to.
 */
// const navigateTo = routeName => () => navigate({ routeName })

export function reducer (state = INITIAL_STATE, action) {
  let nextState
  switch (action.type) {
    // rehydration cases
    case 'SET_REHYDRATION_COMPLETE':
      return AUTH_SUCCESS_STATE
    case 'SET_NO_REHYDRATION':
      return NOT_LOGGED_IN_STATE
    
    // initial login
    case 'AUTH_SUCCESS':
      return AUTH_SUCCESS_STATE
    
      // failures to login - go to initial screen
    case 'AUTH_REFRESH_FAILURE':
      return NOT_LOGGED_IN_STATE
    case 'LOGOUT':
      return NOT_LOGGED_IN_STATE
  }
  nextState = getStateForAction(action, state)
  return nextState || state
}
