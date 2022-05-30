import React from "react";
import { useState,useEffect } from "react";
import { Header } from "./Components/Header";
import Todos from "./Components/Todos";

export default ()=>{
  const [appName] = useState('HW - Simple Todo App with Hooks');
  
    return (
      <div className="App">
        <Header appName={appName}/>
        <Todos/>
      </div>
    )
}