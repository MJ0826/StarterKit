import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../app/root-reducer'
import thunk from 'redux-thunk'
import { batch } from './reduxBatchDispatch'

let store = null

export default function configureStore (initialState) {
  const middlewares = [thunk, batch]
  if (store === null) {
    store = createStore(
      rootReducer,
      initialState,
      applyMiddleware(...middlewares)
    )
  }
  
  return store
}
