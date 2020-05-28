import { ADD_USER } from "../constants";
import {
  LOGIN, GET_FAVORITES, ADD_FAVORITE, GET_BOOKS, REMOVE_FAVORITE, ADD_WISH,
  GET_READ, GET_WISHED, ADD_READ, REMOVE_READ, REMOVE_WISH, CHECK_SESSION, SIGN_OUT, GET_USERS
} from "../constants";

const initialState = {
  currentUser: null,
  books: [],
  favorites: [],
  read: [],
  wish: [],
  users: []
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_USER:
      state.currentUser = action.payload;
      return state;
    case LOGIN:
      state.currentUser = action.data;
      return state;
    case GET_BOOKS:
      state.books = [...action.data];
      return state;
    case ADD_FAVORITE:
      state.currentUser = action.data;
      return state;
    case GET_FAVORITES:
      state.favorites = [...action.data];
      return state;
    case REMOVE_FAVORITE:
      state.currentUser = action.data;
      return state;
    case ADD_WISH:
      state.currentUser = action.data;
      return state;
    case GET_READ:
      state.read = [...action.data];
      return state;
    case GET_WISHED:
      state.wish = [...action.data];
      return state;
    case REMOVE_READ:
      state.currentUser = action.data;
      return state;
    case REMOVE_WISH:
      state.currentUser = action.data;
      return state;
    case ADD_READ:
      state.currentUser = action.data;
      return state;
    case CHECK_SESSION:
      state.currentUser = action.data;
      return state;
    case SIGN_OUT:
      state.currentUser = null;
      return state;
    case GET_USERS:
      state.users = action.data;
      return state;
    default:
      return state;
  }
}

export default rootReducer;