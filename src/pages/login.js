import React, { useState } from "react";
import { Form, Button, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import connection from "../Connection";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [register, setRegister] = useState(false);

  const userObj = {
    username: username,
    password: password,
    name: name,
  };
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await connection.post("/api/login", userObj);

      if (response.status === 200) {
        navigate("/home", { replace: true ,  state: response.data});
      } else if (response.status === 401) {
        Swal.fire("Usuario ou senha invalidos", "Erro: " + response.statusText, "error");
      } else {
        Swal.fire("Erro ao Fazer Login", "Erro: " + response.statusText, "error");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await connection.post("/api/users", userObj);

      if (response.status === 200) {
        Swal.fire("Registrado", "Registro feito com sucesso", "success");
        setRegister(false);
      } else {
        Swal.fire("Erro ao Registrar", "Erro: " + response.statusText, "error");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const loginForm = (
    <>
      <h2>Login</h2>
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
          {register ? "Registrar" : "Login"}
        </Button>
      </Form>
    </>
  );

  const registerForm = (
    <>
      <h2>Registre-se</h2>
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
        <Form.Group controlId="name">
          <Form.Label>Nome:</Form.Label>
          <Form.Control
            style={{ width: "200px" }}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          onClick={handleRegister}
          style={{ backgroundColor: "#404189", borderColor: "#404189" }}
        >
          Registrar
        </Button>
      </Form>
    </>
  );

  const toggleForm = () => {
    setRegister(!register);
  };

  document.body.style = "background: #1d1f63;";
  return (
    <div className="container" style={{ color: "white" }}>
      <Row className="d-flex flex-column align-items-center">
        <img
          src="../I_AM_MISTA_KIN_DICE.png"
          alt="dado de gravata"
          style={{ width: 220, height: 220 }}
        />
        <h1 style={{ fontFamily: "Caprasimo", fontSize: 50 }}>Mr. Dice</h1>
      </Row>
      <div className={`form-container${register ? " slide-left" : ""}`}>
        {register ? registerForm : loginForm}
      </div>
      <h5 className="mt-3" onClick={toggleForm}>
        <a
          className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-75-hover"
          style={{
            cursor: "pointer",
          }}
        >
          {register ? "Login" : "Registrar-se"}
        </a>
      </h5>
    </div>
  );
};

export default LoginScreen;
