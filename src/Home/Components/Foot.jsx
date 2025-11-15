import React from "react";
import { Card } from "react-bootstrap";

const Foot = () => {
  return (
    <div>
      <br />
      <footer className="foot">
        <Card style={{ width: "100%"}}>
          <Card.Body className="text-secondary">
            <div style={{ textAlign: "center" }}>
              <p>All rights are reserved by section 420</p>
            </div>
          </Card.Body>
        </Card>
      </footer>
    </div>
  );
};

export default Foot;
