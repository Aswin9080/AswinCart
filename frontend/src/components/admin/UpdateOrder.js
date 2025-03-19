import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { orderDetail as orderDetailAction, updateOrders } from "../../actions/orderActions";
import { toast } from "react-toastify";
import { clearOrderUpdated, clearError } from "../../slices/orderSlice";
import { Link } from "react-router-dom";

export default function UpdateOrder() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { id: orderId } = useParams();

    // Get Redux state
    const { loading, isOrderUpdated, error, orderDetails = {} } = useSelector(state => state.orderState);

    // Destructure `orderDetails` safely
    const { 
        _id, 
        user = {}, 
        orderItems = [], 
        shippingInfo = {}, 
        totalPrice = 0, 
        paymentInfo = {}, 
        orderStatus: initialOrderStatus = "Processing"
    } = orderDetails || {}; 

    const isPaid = paymentInfo?.status || false;
    const [orderStatus, setOrderStatus] = useState(initialOrderStatus);
    useEffect(() => {
        if (isOrderUpdated) {
            toast.success("Order Updated Successfully!", {
                position: "top-right",
                onOpen: () => dispatch(clearOrderUpdated())
            });
            return;
        }

        if (error) {
            toast.error(error, {
                position: "top-right",
                onOpen: () => dispatch(clearError())
            });
            return;
        }

        dispatch(orderDetailAction(orderId));
    }, [ isOrderUpdated,error, dispatch, orderId]);

    useEffect(() => {
        if (orderDetails._id) {
            setOrderStatus(orderDetails.orderStatus);
        }
    }, [orderDetails]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateOrders(orderId, { orderStatus }));
    };


    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <Fragment>
                    <div className="row d-flex justify-content-around">
                        <div className="col-12 col-lg-8 mt-5 order-details">
                            <h1 className="my-5">Order # {_id}</h1>

                            <h4 className="mb-4">Shipping Info</h4>
                            <p><b>Name:</b> {user?.name || "N/A"}</p>
                            <p><b>Phone:</b> {shippingInfo?.phoneNo || "N/A"}</p>
                            <p className="mb-4"><b>Address:</b> {shippingInfo?.address}, {shippingInfo?.city}, {shippingInfo?.postalCode}, {shippingInfo?.state}, {shippingInfo?.country}</p>
                            <p><b>className:</b> ${totalPrice}</p>

                            <hr />

                            <h4 className="my-4">Payment</h4>
                            <p className={isPaid ? "greenColor" : "redColor"}>
                                <b>{isPaid ? "PAID" : "NOT PAID"}</b>
                            </p>

                            <h4 className="my-4">Order Status:</h4>
                            <p className={orderStatus.includes("Delivered") ? "greenColor" : "redColor"}>
                                <b>{orderStatus}</b>
                            </p>

                            <h4 className="my-4">Order Items:</h4>
                            <hr />
                            <div className="cart-item my-1">
                                {orderItems.length > 0 ? (
                                    orderItems.map(item => (
                                        <div className="row my-5" key={item.product}>
                                            <div className="col-4 col-lg-2">
                                                <img src={item.image} alt={item.name} height="45" width="65" />
                                            </div>
                                            <div className="col-5 col-lg-5">
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </div>
                                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                <p>${item.price}</p>
                                            </div>
                                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                <p>{item.quantity} Piece(s)</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No items in this order.</p>
                                )}
                            </div>
                            <hr />
                        </div>

                        <div className="col-12 col-lg-3 mt-5">
                            <h4 className="my-4">Order Status</h4>
                            <div className="form-group">
                                <select
                                    className="form-control"
                                    onChange={e => setOrderStatus(e.target.value)}
                                    value={orderStatus}
                                    name="status"
                                >
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>
                            <button
                                disabled={loading}
                                onClick={submitHandler}
                                className="btn btn-primary btn-block"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </Fragment>
            </div>
        </div>
    );
}
