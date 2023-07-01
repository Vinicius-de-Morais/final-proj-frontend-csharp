import React, { useState, useEffect } from "react";
import {
  Row,
  Card,
  Container,
  Button,
  Modal,
  Form,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import connection from "../Connection";
import ShowMessage from "../component/showMessage";
import Swal from "sweetalert2";
import CharacterList from "../component/characterList";
import {useNavigate}  from 'react-router-dom';

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [characterName, setCharacterName] = useState("");

  // dependencies
  const [atributesArray, SetAtributesArray] = useState([]);
  const [ClassesArray, SetClassesArray] = useState([]);
  const [RacesArray, SetRacesArray] = useState([]);
  const [SpellsArray, SetSpellsArray] = useState([]);
  const [SkillsArray, SetSkillsArray] = useState([]);

  const [Class, SetClass] = useState({});
  const [Race, SetRace] = useState({});
  const [Spell, SetSpell] = useState({});
  const [Skill, SetSkill] = useState({});
  const finalObj = {
    name: characterName,
    level: 1,
    userId: 1,
    raceId: Race.id,
    ClassId: Class.id,
    Skills: [{ level: 1, CadSkillId: Skill.id }],
    Spells: [{ level: 1, CadSpellId: Spell.id }],
    Notes: ""
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleCharacterNameChange = (event) => {
    setCharacterName(event.target.value);
  };

  const handleAddCharacter = async () => {
    Swal.showLoading();
    try {
      const response = await connection.post("/api/Characters", finalObj);
      if (response.status === 201) {
        Swal.hideLoading();
        Swal.fire("Personagem Cadastrado!", "", "success");
        handleModalClose();
      } else {
        Swal.hideLoading();
        Swal.fire(
          "Ocorreu um erro ao salvar!",
          "Código: " + response.status,
          "error"
        );
      }
    } catch (Error) {
      Swal.hideLoading();
      Swal.fire(
        "Ocorreu um erro ao salvar!",
        "Código: " + Error.message,
        "error"
      );
    }
  };

  const loadDependencies = async () => {
    const loadAtributes = async () => {
      const response = await connection.get("/api/CadAbilityScores");
      if (response.status === 200) {
        SetAtributesArray(response.data);
      }
    };

    const loadSpells = async () => {
      const response = await connection.get("/api/CadSpells");
      if (response.status === 200) {
        SetSpellsArray(response.data);
      }
    };

    const loadSkills = async () => {
      await connection.get("/api/CadSkills").then((response) => {
        if (response.status === 200) {
          SetSkillsArray(response.data);
        }
      });
    };

    const loadRaces = async () => {
      const response = await connection.get("/api/Races");
      if (response.status === 200) {
        SetRacesArray(response.data);
      }
    };

    const loadClasses = async () => {
      await connection.get("/api/Classes").then((response) => {
        if (response.status === 200) {
          SetClassesArray(response.data);
        }
      });
    };

    const finished = await (async () => {
      await loadSpells();
      await loadSkills();
      await loadRaces();
      await loadClasses();
      await loadAtributes();
    })().then(() => {
      return true;
    });

    return finished;
  };

  // setar os elementos
  const selectElement = (event, setTarget) => {
    const { id } = event.currentTarget;
    setTarget(JSON.parse(id));
  };

  const UpdatingPopover = React.forwardRef(
    ({ popper, children, show: _, ...props }, ref) => {
      useEffect(() => {
        popper.scheduleUpdate();
      }, [children, popper]);

      return (
        <>
          <Popover ref={ref} body {...props}>
            {children}
          </Popover>
        </>
      );
    }
  );

  const showInfo = (event, type) => {
    const { id } = event.currentTarget;
    ShowMessage.showInfoModal(JSON.parse(id), type);
  };

  // funcao que carrega a lista de elementos
  const LoadList = (array, onClick, type) => {
    return array.map((value) => {
      const modifiers =
        type === "race" ? value.raceModifiers : value.classModifiers;

      const hasAttr = type === "race" || type === "class" ? true : false;

      const comparing =
        type === "race"
          ? Race
          : type === "class"
          ? Class
          : type === "skill"
          ? Skill
          : Spell;

      const overlay = (ref) =>
        hasAttr ? (
          <OverlayTrigger
            placement="top"
            overlay={
              <UpdatingPopover id="popover-contained">
                <p className="mb-0">
                  <strong>Atributos</strong>
                </p>
                {modifiers.map((val) => (
                  <div>
                    <span className="me-1 fs-7 font-monospace">
                      {val.cadAbilityScore.name}:{val.value}
                    </span>
                  </div>
                ))}
              </UpdatingPopover>
            }
          >
            {ref}
          </OverlayTrigger>
        ) : (
          ref
        );

      return (
        <>
          {overlay(
            <div
              className={
                comparing.id == value.id
                  ? " p-1 w-auto border rounded ms-1 me-1 mb-1 mt-1 border-danger"
                  : "p-1 w-auto border rounded ms-1 me-1 mb-1 mt-1 border-secondary"
              }
              id={JSON.stringify(value)}
              onClick={onClick}
              onDoubleClick={(event) => showInfo(event, type)}
            >
              <span className="me-2 fs-5 font-monospace">{value.name}</span>
            </div>
          )}
        </>
      );
    });
  };
  
  const navigate = useNavigate();
  const openCharacter = async (event) => {
    const {id} = event.currentTarget;
    const characterId = id.split("-")[1];
    
    try{
      Swal.showLoading();
      const response = await connection.get("/api/Characters/"+characterId);
      if (response.status === 200) {
        Swal.close();
        navigate("/character", {state: response.data})
        //return <Navigate to={`${encodeURIComponent(JSON.stringify(response.data))}`} />;
      } else {
        Swal.close();
        Swal.fire(
          "Ocorreu um erro ao abrir o personagem!",
          "Código: " + response.status,
          "error"
        );
      }
    }catch(Error){
      Swal.hideLoading();
      Swal.fire(
        "Ocorreu um erro ao salvar!",
        "Código: " + Error.message,
        "error"
      );
    }

  }

  document.body.style = "background: #293241;";
  return (
    <div style={{ backgroundColor: "#293241", padding: "" }}>
      <Container className="mt-0">
        <header
          style={{
            backgroundColor: "#3d5a80ff",
            padding: "20px",
            color: "#ffffff",
          }}
        >
          <h1>Criar ficha de RPG</h1>
        </header>

        <div style={{ backgroundColor: "#ffffff", padding: "20px" }}className="d-flex">
          <div className="d-flex w-auto">
            <Card
              bg="dark"
              text="white"
              className=""
              style={{ maxWidth: "400px", margin: "0 auto", maxHeight: "150px"}}
            >
              <Card.Body>
                <Card.Title>Bem vindo</Card.Title>
                <Card.Text>Crie seu personagem de maneira facil.</Card.Text>
                <Button variant="primary" onClick={handleModalOpen}>
                  Adicionar um novo personagem
                </Button>
              </Card.Body>
            </Card>
          </div>
          <div className="flex-fill">
            <Container className="">
              <CharacterList onClick={openCharacter}></CharacterList>
            </Container>
          </div>
        </div>
      </Container>

      {/* Modal de Cadastro */}
      <Container className="mt-5">
        <Modal
          onShow={async () => {
            await loadDependencies();
          }}
          show={showModal}
          onHide={handleModalClose}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Adicionar Personagem</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="characterName">
                <Form.Label className="fs-5">Nome:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nome"
                  value={characterName}
                  onChange={handleCharacterNameChange}
                />
              </Form.Group>
              {/* Aqui sao listados todos os em lista */}
              <Form.Group controlId="characterRace">
                <Form.Label className="mt-1 fs-5">Raças: </Form.Label>
                <Row
                  gap={3}
                  className="col-12 border border-secondary rounded mb-0 d-flex flex-row ms-1 justify-content-start"
                  id="races"
                >
                  {LoadList(
                    RacesArray,
                    (event) => selectElement(event, SetRace),
                    "race"
                  )}
                </Row>
                <i className="fs-6 float-end mt-0">
                  *De um clique duplo para ver com detalhes
                </i>
              </Form.Group>

              <Form.Group controlId="characterClasse">
                <Form.Label className="mt-1 fs-5">Classe: </Form.Label>
                <Row
                  gap={3}
                  className="col-12 border border-secondary rounded mb-0 d-flex flex-row ms-1 justify-content-start"
                  id="classes"
                >
                  {LoadList(
                    ClassesArray,
                    (event) => selectElement(event, SetClass),
                    "class"
                  )}
                </Row>
                <i className="fs-6 float-end mt-0">
                  *De um clique duplo para ver com detalhes
                </i>
              </Form.Group>

              <Form.Group controlId="characterSkill">
                <Form.Label className="mt-1 fs-5">Habilidades: </Form.Label>
                <Row
                  gap={3}
                  className="col-12 border border-secondary rounded mb-0 d-flex flex-row ms-1 justify-content-start"
                  id="Spells"
                >
                  {LoadList(
                    SkillsArray,
                    (event) => selectElement(event, SetSkill),
                    "skill"
                  )}
                </Row>
                <i className="fs-6 float-end mt-0">
                  *De um clique duplo para ver com detalhes
                </i>
              </Form.Group>

              <Form.Group controlId="characterSpelll">
                <Form.Label className="mt-1 fs-5">Magias: </Form.Label>
                <Row
                  gap={3}
                  className="col-12 border border-secondary rounded mb-0 d-flex flex-row ms-1 justify-content-start"
                  id="Spells"
                >
                  {LoadList(
                    SpellsArray,
                    (event) => selectElement(event, SetSpell),
                    "spell"
                  )}
                </Row>
                <i className="fs-6 float-end mt-0">
                  *De um clique duplo para ver com detalhes
                </i>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddCharacter}>
              Adicionar Personagem
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default HomePage;

/* 
n sei se vou adicionar no form msm

<Form.Group controlId="characterAttr">
                <Form.Label className="mt-1 fs-5">Atributos: </Form.Label>
                <Row
                  id="selects"
                  className="d-flex flex-row ms-1 me-1 mb-1 mt-1 justify-content-center border border-secondary rounded mb-3"
                >
                  {atributesArray.map((value) => (
                    <div
                      key={`default-checkbox-${value.id}`}
                      className="p-1 w-auto"
                    >
                      <Form.Label className="mt-1 fs-5"><span className="font-monospace">{value.name}</span></Form.Label>
                      <Form.Control
                        type={"checkbox"}
                        id={`atribute-${value.id}`}
                        key={`atribute-${value.id}`}
                        value={JSON.stringify({
                          cadAbilityScoreId: value.id,
                          name: value.name,
                          value: 0,
                        })}
                        //onChange={setSelected}
                      />
                    </div>
                  ))}
                </Row>
                <i className="fs-6 float-end mt-0">
                  *De um clique duplo para ver com detalhes
                </i>
              </Form.Group>

*/
