import { configureStore } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk'

import loggerMiddleware from './middleware/logger'
import uploadedFilesReducer from './reducers/uploadedFilesSlice'

export default function createStore(preloadedState) {
    const middlewares = [loggerMiddleware, thunk]

    const reducers = {
        uploadedFileHashes: uploadedFilesReducer
    }
    const store = configureStore({ reducer: reducers }, undefined, middlewares)

    return store
}