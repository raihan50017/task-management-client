import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from "../../features/tasks/taskSlice";

function Task() {
  // State Management
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
  });
  const [addError, setAddError] = useState({});
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const taskStatus = useSelector((state) => state.tasks.status);
  const error = useSelector((state) => state.tasks.error);

  useEffect(() => {
    if (taskStatus === "idle") {
      dispatch(fetchTasks());
    }
  }, [taskStatus, dispatch]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  // Open modals
  const openEditModal = (task) => {
    setAddError({});
    setNewTask(task);
    setIsEditing(true);
    setCurrentTaskId(task._id);
    setIsTaskModalOpen(true);
  };

  const openAddModal = () => {
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "Low",
    });
    setIsEditing(false);
    setIsTaskModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      dispatch(updateTask({ taskId: currentTaskId, taskData: newTask }))
        .unwrap()
        .then((result) => {
          console.log("Task updated successfully:", result);
          setIsTaskModalOpen(false);
          setIsEditing(false);
          setCurrentTaskId(null);
          setNewTask({
            title: "",
            description: "",
            dueDate: "",
            priority: "",
          });
        })
        .catch((error) => {
          console.error("Error updating task:", error);
        });
    } else {
      dispatch(addNewTask(newTask))
        .unwrap()
        .then((result) => {
          console.log("New task added successfully:", result);
          setIsTaskModalOpen(false);
          setNewTask({
            title: "",
            description: "",
            dueDate: "",
            priority: "",
          });
        })
        .catch((error) => {
          setAddError(error?.errors);
        });
    }
  };

  const handleDelete = () => {
    dispatch(deleteTask(taskToDelete))
      .unwrap()
      .then(() => {
        setIsDeleteModalOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  return (
    <div className="px-3">
      <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
        <h5>
          Tasks <small className="fs-6">(total - {tasks?.length})</small>
        </h5>
        <Button variant="success" size="sm" onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} /> Add Task
        </Button>
      </div>

      <div className="task-list mt-3">
        {tasks
          ?.slice()
          ?.reverse()
          .map((task) => (
            <div key={task?._id} className="task-item border p-3 mb-2">
              <h5>{task?.title}</h5>
              <p className="p-0 m-0">{task.description}</p>
              <p className="p-0 m-0">
                Due Date: {task?.dueDate?.split("T")[0]}
              </p>
              <p className="p-0 m-0">Priority: {task?.priority}</p>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => openEditModal(task)}
              >
                <FontAwesomeIcon icon={faEdit} /> Edit
              </Button>
              <Button
                size="sm"
                variant="danger"
                className="ms-2"
                onClick={() => {
                  setTaskToDelete(task._id);
                  setIsDeleteModalOpen(true);
                }}
              >
                <FontAwesomeIcon icon={faTrash} /> Delete
              </Button>
            </div>
          ))}
      </div>

      <Modal show={isTaskModalOpen} onHide={() => setIsTaskModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">
            {isEditing ? "Edit Task" : "Add Task"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form method="post" onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleChange}
                required
              />
              <span className="text-danger">{addError?.title}</span>
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                as="textarea"
                name="description"
                value={newTask.description}
                onChange={handleChange}
                required
              />
              <span className="text-danger">{addError?.description}</span>
            </Form.Group>
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={newTask.dueDate?.split("T")[0]}
                onChange={handleChange}
                required
              />
              <span className="text-danger">{addError?.dueDate}</span>
            </Form.Group>
            <Form.Group>
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                name="priority"
                value={newTask?.priority}
                onChange={handleChange}
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Form.Control>
              <span className="text-danger">{addError?.priority}</span>
            </Form.Group>
            <Button className="mt-2" size="sm" variant="success" type="submit">
              {isEditing ? "Update Task" : "Add Task"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={isDeleteModalOpen}
        onHide={() => setIsDeleteModalOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this task?</p>
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

export default Task;
