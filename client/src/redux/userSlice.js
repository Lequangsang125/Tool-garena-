import {createSlice} from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState:{
        users: {
            allUsers:[],
            isFetching:false,
            error:false
        },
    },
    reducers:{
        //lấy toàn bộ user
        getUsersStart: (state) =>{
            state.users.isFetching = true;
        },
        getUsersSuccess: (state,action) =>{
            state.users.isFetching = false;
            state.users.allUsers = action.payload || [];
            state.users.error = false; //lấy dữ liệu thành công thì reset lỗi 
        },
        getUsersFailed: (state) =>{
            state.users.isFetching = false;
            state.users.error = true;
        },
        //xóa user
        deleteUserStart: (state) =>{
            state.users.isFetching = true;
            state.users.error = false;
        },
        deleteUserSuccess: (state,action) =>{
            state.users.isFetching = false;
            state.users.allUsers = state.users.allUsers.filter(user => user._id !== action.payload.id);
            state.users.error = false
        },
        deleteUserFailed: (state) =>{
            state.users.isFetching = false;
            state.users.error = true
        }
    }
})

export const {
    getUsersStart,
    getUsersSuccess,
    getUsersFailed,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailed
} = userSlice.actions;

export default userSlice.reducer