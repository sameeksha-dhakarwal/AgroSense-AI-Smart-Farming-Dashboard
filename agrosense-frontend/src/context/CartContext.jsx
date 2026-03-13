import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

/* Hook to access cart anywhere */
export const useCart = () => useContext(CartContext);

/* Cart Provider */
export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);

  /* Load cart from localStorage */
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  /* Save cart to localStorage */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* Add product to cart */
  const addToCart = (product) => {

    setCart((prev) => {

      const exists = prev.find(
        (item) => item._id === product._id
      );

      if (exists) {

        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );

      }

      return [...prev, { ...product, quantity: 1 }];

    });

  };

  /* Remove item */
  const removeFromCart = (_id) => {
    setCart((prev) =>
      prev.filter((item) => item._id !== _id)
    );
  };

  /* Clear cart */
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