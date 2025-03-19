import { useEffect, Fragment } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clearError } from "../../slices/orderSlice"
import Loader from "../layouts/Loader"
import { MDBDataTable } from "mdbreact"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Sidebar from "./Sidebar"
import { AdminOrders as adminOrderActions, deleteOrders } from "../../actions/orderActions"
import { clearOrderDeleted } from "../../slices/orderSlice"

export default function OrderList() {
    const { adminOrders = [], loading = true, error, isOrderDeleted } = useSelector(state => state.orderState)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Number Of Item',
                    field: 'noOfItems',
                    sort: 'asc'
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc'
                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc'
                }
            ],
            rows: []
        }
        adminOrders.forEach(order => {
            data.rows.push({
                id: order._id,
                noOfItems: order.orderItems.length,
                amount: `$${order.totalPrice}`,
                status: <p style={{ color: order.orderStatus === 'Processing' ? 'red' : 'green' }}>{order.orderStatus}</p>,
                actions: (
                    <Fragment>
                        <Link to={`/admin/order/${order._id}`}
                            className='btn btn-primary'
                            onClick={() => navigate(`/admin/product/${order._id}`)}
                        ><i className="fa fa-pencil"></i></Link>
                        <button className="btn btn-danger py-1 px-2 ml-2" onClick={(e) => deleteHandler(e, order._id)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </Fragment>
                )
            })
        })
        return data
    }

    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteOrders(id)); 
    
    }
    useEffect(() => {
        if (error) {
            toast(error, {
                type: 'error',
                position: "top-right",
                onOpen: () => dispatch(clearError())
            })
            return
        }
        if (isOrderDeleted) {
            toast('Order deleted Suceesfully', {
                type: 'success',
                position: 'top-right',
                onOpen: () => dispatch(clearOrderDeleted())
            })
            return;
        }
        dispatch(adminOrderActions)
    }, [dispatch, error, isOrderDeleted])


    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">Order List</h1>
                <Fragment>
                    {loading ? <Loader /> :
                        <MDBDataTable
                            data={setOrders()}
                            bordered
                            striped
                            hover
                            clasName='px-3'>

                        </MDBDataTable>
                    }
                </Fragment>
            </div>
        </div>
    )
}