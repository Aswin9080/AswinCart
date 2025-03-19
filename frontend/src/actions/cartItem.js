import axios from "axios"
import { addCartIemRequest, addCartItemFail, addCartItemSuccess } from "../slices/cartSlice"


export const addCartItem = (id, quantity) => async (dispatch) => {
    console.log(id, quantity)
    try {
        dispatch(addCartIemRequest())
        const { data } = await axios.get(`/api/v1/product/${id}`)
        console.log('data', data)
        dispatch(addCartItemSuccess({
            product: id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].image,
            stock: data.product.stock,
            quantity
        }))
    }
    catch (err) {
        dispatch(addCartItemFail())
    }
}
