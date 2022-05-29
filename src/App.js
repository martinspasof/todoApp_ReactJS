import { render } from "@testing-library/react";
import React from "react";
import { Header } from "./Components/Header";
import { Todos } from "./Components/Todos";

class App extends React.Component{  
  constructor(props){
    super(props);
    this.appName = "HW - Simple Todo App";
  }

  render(){
    return (
      <div className="App">
        <Header appName={this.appName}/>
        <Todos/>
      </div>
    )
  }

}

export default App;