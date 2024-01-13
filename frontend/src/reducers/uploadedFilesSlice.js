import { createSlice } from '@reduxjs/toolkit'

export const uploadedFilesSlice = createSlice({
    name: 'uploadedFileHashes',
    initialState: {
        value: localStorage.getItem("uploadedFileHashes") ? JSON.parse(localStorage.getItem("uploadedFileHashes")) : []
    },
    reducers: {
        appendValue: (state, action) => {
            state.value.push(action.payload);
        }
    }
})

export const { appendValue } = uploadedFilesSlice.actions
export const selectUploadedFileHashesArray = (state) => state.uploadedFileHashes.value;
export default uploadedFilesSlice.reducer

