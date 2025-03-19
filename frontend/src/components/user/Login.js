import { login, clearAuthError } from "../../actions/userActions";
import MetaData from "../layouts/MetaData";
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Link, useNavigate, useLocation } from "react-router-dom"

// import { useNavigate } from 'react-router-dom';
export default function Login() {

    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const { error, isauthenticated } = useSelector(state => state.authState)
    const redirect = location.search ? '/' + location.search.split('=')[1]:'/'
    console.log('redirect',redirect)

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    useEffect(() => {

        if (isauthenticated) {
          
            navigate(redirect)
        }
        if (error) {
            toast(error, {
                position: "top-right",
                type: 'error',
                onOpen: () => { dispatch(clearAuthError) }
            });
        }
    }, [error, isauthenticated, navigate, dispatch,redirect]);


    return (
        <Fragment>
            <MetaData title={`login`} />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-3">Login</h1>
                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={(e) => setemail(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input type="password"
                                id="password_field"
                                className="form-control"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)} />
                        </div>

                        <Link to='/password/forgot' className="float-right mb-4">Forgot Password?</Link>

                        <button id="login_button" type="submit" className="btn btn-block py-3 w-100">
                            LOGIN
                        </button>

                        <Link to='/register' className="float-right mt-3 px-10">New User?</Link>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}