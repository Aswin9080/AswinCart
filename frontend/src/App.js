import './App.css';
import Home from './components/Home';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import ProductDetails from './components/product/productDetails';
import ProductSearch from './components/product/productSearch';
import Login from './components/user/Login';
import Register from './components/user/Regiser';
import { useEffect } from 'react';
import store from './store'
import { loadUser } from './actions/userActions';
import Profile from './components/user/Profile';
import ProtectedRoute from './components/route/ProtectedRoute';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import Forgotpassword from './components/user/ForgotPassword';
import ResetPassword from './/components/user/ResetPassword';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import OrderSucess from './components/cart/OrderSucess';
import Payment from './components/cart/Payment';
import UserOrders from './components/order/UserOrders';
import OrderDetail from './components/order/OrderDetail';
import Dashboard from './components/admin/Dashboard';
import ProductList from './components/admin/ProductList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrderList from './components/admin/OrderList';
import UpdateOrder from './components/admin/UpdateOrder';
import UserList from  './components/admin/UserList'
import UpdateUser from './components/admin/UpdateUser';
import ReviewList from './components/admin/ReviewList';


function App() {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Router>
      <div className="App">
        <HelmetProvider>
          <Header />
          <div className="container container-fluid">
            <ToastContainer theme='dark' />
            <Routes>
              <Route path='/' element={<Home />}></Route>
              <Route path='/product/:id' element={<ProductDetails />}></Route>
              <Route path='/search/:keyword' element={<ProductSearch />}></Route>
              <Route path='/login' element={<Login />}></Route>
              <Route path='/register' element={<Register />}></Route>
              <Route path='/myprofile' element={<ProtectedRoute><Profile /></ProtectedRoute>}></Route>
              <Route path='/myprofile/update' element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>}></Route>
              <Route path='/myprofile/update/password' element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>}></Route>
              <Route path='/password/forgot' element={<Forgotpassword />}></Route>
              <Route path='/password/reset/:token' element={<ResetPassword />}></Route>
              <Route path='/cart' element={<Cart />}></Route>
              <Route path='/shipping' element={<ProtectedRoute><Shipping /></ProtectedRoute>}></Route>
              <Route path='/order/confirm' element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>}></Route>
              <Route path='/payment' element={<ProtectedRoute><Payment /></ProtectedRoute>}></Route>
              <Route path='/order/success' element={<ProtectedRoute><OrderSucess /></ProtectedRoute>}></Route>
              <Route path='/orders' element={<ProtectedRoute><UserOrders /></ProtectedRoute>}></Route>
              <Route path='/order/:id' element={<ProtectedRoute><OrderDetail /></ProtectedRoute>}></Route>
            </Routes>
          </div>
          {/* Admin routs */}
          <Routes>
            <Route path='/admin/dashboard' element={<ProtectedRoute isAdmin={true}><Dashboard /></ProtectedRoute>}></Route>
            <Route path='/admin/products' element={<ProtectedRoute isAdmin={true}><ProductList /></ProtectedRoute>}></Route>
            <Route path='/admin/product/create' element={<ProtectedRoute isAdmin={true}><NewProduct /></ProtectedRoute>}></Route>
            <Route path='/admin/product/:id' element={<ProtectedRoute isAdmin={true}><UpdateProduct /></ProtectedRoute>}></Route>
            <Route path='/admin/orders' element={<ProtectedRoute isAdmin={true}><OrderList /></ProtectedRoute>}></Route>
            <Route path='/admin/order/:id' element={<ProtectedRoute isAdmin={true}><UpdateOrder /></ProtectedRoute>}></Route>
            <Route path='/admin/users' element={<ProtectedRoute isAdmin={true}><UserList /></ProtectedRoute>}></Route>
            <Route path='/admin/user/:id' element={<ProtectedRoute isAdmin={true}><UpdateUser /></ProtectedRoute>}></Route>
            <Route path='/admin/reviews' element={<ProtectedRoute isAdmin={true}><ReviewList /></ProtectedRoute>}></Route>

          </Routes>
          <Footer />
        </HelmetProvider>
      </div >
    </Router >
  );
}

export default App;
