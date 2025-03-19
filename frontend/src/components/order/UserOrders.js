import { Fragment, useState, useEffect } from "react";
import MetaData from "../layouts/MetaData";
import { MDBDataTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { userOrdersAction } from "../../actions/orderActions";
import { Link } from "react-router-dom";

export default function UserOrders() {
    const [ordersData, setOrdersData] = useState({ columns: [], rows: [] });
    const { userOrder =[]} = useSelector(state => state.orderState);  // Get user orders from Redux
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userOrdersAction);  // Fetch user orders when component mounts
    }, [dispatch]);

    useEffect(() => {
        if (userOrder && userOrder.length > 0) {
            const rows = userOrder.map(userOrder => ({
                id: userOrder._id,
                numOfitems: userOrder.orderItems.length,
                amount: `$${userOrder.totalPrice}`,
                status: userOrder.orderStatus && userOrder.orderStatus.includes('Delivered') ? (
                    <p style={{ color: 'green' }}>{userOrder.orderStatus}</p>
                ) : (
                    <p style={{ color: 'red' }}>{userOrder.orderStatus}</p>
                ),
                actions: (
                    <Link to={`/order/${userOrder._id}`} className="btn btn-primary">
                        <i className="fa fa-eye"></i>
                    </Link>
                ),
            }));

            // Set the updated state with new rows and columns
            setOrdersData({
                columns: [
                    { label: "Order ID", field: "id", sort: "asc" },
                    { label: "Number Of Items", field: "numOfitems", sort: "asc" },
                    { label: "Amount", field: "amount", sort: "asc" },
                    { label: "Status", field: "status", sort: "asc" },
                    { label: "Actions", field: "actions", sort: "disabled" },
                ],
                rows,  // Set the rows with the mapped data
            });
        }
    }, [userOrder]);  // This hook runs whenever userOrder changes

    return (
        <Fragment>
            <MetaData title="My Orders" />
            <h1 className="mt-5">My Orders</h1>
            <MDBDataTable className="px-3" bordered striped hover data={ordersData} />
        </Fragment>
    );
}
