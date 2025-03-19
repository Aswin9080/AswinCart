import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clearAuthError, updatePassword as updatePasswordAction } from "../../actions/userActions"
import { toast } from "react-toastify"


export default function UpdatePassword() {

    const [password, setpassword] = useState('')
    const [oldPassword, setoldPassword] = useState('')
    const { isupdated, error } = useSelector(state => state.authState)
    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('password', password)
        formData.append('oldPassword', oldPassword)
        dispatch(updatePasswordAction(formData))
    }

    useEffect(() => {
        if (isupdated) {
            toast('Password updated successfully', {
                type: 'success',
                position: "bottom-center"
            })
            setpassword('')
            setoldPassword('')
            return;
        }

        if (error) {
            toast(error, {
                position: "bottom-center",
                type: 'error',
                onOpen: () => { dispatch(clearAuthError) }
            })
            return
        }

    }, [dispatch, error, isupdated])
    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={submitHandler}>
                    <h1 className="mt-2 mb-5">Update Password</h1>
                    <div className="form-group">
                        <label htmlFor="old_password_field">Old Password</label>
                        <input type="password" id="old_password_field" className="form-control" value={oldPassword} onChange={(e) => setoldPassword(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="new_password_field">New Password</label>
                        <input type="password" id="new_password_field" className="form-control" value={password} onChange={(e) => setpassword(e.target.value)} />
                    </div>

                    <button type="submit" className="btn update-btn btn-block mt-4 mb-3">Update Password</button>
                </form>
            </div>
        </div>
    )
}