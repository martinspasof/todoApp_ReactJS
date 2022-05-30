import React from "react";

const TodoList = (props) => {
    const checkEvenNumber = (todoId)=>{
        return todoId%2 ? 'odd' : 'even';
    }

    const getList = (todo, idx) => {
        return (            
        <li className={checkEvenNumber(idx)} key={todo.id}>
        <span className={todo.completed ? 'strikethrough':''}>{todo.title}</span>
        <input type='checkbox' defaultChecked={todo.completed} onChange={(e)=>props.updateTodo(todo)}/>
        <input className="img" type="image" src="../trash.png" alt="trash" onClick={(e)=>props.deleteTodo(todo.id)}/>
        </li>
        )

    }

	return (
        <ul>
        {props.todos.map((todo, idx) =>getList(todo, idx))}
        </ul>

	)
}

export {TodoList};
