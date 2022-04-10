import { createSlice } from '@reduxjs/toolkit'

const initialState = null
let timer = null

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
        clearTimeout(timer)
        dispatch(showNotification(content))
        timer = setTimeout(() => {
            dispatch(hideNotification())
        }, time * 1000)
    }
}


export default notificationSlice.reducer