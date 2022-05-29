import React from "react";

const TodosCount = (props) => {
	return (
		<div className="total-items">{`total items: ${props.count}`}</div>
	)
}

export {TodosCount};
