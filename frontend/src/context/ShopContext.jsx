import { createContext, use, useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMemo } from "react";

export const ShopContext = createContext()

const ShopContextProvider = (props) => {
    const currency = '$'
    const delivery_fee = 10;
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    const TOKEN_KEYS = ["token", "accessToken", "refreshToken"];

    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error("Please Select a Size!");
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {
                const response = await axios.post(backend_url + '/api/v1/cart/add-to-cart', {
                    itemId, size
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if(response.data.success) {
                    toast.success("Cart Updated");
                }
            } catch (error) {
                console.error(error);
                toast.error("Could not update cart on server");
            }
        }
    }


    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }


    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
    }


    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalAmount;
    }

    const getProductData = async () => {
        try {
            const response = await axios.get(backend_url + '/api/v1/products/get-all-products');
            if (response.data.success) {
                setProducts(response.data.message);
            }
            else {
                toast.error("Could not fetch products");
            }
        } catch (error) {
            console.error(error);

        }
    }

    useEffect(() => {
        getProductData();
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
        }
    }, [])

    const apiAuth = useMemo(
        () =>
            axios.create({
                baseURL: backend_url,
                withCredentials: true,
            }),
        [backend_url]
    );

    const clearClientAuth = () => {
        TOKEN_KEYS.forEach(k => {
            localStorage.removeItem(k);
            sessionStorage.removeItem(k);
        });
        setToken(null);
        setCartItems({});
    };

    // ---- LOGOUT (call this from any component) ----
    const logout = async () => {
        try {
            await apiAuth.post("/api/v1/users/logout");
        } catch (_e) {
            // ignore – still clear client state
        } finally {
            clearClientAuth();
            navigate("/", { replace: true });
            toast.info("Signed out");
        }
    };


    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, getCartCount, setCartItems,
        updateQuantity,
        getCartAmount,
        navigate,
        backend_url,
        token, setToken, logout
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;