export const FETCH_USER_LOADING = 'FETCH_USER_LOADING';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILED = 'FETCH_USER_FAILED';

export const initialState = {
    isFetching: false,
    fetchFailed: false,
    data: '',
    error: ''
};

export default function (state = initialState, action) {
  const meta  = action.meta;
  switch (action.type) {
    case FETCH_USER_LOADING:
        return state;
    case FETCH_USER_SUCCESS:
        return state;
    case FETCH_USER_FAILED:
        return state;
    default:
      return state;
  }
}