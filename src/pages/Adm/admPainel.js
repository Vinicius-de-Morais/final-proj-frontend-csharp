import React, { useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import AbilityScoreForm from "./PainelForm/abilityScoreForm";
import RacesForm from "./PainelForm/racesForm";
import SkillForm from "./PainelForm/skillForm";
import ClassesForm from "./PainelForm/classesForm";
import SpellsForm from "./PainelForm/spellsForm";

const AdmPainelScreen = () => {

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Container>
      <Tabs
        defaultActiveKey={activeTab}
        onSelect={(tab) => setActiveTab(tab)}
        className="mb-3 mt-5"
      >
        <Tab eventKey="overview" title="Visão Geral">
          Here will be the overview
        </Tab>
        <Tab eventKey="abilityScore" title="Pontos de Habilidade">
          <AbilityScoreForm />
        </Tab>  
        <Tab eventKey="races" title="Raças">
          <RacesForm/>
        </Tab><Tab eventKey="classes" title="Classes">
          <ClassesForm />
        </Tab>
        <Tab eventKey="skills" title="Habilidades">
          <SkillForm />
        </Tab><Tab eventKey="spells" title="Mágias">
          <SpellsForm />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdmPainelScreen;
