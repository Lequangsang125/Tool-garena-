import {createSlice} from "@reduxjs/toolkit"

const spamSlice = createSlice({
    name: "spam",
    initialState: {
        count: 0, // so lan dung dich vu,
        isProcessing: false, // dang spam hay khong,
        error: null
    },
    reducers:{
        spamStart: (state) =>{
            state.isProcessing = true;
            state.error = false;
        },
        spamSucces: (state) =>{
            state.count += 1;
            state.isProcessing = false;
        },
        spamFailed: (state,action) =>{
            state.error = action.payload,
            state.isProcessing = false;
        },
        resetSpam:(state) =>{
            state.count = 0;
            state.isProcessing = false;
            state.error = null;
        }
    }
})
export const { spamStart, spamSuccess, spamFailed, resetSpam } = spamSlice.actions;
export default spamSlice.reducer;