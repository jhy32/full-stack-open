import { createSlice } from '@reduxjs/toolkit'
import {useSelector} from 'react-redux'
const notificationReducer = (state = null, action) => {
    switch (action.type) {
      case 'SET_NOTIFICATION':
        return action.notification
      case 'REMOVE_NOTIFICATION':
        if (action.notification === state) {
            return null
        }
        return state
      default:
        return state 
    }
}
  
  export const setNotification = (notification) => {
    return {
      type: 'SET_NOTIFICATION',
      notification: notification,
    }
  }

  export const removeNotification = (notification) => {
    return {
      type: 'REMOVE_NOTIFICATION',
      notification: notification 
    }
  }

  export const setAndRemoveNotification = (notification, duration) => {
    return async dispatch => {
        dispatch(setNotification(notification))
        //basically find some way to check on the current notification, if it is not equal to the original notification, then do not remove notification
        
        setTimeout(() =>
                        dispatch(removeNotification(notification)), duration*1000)
    }
  }


  
  export default notificationReducer