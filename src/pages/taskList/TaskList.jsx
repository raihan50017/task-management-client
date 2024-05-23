import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../features/tasks/taskSlice";
import {
  Form,
  Button,
  Alert,
  Spinner,
  ListGroup,
  Modal,
} from "react-bootstrap";
import {
  addNewTaskList,
  fetchTaskLists,
  deleteTaskList,
} from "../../features/taskLists/taskListSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function CreateTaskList() {
  const [name, setName] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [taskListIdToDelete, setTaskListIdToDelete] = useState(null);

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const taskStatus = useSelector((state) => state.tasks.status);
  const error = useSelector((state) => state.tasks.error);

  const taskLists = useSelector((state) => state.taskLists.taskLists);
  const taskListStatus = useSelector((state) => state.taskLists.status);

  useEffect(() => {
    if (taskStatus === "idle") {
      dispatch(fetchTasks());
    }
    if (taskListStatus === "idle") {
      dispatch(fetchTaskLists());
    }
  }, [taskListStatus, taskStatus, dispatch]);

  const handleTaskSelection = (taskId) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(taskId)
        ? prevSelected.filter((id) => id !== taskId)
        : [...prevSelected, taskId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const taskListData = {
      name,
      tasks: selectedTasks,
    };

    try {
      const result = await dispatch(addNewTaskList(taskListData)).unwrap();
      console.log("New task list added successfully:", result);
      setName("");
      setSelectedTasks([]);
      dispatch(fetchTaskLists());
    } catch (error) {
      console.log("Failed to add new task list:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTaskList(taskListIdToDelete)).unwrap();
      console.log("Task list deleted successfully");
      setShowConfirmation(false);
    } catch (error) {
      console.log("Failed to delete task list:", error);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleShowConfirmation = (taskListId) => {
    setShowConfirmation(true);
    setTaskListIdToDelete(taskListId);
  };

  return (
    <div className="px-3">
      <h5>Create Task List</h5>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter task list name"
          />
        </Form.Group>
        <Form.Group controlId="formTasks">
          <Form.Label>Tasks</Form.Label>
          <div style={{ maxHeight: "180px", overflowY: "auto" }}>
            {tasks.map((task) => (
              <Form.Check
                key={task._id}
                type="checkbox"
                id={`task-${task._id}`}
                label={task?.title}
                checked={selectedTasks.includes(task._id)}
                onChange={() => handleTaskSelection(task._id)}
              />
            ))}
          </div>
        </Form.Group>
        <Button className="mt-2" size="sm" type="submit" variant="primary">
          Create Task List
        </Button>
      </Form>

      <h5 className="mt-4 shadow-sm p-2 bg-light">
        Task Lists <small className="fs-6">(total-{taskLists.length})</small>
      </h5>
      {taskLists.length > 0 ? (
        <ListGroup>
          {taskLists
            ?.slice()
            ?.reverse()
            .map((taskList) => (
              <ListGroup.Item key={taskList._id}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6>{taskList.name}</h6>
                    <ul>
                      {taskList.tasks.map((task) => (
                        <li key={task._id}>{task.title}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleShowConfirmation(taskList._id)}
                    >
                      <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon> Delete
                    </Button>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
        </ListGroup>
      ) : (
        <p>No task lists available.</p>
      )}

      <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task list?</Modal.Body>
        <Modal.Footer>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleCloseConfirmation}
          >
            Cancel
          </Button>
          <Button size="sm" variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CreateTaskList;
