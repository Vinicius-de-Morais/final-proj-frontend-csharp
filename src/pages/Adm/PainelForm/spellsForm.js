import React, { useState, useEffect } from "react";
import { Button, Container, Form, Stack, Row } from "react-bootstrap";
import connection from "../../../Connection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ShowMessage from "../../../component/showMessage";
import Swal from "sweetalert2";
import RequestMaker from "../../../tools/requestMaker";

const SpellsForm = () => {
  const [SpellsArray, SetSpellsArray] = useState([]);
  const [SpellName, SetSpellName] = useState("");
  const [SpellDescription, SetSpellDescription] = useState("");

  // load the actual Spell
  const loadSpells = async () => {
    const response = await connection.get("/api/CadSpells");
    if (response.status === 200) {
      SetSpellsArray(response.data);
    }
  };

  // load the actual Spells
  useEffect(() => {
    (async () => {
      await loadSpells();
    })();
  }, []);

  // insert an new Spell
  const insertSpell = async () => {
    try {
      if (SpellName === "") {
        throw new Error("O nome deve conter algum valor");
      }
      if (SpellDescription === "") {
        throw new Error("A descrição deve conter algum valor");
      }

      const response = RequestMaker.insert("/api/CadSpells", {
        name: SpellName,
        description: SpellDescription,
      });

      if (response) {
        SetSpellName("");
        SetSpellDescription("");
    }
    await loadSpells();
    } catch (error) {
      Swal.fire("Ocorreu um erro: ", error.message, "error");
    }
  };

  const deleteSpell = async (name, id) => {
    const title = "Tem certeza que deseja deletar " + name + "?";
    const message = "Essa ação não poderá ser desfeita.";
    const result = await ShowMessage.withConfirm(title, message, "warning");

    if (result) {
      try {
        const response = await RequestMaker.delete("/api/CadSpells/", id);

        if (response) {
          await loadSpells();
        }
      } catch (error) {}
    }
  };

  const showModal = async(objArray) => {
    const res = await RequestMaker.updateWithModal(objArray, "spell");
    if(res) 
    await loadSpells();
  }

  return (
    <>
      <div className="container" style={{color: "white"}}>
        <Container
          className="col-12 border border-secondary rounded mb-3"
          direction="horizontal"
        >
          <Row
            gap={3}
            className="d-flex flex-row ms-1 me-1 mb-1 mt-1 justify-content-start"
          >
            {SpellsArray.map((value) => (
              <div
                className="p-1 w-auto border rounded ms-1 me-1 mb-1 mt-1"
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
                  onClick={() => deleteSpell(value.name, value.id)}
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
            id="SpellName"
            key="SpellName"
            value={SpellName}
            onChange={(e) => SetSpellName(e.target.value)}
          />
          <Form.Control
            className="me-auto"
            size="ld"
            as="textarea"
            rows={3}
            placeholder="Descrição"
            id="SpellDescription"
            key="SpellDescription"
            value={SpellDescription}
            onChange={(e) => SetSpellDescription(e.target.value)}
          />
          <div className="border-bottom" />
          <Button className="" onClick={insertSpell} style={{ backgroundColor: "#404189", borderColor: "#404189" }}>
            Enviar
          </Button>
        </Stack>
        <br />
      </div>
    </>
  );
};

export default SpellsForm;