import fetch from 'cross-fetch'

import { ADD_USER, GET_FAVORITES, LOGIN, ADD_FAVORITE, GET_BOOKS, REMOVE_FAVORITE, ADD_WISH, GET_WISHED,
  REMOVE_WISH, ADD_READ, REMOVE_READ, GET_READ, GET_BOOK, ADD_COMMENT, CHECK_SESSION, SIGN_OUT, RATE_BOOK, CHANGE_RATING,
  GET_USERS, SEND_NOTIFICATION, GET_NOTIFICATIONS, MARK_AS_READ, DELETE_COMMENT, CREATE_BOOK } from "../constants";

function addUser(payload) {
  return { type: ADD_USER, payload };
}

function getFavoriteBooks(data){
  return {type:GET_FAVORITES, data}
}

export function createUser(data) {

  return (dispatch) => {
    return fetch('http://localhost:5000/api/users/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        return dispatch(addUser(data))
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }

}

export function getUsers() {
  return (dispatch) => {
    return fetch('http://localhost:5000/api/users/', {
      method: "GET",
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: GET_USERS, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }

}

export function getBooks() {
  return (dispatch) => {
    return fetch('http://localhost:5000/api/books/', {
      method: "GET",
      credentials: 'include'
    })
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

export function createBook(data) {
  return (dispatch) => {
    return fetch('http://localhost:5000/api/books/', {
      method: "POST",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: CREATE_BOOK, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }

}

export function getFavorites() {
  return (dispatch) => {
    return fetch('http://localhost:5000/api/books/favorites', {
      method: "GET",
      credentials: 'include'
    })
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

export function rateBook(data) {
  return (dispatch) => {
    return fetch('http://localhost:5000/api/books/rate/'+data.bookID, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: RATE_BOOK, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }

}

export function changeRating(data) {
  console.log(data)
  return (dispatch) => {
    return fetch('http://localhost:5000/api/books/changeRating/' + data.bookID, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: CHANGE_RATING, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }

}

export function removeFavorite(data) {
  return (dispatch) => {
    return fetch('http://localhost:5000/api/users/removeFavorite/'+data.bookID, {
      method: 'PUT',
      credentials: 'include'
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
    return fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      credentials: 'include',
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
    return fetch('http://localhost:5000/api/users/addFavorite/' + data.bookID, {
      method: 'PUT',
      credentials: 'include'
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
    return fetch('http://localhost:5000/api/users/addWish/' + data.bookID, {
      method: 'PUT',
      credentials: 'include',
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

export function getWished() {
  return (dispatch) => {
    return fetch('http://localhost:5000/api/books/wish', {
      method: "GET",
      credentials: 'include'
    })
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
    return fetch('http://localhost:5000/api/users/removeWish/' + data.bookID, {
      method: 'PUT',
      credentials: 'include',
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
    return fetch('http://localhost:5000/api/users/addRead/' + data.bookID, {
      method: 'PUT',
      credentials: 'include',
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
    return fetch('http://localhost:5000/api/books/read', {
      method: "GET",
      credentials: 'include'
    })
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
    return fetch('http://localhost:5000/api/users/removeRead/' + data.bookID, {
      method: 'PUT',
      credentials: 'include',
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
    return fetch('http://localhost:5000/api/books/'+bookID, {
      method: "GET",
      credentials: 'include'
    })
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

export function checkSession(){
  return (dispatch) => {
    return fetch('http://localhost:5000/api/users/checkSession', {
      method: "GET",
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: CHECK_SESSION, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }
}

export function signOut(){
  return (dispatch) => {
    return fetch('http://localhost:5000/api/users/signOut', {
      method: "GET",
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: SIGN_OUT, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }
}

export function addComment(data){
  return (dispatch) => {
    return fetch('http://localhost:5000/api/comments/', {
      method: 'POST',
      credentials: 'include',
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

export function deleteComment(id){
  return (dispatch) => {
    return fetch('http://localhost:5000/api/comments/' + id, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: DELETE_COMMENT, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }
}

export function sendNotification(data) {
  console.log(data)
  return (dispatch) => {
    return fetch('http://localhost:5000/api/notifications/' + data.userID, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: SEND_NOTIFICATION, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }

}

export function getNotifications() {
  return (dispatch) => {
    return fetch('http://localhost:5000/api/notifications/', {
      method: 'GET',
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: GET_NOTIFICATIONS, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }

}

export function markAsRead(id) {
  return (dispatch) => {
    return fetch('http://localhost:5000/api/notifications/markAsRead/'+id, {
      method: 'PUT',
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        return dispatch({type: MARK_AS_READ, data})
      })
      .catch((error) => {
        console.log(error)
        console.error('Error:', error);
      });
  }

}