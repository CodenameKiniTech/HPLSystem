import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import products from "@assets/data/products";
import { defaultPizzaImage } from "@/components/ProductListItem";
import { PizzaSize } from "@/types";
import React, { useState } from 'react';
import Button from "@/components/Button";

const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL', 'XXL'];

const ProductDetailsScreen = () => {

    const { id } = useLocalSearchParams();
    const [selectedSize, setSelectedSize] = useState<PizzaSize>('S');

    const product = products.find((p) => p.id.toString() == id);

    const addToCart = () => {
        console.warn('Adding to cart, size: ', selectedSize);
    };

    if(!product) {
        return <Text>Product not found</Text>;
    }

    return (
        <View style={styles.container}>
          <Stack.Screen options={{ title: 'Details ' + product.name }} />

          <Image source={{ uri: product.image || defaultPizzaImage }} style={styles.image} />

    <Text style={styles.subtitle}>Select size</Text>
      <View style={styles.sizes}>
        {sizes.map((size) => (
          <Pressable
            onPress={() => setSelectedSize(size)}
            key={size}
            style={[
              styles.size,
              {
                backgroundColor: size === selectedSize ? 'gainsboro' : 'white',
              },
            ]}
          >
            <Text
              style={[
                styles.sizeText,
                { color: size === selectedSize ? 'black' : 'gray' },
              ]}
            >
              {size}
            </Text>
          </Pressable>
        ))}
      </View>
            <Text style={styles.price}>
                Price ₱{product.price}
            </Text>
            <Button onPress={addToCart} text="Add to cart" />
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
        backgroundColor: 'white',
        padding: 10,
        flex: 1,
      },
      image: {
        width: '100%',
        aspectRatio: 1,
        alignSelf: 'center',
      },
      subtitle: {
        marginVertical: 10,
        fontWeight: '600',
      },
      price: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 'auto',
      },
    
      sizes: {
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
      size: {
        width: 50,
        aspectRatio: 1,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
      },
      sizeText: {
        fontSize: 20,
        fontWeight: '500',
        color: 'black',
      },
});

export default ProductDetailsScreen;