import { faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, updateTask } from "../../features/tasks/taskSlice";
import { fetchCategories } from "../../features/categories/categorySlice";

function TaskCategory() {
  const [currentCategory, setCurrentCategory] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const categories = useSelector((state) => state.categories.categories);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    setCurrentCategory(e.target.value);
  };

  const openAddModal = (task) => {
    setCurrentCategory(task.category?._id || "");
    setCurrentTaskId(task._id);
    setIsTaskModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateTask({
        taskId: currentTaskId,
        taskData: { category: currentCategory },
      })
    )
      .unwrap()
      .then(() => {
        setIsTaskModalOpen(false);
        setCurrentTaskId(null);
        setCurrentCategory("");
        dispatch(fetchTasks());
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  return (
    <div className="px-3">
      <div>
        <h5 className="p-2 bg-light shadow-sm">
          Tasks <small className="fs-6">(total - {tasks?.length})</small>
        </h5>
      </div>

      <div className="task-list">
        <table className="table border">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task) => (
              <tr key={task?._id}>
                <td>{task?.title}</td>
                <td>
                  {task?.category?.name
                    ? `${task?.category?.name}`
                    : "Unassigned"}
                </td>
                <td className="text-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openAddModal(task)}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Update Category
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={isTaskModalOpen} onHide={() => setIsTaskModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">Change Task Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form method="post" onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={currentCategory}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  --select--
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button className="mt-2" size="sm" variant="success" type="submit">
              Change Category
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TaskCategory;
