import React, { useState } from "react";
import CharacterList from "../../../component/characterList";


const AdmOverView = () => {

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      <CharacterList onClick={(event) => console.log(event)} userId={"all"}/>
    </div>
  );
};

export default AdmOverView;