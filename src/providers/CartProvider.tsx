import { CartItem, Product } from "@/types";
import products from "@assets/data/products";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import {getRandomBytesAsync, randomUUID} from 'expo-crypto';

type CartType = {
    items: CartItem[],
    addItem: (product: Product, size: CartItem['size']) => void;
    updateQuantity: (itemId: string, amount: -1 | 1) => void;
};


const CartContext = createContext<CartType>({
    items: [],
    addItem: () => {},
    updateQuantity: () => {},
});

const CartProvider = ({children}: PropsWithChildren) => {

    const [items, setItems] = useState<CartItem[]>([]);

    const addItem  = (product: Product, size: CartItem['size']) => {

        const existingItems = items.find(item => item.product == product && item.size == size);

        if (existingItems) {
            updateQuantity(existingItems.id, 1);
            return;
        }

        const newCartItem: CartItem = {
            id: randomUUID(),
            product,
            product_id: product.id, 
            size, 
            quantity: 1,
        };

        setItems([newCartItem, ...items]);
    };

    const updateQuantity = (itemId: string, amount: 1 | -1) => {
        setItems((existingItems) =>
          existingItems
            .map((it) =>
              it.id === itemId ? { ...it, quantity: it.quantity + amount } : it
            )
            .filter((item) => item.quantity > 0)
        );
      };

    return (
        <CartContext.Provider 
        value={{ items, addItem, updateQuantity }}
        >

         {children}


        </CartContext.Provider>
    );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);