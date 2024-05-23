import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import {
  fetchTaskAssignedtoMe,
  fetchTasks,
  updateTask,
} from "../../features/tasks/taskSlice";

export default function TaskAssignedtoMe() {
  const [currentStatus, setCurrentStatus] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.taskAssignedtoMe);
  const status = useSelector((state) => state.tasks.status);

  useEffect(() => {
    dispatch(fetchTaskAssignedtoMe());
  }, [dispatch]);

  const handleChange = (e) => {
    setCurrentStatus(e.target.value);
  };

  const openStatusModal = (task) => {
    setCurrentStatus(task.status || "");
    setCurrentTaskId(task._id);
    setIsTaskModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateTask({
        taskId: currentTaskId,
        taskData: { status: currentStatus },
      })
    )
      .unwrap()
      .then(() => {
        setIsTaskModalOpen(false);
        setCurrentTaskId(null);
        setCurrentStatus("");
        dispatch(fetchTaskAssignedtoMe());
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  return (
    <div className="px-3">
      <div>
        <h5 className="p-2 bg-light shadow-sm">
          Tasks Assigned to Me{" "}
          <small className="fs-6">(total - {tasks?.length})</small>
        </h5>
      </div>

      <div className="task-list">
        <table className="table border">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task) => (
              <tr key={task?._id}>
                <td>{task?.title}</td>
                <td>{task?.status}</td>
                <td className="text-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openStatusModal(task)}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Update Status
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={isTaskModalOpen} onHide={() => setIsTaskModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">Change Task Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form method="post" onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={currentStatus}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  --select--
                </option>
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Control>
            </Form.Group>
            <Button className="mt-2" size="sm" variant="success" type="submit">
              {status === "loading"
                ? "Please wait for change.."
                : "Change Status"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
