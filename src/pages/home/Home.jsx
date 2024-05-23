import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTaskAssignedtoMe,
  fetchTasks,
} from "../../features/tasks/taskSlice";
import { Col, Row, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faListCheck,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

function Home() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const taskAssignedtoMe = useSelector((state) => state.tasks.taskAssignedtoMe);
  const taskStatus = useSelector((state) => state.tasks.status);
  const error = useSelector((state) => state.tasks.error);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchTaskAssignedtoMe());
  }, [dispatch]);

  // Calculate summary information
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;
  const todoTasks = tasks.filter((task) => task.status === "To-Do").length;

  // Calculate summary information
  const totalMyTasks = taskAssignedtoMe.length;
  const completedMyTasks = taskAssignedtoMe.filter(
    (task) => task.status === "Completed"
  ).length;
  const inProgressMyTasks = taskAssignedtoMe.filter(
    (task) => task.status === "In Progress"
  ).length;
  const todoMyTasks = taskAssignedtoMe.filter(
    (task) => task.status === "To-Do"
  ).length;

  return (
    <div className="px-3">
      <h5 className="border-bottom pb-2 mb-3">Task Created by Me</h5>
      <Row>
        <Col md={4}>
          <Card style={{ backgroundColor: "#cdb4db" }}>
            <Card.Body>
              <Card.Title className="text-center">
                <FontAwesomeIcon
                  className="fs-2"
                  icon={faList}
                ></FontAwesomeIcon>{" "}
              </Card.Title>
              <h5 className="text-center">Total Tasks-{totalTasks}</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ backgroundColor: "#bde0fe" }}>
            <Card.Body>
              <Card.Title className="text-center">
                <FontAwesomeIcon
                  className="fs-2"
                  icon={faListCheck}
                ></FontAwesomeIcon>{" "}
              </Card.Title>
              <h5 className="text-center">Completed Tasks-{completedTasks}</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ backgroundColor: "#ffc8dd" }}>
            <Card.Body>
              <Card.Title className="text-center">
                <FontAwesomeIcon
                  className="fs-2"
                  icon={faSpinner}
                ></FontAwesomeIcon>{" "}
              </Card.Title>
              <h5 className="text-center">
                In Progress Tasks-{inProgressTasks}
              </h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <h5 className="mt-5 border-bottom pb-2 mb-3">Task Assigned to Me</h5>
      <Row>
        <Col md={4}>
          <Card style={{ backgroundColor: "#cdb4db" }}>
            <Card.Body>
              <Card.Title className="text-center">
                <FontAwesomeIcon
                  className="fs-2"
                  icon={faList}
                ></FontAwesomeIcon>{" "}
              </Card.Title>
              <h5 className="text-center">Total Tasks-{totalMyTasks}</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ backgroundColor: "#bde0fe" }}>
            <Card.Body>
              <Card.Title className="text-center">
                <FontAwesomeIcon
                  className="fs-2"
                  icon={faListCheck}
                ></FontAwesomeIcon>{" "}
              </Card.Title>
              <h5 className="text-center">
                Completed Tasks-{completedMyTasks}
              </h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ backgroundColor: "#ffc8dd" }}>
            <Card.Body>
              <Card.Title className="text-center">
                <FontAwesomeIcon
                  className="fs-2"
                  icon={faSpinner}
                ></FontAwesomeIcon>{" "}
              </Card.Title>
              <h5 className="text-center">
                In Progress Tasks-{inProgressMyTasks}
              </h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
