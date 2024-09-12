import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-hot-toast';

export default function Product(props) {
    const { product } = props;
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart: { cartItems } } = state;

    const addToCartHandler = async (product) => {
        try {
            const existItem = cartItems.find((x) => x._id === product._id);
            const quantity = existItem ? existItem.quantity + 1 : 1;
            const { data } = await axios.get(`https://amazon-mern-backendd.onrender.com/api/products/${product._id}`);

            if (data.countInStock < quantity) {
                toast.error('Sorry, Product is out of stock');
                return;
            }

            toast.success("Item added to cart")
            ctxDispatch({
                type: 'CART_ADD_ITEM',
                payload: { ...product, quantity },
            });
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
            console.error(error);
        }
    };

    return (
        <div className='flex justify-center w-full'>


            <div className="bg-white shadow-md rounded-lg min-w-[220px] overflow-hidden w-[85%] sm:w-64 ">
                <Link to={`/product/${product.slug}`}>
                    <img className="w-full h-48 object-cover" src={product.image} alt={product.name} />
                </Link>
                <div className="p-4">
                    <Link to={`/product/${product.slug}`}>
                        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    </Link>
                    <Rating rating={product.rating} numReviews={product.numReviews} />
                    <p className="text-lg font-bold text-gray-800">₹{product.price}</p>
                    {product.countInStock === 0 ? (
                        <button className="mt-4 w-full py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed" disabled>
                            Out of stock
                        </button>
                    ) : (
                        <button
                            className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={() => addToCartHandler(product)}
                        >
                            Add to cart
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
