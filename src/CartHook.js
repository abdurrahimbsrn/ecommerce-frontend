// src/hooks/useCart.js (Güncellenmiş)

import { useState, useEffect } from 'react';

const CART_KEY = 'e-commerce-cart';

export const useCart = () => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem(CART_KEY);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        // localStorage'dan okurken fiyat ve miktarı sayıya dönüştür
        return parsedCart.map(item => ({
          ...item,
          fiyat: Number(item.fiyat || 0), // 'fiyat' alanını sayıya dönüştür
          miktar: Number(item.miktar || 0), // 'miktar' alanını sayıya dönüştür
        }));
      }
      return [];
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, miktar: Number(item.miktar) + Number(quantity) } : item // Miktarı sayıya dönüştürerek artır
        );
      } else {
        // Yeni bir ürün eklerken de fiyat ve miktarı sayıya dönüştür
        return [...prevItems, { 
          ...product, 
          fiyat: Number(product.fiyat || 0), // Ürünün fiyatını sayıya dönüştür
          miktar: Number(quantity) 
        }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    const quantityAsNumber = Number(newQuantity); // Yeni miktarı sayıya dönüştür
    if (quantityAsNumber <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, miktar: quantityAsNumber } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Sepet toplamını hesaplarken de sayısal değerleri kullan
  const cartTotalAmount = cartItems.reduce((total, item) => total + (Number(item.fiyat) * Number(item.miktar)), 0);


  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal: cartTotalAmount, // Güncellenmiş toplamı döndür
  };
};