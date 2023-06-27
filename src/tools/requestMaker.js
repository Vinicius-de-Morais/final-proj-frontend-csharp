import ShowMessage from "../component/showMessage";
import connection from "../Connection";
import Swal from "sweetalert2";

export default function RequestMaker() {}

RequestMaker.insert = async (url, data) => {
  try {
    Swal.showLoading();
    const response = await connection.post(url, data);

    if (response.status === 201 || response.status === 200) {
      Swal.hideLoading();
      ShowMessage.showMessage("Criado com sucesso", "", "success");
      return true;
    } else {
      Swal.hideLoading();
      return false;
    }
  } catch (error) {
    Swal.hideLoading();
    ShowMessage.showMessage(
      "Erro ao Criar Habilidade",
      "An error occurred during saving:" + error.message,
      "error"
    );
  }
};

RequestMaker.delete = async (url, id) => {
  try {
    Swal.showLoading();
    const response = connection.delete(url + id);
    console.log(response);
    if (response.status === 200 || response.status === 204) {
      Swal.hideLoading();
      ShowMessage.showMessage("Deletado com Sucesso", "", "success");
      return true;
    } else {
      return false;
    }
  } catch (error) {
    Swal.hideLoading();
    ShowMessage.showMessage(
      "Erro ao Criar Habilidade",
      "An error occurred during deleting:" + error.message,
      "error"
    );
  }
};

RequestMaker.updateWithModal = async (objArray, type) => {
  let html = `
  <form action="PUT">
    <div class=" d-block ms-1 me-1 mb-1 mt-1 justify-content-start">
    <div class="row col-12 ms-1">
      <label for="${
        objArray.name + "-" + objArray.id
      }" className="d-block float-start">Nome</label>
      <input
        size="sm"
        type="text"
        name="${objArray.name}"
        id="name-value"
        value="${objArray.name}"
      />
      </div>
      <div class="row col-12 ms-1">
      <label for="${
        objArray.description + "-" + objArray.id
      }" className="d-block float-start">Descrição</label>
      <textarea
        size="sm"
        rows="3"
        type="text"
        name="${objArray.description}"
        id="description-value"
        
      >${objArray.description}</textarea>
      </div>
      `;
  html += "<div class='d-flex flex-row ms-1 me-1 mb-1 mt-1 justify-content-start'>";
  
  // insert the atributes fields
  if (type != "skill" && type != "spell") {
    html += insertFields(objArray, type);
  }

  html += "</div></form>";

  let response = false;
  Swal.fire({
    html: html,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Atualizar",
    showLoaderOnConfirm: true,
    allowOutsideClick: true,

    preConfirm: () => {},
  }).then(
    async (result) => {
      if (result.isConfirmed) {
        const res = await updateReq(objArray, type);
        if (res) {
          Swal.fire({
            title: "Atualizado com Sucesso",
            allowEnterKey: true,
            icon: "success",
          });
          response = true;
        } else {
          Swal.fire({
            title: "Erro ao Atualizar",
            allowEnterKey: true,
            icon: "error",
          });
        }
      }
    },
    (dismiss) => {
      Swal.close();
    }
  );

  return response;
};

const insertFields = (objArray, type) => {
  let html = "";
  const modifiers =
    type === "race" ? objArray.raceModifiers : objArray.classModifiers;
  modifiers.forEach((selected) => {
    html += `
    <div class="w-auto justify-content-start">
      <label
        for=${
          selected.cadAbilityScore.name +
          "-" +
          selected.cadAbilityScore.cadAbilityScoreId
        }
        class=""
      >
        ${selected.cadAbilityScore.name}
      </label>
      <input
        class="col-4 atribute"
        size="sm"
        type="number"
        name="${selected.cadAbilityScore.name}"
        id=${selected.id + "-" + selected.cadAbilityScoreId}
        value=${selected.value}
      />
    </div>
    `;
  });

  return html
};

const updateReq = async (objArray, type) => {
  const newName = Swal.getPopup().querySelector("#name-value").value;
  const newDescription =
    Swal.getPopup().querySelector("#description-value").value;
  const newAtributes = Swal.getPopup().querySelectorAll(".atribute");

  let reqBody = {
    id: objArray.id,
    name: newName,
    description: newDescription,
  };

  if (type !== "skill" && type !== "spell") {
    const modifiers = [];
    newAtributes.forEach((item) => {
      const idArray = item.getAttribute("id").split("-");
      var obj = {
        id: idArray[0],
        cadAbilityScoreId: idArray[1],
        name: item.getAttribute("name"),
        value: item.value,
      };
      modifiers.push(obj);
    });

    if (type === "race") reqBody.raceModifiers = modifiers;
    else reqBody.classModifiers = modifiers;
  }

  const response = await connection.put(urlSwithCase(type) + objArray.id, reqBody);
  
  // n sei pq ele ta retornando errado
  console.log(response.status === 204);
  if (
    response.status === 200 ||
    response.status === 201 ||
    response.status === 204
  ) {
    return true;
  } else {
    return false;
  }
};

const urlSwithCase = (type) => {
  switch (type) {
    case "race":
      return "/api/Races/";
    case "class":
      return "/api/Classes/";
    case "spell":
      return "/api/CadSpells/";
    case "skill":
      return "/api/cadSkills/";
    default:
      throw new Error("Type no Acepted");
  }
};
