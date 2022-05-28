import React from "react";

class Todo extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			'inputValue':''
		}

		this.inputRef = React.createRef();
	}

	onInputChange(e){
		this.setState( {
			inputValue:e.target.value
		})
	}

	onAddHandler(e){
		this.props.onAdd(this.state.inputValue)
		this.setState({inputValue: ''});
		this.inputRef.current.focus();
	}

	render(){
		return (
			<div>
                <input  
				ref={this.inputRef} 
				placeholder="enter todo title" 
				type="text" 
				autoFocus
				onChange={e=>this.onInputChange(e)}
				value={this.state.inputValue}
				/>
				<button onClick={e=>this.onAddHandler(e)}>Add Todo</button>
			</div>
		)
	}
}

export {Todo}