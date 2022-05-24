import React from "react";
import { Todo } from "./Todo";

class Todos extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			todos: [],
            completed: false
		}

        this.url = 'http://localhost:3002';
		this.onAdd = this.onAdd.bind(this);		
	}

    processResponse(r) {
        if (r.status > 199 && r.status < 300) {
            return r.json()
        } else {
            throw new Error(`Error: ${r.status}`)
        }
    }

    componentDidMount() {
        fetch(this.url + '/todos', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => {
            return this.processResponse(res);
        })
        .then(data => {
            this.setState( { todos: [...data] });
        })
    }

	onAdd(todoTitle){
        const newTodo = {
            'title': todoTitle,
            'completed': false
        };
    
        fetch(this.url + '/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(newTodo)
        })
        .then(res => {
            return this.processResponse(res);
        })
        .then(todo => {                       
            this.setState( {todos: [...this.state.todos, todo] })            
        });		
	}

    deleteTodo(id) {
        fetch(this.url + '/todos/' + id, {
            method: 'DELETE',

        })
        .then(res => {
            return this.processResponse(res);
        })
        .then(() => {
            this.componentDidMount();
        })
    }

    updateTodo(todo) {
        const todoEl = {
            'title': todo.title,
            'completed': !todo.completed
        };
    
        fetch(this.url + '/todos/'+todo.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(todoEl)
        })
        .then(() => {
            this.setState({
                completed: !this.state.completed
            });
            this.componentDidMount();
        })
    }
    

    evenNumber(todoId){
        return todoId%2 ? 'odd' : 'even';
    }

    list(todo){

        <button onClick={e=>this.onAddHandler(e)}>Add Todo</button>
        let img = <input className="img" type="image" src="../trash.png" alt="trash" onClick={e=>this.deleteTodo(todo.id)}/>
        let checkbox = <input type='checkbox' defaultChecked={this.state.completed} onChange={e=>this.updateTodo(todo)}/>
        let todoStyle=todo.completed ? 'strikethrough':'';

        return <li className={this.evenNumber(todo.id)} key={todo.id}>
                   <span className={todoStyle}>{todo.title}</span>
                   {checkbox}
                   {img}
               </li>
    }

    header(){        
        let h1 = <h1 className="head">HW - Simple Todo App</h1>    
        return h1;
    }

    todoCount(todos){
        return (
            <div className="total-items">{`total items: ${todos.length}`}</div>
        )
    }

	render(){        
		return (
			<div>                 
                {this.header()}
                <Todo onAdd={this.onAdd}/>
                <hr/>
				<ul>
					{this.state.todos.map(todo=>this.list(todo))}
				</ul>
                {this.todoCount(this.state.todos)}
			</div>
		)
	}
}

export {Todos}