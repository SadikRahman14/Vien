// ShopContext.jsx
import React, { createContext, useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const TOKEN_KEYS = ["token", "accessToken", "refreshToken"];
const CART_KEY = "cartItems_v1"; // localStorage key for cart (change if you want)

const readTokenFromStorage = () => {
    try {
        const candidates = ["accessToken", "token"];
        for (const k of candidates) {
            const v = localStorage.getItem(k) ?? sessionStorage.getItem(k);
            if (v && v !== "null" && v !== "undefined") return v;
        }
    } catch (e) { }
    return null;
};

const readCartFromStorage = () => {
    try {
        const raw = localStorage.getItem(CART_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        if (typeof parsed === "object" && parsed !== null) return parsed;
    } catch (e) {
        console.error("Failed to parse cart from storage", e);
    }
    return {};
};

const ShopContextProvider = (props) => {
    const currency = "$";
    const delivery_fee = 10;
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    // initialize cart synchronously from localStorage so UI sees it immediately
    const [cartItems, setCartItemsState] = useState(() => readCartFromStorage());
    const [products, setProducts] = useState([]);
    const [token, setTokenState] = useState(() => readTokenFromStorage());
    const navigate = useNavigate();

    // axios instance that will include Authorization header when token exists
    const apiAuth = useMemo(() => {
        const instance = axios.create({
            baseURL: backend_url,
            withCredentials: true,
        });
        // add Authorization header via interceptor so instance updates when token changes
        instance.interceptors.request.use((config) => {
            if (token) config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
            return config;
        });
        return instance;
    }, [backend_url, token]);

    // helper setter that persists cart to localStorage and updates state
    const persistCart = useCallback((newCart) => {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(newCart || {}));
        } catch (e) {
            console.error("Failed to persist cart", e);
        }
        setCartItemsState(newCart || {});
    }, []);

    // wrapper so consumers can call setCartItems (keeps same API as before)
    const setCartItems = useCallback(
        (next) => {
            // allow passing function or value
            const newCart = typeof next === "function" ? next(cartItems) : next;
            persistCart(newCart);
        },
        [cartItems, persistCart]
    );

    // fetch products (unchanged)
    const getProductData = async () => {
        try {
            const response = await axios.get(`${backend_url}/api/v1/products/get-all-products`);
            if (response.data.success) setProducts(response.data.message);
            else toast.error("Could not fetch products");
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getProductData();
    }, []); // eslint-disable-line




    // On first load or when token becomes available, try to fetch server cart and merge:
    useEffect(() => {
        let didCancel = false;
        if (!token) return; // only applicable for authenticated users

        const fetchServerCart = async () => {
            try {
                // Example endpoint — replace with your real one if different
                const resp = await apiAuth.get("/api/v1/cart/get-user-cart");
                if (resp?.data?.success && !didCancel) {
                    const serverCart = resp.data.cart || {}; // adapt to your response shape
                    // merge strategy: prefer server quantities when server has items,
                    // otherwise keep local. Modify as needed.
                    const merged = { ...(cartItems || {}) };
                    for (const pid in serverCart) {
                        merged[pid] = { ...(merged[pid] || {}), ...(serverCart[pid] || {}) };
                    }
                    persistCart(merged);
                }
            } catch (e) {
                // ignore; server may not provide this endpoint
            }
        };

        fetchServerCart();
        return () => {
            didCancel = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]); // run when token becomes set

    // CLEAR auth + cart helper
    const clearClientAuth = useCallback(() => {
        TOKEN_KEYS.forEach((k) => {
            try {
                localStorage.removeItem(k);
                sessionStorage.removeItem(k);
            } catch (e) { }
        });
        // clear cart and token
        persistCart({});
        setTokenState(null);
    }, [persistCart]);

    // LOGOUT
    const logout = useCallback(async () => {
        try {
            await apiAuth.post("/api/v1/users/logout");
        } catch (e) {
            // ignore server error
        } finally {
            clearClientAuth();
            navigate("/", { replace: true });
            toast.info("Signed out");
        }
    }, [apiAuth, clearClientAuth, navigate]);

    // token setter that persists to storage and updates state
    const setToken = useCallback((newToken) => {
        if (!newToken || newToken === "null" || newToken === "undefined") {
            TOKEN_KEYS.forEach((k) => {
                try {
                    localStorage.removeItem(k);
                    sessionStorage.removeItem(k);
                } catch (e) { }
            });
            setTokenState(null);
            return;
        }
        try {
            localStorage.setItem("accessToken", newToken);
            localStorage.setItem("token", newToken);
        } catch (e) {
            console.error("Failed to persist token", e);
        }
        setTokenState(newToken);
    }, []);

    const login = useCallback(
        (newToken) => {
            setToken(newToken);
        },
        [setToken]
    );

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error("Please Select a Size!");
            return;
        }

        const cartClone = structuredClone(cartItems || {});
        if (cartClone[itemId]) {
            cartClone[itemId][size] = (cartClone[itemId][size] || 0) + 1;
        } else {
            cartClone[itemId] = { [size]: 1 };
        }
        persistCart(cartClone);

        if (token) {
            try {
                const response = await apiAuth.post("/api/v1/cart/add-to-cart", { itemId, size });
                if (response?.data?.success) toast.success("Cart Updated");
            } catch (error) {
                console.error("Failed to update server cart", error);
                toast.error("Could not update cart on server");
            }
        }
    };

    const getUserCart = async () => {
        try {
            const response = await axios.get(backend_url + "/api/v1/cart/get-user-cart"
                , {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setCartItems(response.data.message);
            }
        } catch (error) {

        }
    }


    const getCartCount = useCallback(() => {
        let totalCount = 0;
        for (const pid in cartItems) {
            for (const sz in (cartItems[pid] || {})) {
                try {
                    const q = cartItems[pid][sz];
                    if (Number(q) > 0) totalCount += Number(q);
                } catch (e) { }
            }
        }
        return totalCount;
    }, [cartItems]);

    const updateQuantity = async (itemId, size, quantity) => {
        const cartClone = structuredClone(cartItems || {});
        if (!cartClone[itemId]) cartClone[itemId] = {};
        cartClone[itemId][size] = quantity;

        if (quantity === 0) {
            delete cartClone[itemId][size];
            if (Object.keys(cartClone[itemId]).length === 0) delete cartClone[itemId];
        }

        // Update state first
        setCartItems(cartClone); // <-- use context setter directly

        // send to backend if logged in
        if (token) {
            try {
                await apiAuth.put("/api/v1/cart/update-cart", { itemId, size, quantity });
            } catch (err) {
                console.error("updateQuantity server call failed", err);
                await getUserCart(); // re-sync from server if failed
            }
        }
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            const itemInfo = products.find((p) => String(p._id) === String(items));
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0 && itemInfo) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) { }
            }
        }
        return totalAmount;
    };

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        getCartCount,
        setCartItems,
        updateQuantity,
        getCartAmount,
        navigate,
        backend_url,
        token,
        setToken,
        login,
        logout,
        apiAuth,
    };

    return <ShopContext.Provider value={value}>
        {props.children}
    </ShopContext.Provider>;
};

export default ShopContextProvider;