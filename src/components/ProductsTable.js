import React from "react";
import {
  IconButton,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { Delete, Edit } from "@mui/icons-material";

const ProductsTable = ({ existentProducts, removeProduct, updateForm }) => {
  const handleRemoveProduct = (id, e) => {
    removeProduct(id, e);
  };
  const handleUpdateForm = (value) => {
    updateForm(value);
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Products table">
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
          {existentProducts.map((product, index) => (
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
                    handleRemoveProduct(product.id, event);
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
                    handleUpdateForm({
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
  );
};
export default ProductsTable;
