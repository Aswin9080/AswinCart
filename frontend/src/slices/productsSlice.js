import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        loading: false
    },
    reducers: {
        productsRequest(state, action) {
            state.loading = true;
        },
        productsSuccess(state, action) {
            state.loading = false;
            state.products = action.payload.product;
            state.productsCount = action.payload.count
            state.resperpage = action.payload.resperpage
        },
        productsFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        adminproductsRequest(state, action) {
            state.loading = true;
        },
        adminproductsSuccess(state, action) {
            state.loading = false;
            state.products = action.payload.products;
        },
        adminproductsFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        }
        ,
        clearError(state, action) {
            state.loading = false;
            state.error = null;
        }
    }

});


const { actions, reducer } = productsSlice

export const { productsRequest,
    productsSuccess,
    productsFail,
    adminproductsRequest,
    adminproductsSuccess,
    adminproductsFail,
    clearError } = actions
export default reducer