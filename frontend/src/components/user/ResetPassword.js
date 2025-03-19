import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthError, resetPassword } from "../../actions/userActions";
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from "react-toastify";

export default function ResetPassword() {

    const [password, setpassword] = useState()
    const [conPassword, setconPassword] = useState()
    const dispatch = useDispatch()
    const { isauthenticated ,error} = useSelector(state => state.authState)
    const navigate = useNavigate()
    const {token} = useParams()

    
    const submitHandler = (e) => {
        e.preventDefault()
        const formdata = new FormData();
        formdata.append('password', password)
        formdata.append('confirmPassword', conPassword) 
        dispatch(resetPassword(formdata,token))
    }

    useEffect(() => {

        if (isauthenticated) {
            navigate('/')
            toast('Password Reset sucess', {
                type: "success",
                position: "top-right"
            })
        }


        if (error) {
            toast(error, {
                position: "top-right",
                type: 'error',
                onOpen: () => { dispatch(clearAuthError) }
            })
        }
    })
    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={submitHandler}>
                    <h1 className="mb-3">New Password</h1>

                    <div className="form-group">
                        <label htmlFor="password_field">Password</label>
                        <input
                            type="password"
                            id="password_field"
                            className="form-control"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm_password_field">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_password_field"
                            className="form-control"
                            value={conPassword}
                            onChange={(e) => setconPassword(e.target.value)}
                        />
                    </div>

                    <button
                        id="new_password_button"
                        type="submit"
                        className="btn btn-block py-3">
                        Set Password
                    </button>
                </form>
            </div>
        </div>
    );
}
