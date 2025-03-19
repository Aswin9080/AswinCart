import { Fragment, useEffect, useState } from "react"
import Sidebar from "./Sidebar"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom"
import { toast } from 'react-toastify'
import { clearError, clearuserUpdated } from "../../slices/userSlice"
import { updateUser, getUser } from "../../actions/userActions"



export default function UpdateUser() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [role, setrole] = useState('')
    const { id: UserId } = useParams()

    const { loading, isUserUpdated, error, user } = useSelector(state => state.userState)
    const { user:authUser } = useSelector(state => state.authState)

    const navigate = useNavigate()
    const dispatch = useDispatch()


    const submitHandler = (e) => {
        e.preventDefault()
        const formdata = new FormData();
        formdata.append('name', name)
        formdata.append('email', email)
        formdata.append('role', role)
        dispatch(updateUser(UserId, formdata))
    }


    useEffect(() => {
        if (isUserUpdated) {
            toast('User Updated Suceesfully', {
                type: 'success',
                position: 'top-right',
                onOpen: () => dispatch(clearuserUpdated())
            })
            return;
        }

        if (error) {
            toast(error, {
                type: 'error',
                position: 'top-right',
                onOpen: () => dispatch(clearError())
            })
        }

        dispatch(getUser(UserId))
    }, [isUserUpdated, error, dispatch, navigate])
    useEffect(() => {

        if (user._id) {
            setName(user.name)
            setEmail(user.email)
            setrole(user.role)

        }
    }, [user._id])
console.log('user._id',user._id,'authUser._id',authUser)
console.log('aaaaaaaaa',user._id === authUser._id)
    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <Fragment>
                    <div className="wrapper my-5">
                        <form className="shadow-lg" encType='multipart/form-data' onSubmit={submitHandler}>
                            <h1 className="mb-4">Update User</h1>

                            <div className="form-group">
                                <label htmlFor="name_field">Name</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price_field">Email</label>
                                <input
                                    type="text"
                                    id="price_field"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}

                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description_field">Role</label>
                                <select value={role}
                                disabled={user._id === authUser._id}
                                    onChange={(e) => setrole(e.target.value)} className="form-control" >
                                    <option value=''>Select</option>
                                    <option value='admin'>Admin</option>
                                    <option value='user'>User</option>
                                </select>
                            </div>

                            <button
                                id="login_button"
                                type="submit"
                                disabled={loading}
                                className="btn btn-block py-3"
                            >
                                UPDATE
                            </button>

                        </form>
                    </div>
                </Fragment>
            </div>
        </div>
    )
}