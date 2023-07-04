import React, { useState, useEffect } from "react";
import { Button, Container, Form, Stack, Row, Card } from "react-bootstrap";
import connection from "../Connection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import ShowMessage from "./showMessage";
import RequestMaker from "../tools/requestMaker";

const CharacterList = ({ onClick, userId }) => {
  const [CharacterArray, SetCharacterArray] = useState([]);
  const [atributeName, SetAtributeName] = useState("");

  // load the Characters
  const loadCharacters = async () => {
    try {
      let url = "/api/Characters/user/" + userId;
      if (userId == "all") {
        url = "/api/Characters";
      }

      const response = await connection.get(url);
      if (response.status === 200) {
        SetCharacterArray(response.data);
      } else if (response.status == 404) {
        SetCharacterArray([]);
      } else {
        Swal.fire(
          "Erro ao Encontrar personagens",
          "Erro: " + Error.message,
          "error"
        );
      }
    } catch (Error) {
      Swal.fire(
        "Erro ao Encontrar personagens",
        "Erro: " + Error.message,
        "error"
      );
    }
  };

  // load the actual Characters
  useEffect(() => {
    (async () => {
      await loadCharacters();
    })();
  }, []);

  const deleteCharacter = async(name, id)=>{
    const title = "Tem certeza que deseja deletar " + name + "?";
    const message = "Essa ação não poderá ser desfeita.";
    const result = await ShowMessage.withConfirm(title, message, "warning");

    if (result) {
      try {
        const response = await RequestMaker.delete(
          "/api/Characters/",
          id
        );

        if (response) {
          await loadCharacters();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  const characterTable = (
    <>
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Raça</th>
            <th scope="col">Classe</th>
            <th scope="col">Level</th>
            <th scope="col">Opções</th>
          </tr>
        </thead>
        <tbody>
          {CharacterArray.map((value) => (
            <tr className="" id={value.name + "-" + value.id} onClick={onClick}>
              <td>
                <span className="fs-6 font-monospace">{value.name}</span>
              </td>
              <td>
                <span className="fs-6 font-monospace">{value.race.name}</span>
              </td>
              <td>
                <span className="fs-6 font-monospace">{value.class.name}</span>
              </td>
              <td>
                <span className="fs-6 font-monospace">{value.level}</span>
              </td>
              <td onClick={() => deleteCharacter(value.name, value.id)}>
                <FontAwesomeIcon
                  role="button"
                  icon={faTrash}
                  size="sm"
                  key={value.id}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  return (
    <>
      <div className="">
        <Card
          bg="white"
          text="black"
          className=""
          style={{ margin: "0 auto", borderColor: "#404189" }}
        >
          <Card.Header
            style={{
              backgroundColor: "#1d1f63",
              borderColor: "#1d1f63",
              color: "white",
            }}
          >
            <Card.Title>Seus Personagens</Card.Title>
          </Card.Header>
          <Card.Body>
            {CharacterArray.length > 0
              ? characterTable
              : "Nenhum personagem encontrado"}
          </Card.Body>
          <Card.Footer
            style={{
              backgroundColor: "#1d1f63",
              borderColor: "#1d1f63",
              color: "white",
            }}
          >
            <Card.Text>
              Clique no personagem desejado para abrir sua ficha
            </Card.Text>
          </Card.Footer>
        </Card>
      </div>
    </>
  );
};

export default CharacterList;
