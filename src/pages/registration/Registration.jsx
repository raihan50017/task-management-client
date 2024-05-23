import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../hooks/axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient
        .post("/user/register", formData)
        .then((response) => {
          setErrors({});
          setFormData({ firstName: "", lastName: "", email: "", password: "" });
          setSuccessMessage("Registration Successfulll!");
          dispatch(
            loginSuccess({
              data: response?.data?.data,
              token: response?.data?.token,
            })
          );
          setTimeout(() => {
            navigate("/");
          }, 3000);
        })
        .catch((error) => {
          setErrors(error?.response?.data?.errors);
          setSuccessMessage("");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <div className="p-3 bg-light rounded shadow-sm">
            <h2 className="mb-4">Register</h2>
            <span className="text-success text-center d-block">
              {successMessage}
            </span>
            <span className="text-danger text-center d-block">
              {errors?.message}
            </span>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2" controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <span className="text-danger">{errors?.firstName}</span>
              </Form.Group>
              <Form.Group className="mb-2" controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <span className="text-danger">{errors?.lastName}</span>
              </Form.Group>
              <Form.Group className="mb-2" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <span className="text-danger">{errors?.email}</span>
              </Form.Group>
              <Form.Group className="mb-2" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span className="text-danger">{errors?.password}</span>
              </Form.Group>
              <Button className="mb-2" variant="success" type="submit">
                Register
              </Button>
            </Form>
            If registered, <Link to="../login">login now</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Registration;
