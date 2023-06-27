import React, { useState, useEffect } from "react";
import { Button, Container, Form, Stack, Row } from "react-bootstrap";
import connection from "../../../Connection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ShowMessage from "../../../component/showMessage";
import Swal from "sweetalert2";
import RequestMaker from "../../../tools/requestMaker";

const RacesForm = () => {
  const [atributesArray, SetAtributesArray] = useState([]);
  const [RacesArray, SetRacesArray] = useState([]);
  const [selectedAtributes, SetSelectedAtributes] = useState({ values: [] });
  const [RaceName, SetRaceName] = useState("");
  const [RaceDescription, SetRaceDescription] = useState("");
  
  // load the abilities
  const loadAtributes = async () => {
    const response = await connection.get("/api/CadAbilityScores");
    if (response.status === 200) {
      SetAtributesArray(response.data);
    }
  };

  // load the actual races
  const loadRaces = async () => {
    const response = await connection.get("/api/Races");
    if (response.status === 200) {
      SetRacesArray(response.data);
    }
  };

  // load the actual abilities and races
  useEffect(() => {
    (async () => {
      await loadAtributes();
      await loadRaces();
    })();
  }, []);

  // insert an new race
  const insertRace = async () => {
    try {
      if (RaceName === "") {
        throw new Error("O nome deve conter algum valor");
      }
      if (RaceDescription === "") {
        throw new Error("A descrição deve conter algum valor");
      }

      const response = await RequestMaker.insert("/api/Races", {
        name: RaceName,
        description: RaceDescription,
        raceModifiers: selectedAtributes.values,
      });

      if (response) {
        SetRaceName("");
        SetRaceDescription("");
        await loadRaces();
      }
    } catch (error) {
      Swal.fire("Ocorreu um erro: ", error.message, "error");
    }
  };

  const deleteRace = async (name, id) => {
    const title = "Tem certeza que deseja deletar " + name + "?";
    const message = "Essa ação não poderá ser desfeita.";
    const result = await ShowMessage.withConfirm(title, message, "warning");

    if (result) {
      try {
        const response = await RequestMaker.delete("/api/Races/", id);

        if (response) {
          await loadRaces();
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
    const res = await RequestMaker.updateWithModal(objArray, "race");
    if(res)
    await loadRaces();
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
            {RacesArray.map((value) => (
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
                  onClick={() => deleteRace(value.name, value.id)}
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
            id="RaceName"
            key="RaceName"
            value={RaceName}
            onChange={(e) => SetRaceName(e.target.value)}
          />
          <Form.Control
            className="me-auto"
            size="ld"
            as="textarea"
            rows={3}
            placeholder="Descrição"
            id="RaceDescription"
            key="RaceDescription"
            value={RaceDescription}
            onChange={(e) => SetRaceDescription(e.target.value)}
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
                        element.cadAbilityScoreId == e.target.id.split("-")[1]
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
          <Button className="" onClick={insertRace}>
            Enviar
          </Button>
        </Stack>
        <br />
      </div>
    </>
  );
};

export default RacesForm;
/* 
  junky code

  value.raceModifiers.forEach(selected => {
        html += 
        `
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
                element.cadAbilityScoreId == e.target.id.split("-")[1]
                  ? (element.value = e.target.value)
                  : ""
              );
            }}
          />
        </div>
        `
      });
*/