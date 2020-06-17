import { combineReducers } from 'redux';

import reducers from '../reducers';
import { batching } from '../store/reduxBatchDispatch';

const appReducer = batching(combineReducers({
  // Add App reducers here
  reducers
}));

export default appReducer;
