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
    if(result.isConfirmed){
        return true;
    }else{
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
    })
  
  };