import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation } from 'react-query';

import NavbarAdmin from '../components/NavbarAdmin';

import { API } from "../config/api";

export default function UpdateCategoryAdmin() {
  const title = "Category admin";
  document.title = "DumbMerch | " + title;

  let navigate = useNavigate();
  const { id } = useParams();
  let api = API();

  const [category, setCategory] = useState({ name: "" });

  // Fetching category data by id from database
  let { refetch } = useQuery("categoryCache", async () => {
    const response = await api.get("/category/" + id);
    setCategory({ name: response.data.name });
  });

  const handleChange = (e) => {
    setCategory({
      ...category,
      name: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // Data body
      const body = JSON.stringify(category);

      // Configuration
      const config = {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body,
      };

      // Insert category data
      const response = await api.patch("/category/" + id, config);

      navigate("/category-admin");
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <NavbarAdmin title={title} />
      <Container className="py-5">
        <Row>
          <Col xs="12">
            <div className="text-header-category mb-4">Edit Category</div>
          </Col>
          <Col xs="12">
            <form onSubmit={(e) => handleSubmit.mutate(e)}>
              <input
                onChange={handleChange}
                value={category.name}
                placeholder="category"
                className="input-edit-category mt-4"
              />
              <div className="d-grid gap-2 mt-4">
                <Button type="submit" variant="success" size="md">
                  Save
                </Button>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
