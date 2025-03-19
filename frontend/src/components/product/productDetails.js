import React, { Fragment, useEffect, useState } from "react";
import { createReview, getProduct } from "../../actions/productsActions";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../layouts/Loader";
import { Carousel } from 'react-bootstrap'
import MetaData from "../layouts/MetaData";
import { addCartItem } from "../../actions/cartItem";
import { Modal } from 'react-bootstrap'
import { toast } from "react-toastify"
import { clearError, clearProduct, clearReviewSubmitted } from "../../slices/productSlice";
import ProductReview from "./ProductReview";

const ProductDetails = () => {
    const { loading, product = {}, isReviewSubmitted, error } = useSelector((state) => state.productState)
    const { user } = useSelector(state => state.authState)
    const dispatch = useDispatch()
    const { id } = useParams()
    const [quantity, setQquantity] = useState(1)
    const [rating, setRating] = useState(1);
    const [show, setShow] = useState(false);
    const [comment, setcomment] = useState('')
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const increaseQty = () => {
        const count = document.querySelector('.count')
        if (product.stock === 0 || count.valueAsNumber >= product.stock) return;
        const qty = count.valueAsNumber + 1
        setQquantity(qty)
    }

    const decreaseQty = () => {
        const count = document.querySelector('.count')
        if (count.valueAsNumber === 1) return;
        const qty = count.valueAsNumber - 1
        setQquantity(qty)
    }

    const reviewHandler = () => {
        let formdata = new FormData();
        formdata.append('rating', rating)
        formdata.append('comment', comment)
        formdata.append('productId', id)
        dispatch(createReview(formdata))
        console.log('formdata', formdata)
    }

    useEffect(() => {
        if (isReviewSubmitted) {
            handleClose()
            toast('Review Submitted Succesfully', {
                type: 'success',
                position: "top-right",
                onOpen: () => dispatch(clearReviewSubmitted())
            })
        }
        if (error) {
            toast(error, {
                type: 'error',
                position: "top-right",
                onOpen: () => dispatch(clearError())
            })
        }

        if (!product._id || isReviewSubmitted) {
            dispatch(getProduct(id))
        }

        return ()=>{dispatch(clearProduct())}

    }, [dispatch, id, isReviewSubmitted, error])
    console.log('product',product)
    return (

        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={product.name} />
                    <div className="row f-flex justify-content-around">
                        <div className="col-12 col-lg-5 img-fluid" id="product_image">
                            <Carousel pause='hover'>
                                {
                                    product.images && product.images.map(image =>
                                        <Carousel.Item key={image._id}>
                                            <img className="d-block w-100" src={image.image} alt={product.name} height="500" width="500" />
                                        </Carousel.Item>
                                    )
                                }
                            </Carousel>
                        </div>

                        <div className="col-12 col-lg-5 mt-5">
                            <h3>{product.name}</h3>
                            <p id="product_id">{product._id}</p>

                            <hr />

                            <div className="rating-outer">
                                <div className="rating-inner" style={{ width: `${product.ratings / 5 * 100}%` }}></div>
                            </div>
                            <span id="no_of_reviews" >{product.numOfReviews} Reviews</span>

                            <hr />

                            <p id="product_price">${product.price}</p>
                            <div className="stockCounter d-inline">
                                <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>

                                <input
                                    type="number"
                                    className="form-control count d-inline"
                                    value={quantity}
                                    readOnly
                                />

                                <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                            </div>
                            <button type="button" id="cart_btn"
                                className="btn btn-primary d-inline ml-4"
                                disabled={product.stock === 0 ? true : false}
                                onClick={() => {
                                    dispatch(addCartItem(product._id, quantity))
                                    toast('Cart Item Added', {
                                        type: 'success',
                                        position: "top-right",
                                    })
                                }}

                            >
                                Add to Cart
                            </button>

                            <hr />

                            <p>
                                Status: <span className={product.stock > 0 ? 'greenColor' : "redColor"} id="stock_status">{product.stock > 0 ? "In Stock" : "out of stock"}</span>
                            </p>

                            <hr />

                            <h4 className="mt-2">Description:</h4>
                            <p>{product.description}</p>
                            <hr />
                            <p id="product_seller" className="mb-3">
                                Sold by: <strong>{product.seller}</strong>
                            </p>
                            {
                                user ? <button
                                    id="review_btn"
                                    type="button"
                                    className="btn btn-primary mt-4"
                                    data-toggle="modal"
                                    data-target="#ratingModal"
                                    onClickCapture={handleShow}
                                >
                                    Submit Your Review
                                </button> : <div className="alert alert-danger mt-5">Login to Post Review</div>
                            }


                            <div className="row mt-2 mb-5">
                                <div className="rating w-50">
                                    <div
                                        className="modal fade"
                                        id="ratingModal"
                                        tabIndex="-1"
                                        role="dialog"
                                        aria-labelledby="ratingModalLabel"
                                        aria-hidden="true"
                                    >
                                    </div>
                                    <Modal show={show} onHide={handleClose}>
                                        <Modal.Header>
                                            <Modal.Title>Submit Review</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <ul className="stars">
                                                {
                                                    [1, 2, 3, 4, 5].map(star => (
                                                        <li
                                                            onClick={() => setRating(star)}
                                                            value={star}
                                                            className={`star ${star <= rating ? `orange` : ``}`}
                                                            onMouseOver={(e) => e.target.classList.add('yellow')}
                                                            onMouseOut={(e) => e.target.classList.remove('yellow')}>
                                                            <i className="fa fa-star"></i>
                                                        </li>
                                                    ))
                                                }

                                            </ul>

                                            <textarea
                                                onChange={(e) => setcomment(e.target.value)}
                                                name="review"
                                                id="review"
                                                className="form-control mt-3"
                                            ></textarea>

                                        </Modal.Body>
                                        <Modal.Footer>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={handleClose}
                                            >
                                                Close
                                            </button>
                                            <button
                                                className="btn btn-primary review-btn px-4 text-white"
                                                disabled={loading}
                                                onClick={reviewHandler}
                                            >
                                                Submit
                                            </button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
                {product.reviews && product.reviews.length > 0 ?
                <ProductReview reviews={product.reviews}/> :null}
                </Fragment>}

        </Fragment>
    );
};

export default ProductDetails;
