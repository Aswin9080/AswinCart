import { Fragment, useEffect, useState } from "react";
import MetaData from "./layouts/MetaData";
import { getProducts } from "../actions/productsActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./layouts/Loader";
import Product from "./product/product";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";


export default function Home() {

    const dispatch = useDispatch();
    const { products, loading, error,productsCount,resperpage} = useSelector((state) => state.productsState)
    const [currentPage,setcurrentPage]=useState(1)
    
    const setCurrentPageNo = (pageNO)=>{
        setcurrentPage(pageNO)

    }

    useEffect(() => {
        if (error) {
            return toast.error(error, {
                position: "bottom-center",
            })
        }

        dispatch(getProducts(null,null,null,null,currentPage))
    }, [dispatch,error,currentPage])
    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={'Buy Best Product'} />
                    <h1 id="products_heading">Latest Products</h1>

                    <section id="products" className="container mt-5">

                        <div className="row">
                            {
                                products && products.map((product, index) => (
                                    <Product col={3} product={product} key={product._id} />
                                ))
                            }
                        </div>
                    </section>
                    {productsCount > 0 && productsCount > resperpage ?                   
                     <div className="d-flex justify-content-center mt-5">
                        <Pagination
                          activePage={currentPage}
                          onChange={setCurrentPageNo}
                          totalItemsCount={productsCount }
                          itemsCountPerPage={resperpage}
                          nextPageText={'Next'}
                          firstPageText={'First'}
                          lastPageText={'Last'}
                          itemClass={"page-item"}
                          linkClass={"page-link"}
                        />
                    </div>:''}
                </Fragment>}

        </Fragment>
    )
}