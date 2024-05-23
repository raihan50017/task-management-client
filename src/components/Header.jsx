import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { Dropdown, Button, Modal } from "react-bootstrap";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import apiClient from "../hooks/axios";
const socket = io("http://localhost:8000");

function Header({ handleOffcanvasShow }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  // State to manage modal visibility
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/auth/login");
  };

  // Function to handle opening modal
  const handleShowModal = () => {
    setShowModal(true);
  };

  // Function to handle closing modal
  const handleCloseModal = () => {
    localStorage.removeItem("task-notification");
    setTaskNotification([]);
    setShowModal(false);
  };

  const [taskNotification, setTaskNotification] = useState([]);

  useEffect(() => {
    let notificationData = localStorage.getItem("task-notification");
    if (notificationData) {
      notificationData = JSON.parse(notificationData);
      setTaskNotification(notificationData?.notificatin);
    }
    const authData = JSON.parse(localStorage.getItem("auth-data"));
    const token = authData ? authData.access_token : null;
    apiClient
      .get("/user/verify-token", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setUserId(response?.data?.userId);
      });
  }, []);

  // Listen for the 'taskUpdate' event from the server
  socket.on("taskUpdate", function (data) {
    if (data?.task?.createdBy?._id == userId) {
      let notificationData = localStorage.getItem("task-notification");

      if (notificationData) {
        // If notificationData exists in localStorage
        notificationData = JSON.parse(notificationData);

        const index = notificationData?.notificatin?.findIndex(
          (item) =>
            item?.task?._id === data?.task?._id &&
            item?.task?.status === data?.task?.status
        );

        if (index === -1) {
          notificationData.notificatin.push(data);
          localStorage.setItem(
            "task-notification",
            JSON.stringify(notificationData)
          );
        }
      } else {
        // If notificationData doesn't exist in localStorage
        localStorage.setItem(
          "task-notification",
          JSON.stringify({ notificatin: [data] })
        );
      }

      // Retrieve the updated notificationData from localStorage
      notificationData = JSON.parse(localStorage.getItem("task-notification"));
      setTaskNotification(notificationData.notificatin);
    }
  });

  return (
    <div
      style={{ backgroundColor: "#219ebc", zIndex: "1000" }}
      className="d-flex align-items-center justify-content-between position-sticky px-3 py-2 top-0 text-white shadow-sm"
    >
      <div>
        <h4 className="m-0 d-none d-md-block">Logo</h4>
        <Button
          variant="primary d-block d-md-none p-0 m-0 bg-transparent border-0 rounded-0"
          onClick={handleOffcanvasShow}
        >
          <FontAwesomeIcon className="fs-3" icon={faBars}></FontAwesomeIcon>
        </Button>
      </div>
      <div className="d-flex">
        <div className="position-relative me-3 mt-2">
          {" "}
          <FontAwesomeIcon
            icon={faBell}
            size="lg"
            style={{ cursor: "pointer" }}
            onClick={handleShowModal}
          />
          {taskNotification != undefined && taskNotification?.length != 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {taskNotification?.length}
              <span className="visually-hidden">unread messages</span>
            </span>
          )}
        </div>
        <Dropdown>
          <Dropdown.Toggle
            size="sm"
            className="m-0 p-0 rounded-circle"
            variant="success"
            id="dropdown-basic"
          >
            <FontAwesomeIcon
              style={{ fontSize: "30px" }}
              icon={faCircleUser}
            ></FontAwesomeIcon>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Modal for notification */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {taskNotification?.map((item) => (
            <div
              key={item?.task?._id + item?.task?._status}
              className="border-bottom"
            >
              <p>
                <span className="fw-bold">{item?.task?.title}</span> is updated
                to <span className="fw-bold">{item?.task?.status}</span>
              </p>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Header;
