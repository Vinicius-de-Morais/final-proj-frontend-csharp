import React, { useState, useEffect } from "react";
import { Button, Container, Form, Stack, Row } from "react-bootstrap";
import connection from "../../../Connection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ShowMessage from "../../../component/showMessage";
import Swal from "sweetalert2";
import RequestMaker from "../../../tools/requestMaker";

const ClassesForm = () => {
  const [atributesArray, SetAtributesArray] = useState([]);
  const [ClassesArray, SetClassesArray] = useState([]);
  const [selectedAtributes, SetSelectedAtributes] = useState({ values: [] });
  const [className, SetClassName] = useState("");
  const [classDescription, SetClassDescription] = useState("");
  
  // load the abilities
  const loadAtributes = async () => {
    const response = await connection.get("/api/CadAbilityScores");
    if (response.status === 200) {
      SetAtributesArray(response.data);
    }
  };

  // load the actual Classes
  const loadClasses = async () => {
    const response = await connection.get("/api/Classes");
    if (response.status === 200) {
      SetClassesArray(response.data);
    }
  };

  // load the actual classes
  useEffect(() => {
    (async () => {
      await loadAtributes();
      await loadClasses();
    })();
  }, []);

  // insert an new classe
  const insertClass = async () => {
    try {
      if (className === "") {
        throw new Error("O nome deve conter algum valor");
      }
      if (classDescription === "") {
        throw new Error("A descrição deve conter algum valor");
      }

      const response = await RequestMaker.insert("/api/Classes", {
        name: className,
        description: classDescription,
        classModifiers: selectedAtributes.values,
      });

      if (response) {
        SetClassName("");
        SetClassDescription("");
        await loadClasses();
      }
    } catch (error) {
      Swal.fire("Ocorreu um erro: ", error.message, "error");
    }
  };

  const deleteClass = async (name, id) => {
    const title = "Tem certeza que deseja deletar " + name + "?";
    const message = "Essa ação não poderá ser desfeita.";
    const result = await ShowMessage.withConfirm(title, message, "warning");

    if (result) {
      try {
        const response = await RequestMaker.delete("/api/Classes/", id);

        if (response) {
          await loadClasses();
        }
      } catch (error) {}
    }
  };

  const setSelected = (event) => {
    let { value, checked } = event.target;
    const { values } = selectedAtributes;
    value = JSON.parse(value);

    if (checked) {
      SetSelectedAtributes({ values: [...values, value] });
    } else {
      SetSelectedAtributes({
        values: values.filter((element) => element.id !== value.id),
      });
    }
  };

  const showModal = async(objArray) => {
    const res = await RequestMaker.updateWithModal(objArray, "class");
    if(res) 
    await loadClasses();
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
            {ClassesArray.map((value) => (
              <div
                className="p-1 w-auto border rounded ms-1 me-1 mb-1 mt-1"
              >
                <span className="me-2 fs-5 font-monospace" onClick={() => showModal(value)}>{value.name}</span>
                <FontAwesomeIcon
                  role="button"
                  icon={faTrash}
                  size="xs"
                  id={value.id}
                  key={value.id}
                  onClick={() => deleteClass(value.name, value.id)}
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
            id="className"
            key="className"
            value={className}
            onChange={(e) => SetClassName(e.target.value)}
          />
          <Form.Control
            className="me-auto"
            size="ld"
            as="textarea"
            rows={3}
            placeholder="Descrição"
            id="classDescription"
            key="classDescription"
            value={classDescription}
            onChange={(e) => SetClassDescription(e.target.value)}
          />
          <Row
            id="selects"
            className="d-flex flex-row ms-1 me-1 mb-1 mt-1 justify-content-center border border-secondary rounded mb-3"
          >
            <Form.Label htmlFor="selects">Atritos que irá afetar</Form.Label>
            {atributesArray.map((value) => (
              <div key={`default-checkbox-${value.id}`} className="p-1 w-auto">
                <Form.Check
                  type={"checkbox"}
                  id={`atribute-${value.id}`}
                  key={`atribute-${value.id}`}
                  value={JSON.stringify({
                    cadAbilityScoreId: value.id,
                    name: value.name,
                    value: 0,
                  })}
                  label={<span className="font-monospace">{value.name}</span>}
                  onChange={setSelected}
                />
              </div>
            ))}
          </Row>
          <Row
            direction="horizontal"
            key="selectedFields"
            className="d-flex flex-row ms-1 me-1 mb-1 mt-1 justify-content-start"
          >
            {selectedAtributes.values.map((selected) => {
              return (
                <div className="w-auto justify-content-start">
                  <Form.Label
                    htmlFor={selected.name + "-" + selected.cadAbilityScoreId}
                    className="d-block"
                  >
                    {selected.name}
                  </Form.Label>

                  <Form.Control
                    className="col-4"
                    size="sm"
                    type="number"
                    name={selected.name}
                    id={selected.name + "-" + selected.cadAbilityScoreId}
                    defaultValue={0}
                    onChange={(e) => {
                      selectedAtributes.values.forEach((element) =>
                        element.cadAbilityScoreId === e.target.id.split("-")[1]
                          ? (element.value = e.target.value)
                          : ""
                      );
                    }}
                  />
                </div>
              );
            })}
          </Row>
          <div className="border-bottom" />
          <Button className="" onClick={insertClass} style={{ backgroundColor: "#404189", borderColor: "#404189" }}>
            Enviar
          </Button>
        </Stack>
        <br />
      </div>
    </>
  );
};

export default ClassesForm;
