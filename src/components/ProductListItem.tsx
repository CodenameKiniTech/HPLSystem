import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import Colors from "@constants/Colors";
import { Tables } from "../types";
import { Href, Link, useSegments } from "expo-router";

export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

type ProductListItemProps = {
  product: Tables<"products">;
};

const ProductListItem = ({ product }: ProductListItemProps) => {
  const segments = useSegments();

  const path = `/${segments[0]}/menu/${product.id}` as Href;

  return (
    //<Link href={`/${segments[0]}/menu/${product.id}`} asChild>
    <Link href={path} asChild>
      <Pressable style={styles.container}>
        <Image
          source={{ uri: product.image || defaultPizzaImage }}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>₱{product.price}</Text>
      </Pressable>
    </Link>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    flex: 1,
    maxWidth: "50%",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: "bold",
  },
});
