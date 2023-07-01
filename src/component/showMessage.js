import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function ShowMessage() {}

ShowMessage.withConfirm = async (title, message, icon) => {
  const result = await MySwal.fire({
    title: title,
    text: message,
    icon: icon,

    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Confirmar",
    showLoaderOnConfirm: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      return true;
    } else {
      return false;
    }
  });

  return result;
};

ShowMessage.showMessage = async (title, message, icon) => {
  MySwal.fire({
    title: title,
    text: message,
    icon: icon,
  });
};

ShowMessage.showInfoModal = async (objArray, type) => {
  let html = `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <span class="float-start me-1"><strong>Nome</strong>: </span>
          <span class="float-start ms-1" name="${objArray.name}" id="name-value">${objArray.name}</span>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <p class="d-block"><strong>Descrição</strong></p>
          <p name="${objArray.description}" id="description-value">${objArray.description}</p>
        </div>
      </div>
    `;

  // insert the attributes fields
  if (type !== "skill" && type !== "spell") {
    html += insertValues(objArray, type);
  }

  html += `
    </div>
  `;

  Swal.fire({
    html: html,
  });
};

const insertValues = (objArray, type) => {
  let html = "";
  const modifiers = type === "race" ? objArray.raceModifiers : objArray.classModifiers;
  modifiers.forEach((selected) => {
    html += `
      <div class="d-flex align-items-center mb-2">
        <p class="float-start me-1"><strong>${selected.cadAbilityScore.name}</strong>: </p>
        <p class="float-start ms-1" name="${selected.cadAbilityScore.name}" id="${selected.id}-${selected.cadAbilityScoreId}">${selected.value}</p>
      </div>
    `;
  });

  return html;
};

