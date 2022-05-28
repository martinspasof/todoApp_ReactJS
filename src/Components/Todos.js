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
            this.saveToLocalStorage('todos', JSON.stringify(data));
        })
		.catch(err => {
			this.setState( { todos: [...this.readFromLocalStorage('todos')] });
			console.log(err);
		})
    }

    saveToLocalStorage(key, value) {
        // save to local storage
        let ls = window.localStorage;
        ls.setItem(key,value);
    }

    readFromLocalStorage(key) {
        // save to local storage
        let ls = window.localStorage;
        return JSON.parse(ls.getItem(key));
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
            this.setState( {todos: [...this.state.todos, todo] });
            this.saveToLocalStorage('todos', JSON.stringify([...this.state.todos, todo]));          
        })
        .catch(err => {           
            let idx= 1;
            for(let el in this.state.todos){
                this.state.todos[el].id = Number(idx++);
            }
            newTodo.id = this.state.todos.length + 1;
            this.setState( {todos: [...this.state.todos, newTodo] });
            this.saveToLocalStorage('todos', JSON.stringify([...this.state.todos, newTodo]));
            console.log(err);
        })	
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
        .catch(err => {
            this.state.todos = this.state.todos.filter(function (todo, idx) {
                todo.id = idx+1;
                return todo.id != id;
            });
            let idx= 1;
            for(let el in this.state.todos){
                this.state.todos[el].id = Number(idx++);
            }

            this.setState( {todos: [...this.state.todos] });
    
            this.saveToLocalStorage('todos', JSON.stringify([...this.state.todos]));
            this.componentDidMount();
            console.log(err);
        });
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
        .catch(err => {

            this.state.todos.forEach(todoKey => {
                if(todoKey.id == todo.id){                    
                    todoKey.title = todoEl.title;
                    todoKey.completed = todoEl.completed;
                }
            });

            this.saveToLocalStorage('todos', JSON.stringify([...this.state.todos]));
            this.componentDidMount();
            console.log(err);
        })
    }
    

    checkEvenNumber(todoId){
        return todoId%2 ? 'odd' : 'even';
    }

    getList(todo){

        <button onClick={e=>this.onAddHandler(e)}>Add Todo</button>
        let img = <input className="img" type="image" src="../trash.png" alt="trash" onClick={e=>this.deleteTodo(todo.id)}/>
        let checkbox = <input type='checkbox' defaultChecked={this.state.completed} onChange={e=>this.updateTodo(todo)}/>
        let todoStyle=todo.completed ? 'strikethrough':'';

        return <li className={this.checkEvenNumber(todo.id)} key={todo.id}>
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
					{this.state.todos.map(todo=>this.getList(todo))}
				</ul>
                {this.todoCount(this.state.todos)}
			</div>
		)
	}
}

export {Todos}