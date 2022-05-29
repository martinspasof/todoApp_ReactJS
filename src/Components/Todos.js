import React from "react";
import { Todo } from "./Todo";
import { TodoList } from "./TodoList";
import { TodosCount } from "./TodosCount";

const url = 'http://localhost:3002'

class Todos extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			todos: [],
            completed: false,
		}

		this.onAdd = this.onAdd.bind(this);		
		this.updateTodo = this.updateTodo.bind(this);		
		this.deleteTodo = this.deleteTodo.bind(this);		
	}

    processResponse(r) {
        if (r.status > 199 && r.status < 300) {
            return r.json()
        } else {
            throw new Error(`Error: ${r.status}`)
        }
    }

    componentDidMount() {
        fetch(url + '/todos', {
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
    
        fetch(url + '/todos', {
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
        fetch(url + '/todos/' + id, {
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
            
        fetch(url + '/todos/'+todo.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(todoEl)
        })
        .then(() => {
            this.setState({
                // completed: !this.state.completed
                completed: todoEl.completed
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

	render(){        
		return (
			<div> 
                <Todo onAdd={this.onAdd}/>
                <hr/>                
               <TodoList 
                   todos={this.state.todos} 
                   updateTodo={this.updateTodo} 
                   deleteTodo={this.deleteTodo}/>

                <TodosCount count={this.state.todos.length}/>
			</div>
		)
	}
}

export {Todos}