/* src/App.js */
import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";

import { Amplify, API, graphqlOperation } from "aws-amplify";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "./graphql/mutations";
import { listProducts } from "./graphql/queries";
import awsExports from "./aws-exports";
import Form from "./components/Form";
import ProductsTable from "./components/ProductsTable";
Amplify.configure(awsExports);
const initialState = {
  name: "",
  description: "",
  price: "",
  size: "",
  color: "",
};
const App = () => {
  useEffect(() => {
    fetchProducts();
  }, []);
  const [formState, setFormState] = useState(initialState);
  const [products, setProducts] = useState([]);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchProducts() {
    try {
      const resultFetch = await API.graphql(graphqlOperation(listProducts));
      setProducts(resultFetch.data.listProducts.items);
    } catch (err) {
      console.log("error fetching Products");
    }
  }
  async function addProduct(e) {
    e.preventDefault();
    try {
      const resultCreate = await API.graphql(
        graphqlOperation(createProduct, {
          input: formState,
        })
      );
      const product = resultCreate.data.createProduct;
      setProducts([...products, product]);
      console.log(
        `A product has been created with ID: ${resultCreate.data.createProduct.id}`
      );
      setFormState(initialState);
    } catch (err) {
      console.log(err.errors[0].message);
    }
  }
  async function removeProduct(id, e) {
    try {
      const resultDelete = await API.graphql(
        graphqlOperation(deleteProduct, {
          input: {
            id,
          },
        })
      );
      console.log(
        `The product with ID: ${resultDelete.data.deleteProduct.id} has been deleted`
      );
      fetchProducts();
    } catch (err) {
      console.log("error deleting Product");
    }
  }
  async function editProduct(e) {
    e.preventDefault();
    try {
      const resultEdit = await API.graphql(
        graphqlOperation(updateProduct, {
          input: formState,
        })
      );
      console.log(
        `The product with ID: ${resultEdit.data.updateProduct.id} has been updated`
      );
      fetchProducts();
      setFormState(initialState);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Container maxWidth="lg" sx={{ p: 2 }}>
      <Form
        formData={formState}
        updateForm={setFormState}
        editProduct={editProduct}
        addProduct={addProduct}
        updateInput={setInput}
        initialState={initialState}
      />
      <ProductsTable
        existentProducts={products}
        removeProduct={removeProduct}
        updateForm={setFormState}
      />
    </Container>
  );
};

export default App;
