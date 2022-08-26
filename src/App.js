/* src/App.js */
import React, { useEffect, useState } from "react";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "./graphql/mutations";
import { listProducts } from "./graphql/queries";
import awsExports from "./aws-exports";
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
        `Product added with ID: ${resultCreate.data.createProduct.id}`
      );
      setFormState(initialState);
    } catch (err) {
      console.log(err.errors[0].message);
    }
  }
  async function removeProduct(id, e) {
    e.preventDefault();
    try {
      const resultDelete = await API.graphql(
        graphqlOperation(deleteProduct, {
          input: {
            id,
          },
        })
      );
      console.log(
        `Product with ID: ${resultDelete.data.deleteProduct.id} has been deleted`
      );
      fetchProducts();
    } catch (err) {
      console.log("error deleting Product");
    }
  }
  async function editProduct(currentProduct, e) {
    e.preventDefault();
    setFormState(currentProduct);
    const editData = { ...formState, id: currentProduct.id };
    try {
      const resultEdit = await API.graphql(
        graphqlOperation(updateProduct, {
          input: editData,
        })
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          onChange={(event) => setInput("name", event.target.value)}
          value={formState.name}
        ></input>
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          onChange={(event) => setInput("description", event.target.value)}
          value={formState.description}
        ></input>
        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          onChange={(event) => setInput("price", event.target.value)}
          value={formState.price}
        ></input>
        <label htmlFor="size">Size</label>
        <input
          type="text"
          id="size"
          onChange={(event) => setInput("size", event.target.value)}
          value={formState.size}
        ></input>
        <label htmlFor="color">Color</label>
        <input
          type="text"
          id="color"
          onChange={(event) => setInput("color", event.target.value)}
          value={formState.color}
        ></input>
        <button onClick={addProduct}>Add product</button>
      </form>
      <div>
        {products.map((product, index) => (
          <div key={product.id ? product.id : index}>
            <p>{product.id}</p>
            <p>{product.description}</p>
            <p>{product.price}</p>
            <p>{product.size}</p>
            <p>{product.color}</p>
            <button
              onClick={(event) => {
                removeProduct(product.id, event);
              }}
            >
              Delete
            </button>
            <button
              onClick={(event) => {
                editProduct(product, event);
              }}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
