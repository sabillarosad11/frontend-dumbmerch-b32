import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import ShowMoreText from 'react-show-more-text';
import rupiahFormat from 'rupiah-format';
import { useQuery, useMutation } from "react-query";

import NavbarAdmin from '../components/NavbarAdmin';
import DeleteData from '../components/modal/DeleteData';

import imgEmpty from '../assets/empty.svg';

import { API } from "../config/api";

export default function ProductAdmin() {
  let navigate = useNavigate();

  const title = "Product admin";
  document.title = "DumbMerch | " + title;

  // Variabel for delete product data
  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Modal Confirm delete data
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Fetching product
  let { data: products } = useQuery("productsCache", async () => {
    const response = await API.get("/products");
    return response.data.data.products;
  });
  console.log(products);

  const addProduct = () => {
    navigate("/add-product");
  };

  const handleUpdate = (id) => {
    navigate("/update-product/" + id);
  };

  // For get id product & show modal confirm delete data
  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  // If confirm is true, execute delete data
  const deleteById = useMutation(async (id) => {
    try {
      await API.delete(`/product/${id}`);
      // refetch();
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    if (confirmDelete) {
      // Close modal confirm delete data
      handleClose();
      // execute delete data by id function
      deleteById.mutate(idDelete);
      setConfirmDelete(null);
    }
  }, [confirmDelete]);

  return (
    <>
      <NavbarAdmin title={title} />

      <Container className="py-5">
        <Row>
          <Col xs="6">
            <div className="text-header-category mb-4">List Product</div>
          </Col>
          <Col xs="6" className="text-end">
            <Button
              onClick={addProduct}
              className="btn-dark"
              style={{ width: "100px" }}
            >
              Add
            </Button>
          </Col>
          <Col xs="12">
            {products?.length !== 0 ? (
              <Table striped hover size="lg" variant="dark">
                <thead>
                  <tr>
                    <th width="1%" className="text-center">
                      No
                    </th>
                    <th>Photo</th>
                    <th>Product Name</th>
                    <th>Product Desc</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((products, index) => (
                    <tr key={index}>
                      <td className="align-middle text-center">{index + 1}</td>
                      <td className="align-middle">
                        <img
                          src={products.image}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                          alt={products.name}
                        />
                      </td>
                      <td className="align-middle">{products.name}</td>
                      <td className="align-middle">
                        <ShowMoreText
                          lines={1}
                          more="show"
                          less="hide"
                          className="content-css"
                          anchorClass="my-anchor-css-class"
                          expanded={false}
                          width={280}
                        >
                          {products.desc}
                        </ShowMoreText>
                      </td>
                      <td className="align-middle">
                        {rupiahFormat.convert(products.price)}
                      </td>
                      <td className="align-middle">{products.qty}</td>
                      <td className="align-middle">
                        <Button
                          onClick={() => {
                            handleUpdate(products.id);
                          }}
                          className="btn-sm btn-success me-2"
                          style={{ width: "135px" }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            handleDelete(products.id);
                          }}
                          className="btn-sm btn-danger"
                          style={{ width: "135px" }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center pt-5">
                <img
                  src={imgEmpty}
                  className="img-fluid"
                  style={{ width: "40%" }}
                  alt="empty"
                />
                <div className="mt-3">No data product</div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <DeleteData
      setConfirmDelete={setConfirmDelete}
      show={show}
      handleClose={handleClose}
      />
    </>
  );
}
