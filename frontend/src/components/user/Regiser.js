
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { clearAuthError, register } from '../../actions/userActions'
import { toast } from 'react-toastify'
import {useNavigate} from 'react-router-dom'


export default function Register() {

    const [useData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
    })
   
    const [avatar, setavatar] = useState("")
    const [avatorPreview, setavatorPreview] = useState("/images/default_avatar.png")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error,isauthenticated } = useSelector(state => state.authState)

    const onChangeHandler = (e) => {
        if (e.target.name === 'avatar') {

            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setavatorPreview(reader.result)
                    console.log('register',e.target.files[0])
                    setavatar(e.target.files[0])
                }
            }
            //binary data vagaum base 64 ra irukum 
            reader.readAsDataURL(e.target.files[0])
        }
        else {
            setUserData(
                { ...useData, [e.target.name]: e.target.value }
            )

        }
    }

    const onSubmitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("name", useData.name)
        formData.append("email", useData.email)
        formData.append("password", useData.password)
        formData.append("avatar", avatar)
        dispatch(register(formData))
    }

    useEffect(() => {
        
        if (isauthenticated){
            navigate('/')
        }
        if (error) {
            toast(error, {
                position: "top-right",
                type: 'error',
                onOpen: () => { dispatch(clearAuthError) }
            });
        }


    }, [error,isauthenticated,dispatch,navigate])
    return (
        <Fragment>
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" encType='multipart/form-data' onSubmit={onSubmitHandler}>
                        <h1 className="mb-3">Register</h1>

                        <div className="form-group">
                            <label htmlFor="email_field">Name</label>
                            <input name='name' type="name" id="name_field" className="form-control" value={useData.name} onChange={onChangeHandler} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input name='email' type="email" id="email_field" className="form-control" value={useData.email} onChange={onChangeHandler} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input name='password' type="password" id="password_field" className="form-control" value={useData.password} onChange={onChangeHandler} />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='avatar_upload'>Avatar</label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl'>
                                        <img src={avatorPreview} className='rounded-circle' alt='Avatar' />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input onChange={onChangeHandler} type='file' name='avatar' className='custom-file-input' id='customFile' />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Browse
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button id="register_button" type="submit" className="btn btn-block py-3" disabled={loading}>
                            REGISTER
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}