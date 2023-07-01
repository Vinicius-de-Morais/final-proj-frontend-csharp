import React, { useState, useEffect } from "react";
import { Button, Container, Form, Stack, Row, Card } from "react-bootstrap";
import connection from "../Connection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const CharacterList = ({onClick}) => {
  const [CharacterArray, SetCharacterArray] = useState([]);
  const [atributeName, SetAtributeName] = useState("");

  // load the Characters
  const loadCharacters = async () => {
    const response = await connection.get("/api/Characters");
    if (response.status === 200) {
      SetCharacterArray(response.data);
    }
  };

  // load the actual Characters
  useEffect(() => {
    (async () => {
      await loadCharacters();
    })();
  }, []);

  return (
    <>
      <div className="">
        <Card bg="white" text="black" className="" style={{ margin: "0 auto" }}>
          <Card.Header>
            <Card.Title>Seus Personagens</Card.Title>
          </Card.Header>
          <Card.Body>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">Raça</th>
                  <th scope="col">Classe</th>
                  <th scope="col">Level</th>
                </tr>
              </thead>
              <tbody>
                {CharacterArray.map((value) => (
                  <tr className=""
                    id={value.name+"-"+value.id}
                    onClick={onClick}
                  >
                    <td>
                      <span className="fs-6 font-monospace">{value.name}</span>
                    </td>
                    <td>
                      <span className="fs-6 font-monospace">
                        {value.race.name}
                      </span>
                    </td>
                    <td>
                      <span className="fs-6 font-monospace">
                        {value.class.name}
                      </span>
                    </td>
                    <td>
                      <span className="fs-6 font-monospace">{value.level}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card.Body>
          <Card.Footer>
            <Card.Text>Clique no personagem desejado para abrir sua ficha</Card.Text>
          </Card.Footer>
        </Card>
      </div>
    </>
  );
};

export default CharacterList;
