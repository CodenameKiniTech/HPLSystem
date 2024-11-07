import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  useInsertProduct,
  useProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/api/products";
import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductListItem";
import Colors from "@/constants/Colors";

import * as FileSystem from 'expo-file-system';
import { randomUUID } from "expo-crypto";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";

const CreateProductScreen = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // Separate loading states
  const [isCreating, setCreating] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString?.[0]);
  const isUpdateMode = !!idString;

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { data: updatingProduct } = useProduct(id);
  const { mutate: deleteProduct } = useDeleteProduct();

  const router = useRouter();

  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]);

  const resetFields = () => {
    setName("");
    setPrice("");
  };

  const validateInput = () => {
    setErrors("");
    if (!name) {
      setErrors("Name is required!");
      return false;
    }
    if (!price) {
      setErrors("Price is required!");
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setErrors("Price is not a number!");
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (isUpdateMode) {
      onUpdate();
    } else {
      onCreate();
    }
  };

  const onCreate = async () => {
    if (!validateInput()) return;

    const imagePath = await uploadImage();

    setCreating(true); // Set create loading state
    insertProduct(
      { name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          setCreating(false);
          resetFields();
          router.back();
        },
        onError: () => setCreating(false),
      }
    );
  };

  const onUpdate = async () => {
    if (!validateInput()) return;

    const imagePath = await uploadImage();

    setUpdating(true); // Set update loading state
    updateProduct(
      { id, name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          setUpdating(false);
          resetFields();
          router.back();
        },
        onError: () => setUpdating(false),
      }
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onDelete = () => {
    setDeleting(true); // Set delete loading state
    deleteProduct(id, {
      onSuccess: () => {
        setDeleting(false);
        resetFields();
        router.replace("/(admin)");
      },
      onError: () => {
        setDeleting(false);
        Alert.alert("Error", "Failed to delete the product. Please try again.");
      },
    });
  };

  const confirmDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this product?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: onDelete },
    ]);
  };

  // Choose the appropriate loading message based on active state
  const getLoadingMessage = () => {
    if (isCreating) return "Creating product, please wait...";
    if (isUpdating) return "Updating product, please wait...";
    if (isDeleting) return "Deleting product, please wait...";
    return "";
  };

  const uploadImage = async () => {
    if (!image?.startsWith('file://')) {
      return;
    }
  
    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: 'base64',
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = 'image/png';
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, decode(base64), { contentType });
  
    if (data) {
      return data.path;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdateMode ? "Update Product" : "Create Product" }}
      />

      {/* Full-Screen Loading Overlay with dynamic message */}
      {(isCreating || isUpdating || isDeleting) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
          <Text style={styles.loadingText}>{getLoadingMessage()}</Text>
        </View>
      )}

      {/* Main content */}
      {!(isCreating || isUpdating || isDeleting) && (
        <>
          <Image
            source={{ uri: image || defaultPizzaImage }}
            style={styles.image}
            resizeMode="contain"
          />
          <Text onPress={pickImage} style={styles.textButton}>
            Select Image
          </Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="name"
            style={styles.input}
          />

          <Text style={styles.label}>Price (₱)</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder="price"
            style={styles.input}
            keyboardType="numeric"
          />

          <Text style={{ color: "red" }}>{errors}</Text>

          <Button onPress={onSubmit} text={isUpdateMode ? "Update" : "Create"} />

          {isUpdateMode && (
            <Text onPress={confirmDelete} style={styles.textButton}>
              Delete
            </Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  label: {
    color: "gray",
    fontSize: 16,
  },
  image: {
    width: "50%",
    aspectRatio: 1,
    alignSelf: "center",
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
});

export default CreateProductScreen;
