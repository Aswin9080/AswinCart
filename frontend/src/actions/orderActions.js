import { adminOrdersFail, adminOrdersRequest, adminOrdersSuccess, createOrderFail, createOrderRequest, createOrderSuccess, deleteOrdersFail, deleteOrdersRequest, deleteOrdersSuccess, OrderDetailFail, orderDetailRequest, OrderDetailSuccess, updateOrdersFail, updateOrdersRequest, updateOrdersSuccess, userOrdersFail, userOrdersRequest, userOrdersSuccess } from "../slices/orderSlice"
import axios from 'axios'

export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch(createOrderRequest())
    const { data } = await axios.post(`/api/v3/order/new`, order)
    dispatch(createOrderSuccess(data))
  }
  catch (err) {
    dispatch(createOrderFail(err.response.data.message))
  }
}


export const userOrdersAction = async (dispatch) => {

  try {
    dispatch(userOrdersRequest())
    const { data } = await axios.get('/api/v3/myorders')
    dispatch(userOrdersSuccess(data))
  }
  catch (err) {
    dispatch(userOrdersFail(err.response.data.message))
  }
}


export const orderDetail = (id) => async (dispatch) => {

  try {
    dispatch(orderDetailRequest())
    const { data } = await axios.get(`/api/v3/order/${id}`)
    dispatch(OrderDetailSuccess(data))
  }
  catch (err) {
    dispatch(OrderDetailFail(err.response.data.message))
  }
}

export const AdminOrders = async (dispatch) => {

  try {
    dispatch(adminOrdersRequest())
    const { data } = await axios.get('/api/v3/admin/orders')
    dispatch(adminOrdersSuccess(data))
  }
  catch (err) {
    dispatch(adminOrdersFail(err.response.data.message))
  }
}


export const deleteOrders = (id) => async (dispatch) => {

  try {
    dispatch(deleteOrdersRequest())
    const { data } = await axios.delete(`/api/v3/admin/order/${id}`)
    dispatch(deleteOrdersSuccess(data))
  }
  catch (err) {
    dispatch(deleteOrdersFail(err.response.data.message))
  }
}

export const updateOrders = (id,orderData) => async (dispatch) => {

  try {
    dispatch(updateOrdersRequest())
    const { data } = await axios.put(`/api/v3/admin/order/${id}`,orderData)
    dispatch(updateOrdersSuccess(data))
  }
  catch (err) {
    dispatch(updateOrdersFail(err.response.data.message))
  }
}