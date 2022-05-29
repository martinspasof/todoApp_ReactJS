import React from "react";

class Header extends React.Component{
    constructor(props){
        super(props);
        this.appName = props.appName;        
    }

	render(){
		return (
			<h1 className="head">{this.appName}</h1>
		)
	}
}

export {Header}
