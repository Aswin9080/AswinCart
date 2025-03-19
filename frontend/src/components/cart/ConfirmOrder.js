import { Fragment, useEffect } from "react";
import MetaData from "../layouts/MetaData";
import CheckOutStep from './CheckOutStep'
import { validateShipping } from "./Shipping";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios'
import { orderCompleted } from "../../slices/cartSlice";
import { createOrder } from "../../actions/orderActions";
import { toast } from "react-toastify";
import { clearOrderError } from "../../slices/orderSlice";

export default function ConfirmOrder() {
    const { shippingInfo, items: cartItems } = useSelector(state => state.cartState)
    const { user } = useSelector(state => state.authState)
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'))

    const ItemPrice = cartItems.reduce((acc, item) => (acc + item.price + item.quantity), 0)
    const shippingPrice = ItemPrice > 200 ? 0 : 25;
    let taxPrice = 0.05 * ItemPrice;
    taxPrice = Number(taxPrice).toFixed(2);
    const totalPrice = Number(ItemPrice + taxPrice * shippingPrice).toFixed(2)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {error:orderError}=useSelector(state=>state.orderState)
    useEffect(()=>{
        if(orderError){
            toast(orderError,{
                position:'top-right',
                type:'error',
                onOpen:()=>{dispatch(clearOrderError())}
            })
            return
        }
    })
    const order ={
        orderItems:cartItems,
        shippingInfo
    }

    if(orderInfo) {
        order.itemsPrice = orderInfo.itemPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.taxPrice = orderInfo.taxPrice
        order.totalPrice = orderInfo.totalPrice
        
    }
    console.log('order',order)

    const processPayment =async () => {
        const data = {
            ItemPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        }
        sessionStorage.setItem('orderInfo', JSON.stringify(data))
        navigate('/payment')

      


        try {
            // Step 1: Get the payment order from the backend
            const { data } = await axios.post('api/v4/payment/process', { amount: totalPrice });
            console.log('data', data.data);

            // Step 2: Configure Razorpay options
            const options = {
                key: 'rzp_test_WCmMdLXTLmggQg',
                amount: data.data.amount,
                currency: data.data.currency,
                description: "test Payment Method",
                order_id: data.data.id,
                handler: async (paymentData) => {
                    console.log('paymentData', paymentData)
                    // Step 3: Send payment data for verification
                    try {
                        const verificationResponse = await axios.post('/api/v4/verify', {
                            payment_id: paymentData.razorpay_payment_id,
                            order_id: paymentData.razorpay_order_id,
                            signature: paymentData.razorpay_signature
                        });
                        console.log('verificationResponse', verificationResponse)
                        // Step 4: Check the response status from the backend
                        if (verificationResponse.data.success) {

                            toast('Payment Verified',{
                                position:'top-right',
                                type:'success',
                            })
                            order.paymentInfo ={
                                id:paymentData.razorpay_payment_id,
                                status:verificationResponse.data.success
                            }

                            dispatch(orderCompleted())
                            dispatch(createOrder(order))
                            navigate('/order/success')

                        } else {
                            alert('Payment Failed');
                        }
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        alert('Payment verification failed. Please try again.');
                    }
                },
                theme: {
                    color: "#3399cc"
                },
            };

            // Step 5: Open Razorpay popup
            const razorpayPopup = new window.Razorpay(options);
            console.log('Opening Razorpay popup...', options);
            razorpayPopup.open();

        } catch (err) {
            console.error('Payment integration failed:', err);
            alert('Payment integration failed. Please try again.');
        }
    }

    useEffect(() => {
        validateShipping(shippingInfo, navigate)
    })

    return (
        <Fragment>
            <MetaData title={'confirm Order'} />
            <CheckOutStep Shipping={true} confirmOrder={true} />
            <div className="row d-flex justify-content-between">
                <div className="col-12 col-lg-8 mt-5 order-confirm">

                    <h4 className="mb-3">Shipping Info</h4>
                    <p><b>Name:{user.name}</b> </p>
                    <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                    <p className="mb-4"><b>Address:</b> {shippingInfo.address},{shippingInfo.city},{shippingInfo.postalCode},{shippingInfo.state},{shippingInfo.country}</p>

                    <hr />
                    <h4 className="mt-4">Your Cart Items:</h4>

                    <hr />
                    {
                        cartItems.map((item, i) => (
                            <Fragment key={i}>
                                <div className="cart-item my-1">
                                    <div className="row">
                                        <div className="col-4 col-lg-2">
                                            <img src={item.image} alt={item.name} height="45" width="65" />
                                        </div>

                                        <div className="col-5 col-lg-6">
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        </div>


                                        <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                            <p>{item.quantity} x {item.price}= <b>${item.quantity * item.price}</b></p>
                                        </div>

                                    </div>
                                </div>
                                <hr />
                            </Fragment>
                        ))
                    }



                </div>

                <div className="col-12 col-lg-3 my-4">
                    <div id="order_summary">
                        <h4>Order Summary</h4>
                        <hr />
                        <p>Subtotal:  <span className="order-summary-values">${ItemPrice}</span></p>
                        <p>Shipping: <span className="order-summary-values">${shippingPrice}</span></p>
                        <p>Tax:  <span className="order-summary-values">${taxPrice}</span></p>

                        <hr />

                        <p>Total: <span className="order-summary-values">${totalPrice}</span></p>

                        <hr />
                        <button id="checkout_btn" className="btn btn-primary btn-block" onClick={processPayment}>Proceed to Payment</button>
                    </div>
                </div>


            </div>
        </Fragment>
    )
}