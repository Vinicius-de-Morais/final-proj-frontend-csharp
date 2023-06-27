import React, { useState, useEffect } from "react";
import { Button, Container, Form, Stack, Row } from "react-bootstrap";
import connection from "../../../Connection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ShowMessage from "../../../component/showMessage";
import Swal from "sweetalert2";
import RequestMaker from "../../../tools/requestMaker";

const AbilityScoreForm = () => {
  const [atributesArray, SetAtributesArray] = useState([]);
  const [atributeName, SetAtributeName] = useState("");

  // load the abilities
  const loadAtributes = async () => {
    const response = await connection.get("/api/CadAbilityScores");
    if (response.status === 200) {
      SetAtributesArray(response.data);
    }
  };

  // load the actual abilities
  useEffect(() => {
    (async () => {
      await loadAtributes();
    })();
  }, []);

  // insert an new ability
  const insertAbility = async () => {
    try {
      if (atributeName === "") {
        throw new Error("O nome deve conter algum valor");
      }

      const created = RequestMaker.insert("/api/CadAbilityScores", {
        name: atributeName,
      });
      if (created) {
        SetAtributeName("");
        await loadAtributes();
      }
    } catch (error) {
      Swal.fire("Ocorreu um erro: ", error, "error");
    }
  };

  const deleteAbility = async (name, id) => {
    const title = "Tem certeza que deseja deletar " + name + "?";
    const message = "Essa ação não poderá ser desfeita.";
    const result = await ShowMessage.withConfirm(title, message, "warning");

    if (result) {
      try {
        const response = await RequestMaker.delete(
          "/api/CadAbilityScores/",
          id
        );

        if (response) {
          await loadAtributes();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <div className="container">
        <Container
          className="col-12 border border-secondary rounded mb-3"
          direction="horizontal"
        >
          <Row
            gap={3}
            className="d-flex flex-row ms-1 me-1 mb-1 mt-1 justify-content-start"
          >
            {atributesArray.map((value) => (
              <div className="p-1 w-auto border border-primary rounded ms-1 me-1 mb-1 mt-1">
                <span className="me-2 fs-5 font-monospace">{value.name}</span>
                <FontAwesomeIcon
                  role="button"
                  icon={faTrash}
                  size="xs"
                  id={value.id}
                  key={value.id}
                  onClick={() => deleteAbility(value.name, value.id)}
                />
              </div>
            ))}
          </Row>
        </Container>
        <Stack direction="horizontal" gap={3}>
          <Form.Control
            className="me-auto"
            size="ld"
            type="text"
            placeholder="Nome"
            id="atributeName"
            key="atributeName"
            value={atributeName}
            onChange={(e) => SetAtributeName(e.target.value)}
          />
          <div className="vr" />
          <Button className="" onClick={insertAbility}>
            Enviar
          </Button>
        </Stack>
        <br />
      </div>
    </>
  );
};

export default AbilityScoreForm;
