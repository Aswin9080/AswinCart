import axios from 'axios'
import { adminproductsFail, adminproductsRequest, adminproductsSuccess, productsFail, productsRequest, productsSuccess } from '../slices/productsSlice'
import { productRequest, productSuccess, productFail, createReviewRequest, createReviewSuccess, createReviewFail, newProductRequest, newproductSuccess, newproductFail, deleteProductRequest, deleteproductSuccess, deleteproductFail, updateProductRequest, updateproductSuccess, updateproductFail, reviewsRequest, reviewsSuccess, reviewsFail, deleteReviewRequest, deleteReviewSuccess, deletereviewFail } from '../slices/productSlice'

export const getProducts = (keyword, price, category, rating, currentPage) => async (dispatch) => {
    try {
        dispatch(productsRequest())

        let link = `/api/v1/products?page=${currentPage}`;


        if (keyword) {
            link += `&keyword=${keyword}`
        }
        if (price) {
            link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`
        }

        if (category) {
            link += `&category=${category}`
        }

        if (rating) {
            link += `&ratings=${rating}`
        }
        const { data } = await axios.get(link)

        dispatch(productsSuccess(data))
    }
    catch (error) {
        //hadnleerror
        dispatch(productsFail(error.response.data.message))
        console.log('error')
    }
}



export const getProduct = id => async (dispatch) => {
    try {
        dispatch(productRequest())
        const { data } = await axios.get(`/api/v1/product/${id}`)
        dispatch(productSuccess(data))
    }
    catch (error) {
        //hadnleerror
        dispatch(productFail(error.response.data.message))
    }
}


export const createReview = reviewData => async (dispatch) => {

    try {
        dispatch(createReviewRequest())
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }
        const { data } = await axios.put(`/api/v1/review`, reviewData, config)
        dispatch(createReviewSuccess(data))
    }
    catch (error) {
        //hadnleerror
        dispatch(createReviewFail(error.response.data.message))
    }
}

export const getAdminProducts = async (dispatch) => {
    try {
        dispatch(adminproductsRequest())
        const { data } = await axios.get(`/api/v1/admin/products`)
        dispatch(adminproductsSuccess(data))
    }
    catch (error) {
        //hadnleerror
        dispatch(adminproductsFail(error.response.data.message))

    }
}

export const createNewproduct = (productData) => async (dispatch) => {
    try {
        const config = {
            headers: {
                "Content-type": "multipart/form-data"
            }
        }
        dispatch(newProductRequest())
        const { data } = await axios.post(`/api/v1/admin/product/new`, productData, config)
        dispatch(newproductSuccess(data))
    }
    catch (error) {
        //hadnleerror
        dispatch(newproductFail(error.response.data.message))

    }
}


export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch(deleteProductRequest())
        await axios.delete(`/api/v1/admin/product/${id}`)
        dispatch(deleteproductSuccess())
    }
    catch (error) {
        //hadnleerror
        dispatch(deleteproductFail(error.response.data.message))
    }
}

export const updateproduct = (id, productData) => async (dispatch) => {
    try {
        const config = {
            headers: {
                "Content-type": "multipart/form-data"
            }
        }
        dispatch(updateProductRequest())
        const { data } = await axios.put(`/api/v1/admin/product/${id}`, productData, config)
        dispatch(updateproductSuccess(data))
    }
    catch (error) {
        //hadnleerror
        dispatch(updateproductFail(error.response.data.message))

    }
}


//Reviews
export const getReviews = id => async (dispatch) => {
    try {

        dispatch(reviewsRequest())
        const { data } = await axios.get(`/api/v1/admin/reviews`, { params: { id } })
        dispatch(reviewsSuccess(data))
    }
    catch (error) {
        //hadnleerror
        dispatch(reviewsFail(error.response.data.message))
        console.log('error')
    }
}

export const deleteReview = (productID, id) => async (dispatch) => {
    try {

        dispatch(deleteReviewRequest())
        await axios.delete(`/api/v1/admin/review`, { params: { productID, id } })
        dispatch(deleteReviewSuccess())
    }
    catch (error) {
        //hadnleerror
        dispatch(deletereviewFail(error.response.data.message))
        console.log('error')
    }
}

