import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: true,
        isauthenticated: false
    },
    reducers: {
        loginRequest(state, action) {
            return {
                ...state,
                loading: true

            }

        },
        loginSuccess(state, action) {
            state.loading = false
            state.isauthenticated = true
            state.user = action.payload.user

        },

        loginFail(state, action) {
            state.loading = false
            state.isauthenticated = false
            state.error = action.payload;
        },

        clearError(state, action) {
            return {
                ...state,
                error: null
            }
        },

        registerRequest(state, action) {
            return {
                ...state,
                loading: true
            }

        },
        registerSuccess(state, action) {
            state.loading = false
            state.isauthenticated = true
            state.user = action.payload.user

        },

        registerFail(state, action) {
            state.loading = false
            state.error = action.payload;
        },

        loadUserRequest(state, action) {
            return {
                ...state,
                isauthenticated: false,
                loading: true
            }

        },
        loadUserSuccess(state, action) {
            state.loading = false
            state.isauthenticated = true
            state.user = action.payload.user

        },

        loadUserFail(state, action) {
            state.loading = false
            state.isauthenticated = false
        },

        logOutSuccess(state, action) {
            state.loading = false
            state.isauthenticated = false
        },

        logOutFail(state, action) {
            state.loading = false
            state.isauthenticated = false
            state.error = action.payload;
        },
        
        updateProfileRequest(state, action) {
            return {
                ...state,
                loading: true,
                isupdated:false
            }
        },
        updateProfileSuccess(state, action) {
            state.loading = false
            state.isauthenticated = true
            state.user = action.payload.user
            state.isupdated =true
        },

        updateProfileFail(state, action) {
            state.loading = false
            state.isauthenticated = false
            state.error = action.payload;
        },

        clearUpdateProfile(state, action) {
            state.loading = false
            state.isupdated = false
        },

        updatePasswordRequest(state, action) {
            return {
                ...state,
                loading: true,
                isupdated:false
            }
        },
        updatePasswordSuccess(state, action) {
            state.loading = false
            state.isauthenticated = true
            state.isupdated =true
        },

        updatePasswordFail(state, action) {
            state.loading = false
            state.error = action.payload;
        },
        forgotPasswordRequest(state, action) {
            return {
                ...state,
                loading: true,
                message:null
            }
        },
        forgotPasswordSuccess(state, action) {
            return{
                ...state,
                loading:false,
                message :action.payload.message
            }
        },

        forgotPasswordFail(state, action) {
            return{
                ...state,
                loading:false,
                error : action.payload
            }
        },
        resetPasswordRequest(state, action) {
            return {
                ...state,
                loading: true,
            }
        },
        resetPasswordSuccess(state, action) {
            return{
                ...state,
                loading:false,
                isauthenticated:true,
                user :action.payload.user
            }
        },

        resetPasswordFail(state, action) {
            return{
                ...state,
                loading:false,
                error : action.payload
            }
        }
    }
});


const { actions, reducer } = authSlice

export const { loginRequest,
    loginSuccess,
    loginFail,
    clearError,
    registerRequest,
    registerSuccess,
    registerFail,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail,
    logOutSuccess,
    logOutFail,
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFail,
    clearUpdateProfile,
    updatePasswordRequest,
    updatePasswordSuccess,
    updatePasswordFail,
    forgotPasswordRequest,
    forgotPasswordSuccess,
    forgotPasswordFail,
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordFail
 } = actions
export default reducer