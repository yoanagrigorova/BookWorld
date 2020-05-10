import fetch from 'cross-fetch'

import { ADD_USER, GET_FAVORITES, LOGIN, ADD_FAVORITE, GET_BOOKS, REMOVE_FAVORITE, ADD_WISH, GET_WISHED,
  REMOVE_WISH, ADD_READ, REMOVE_READ, GET_READ, GET_BOOK, ADD_COMMENT } from "../constants";

function addUser(payload) {
  return { type: ADD_USER, payload };
}

function getFavoriteBooks(data){
  return {type:GET_FAVORITES, data}
}

export function createUser(data) {

  return (dispatch) => {
    return fetch('http://localhost:5000/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        return dispatch(addUser(data))
        // dispatch({ type: ADD_USER, data })
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }

}

export function getBooks() {
  return (dispatch) => {
    return fetch('http://localhost:5000/books/all')
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: GET_BOOKS, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }

}

export function getFavorites(userID) {
  return (dispatch) => {
    return fetch('http://localhost:5000/books/favorites?userID='+userID)
      .then((response) => response.json())
      .then((data) => {
        return dispatch(getFavoriteBooks(data))
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }

}

export function removeFavorite(data) {
  return (dispatch) => {
    return fetch('http://localhost:5000/users/removeFavorite', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: REMOVE_FAVORITE, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }

}

export function login(data){
  return (dispatch) => {
    return fetch('http://localhost:5000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: LOGIN, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }
}

export function addToFavorite(data){
  return (dispatch) => {
    return fetch('http://localhost:5000/users/addFavorite', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: ADD_FAVORITE, data})
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

export function addToWish(data){
  return (dispatch) => {
    return fetch('http://localhost:5000/users/addWish', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: ADD_WISH, data})
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

export function getWished(userID) {
  return (dispatch) => {
    return fetch('http://localhost:5000/books/wish?userID='+userID)
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: GET_WISHED, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }

}

export function removeWish(data){
  return (dispatch) => {
    return fetch('http://localhost:5000/users/removeWish', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: REMOVE_WISH, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }
}

export function addToRead(data){
  return (dispatch) => {
    return fetch('http://localhost:5000/users/addRead', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: ADD_READ, data})
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

export function getRead(userID) {
  return (dispatch) => {
    return fetch('http://localhost:5000/books/read?userID=' + userID)
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: GET_READ, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }

}

export function removeRead(data){
  return (dispatch) => {
    return fetch('http://localhost:5000/users/removeRead', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: REMOVE_READ, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }
}

export function getBook(bookID){
  return (dispatch) => {
    return fetch('http://localhost:5000/books/book?bookID='+bookID)
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: GET_BOOK, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }
}

export function addComment(data){
  return (dispatch) => {
    return fetch('http://localhost:5000/comments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: ADD_COMMENT, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }
}