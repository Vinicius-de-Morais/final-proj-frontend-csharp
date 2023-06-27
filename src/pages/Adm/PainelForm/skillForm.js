import React, { useState, useEffect } from "react";
import { Button, Container, Form, Stack, Row } from "react-bootstrap";
import connection from "../../../Connection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ShowMessage from "../../../component/showMessage";
import Swal from "sweetalert2";
import RequestMaker from "../../../tools/requestMaker";

const SkillsForm = () => {
  const [SkillsArray, SetSkillsArray] = useState([]);
  const [SkillName, SetSkillName] = useState("");
  const [SkillDescription, SetSkillDescription] = useState("");

  // load the actual Skill
  const loadSkills = async () => {
    const response = await connection.get("/api/CadSkills");
    if (response.status === 200) {
      SetSkillsArray(response.data);
    }
  };

  // load the actual skills
  useEffect(() => {
    (async () => {
      await loadSkills();
    })();
  }, []);

  // insert an new skill
  const insertSkill = async () => {
    try {
      if (SkillName === "") {
        throw new Error("O nome deve conter algum valor");
      }
      if (SkillDescription === "") {
        throw new Error("A descrição deve conter algum valor");
      }

      const response = RequestMaker.insert("/api/CadSkills", {
        name: SkillName,
        description: SkillDescription,
      });

      if (response) {
        SetSkillName("");
        SetSkillDescription("");
    }
    await loadSkills();
    } catch (error) {
      Swal.fire("Ocorreu um erro: ", error.message, "error");
    }
  };

  const deleteSkill = async (name, id) => {
    const title = "Tem certeza que deseja deletar " + name + "?";
    const message = "Essa ação não poderá ser desfeita.";
    const result = await ShowMessage.withConfirm(title, message, "warning");

    if (result) {
      try {
        const response = RequestMaker.delete("/api/CadSkills/", id);

        if (response) {
          await loadSkills();
        }
      } catch (error) {}
    }
  };

  const showModal = async(objArray) => {
    const res = await RequestMaker.updateWithModal(objArray, "skill");
    if(res) 
    await loadSkills();
  }

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
            {SkillsArray.map((value) => (
              <div
                className="p-1 w-auto border border-primary rounded ms-1 me-1 mb-1 mt-1"
                >
                <span className="me-2 fs-5 font-monospace"
                  onClick={() => showModal(value)}
                >{value.name}</span>
                <FontAwesomeIcon
                  role="button"
                  icon={faTrash}
                  size="xs"
                  id={value.id}
                  key={value.id}
                  onClick={() => deleteSkill(value.name, value.id)}
                />
              </div>
            ))}
          </Row>
        </Container>
        <Stack gap={3}>
          <Form.Control
            className="me-auto"
            size="ld"
            type="text"
            placeholder="Nome"
            id="SkillName"
            key="SkillName"
            value={SkillName}
            onChange={(e) => SetSkillName(e.target.value)}
          />
          <Form.Control
            className="me-auto"
            size="ld"
            as="textarea"
            rows={3}
            placeholder="Descrição"
            id="SkillDescription"
            key="SkillDescription"
            value={SkillDescription}
            onChange={(e) => SetSkillDescription(e.target.value)}
          />
          <div className="border-bottom" />
          <Button className="" onClick={insertSkill}>
            Enviar
          </Button>
        </Stack>
        <br />
      </div>
    </>
  );
};

export default SkillsForm;