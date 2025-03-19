import React from "react"
import Search from "./Search"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Dropdown, Image } from "react-bootstrap";
import { logout } from "../../actions/userActions";

export default function Header() {
    const { isauthenticated, user } = useSelector(state => state.authState)
    const { items: cartItems } = useSelector(state => state.cartState)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logOutHandler = () => {
        dispatch(logout())
    }

    return (
        <nav className="navbar row">
            <div className="col-12 col-md-3">
                <div className="navbar-brand">
                    <Link to={'/'}> <img width="150px" src="/images/logo.png" alt="Logo" /></Link>
                </div>
            </div>

            <div className="col-12 col-md-6 mt-2 mt-md-0">
                <Search />
            </div>

            <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                {
                    isauthenticated ?
                        (
                            <Dropdown>
                                <Dropdown.Toggle variant="default text-white pr-5" id='dropdown-basic'>
                                    <figure className='avatar avatar-nav'>
                                        {/* ?? null kulasing */}
                                        <Image width="50px" src={user.avatar ?? './images/default_avatar.png'} />
                                        <span>{user.name}</span>
                                    </figure>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {user.role === 'admin' && <Dropdown.Item className="text-danger" onClick={() => navigate('/admin/dashboard')}>Dashboard</Dropdown.Item>                                }
                                    <Dropdown.Item className="text-dark" onClick={() => { navigate("/myprofile") }}>Profile</Dropdown.Item>
                                    <Dropdown.Item className="text-danger" onClick={() => navigate('/orders')}>Orders</Dropdown.Item>

                                    <Dropdown.Item className="text-danger" onClick={logOutHandler}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) :
                        <Link to={'/login'} className="btn" id="login_btn">Login</Link>

                }
                <Link to='/cart' id="cart" className="ml-3">Cart</Link>
                <span className="ml-1" id="cart_count">{cartItems.length}</span>
            </div>
        </nav>
    )
}