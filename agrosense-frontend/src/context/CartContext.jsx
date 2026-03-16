import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);

  useEffect(() => {

    const storedCart = localStorage.getItem("cart");

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

  }, []);

  useEffect(() => {

    localStorage.setItem("cart", JSON.stringify(cart));

  }, [cart]);

  const addToCart = (product) => {

    if (!product) return;

    setCart((prev) => {

      const exists = prev.find(p => p._id === product._id);

      if (exists) {

        alert(product.name + " quantity updated");

        return prev.map(p =>
          p._id === product._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );

      }

      alert(product.name + " added to cart");

      return [...prev, { ...product, quantity: 1 }];

    });

  };

  const removeFromCart = (_id) => {

    setCart(prev => prev.filter(p => p._id !== _id));

  };

  const clearCart = () => {

    setCart([]);

  };

  return (

    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>

  );

};