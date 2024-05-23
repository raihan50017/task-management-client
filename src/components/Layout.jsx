import { Col, Container, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useState } from "react";
import Sidebar from "./Sidebar";

function Layout() {
  const [offcanvasShow, setOffcanvasShow] = useState(false);

  const handleOffcanvasClose = () => setOffcanvasShow(false);
  const handleOffcanvasShow = () => setOffcanvasShow(true);
  return (
    <>
      <Header handleOffcanvasShow={handleOffcanvasShow}></Header>
      <Container>
        <Row className="g-0 mt-3">
          <Col md={3} className="d-md-block d-none">
            <Sidebar
              offcanvasShow={offcanvasShow}
              handleOffcanvasClose={handleOffcanvasClose}
            ></Sidebar>
          </Col>
          <Col md={9}>
            <Outlet></Outlet>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Layout;
