import { ADD_USER } from "../constants";
import { LOGIN, GET_FAVORITES, ADD_FAVORITE, GET_BOOKS , REMOVE_FAVORITE, ADD_WISH} from "../constants";

const initialState = {
  currentUser: null,
  books: [],
  favorites: []
};

function rootReducer(state = initialState, action) {
  if (action.type === ADD_USER) {
    state.currentUser = action.payload;
  }
  if (action.type === LOGIN) {
    state.currentUser = action.data;
  }
  if (action.type === GET_BOOKS) {
    state.books = [...action.data];
  }
  if (action.type === ADD_FAVORITE) {
    state.currentUser = action.data;
  }
  if (action.type === GET_FAVORITES) {
    console.log(action.data)
    state.favorites = [...action.data];
  }
  if (action.type === REMOVE_FAVORITE) {
    state.currentUser = action.data;
  }
  if (action.type === ADD_WISH) {
    console.log(action.data)
    state.currentUser = action.data;
  }
  return state;
}

export default rootReducer;