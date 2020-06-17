export const type = '@@redux-batch-middleware/BATCH';

export const batch = ({ dispatch }) => next => (action) => {
  if (Array.isArray(action)) {
    return dispatch({ type, payload: action });
  }
  return next(action);
};
export const batching = reducer => function batcher(state, action) {
  return action.type === type
            ? action.payload.reduce(batcher, state)
            : reducer(state, action);
};
