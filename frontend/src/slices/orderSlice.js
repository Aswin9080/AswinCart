import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        loading:false,
        orderDetails:{},
        userOrder:[],
        adminOrders:[],
        isOrderDeleted:false,
        isOrderUpdated:false
    },
    reducers: {
       createOrderRequest(state,action){
        return{
            ...state,
            loading:true
        }
       },
       createOrderSuccess(state,action){
        return{
            ...state,
            loading:false,
            orderDetails:action.payload.order
        }
       },
       createOrderFail(state,action){
        return{
            ...state,
            loading:false,
            error:action.payload
        }
       },
       clearOrderError(state,action){
        return{
            ...state,
            error:null
        }
       },
       userOrdersRequest(state,action){
        return{
            ...state,
            loading:true
        }
       },
       userOrdersSuccess(state,action){
        return{
            ...state,
            loading:false,
            userOrder:action.payload.orders
        }
       },
       userOrdersFail(state,action){
        return{
            ...state,
            loading:false,
            error:action.payload
        }
       },
       adminOrdersRequest(state,action){
        return{
            ...state,
            loading:true,
        }
       },
       adminOrdersSuccess(state,action){
        return{
            ...state,
            loading:false,
            adminOrders:action.payload.orders,
        }
       },
       adminOrdersFail(state,action){
        return{
            ...state,
            loading:false,
            error:action.payload
        }
       },
       deleteOrdersRequest(state,action){
        return{
            ...state,
            loading:true
        }
       },
       deleteOrdersSuccess(state,action){
        return{
            ...state,
            loading:false,
            isOrderDeleted:true,

        }
       },
       deleteOrdersFail(state,action){
        return{
            ...state,
            loading:false,
            error:action.payload
        }
       },
       clearOrderDeleted(state,action){
        return{
            isOrderDeleted:false
        }
       },
       updateOrdersRequest(state,action){
        return{
            ...state,
            loading:true,
            isOrderUpdated:false
        }
       },
       updateOrdersSuccess(state,action){
        return{
            ...state,
            loading:false,
            isOrderUpdated:true
        }
       },
       updateOrdersFail(state,action){
        return{
            ...state,
            loading:false,
            isOrderUpdated:false,
            error:action.payload
        }
       },
       clearOrderUpdated(state,action){
        return{
            isOrderUpdated:false,
        }
       },

       orderDetailRequest(state,action){
        return{
            ...state,
            loading:true,

        }
       },
       OrderDetailSuccess(state,action){
        return{
            ...state,
            loading:false,
  
            orderDetails:action.payload.order
        }
       },
       OrderDetailFail(state,action){
        return{
            ...state,
            loading:false,
            error:action.payload
        }
       },
       clearError(state, action) {
        return {
            ...state,
            error: null
        }
    },

       

    } 
});


const { actions, reducer } = orderSlice

export const {
    createOrderRequest,
    createOrderSuccess,
    createOrderFail,
    clearOrderError,
    userOrdersRequest,
    userOrdersSuccess,
    userOrdersFail,
    orderDetailRequest,
    OrderDetailSuccess,
    OrderDetailFail,
    adminOrdersRequest,
    adminOrdersSuccess,
    adminOrdersFail,
    updateOrdersRequest,
    updateOrdersSuccess,
    updateOrdersFail,
    deleteOrdersRequest,
    deleteOrdersSuccess,
    deleteOrdersFail,
    clearOrderUpdated,
    clearOrderDeleted,
    clearError
} = actions
export default reducer