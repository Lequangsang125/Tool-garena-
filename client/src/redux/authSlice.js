import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: "auth",
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false
        },
        register: {
            isFetching: false,
            error: false,
            success: false,
        },

    },
    reducers: {
        // Trạng thái đăng nhập
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },

        // Trạng thái đăng ký
        registerStart: (state) => {
            state.register.isFetching = true;
        },
        registerSuccess: (state) => {
            state.register.isFetching = false;
            state.register.error = false;
            state.register.success = true;
        },
        registerFailed: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },

        // Trạng thái đăng xuất
        logoutStart: (state) => {
            state.login.isFetching = true;
            state.login.error = false; // Reset lỗi trước khi đăng xuất
        },

        logoutSuccess: (state) => {
            state.login.isFetching = false;
            state.login.error = false;
            state.login.currentUser = null; // Xóa thông tin user
            state.login.accessToken = null; // Xóa luôn accessToken nếu lưu trong Redux
        },

        logoutFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },

    }
});

// Export actions
export const {
    loginStart,
    loginSuccess,
    loginFailed,
    registerStart,
    registerSuccess,
    registerFailed,
    logoutStart,
    logoutSuccess,
    logoutFailed // ✅ Thiếu logout actions nên thêm vào
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
