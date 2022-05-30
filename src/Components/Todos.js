import React from "react";
import { useState,useEffect } from "react";
import Todo from "./Todo";
import { TodoList } from "./TodoList";
import { TodosCount } from "./TodosCount";

const url = 'http://localhost:3002'

export default ()=>{
    const [todos,setTodos] = useState( [] );
    const [completed,setCompleted] = useState( false );    

    const processResponse = (r) =>{
        if (r.status > 199 && r.status < 300) {
            return r.json()
        } else {
            throw new Error(`Error: ${r.status}`)
        }
    }

    const componentDidMount = () => {
        fetch(url + '/todos', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => {
            return processResponse(res);
        })
        .then(data => {
            setTodos( data );
            saveToLocalStorage('todos', JSON.stringify(data));
        })
		.catch(err => {
			setTodos( readFromLocalStorage('todos'));
			console.log(err);
		})
    }

    useEffect(componentDidMount,[]);

    const saveToLocalStorage = (key, value) => {
        // save to local storage
        let ls = window.localStorage;
        ls.setItem(key,value);
    }

    const readFromLocalStorage = (key) => {
        // save to local storage
        let ls = window.localStorage;
        return JSON.parse(ls.getItem(key));
    }

	const onAdd = (todoTitle) => {
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
            return processResponse(res);
        })
        .then(todo => {                       
            setTodos( [...todos, todo] );
            saveToLocalStorage('todos', JSON.stringify([...todos, todo]));          
        })
        .catch(err => {           
            let idx= 1;
            for(let el in todos){
                todos[el].id = Number(idx++);
            }
            newTodo.id = todos.length + 1;
            setTodos( [...todos, newTodo] );
            saveToLocalStorage('todos', JSON.stringify([...todos, newTodo]));
            console.log(err);
        })	
	}

    const deleteTodo = (id) => {        
        fetch(url + '/todos/' + id, {
            method: 'DELETE'
        })
        .then(res => {
            return processResponse(res);
        })
        .then(() => {
            componentDidMount();
        })
        .catch(err => {            
            const filterTodos = todos.filter(function (todo, idx) {
                todo.id = idx+1;
                return todo.id != id;
            });

            let idx= 1;
            const getFilterTodos = filterTodos;
            for(let el in filterTodos){
                getFilterTodos[el].id = Number(idx++);
            }

            setTodos( getFilterTodos );
    
            saveToLocalStorage('todos', JSON.stringify(getFilterTodos));
            componentDidMount();
            console.log(err);
        });
    }

    const updateTodo = (todo) => {
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
            setCompleted(todoEl.completed);
            componentDidMount();
        })
        .catch(err => {        
            todos.forEach(todoKey => {
                if(todoKey.id == todo.id){                    
                    todoKey.title = todoEl.title;
                    todoKey.completed = todoEl.completed;
                }
            });

            saveToLocalStorage('todos', JSON.stringify(todos));
            componentDidMount();
            console.log(err);
        })
    }  

	       
	return (
		<div> 
            <Todo onAdd={onAdd}/>
            <hr/>                
           <TodoList 
               todos={todos} 
               updateTodo={updateTodo} 
               deleteTodo={deleteTodo}/>
            <TodosCount count={todos.length}/>
		</div>
	)
	
}