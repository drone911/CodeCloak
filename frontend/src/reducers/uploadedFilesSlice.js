import { createSlice } from '@reduxjs/toolkit'

export const uploadedFilesSlice = createSlice({
    name: 'uploadedFileHashes',
    initialState: {
        value: localStorage.getItem("uploadedFileHashes") ? JSON.parse(localStorage.getItem("uploadedFileHashes")) : []
    },
    reducers: {
        appendValue: (state, action) => {
            if (state.value.length >= 5) {
                state.value.shift();
            }
            state.value.push(action.payload);
            // Deduplicate array
            state.value = [...new Set(state.value)];
        }
    }
})

export const { appendValue } = uploadedFilesSlice.actions
export const selectUploadedFileHashesArray = (state) => state.uploadedFileHashes.value;
export default uploadedFilesSlice.reducer

