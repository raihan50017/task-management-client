import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, updateTask } from "../../features/tasks/taskSlice";
import { fetchUsers } from "../../features/users/userSlice";

function AssignTask() {
  const [currentUserId, setCurrentUserId] = useState("");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks?.tasks);
  const users = useSelector((state) => state.users?.users);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleUserChange = (e) => {
    setCurrentUserId(e.target.value);
  };

  const openUserModal = (task) => {
    setCurrentUserId(task.assignedTo?._id || "");
    setCurrentTaskId(task._id);
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateTask({
        taskId: currentTaskId,
        taskData: { assignedTo: currentUserId },
      })
    )
      .unwrap()
      .then(() => {
        setIsUserModalOpen(false);
        setCurrentTaskId(null);
        setCurrentUserId("");
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
              <th>Assigned To</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task) => (
              <tr key={task?._id}>
                <td>{task?.title}</td>
                <td>
                  {task?.assignedTo?.firstName
                    ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}`
                    : "Unassigned"}
                </td>
                <td className="text-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openUserModal(task)}
                  >
                    <FontAwesomeIcon icon={faUser} /> Assign User
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={isUserModalOpen} onHide={() => setIsUserModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">Assign Task to User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form method="post" onSubmit={handleUserSubmit}>
            <Form.Group>
              <Form.Label>User</Form.Label>
              <Form.Control
                as="select"
                name="user"
                value={currentUserId}
                onChange={handleUserChange}
                required
              >
                <option value="" disabled>
                  --select--
                </option>
                {users?.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button className="mt-2" size="sm" variant="success" type="submit">
              Assign User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AssignTask;
