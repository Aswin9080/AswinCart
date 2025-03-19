
import { Fragment, useEffect, useState } from "react";
import MetaData from ".././layouts/MetaData";
import { getProducts } from "../../actions/productsActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from ".././layouts/Loader";
import Product from ".././product/product";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import { useParams } from "react-router-dom";
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css';
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap.css'

export default function ProductSearch() {

    const dispatch = useDispatch();
    const { products, loading, error, productsCount, resperpage } = useSelector((state) => state.productsState)
    const [currentPage, setcurrentPage] = useState(1)
    const { keyword } = useParams();
    const [price, setprice] = useState([1, 1000])
    const [pricechanged, setpricechanged] = useState(price)
    const [category, setcategory] = useState(null)
    const [rating, setrating] = useState(0)

    const categories = [
        'Electronics',
        'Mobile Phones',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ]
    console.log('price', price)
    const setCurrentPageNo = (pageNO) => {
        setcurrentPage(pageNO)

    }

    useEffect(() => {
        if (error) {
            return toast.error(error, {
                position: toast.POSITION.BOTTOM_CENTER
            })
        }
        dispatch(getProducts(keyword, pricechanged, category, rating, currentPage))
    }, [error, dispatch, currentPage, keyword, pricechanged, category, rating])




    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={'Buy Best Product'} />
                    <h1 id="products_heading">Serach Products</h1>

                    <section id="products" className="container mt-5">

                        <div className="row">
                            <div className="col-6 col-md-3 mb-5 mt-5">
                                {/* {price filter} */}
                                <div className="px-5" onMouseUp={() => setpricechanged(price)}>
                                    <Slider
                                        range={true}
                                        marks={
                                            {
                                                1: "$1",
                                                1000: "$1000"
                                            }
                                        }
                                        min={1}
                                        max={1000}
                                        //value nu potta change panna mudiyadhu defaulyvalue kudutha range change panlam
                                        defaultValue={price}
                                        onChange={(price) => setprice(price)}

                                        //render agura apo therimum mela value
                                        handleRender={(renderProps) => {
                                            return (
                                                <Tooltip overlay={`$${renderProps.props['aria-valuenow']}`}>
                                                    <div {...renderProps.props} ></div>
                                                </Tooltip>
                                            );
                                        }}
                                    />
                                </div>

                                <hr className="mt-5"></hr>

                                {/* {category filter} */}
                                <div className="mt-5">
                                    <h3 className="mb-5">category</h3>
                                    {categories.map((category, key) => (
                                        <ul className="pl-0" key={key}>
                                            <li style={{ cursor: "pointer", listStyleType: "none" }}
                                                key={category}
                                                onClick={() => {
                                                    setcategory(category)
                                                }}
                                            >
                                                {category}
                                            </li>
                                        </ul>
                                    ))}

                                </div>

                                <hr className="mt-5"></hr>

                                {/* {ratingfilter} */}
                                <div>
                                    <h4 className="mb-3">Ratings</h4>
                                    {[5, 4, 3, 2, 1].map((star, key) => (
                                        <ul className="pl-0" key={key}>
                                            <li style={{ cursor: "pointer", listStyleType: "none" }}
                                                key={star}
                                                onClick={() => {
                                                    setrating(star)
                                                }}

                                            >
                                                <div className="rating-outer">
                                                    <div className="rating-inner"
                                                        style={{
                                                            width: `${star * 20}%`
                                                        }}>

                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    ))}
                                </div>

                            </div>

                            <div className="col-6 col-md-9">
                                <div className='row'>
                                    {
                                        products && products.map((product, index) => (
                                            <Product col={4} product={product} key={product._id} />
                                        ))
                                    }
                                </div>
                            </div>

                        </div>
                    </section>
                    {productsCount > 0 && productsCount > resperpage ?
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                onChange={setCurrentPageNo}
                                totalItemsCount={productsCount}
                                itemsCountPerPage={resperpage}
                                nextPageText={'Next'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass={"page-item"}
                                linkClass={"page-link"}
                            />
                        </div> : ''}
                </Fragment>}

        </Fragment >
    )
}