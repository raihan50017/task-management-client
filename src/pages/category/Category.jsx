import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  addNewCategory,
  deleteCategory,
} from "../../features/categories/categorySlice";
import { Button, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

function Category() {
  const [newCategory, setNewCategory] = useState("");
  const [addError, setAddError] = useState({});
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const categoryStatus = useSelector((state) => state.categories.status);
  const error = useSelector((state) => state.categories.error);

  useEffect(() => {
    if (categoryStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [categoryStatus, dispatch]);

  const handleChange = (e) => {
    setNewCategory(e.target.value);
  };

  const openAddModal = () => {
    setNewCategory("");
    setIsCategoryModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addNewCategory({ name: newCategory }))
      .unwrap()
      .then(() => {
        setIsCategoryModalOpen(false);
        setNewCategory("");
      })
      .catch((error) => {
        setAddError(error?.errors);
      });
  };

  const handleDelete = () => {
    dispatch(deleteCategory(categoryToDelete))
      .unwrap()
      .then(() => {
        setIsDeleteModalOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
      });
  };

  return (
    <div className="px-3">
      <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
        <h5>
          Categories{" "}
          <small className="fs-6">(total - {categories?.length})</small>
        </h5>
        <Button variant="success" size="sm" onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} /> Add Category
        </Button>
      </div>

      <div className="category-list mt-3">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Category Name</th>
              <th className="text-center" scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories
              ?.slice()
              ?.reverse()
              .map((category) => (
                <tr key={category?._id}>
                  <td>{category?.name}</td>
                  <td className="text-center">
                    <Button
                      size="sm"
                      variant="danger"
                      className="ms-2"
                      onClick={() => {
                        setCategoryToDelete(category._id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal
        show={isCategoryModalOpen}
        onHide={() => setIsCategoryModalOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form method="post" onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newCategory}
                onChange={handleChange}
                required
              />
              <span className="text-danger">{addError?.name}</span>
            </Form.Group>
            <Button className="mt-2" size="sm" variant="success" type="submit">
              Add Category
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={isDeleteModalOpen}
        onHide={() => setIsDeleteModalOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this category?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            No
          </Button>
          <Button size="sm" variant="danger" onClick={handleDelete}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Category;
