import { createSlice,  } from "@reduxjs/toolkit";

const walletSlice = createSlice({
    name: 'wallet',
    initialState: {
        balance: 0,  // Số dư ví
        isFetching: false,
        error: null
    },
    reducers: {
        setBalance: (state, action) => {
            state.balance = action.payload;  // Cập nhật số dư từ backend
        },
        deductCoinsStart: (state) => {
            state.isFetching = true;
            state.error = null;
        },
        deductCoinsSuccess: (state, action) => {
            state.balance -= action.payload;  // Trừ tiền nếu API thành công
            state.isFetching = false;
        },
        deductCoinsFailed: (state, action) => {
            state.isFetching = false;
            state.error = action.payload;
        }
    }
});

export const { setBalance, deductCoinsStart, deductCoinsSuccess, deductCoinsFailed } = walletSlice.actions;
export default walletSlice.reducer;
