import { useEffect, Fragment } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clearError } from "../../slices/productsSlice"
import { deleteProduct, getAdminProducts } from "../../actions/productsActions"
import Loader from "../layouts/Loader"
import { MDBDataTable } from "mdbreact"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Sidebar from "./Sidebar"
import { clearProductDeleted } from "../../slices/productSlice"

export default function ProductList() {
    const { products = [], loading = true, error } = useSelector(state => state.productsState)
    const { isProductDeleted ,error:producterror } = useSelector(state => state.productState)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const setProducts = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'price',
                    field: 'price',
                    sort: 'asc'
                },
                {
                    label: 'Stock',
                    field: 'stock',
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
        products.forEach(product => {
            data.rows.push({
                id: product._id,
                name: product.name,
                price: `$${product.price}`,
                stock: product.stock,
                actions: (
                    <Fragment>
                        <Link to={`/admin/product/${product._id}`}
                            className='btn btn-primary'
                            onClick={()=>navigate(`/admin/product/${product.id}`)}
                        ><i className="fa fa-pencil"></i></Link>
                        <button className="btn btn-danger py-1 px-2 ml-2" onClick={(e) => deleteHandler(e, product._id)}>
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
        dispatch(deleteProduct(id))
    }

    useEffect(() => {
        if (error || producterror) {
            toast(error || producterror, {
                type: 'error',
                position: "top-right",
                onOpen: () => dispatch(clearError())
            })
            return
        }
        if (isProductDeleted) {
            toast('Product deleted Suceesfully', {
                type: 'success',
                position: 'top-right',
                onOpen: () => dispatch(clearProductDeleted())
            })
            navigate('/admin/products')
            return;
        }
        dispatch(getAdminProducts)
    }, [dispatch, error,isProductDeleted,producterror,navigate])
    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">Product List</h1>
                <Fragment>
                    {loading ? <Loader /> :
                        <MDBDataTable
                            data={setProducts()}
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