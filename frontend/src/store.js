import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk'; 
import productsreducer from './slices/productsSlice'
import productreducer from './slices/productSlice'
import authreducer from "./slices/authSlice"
import cartreducer from "./slices/cartSlice"
import orderreducer from './slices/orderSlice'
import userreducer from './slices/userSlice'
const reducer = combineReducers({
    productsState:productsreducer,
    productState:productreducer,
    authState:authreducer,
    cartState:cartreducer,
    orderState :orderreducer,
    userState:userreducer
});

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),

});

export default store;
