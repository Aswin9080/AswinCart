import axios from "axios"
import {
    clearError,
    forgotPasswordFail,
    forgotPasswordRequest,
    forgotPasswordSuccess,
    loadUserFail,
    loadUserRequest,
    loadUserSuccess,
    loginFail,
    loginRequest,
    loginSuccess,
    logOutFail,
    logOutSuccess,
    registerFail,
    registerRequest,
    registerSuccess,
    resetPasswordFail,
    resetPasswordRequest,
    resetPasswordSuccess,
    updatePasswordFail,
    updatePasswordRequest,
    updatePasswordSuccess,
    updateProfileFail,
    updateProfileRequest,
    updateProfileSuccess
} from "../slices/authSlice"
import { deleteUserRequest, deleteUserSuccess, updateUserFail, updateUserRequest, updateUserSuccess, userFail, userRequest, usersFail, usersRequest, usersSuccess, userSuccess } from "../slices/userSlice"

export const login = (email, password) => async (dispatch) => {

    try {
        dispatch(loginRequest())
        const { data } = await axios.post(`/api/v2/login`, { email, password })
        dispatch(loginSuccess(data))
    }
    catch (err) {
        // console.log('login auth',err.response.data.message)
        dispatch(loginFail(err.response.data.message))
    }
}

export const clearAuthError = (dispatch) => {
    dispatch(clearError())
}

export const register = (userdata) => async (dispatch) => {

    try {
        dispatch(registerRequest())

        //images add panradhunala ipdi kudknum 
        const config = {
            headers: {
                'Content-type': 'multipart/form-data'
            }
        }
        // console.log('userdata register', userdata)
        const { data } = await axios.post(`/api/v2/register`, userdata, config)
        dispatch(registerSuccess(data))
    }
    catch (err) {
        // console.log('register auth ', err)
        dispatch(registerFail(err.response.data.message))
    }
}

export const loadUser = () => async (dispatch) => {
    // console.log('aa')

    try {
        dispatch(loadUserRequest())
        const { data } = await axios.get(`/api/v2/myprofile`)
        dispatch(loadUserSuccess(data))
    }
    catch (err) {
        // console.log('loadUser  ', err)
        dispatch(loadUserFail(err.response.data.message))
    }
}

export const logout = () => async (dispatch) => {

    try {
        await axios.get(`/api/v2/logout`)
        dispatch(logOutSuccess())
    }
    catch (err) {
        // console.log('loadUser  ', err)
        dispatch(logOutFail(err.response.data.message))
    }
}



export const updateProfiles = (name, email, avatar) => async (dispatch) => {
    try {
        dispatch(updateProfileRequest());
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        };

        const { data } = await axios.put(`/api/v2/updateProfile`, { name, email, avatar }, config);
        dispatch(updateProfileSuccess(data));
    } catch (error) {
        dispatch(updateProfileFail(error.response?.data?.message || "Update failed"));
    }
};

export const updatePassword = (formData) => async (dispatch) => {
    try {
        dispatch(updatePasswordRequest());
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        await axios.put(`/api/v2/password/change`, formData,config);
        dispatch(updatePasswordSuccess());
    } catch (error) {
        dispatch(updatePasswordFail(error.response?.data?.message || "Update failed"));
    }
};


export const forgotPassword = (formData) => async (dispatch) => {

    try {
        dispatch(forgotPasswordRequest());
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        const {data} = await axios.post(`/api/v2/password/forgot`, formData,config);
        dispatch(forgotPasswordSuccess(data));
    } catch (error) {
        dispatch(forgotPasswordFail(error.response?.data?.message || "Update failed"));
    }
};

export const resetPassword = (formData ,token) => async (dispatch) => {

    try {
        dispatch(resetPasswordRequest());
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        const {data} = await axios.post(`/api/v2/password/reset/${token}`, formData,config);
        dispatch(resetPasswordSuccess(data));
    } catch (error) {
        dispatch(resetPasswordFail(error.response?.data?.message || "Update failed"));
    }
};

export const getUsers = async (dispatch) => {

    try {
        dispatch(usersRequest())
        console.log('---------')
        const { data } = await axios.get(`/api/v2/admin/user`)
        dispatch(usersSuccess(data))
    }
    catch (err) {
        dispatch(usersFail(err.response.data.message))
    }
}



export const getUser = (id) => async (dispatch) => {

    try {
        dispatch(userRequest())
        const { data } = await axios.get(`/api/v2/admin/user/${id}`)
        dispatch(userSuccess(data))
    }
    catch (err) {
        dispatch(userFail(err.response.data.message))
    }
}

export const deleteUser = (id) => async (dispatch) => {

    try {
        dispatch(deleteUserRequest())
         await axios.delete(`/api/v2/admin/user/${id}`)
        dispatch(deleteUserSuccess())
    }
    catch (err) {
        dispatch(deleteUserSuccess(err.response.data.message))
    }
}

export const updateUser = (id,formData) => async (dispatch) => {
    try {
        dispatch(updateUserRequest());
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        await axios.put(`/api/v2/admin/user/${id}`, formData,config);
        dispatch(updateUserSuccess());
    } catch (error) {
        dispatch(updateUserFail(error.response?.data?.message || "Update failed"));
    }
};