import React from "react";
import { useState,useEffect } from "react";

export default (props)=>{
	const [input,setInput] = useState( '' );
	const inputRef = React.createRef();

	const onInputChange = (e) => {
		setInput(e.target.value);
	}

	const onAddHandler = (e) => {
		props.onAdd(input);
		setInput('');
		inputRef.current.focus();
	}

	
	return (
		<div>
            <input  
			ref={inputRef} 
			placeholder="enter todo title" 
			type="text" 
			autoFocus
			onChange={e=>onInputChange(e)}
			value={input}
			/>
			<button onClick={e=>onAddHandler(e)}>Add Todo</button>
		</div>
	)
	
}