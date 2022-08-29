/* src/App.js */
import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { Delete, Edit, Send } from "@mui/icons-material";
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
    <div>
      <form onSubmit={formState.id ? editProduct : addProduct}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          required
          onChange={(event) => setInput("name", event.target.value)}
          value={formState.name}
        />
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          required
          onChange={(event) => setInput("description", event.target.value)}
          value={formState.description}
        ></input>
        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          required
          onChange={(event) => setInput("price", event.target.value)}
          value={formState.price}
        ></input>
        <label htmlFor="size">Size</label>
        <input
          type="text"
          id="size"
          onChange={(event) => setInput("size", event.target.value)}
          value={formState.size}
          required
        ></input>
        <label htmlFor="color">Color</label>
        <input
          type="text"
          id="color"
          onChange={(event) => setInput("color", event.target.value)}
          value={formState.color}
          required
        ></input>
        {/* the field id is only included in formState when editing a product as it is the main key and it is populated from the database.
        It is not needed when creating a new product as it is generated by the DB. */}
        <Button
          variant="contained"
          size="small"
          type="submit"
          endIcon={<Send />}
        >
          {formState.id ? "Edit Product" : "Add product"}
        </Button>
        <Button
          size="small"
          variant="outlined"
          type="button"
          onClick={() => setFormState(initialState)}
        >
          Clear
        </Button>
      </form>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.id ? product.id : index}>
                {/* <p>{product.id}</p> */}
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>$ {product.price}</TableCell>
                <TableCell>{product.size}</TableCell>
                <TableCell>{product.color}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="delete"
                    type="button"
                    onClick={(event) => {
                      removeProduct(product.id, event);
                    }}
                  >
                    <Delete />
                  </IconButton>
                  {/* when editing, an array is created only with the data needed for the update API call as the fetch query 
              brings fields that are not needed e.g (createdAt) when updating and generate errors */}
                  <IconButton
                    aria-label="edit"
                    type="button"
                    onClick={() => {
                      setFormState({
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        size: product.size,
                        color: product.color,
                      });
                    }}
                  >
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default App;
