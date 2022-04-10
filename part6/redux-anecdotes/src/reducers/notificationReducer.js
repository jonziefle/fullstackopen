import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification(state, action) {
            return action.payload
        },
        hideNotification(state, action) {
            return null
        }
    },
})

const { showNotification, hideNotification } = notificationSlice.actions;

export const setNotification = (content, time) => {
    return dispatch => {
        dispatch(showNotification(content))
        setTimeout(() => {
            dispatch(hideNotification())
        }, time * 1000)
    }
}


export default notificationSlice.reducer