import { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, clearUserDeleted } from "../../slices/userSlice";
import Loader from "../layouts/Loader";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import { getUsers, deleteUser } from "../../actions/userActions";

export default function OrderList() {
    const { users = [], loading = true, error, isUserDeleted } = useSelector(state => state.userState);
    const dispatch = useDispatch();

    const setusers = () => {
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
                    label: 'Email',
                    field: 'email',
                    sort: 'asc'
                },
                {
                    label: 'Role',
                    field: 'role',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc'
                }
            ],
            rows: []
        };

        // Ensure users is an array before using forEach
        if (Array.isArray(users)) {
            users.forEach(user => {
                console.log(user)
                data.rows.push({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    actions: (
                        <Fragment>
                            <Link to={`/admin/user/${user._id}`} className='btn btn-primary'>
                                <i className="fa fa-pencil"></i>
                            </Link>
                            <button className="btn btn-danger py-1 px-2 ml-2" onClick={(e) => deleteHandler(e, user._id)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </Fragment>
                    )
                });
            });
        }

        return data;
    };

    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteUser(id));
    };

    useEffect(() => {
        if (error) {
            toast(error, {
                type: 'error',
                position: "top-right",
                onOpen: () => dispatch(clearError())
            });
            return;
        }
        if (isUserDeleted) {
            toast('User deleted successfully', {
                type: 'success',
                position: 'top-right',
                onOpen: () => dispatch(clearUserDeleted())
            });
            return;
        }
        dispatch(getUsers);
    }, [dispatch, error, isUserDeleted]);

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">User List</h1>
                <Fragment>
                    {loading ? <Loader /> :
                        <MDBDataTable
                            data={setusers()}
                            bordered
                            striped
                            hover
                            className='px-3'
                        />
                    }
                </Fragment>
            </div>
        </div>
    );
}