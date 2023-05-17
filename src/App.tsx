import React from "react";
import Sidebar from "./components/Sidebar";
import MainHeader from "./components/MainHeader";
import "ol/ol.css";
import "./App.scss";


const App = () : JSX.Element =>{
  return (
    <React.Fragment>
      <MainHeader />
      <Sidebar />
    </React.Fragment>
  );
}

export default App;
