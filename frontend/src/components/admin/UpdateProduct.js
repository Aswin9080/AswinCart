import { Fragment, useEffect, useState } from "react"
import Sidebar from "./Sidebar"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom"
import { getProduct, updateproduct } from "../../actions/productsActions"
import { toast } from 'react-toastify'
import { clearError, clearProductUpdated } from "../../slices/productSlice"



export default function UpdateProduct() {

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setdescription] = useState('')
    const [category, setCategory] = useState('')
    const [stock, setStock] = useState(0)
    const [seller, setSeller] = useState('')
    const [images, setImages] = useState([])
    const [imagesCleared, setImagesCleared] = useState(false)
    const [imagesPreview, setImagesPreview] = useState([])

    const { loading, isProductUpdated, error, product } = useSelector(state => state.productState)
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

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onImagesChange = (e) => {
        e.preventDefault()
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagesPreview(oldArray => [...oldArray, reader.result]);
                setImages(oldArray => [...oldArray, file])
            };
            reader.readAsDataURL(file)

        })
    }
    const { id:productId } = useParams()
    const submitHandler = (e) => {
        e.preventDefault()
        const formdata = new FormData();
        formdata.append('name', name)
        formdata.append('price', price)
        formdata.append('description', description)
        formdata.append('stock', stock)
        formdata.append('seller', seller)
        formdata.append('category', category)
        formdata.append('imagesCleared', imagesCleared)

        images.forEach(image => {
            formdata.append('images', image)
        })
        dispatch(updateproduct(productId,formdata))

    }

    const clearImagesHandler = () => {
        setImages([]);
        setImagesPreview([]);
        setImagesCleared(true);
    }

    
    useEffect(() => {
        if (isProductUpdated) {
            toast('Product Updated Suceesfully', {
                type: 'success',
                position: 'top-right',
                onOpen: () => dispatch(clearProductUpdated())
            })
            navigate('/admin/orders')
            setImages([])
            return;
        }

        if (error) {
            toast(error, {
                type: 'error',
                position: 'top-right',
                onOpen: () => dispatch(clearError())
            })
        }

        dispatch(getProduct(productId))
    }, [isProductUpdated, error, dispatch, navigate,productId])

    useEffect(() => {

        if (product._id) {
            setName(product.name)
            setPrice(product.price)
            setdescription(product.description)
            setStock(product.stock)
            setCategory(product.category)
            setSeller(product.seller)

            if (images.length === 0) {
                setImagesPreview(product.images.map(img => img.image));
            }
        }
    }, [product,images.length])


    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <Fragment>
                    <div className="wrapper my-5">
                        <form className="shadow-lg" encType='multipart/form-data' onSubmit={submitHandler}>
                            <h1 className="mb-4">Update Product</h1>

                            <div className="form-group">
                                <label htmlFor="name_field">Name</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price_field">Price</label>
                                <input
                                    type="text"
                                    id="price_field"
                                    className="form-control"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}

                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description_field">Description</label>
                                <textarea className="form-control" id="description_field" rows="8"
                                    value={description}
                                    onChange={(e) => setdescription(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="category_field">Category</label>
                                <select className="form-control" id="category_field"
                                value={category}
                                    onChange={(e) => setCategory(e.target.value)}>
                                    <option value=''>Select</option>
                                    {categories.map(category => (
                                        <option value={category} key={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="stock_field">Stock</label>
                                <input
                                    type="number"
                                    id="stock_field"
                                    className="form-control"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="seller_field">Seller Name</label>
                                <input
                                    type="text"
                                    id="seller_field"
                                    className="form-control"
                                    value={seller}
                                    onChange={(e) => setSeller(e.target.value)}

                                />
                            </div>

                            <div className='form-group'>
                                <label>Images</label>

                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='product_images'
                                        className='custom-file-input'
                                        id='customFile'
                                        multiple
                                        onChange={onImagesChange}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Images
                                    </label>
                                </div>
                                {imagesPreview.length > 0 && <span className="mr-2" style={{ cursor: "pointer" }} onClick={clearImagesHandler}>
                                    <i className="fa fa-trash"></i></span>}
                                {imagesPreview.map(image => (
                                    <img
                                        className="mt-3 mr-2"
                                        key={image}
                                        src={image}
                                        alt={`Image Preview`}
                                        width='55'
                                        height='52'
                                    />
                                ))}
                            </div>


                            <button
                                id="login_button"
                                type="submit"
                                disabled={loading}
                                className="btn btn-block py-3"
                            >
                                UPDATE
                            </button>

                        </form>
                    </div>
                </Fragment>
            </div>
        </div>
    )
}