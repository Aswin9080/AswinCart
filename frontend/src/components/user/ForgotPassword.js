import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { forgotPassword, clearAuthError } from "../../actions/userActions"
import { toast } from "react-toastify"


export default function Forgotpassword() {

    const [email, setemail] = useState('')
    const dispatch = useDispatch()
    const {  error, message } = useSelector(state => state.authState)
    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('email', email)
        dispatch(forgotPassword(formData))
    }

    useEffect(() => {
        if (message) {
            toast(message, {
                type: "success",
                position: "top-right"
            })
            setemail('')
            return;
        }

        if (error) {
            toast(error, {
                position: "top-right",
                type: 'error',
                onOpen: () => { dispatch(clearAuthError) }
            })
        }
    },[error,message,dispatch])
    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={submitHandler}>
                    <h1 className="mb-3">Forgot Password</h1>
                    <div className="form-group">
                        <label htmlFor="email_field">Enter Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                        />
                    </div>

                    <button
                        id="forgot_password_button"
                        type="submit"
                        className="btn btn-block py-3">
                        Send Email
                    </button>

                </form>
            </div>
        </div>
    )
}