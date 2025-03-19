import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'product',
    initialState: {
        loading: false,
        product: {},
        isReviewSubmitted: false,
        isProductCreated: false,
        isProductDeleted: false,
        isProductUpdated: false,
        isReviewDeleted: false,
        reviews: {}
    },
    reducers: {
        productRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        productSuccess(state, action) {
            return {
                ...state,
                loading: false,
                product: action.payload.product
            }

        },
        productFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        createReviewRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        createReviewSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isReviewSubmitted: true
            }
        },
        createReviewFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },

        clearReviewSubmitted(state, action) {
            return {
                ...state,
                isReviewSubmitted: false
            }
        },
        clearError(state, action) {
            return {
                ...state,
                error: null
            }
        },
        clearProduct(state, action) {
            return {
                ...state,
                loading: false,
                product: {}
            }
        }, newProductRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        newproductSuccess(state, action) {
            return {
                ...state,
                loading: false,
                product: action.payload.product,
                isProductCreated: true
            }

        },
        newproductFail(state, action) {
            return {
                ...state,
                loading: false,
                isProductCreated: false,
                error: action.payload
            }
        },
        clearProductCreated(state, action) {
            return {
                ...state,
                isProductCreated: false
            }
        }
        , updateProductRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        updateproductSuccess(state, action) {
            return {
                ...state,
                loading: false,
                product: action.payload.product,
                isProductUpdated: true
            }

        },
        updateproductFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        clearProductUpdated(state, action) {
            return {
                ...state,
                isProductUpdated: false,

            }
        }
        , deleteProductRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        deleteproductSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isProductDeleted: true
            }

        },
        deleteproductFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        clearProductDeleted(state, action) {
            return {
                ...state,
                isProductDeleted: false
            }
        },
        reviewsRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        reviewsSuccess(state, action) {
            return {
                ...state,
                loading: false,
                reviews: action.payload.reviews
            }

        },
        reviewsFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        }
        , deleteReviewRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        deleteReviewSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isReviewDeleted: true
            }

        },
        deletereviewFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        clearReviewDeleted(state, action) {
            return {
                ...state,
                isReviewDeleted: false
            }
        },

    }
})


const { actions, reducer } = productSlice

export const { productRequest,
    productSuccess,
    productFail,
    createReviewRequest,
    createReviewSuccess,
    createReviewFail,
    clearError,
    clearReviewSubmitted,
    clearProduct,
    newProductRequest,
    newproductSuccess,
    newproductFail,
    clearProductCreated,
    deleteProductRequest,
    deleteproductSuccess,
    deleteproductFail,
    clearProductDeleted,
    updateProductRequest,
    updateproductSuccess,
    updateproductFail,
    clearProductUpdated,
    reviewsRequest,
    reviewsSuccess,
    reviewsFail,
    deleteReviewRequest,
    deleteReviewSuccess,
    deletereviewFail,
    clearReviewDeleted } = actions
export default reducer