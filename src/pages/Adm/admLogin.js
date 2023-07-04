import React, { useState } from "react";
import { Form, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import connection from "../../Connection";


const AdmLoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const userObj = {
    username: username,
    password: password,
    name: "ADMIN",
  };

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if(username == "ADM" && password=="adm123"){
        const response = await connection.post("/api/login", userObj);
        navigate('/painel')
      } else {
        Swal.fire("Usuario ou senha invalidos", "", "error");
      }

    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  document.body.style = "background: #1d1f63;";
  return (
    <div className="container" style={{ color: "white"}}>
      <Row className="d-flex flex-column align-items-center">
        <img
          src="../I_AM_MISTA_KIN_DICE.png"
          alt="dado de gravata"
          style={{ width: 220, height: 220 }}
        />
        <h1 style={{ fontFamily: "Caprasimo", fontSize: 50 }}>Mr. Dice</h1>
      </Row>
      <h2>ADM Login</h2>
      <Form>
        <Form.Group controlId="username">
          <Form.Label>Nome de Usuário:</Form.Label>
          <Form.Control
            style={{ width: "200px" }}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mx-auto"
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Senha:</Form.Label>
          <Form.Control
            style={{ width: "200px" }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mx-auto"
          />
        </Form.Group>
        <Button
          variant="primary"
          type="button"
          className="mt-2"
          onClick={handleLogin}
          style={{ backgroundColor: "#404189", borderColor: "#404189" }}
        >
          Login
        </Button>
      </Form>
    </div>
  );
};

export default AdmLoginScreen;