import {
  faDashboard,
  faGear,
  faKeyboard,
  faList,
  faListCheck,
  faPen,
  faPenSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Offcanvas } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Make sure to import Bootstrap CSS
import { useEffect, useState } from "react";

function Sidebar({ offcanvasShow, handleOffcanvasClose }) {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  return (
    <>
      {/* Mobile Menu */}
      <Offcanvas
        className="w-75"
        show={offcanvasShow}
        onHide={handleOffcanvasClose}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Task Management</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="side-bar">
            <Link
              onClick={handleOffcanvasClose}
              to="/"
              className={`nav-link px-3 py-2 border-bottom ${
                currentPath === "/" ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faDashboard} /> Dashboard
            </Link>
            <Link
              to="/task"
              onClick={handleOffcanvasClose}
              className={`nav-link px-3 py-2 border-bottom ${
                currentPath === "/task" ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faListCheck} /> Tasks
            </Link>
            <Link
              to="/category"
              onClick={handleOffcanvasClose}
              className={`nav-link px-3 py-2 border-bottom ${
                currentPath === "/category" ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faKeyboard} /> Category
            </Link>
            <Link
              to="/task-category"
              onClick={handleOffcanvasClose}
              className={`nav-link px-3 py-2 border-bottom ${
                currentPath === "/task-category" ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faList} />
              Task Category
            </Link>
            <Link
              to="/task-list"
              onClick={handleOffcanvasClose}
              className={`nav-link px-3 py-2 border-bottom ${
                currentPath === "/task-list" ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faListCheck} />
              Task List
            </Link>
            <Link
              to="/assign-task"
              onClick={handleOffcanvasClose}
              className={`nav-link px-3 py-2 border-bottom ${
                currentPath === "/assign-task" ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faPenSquare} />
              Assign Task
            </Link>
            <Link
              to="/assignedto-me"
              onClick={handleOffcanvasClose}
              className={`nav-link px-3 py-2 border-bottom ${
                currentPath === "/assignedto-me" ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faList} />
              Assign Task
            </Link>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      {/* Large Screen Menu */}
      <div className="side-bar rounded shasow-sm">
        <Link
          to="/"
          className={`nav-link px-3 py-2 border-bottom ${
            currentPath === "/" ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faDashboard} /> Dashboard
        </Link>
        <Link
          to="/task"
          className={`nav-link px-3 py-2 border-bottom ${
            currentPath === "/task" ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faListCheck} /> Tasks
        </Link>
        <Link
          to="/category"
          className={`nav-link px-3 py-2 border-bottom ${
            currentPath === "/category" ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faKeyboard} /> Category
        </Link>
        <Link
          to="/task-category"
          className={`nav-link px-3 py-2 border-bottom ${
            currentPath === "/task-category" ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faList} /> Task Category
        </Link>
        <Link
          to="/task-list"
          className={`nav-link px-3 py-2 border-bottom ${
            currentPath === "/task-list" ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faListCheck} /> Task List
        </Link>
        <Link
          to="/assign-task"
          className={`nav-link px-3 py-2 border-bottom ${
            currentPath === "/assign-task" ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faPenSquare} /> Assign Task
        </Link>
        <Link
          to="/assignedto-me"
          className={`nav-link px-3 py-2 border-bottom ${
            currentPath === "/assignedto-me" ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faList} /> Assigned to Me
        </Link>
      </div>
    </>
  );
}

export default Sidebar;
