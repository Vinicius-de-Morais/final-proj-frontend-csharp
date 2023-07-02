import React, { useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import AbilityScoreForm from "./PainelForm/abilityScoreForm";
import RacesForm from "./PainelForm/racesForm";
import SkillForm from "./PainelForm/skillForm";
import ClassesForm from "./PainelForm/classesForm";
import SpellsForm from "./PainelForm/spellsForm";
import AdmOverView from "./PainelForm/admOverView";

const AdmPainelScreen = () => {
  const [activeTab, setActiveTab] = useState("overview");

  document.body.style = "background: #1d1f63;";
  return (
    <div>
      <header
        className="d-flex align-items-center"
        style={{
          backgroundColor: "#404189",
          padding: "20px",
          color: "#ffffff",
        }}
      >
        <img
          src="../I_AM_MISTA_KIN_DICE.png"
          alt="dado de gravata"
          style={{ width: 60, height: 60 }}
        />
        <h1 className="mx-auto">Página de Administração</h1>
      </header>
      <Container className="mb-5 mt-2">
        <Tabs
          defaultActiveKey={activeTab}
          onSelect={(tab) => setActiveTab(tab)}
          className="mb-3 mt-2"
        >
          <Tab eventKey="overview" title="Visão Geral">
            <AdmOverView />
          </Tab>
          <Tab eventKey="abilityScore" title="Pontos de Habilidade">
            <AbilityScoreForm />
          </Tab>
          <Tab eventKey="races" title="Raças">
            <RacesForm />
          </Tab>
          <Tab eventKey="classes" title="Classes">
            <ClassesForm />
          </Tab>
          <Tab eventKey="skills" title="Habilidades">
            <SkillForm />
          </Tab>
          <Tab eventKey="spells" title="Mágias">
            <SpellsForm />
          </Tab>
        </Tabs>
      </Container>
      <footer
        className="fixed-bottom d-flex align-items-center"
        style={{
          backgroundColor: "#1d1f63",
          padding: "10px",
          color: "#ffffff",
          fontSize: 10,
        }}
      >
        © 2023 - Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default AdmPainelScreen;
