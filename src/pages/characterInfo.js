import {
  faArrowLeft,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Col, Container, Row, Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import connection from "../Connection";
import Swal from "sweetalert2";

const CharacterInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const {
    id,
    name,
    level,
    race,
    class: characterClass,
    skills,
    spells,
    abilityScore,
    equipment,
    notes,
  } = state;
  const [noteValue, setNoteValue] = useState(notes);

  const [abilityScores, setAb] = useState(abilityScore);
  const changeVal = (ability) => {
    const update = abilityScores.map((ab) => {
      if (ab.id == ability.id) {
        ab.value = ability.value;
      }
      return ab;
    });
    setAb(update);
  };

  const finalObj = {
    id: id,
    userId: 1,
    name: name,
    level: level,
    raceId: race.id,
    classId: characterClass.id,
    skills: skills,
    spells: spells,
    abilityScore: abilityScores,
    equipment: equipment,
    notes: noteValue,
  };
  const updateCharacter = async () => {
    try {
      console.log(finalObj);
      const response = await connection.put("/api/Characters/" + id, finalObj);

      Swal.showLoading();
      if (response.status === 204 || response.status === 200) {
        Swal.fire("Atualizado com sucesso", "", "success");
      } else {
        Swal.fire(
          "Erro ao Atualizar",
          "Erro codigo: " + response.statusText,
          "error"
        );
      }
    } catch (Error) {
      Swal.fire("Erro ao Atualizar", "Erro codigo: " + Error.message, "error");
    }
  };

  const [itemName, setItemName] = useState("");
  const [itemQtd, setItemQtd] = useState("");
  const [itemArray, setItemArray] = useState(equipment);

  const addItem = () => {
    const item = {name: itemName, quantity: itemQtd}
    console.log(item);
    setItemArray([...itemArray, item]);
  }
  return (
    <>
      <div className="character-sheet card d-flex rounded-0 min-vh-100">
        <div className="card-header d-flex align-items-center">
          <div className="align-self-center">
            <FontAwesomeIcon
              icon={faArrowLeft}
              size="xl"
              className="w-auto"
              onClick={() => navigate("/")}
            />
          </div>
          <h2 className="card-title mx-auto">Ficha</h2>
        </div>

        <div className="card-body align-items-start">
          <div className="d-flex flex-wrap">
            <div class="d-flex flex-column p-2 flex-fill m-3 w-auto border border-dark border-2 rounded">
              <span className="fs-3">{name}</span>
              <span>Nome do Personagem</span>
            </div>
            <div class="d-flex flex-row p-2 flex-fill m-3 w-auto border border-dark border-2 rounded justify-content-around">
              <div className="card-text m-2 d-flex flex-column justify-content-center">
                <span className="fs-3">{level}</span>
                <span>Level</span>
              </div>
              <div className="card-text m-2 me-4 d-flex flex-column justify-content-center">
                <span className="fs-3">{race.name}</span>
                <span>Raça</span>
              </div>
              <div className="card-text m-2 me-4 d-flex flex-column justify-content-center">
                <span className="fs-3">{characterClass.name}</span>
                <span>Classe</span>
              </div>
            </div>
          </div>
          <div
            className="col-12 d-flex  border border-secondary rounded justify-content-around mb-3"
            style={{ backgroundColor: "#404189" }}
          >
            {abilityScores.map((ability) => {
              return (
                <div className="d-flex flex-column">
                  <div className="d-flex justify-content-center mb-3">
                    <span
                      className="bg-light border border-dark border-2 rounded-start-pill align-self-center ps-1 pe-1"
                      style={{ marginRight: -6.5 }}
                      size="xs"
                      onClick={() => {
                        ability.value--;
                        changeVal(ability);
                      }}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </span>
                    <div
                      class="bg-light d-flex flex-column mt-3 mb-0 ms-0 me-0 col-sm-1 border border-dark border-2 rounded"
                      style={{
                        width: 90,
                        fontFamily: "sans-serif",
                        textTransform: "uppercase",
                        fontSize: 10,
                        zIndex: 2,
                      }}
                    >
                      <span>{ability.cadAbilityScore.name}</span>
                      <span className="fs-2">{ability.value}</span>
                    </div>
                    <span
                      className="bg-light border border-dark border-2 rounded-end-circle align-self-center  ps-1 pe-1"
                      style={{ marginLeft: -5 }}
                      size="2xs"
                      onClick={() => {
                        ability.value++;
                        changeVal(ability);
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </span>
                  </div>
                  <div
                    className="row bg-light border border-dark border-2 rounded-circle align-self-center  ps-2 pe-2"
                    style={{
                      fontFamily: "sans-serif",
                      fontWeight: "bold",
                      fontSize: 15,
                      zIndex: 2,
                      marginTop: -27,
                    }}
                  >
                    {Math.round((ability.value - 10) / 2)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="row d-flex flex-wrap justify-content-around">
            <div className="col-3 d-flex flex-column flex-fill border border-dark border-2 rounded justify-content-around ms-1 me-1">
              <Row className="mb-1">
                <Col>
                  <h3>Skills</h3>
                  <ul className="list-group">
                    {skills.map((skill) => (
                      <li key={skill.id} className="list-group-item">
                        {skill.cadSkill.name}
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
              <Row className="mb-1">
                <Col>
                  <h3>Spells</h3>
                  <Col className="list-group">
                    {spells.map((spell) => (
                      <li key={spell.id} className="list-group-item">
                        {spell.cadSpell.name}
                      </li>
                    ))}
                  </Col>
                </Col>
              </Row>
            </div>
            <div className="container col-3 d-flex flex-fill border border-dark border-2 rounded justify-content-around ms-1 me-1">
              <Col>
                <h3>Equipamentos</h3>
                <ul className="list-group">
                  {itemArray.map((equip) => (
                    <li key={equip.id? equip.id : equip.name} className="list-group-item mb-1">
                      <span>{equip.name}</span> <div class="vr ms-1 me-1"></div> <span> x {equip.quantity}</span>
                    </li>
                  ))}
                </ul>
                <div className=" d-flex">
                  <Form.Control
                    className="flex-grow-1 me-2"
                    type="text"
                    placeholder="Item"
                    value={itemName}
                    onChange={(e) => setItemName(e.currentTarget.value)}
                  />
                  <div className="d-flex">
                    <Form.Control
                      className="me-2 flex-shrink-1"
                      type="number"
                      placeholder="Qtd."
                      value={itemQtd}
                      onChange={(e) => setItemQtd(e.currentTarget.value)}
                    />
                    <Button
                      className=""
                      variant="primary"
                      style={{
                        backgroundColor: "#404189",
                        borderColor: "#404189",
                      }}
                      onClick={() => addItem()}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </Col>
            </div>
            <div className="col-3 d-flex flex-fill border border-dark border-2 rounded justify-content-around ms-1 me-1">
              <Col>
                <h3>Anotações</h3>
                <textarea
                  className="col-12"
                  size="ld"
                  as="textarea"
                  rows={4}
                  placeholder="Anotações"
                  onChange={(e) => setNoteValue(e.currentTarget.value)}
                >
                  {notes}
                </textarea>
              </Col>
            </div>
          </div>
        </div>

        <div className="card-footer align-items-start">
          <Button
            variant="primary"
            style={{ backgroundColor: "#404189", borderColor: "#404189" }}
            onClick={updateCharacter}
          >
            Salvar Mudanças
          </Button>
        </div>
      </div>
    </>
  );
};

export default CharacterInfo;
