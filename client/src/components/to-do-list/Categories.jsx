import React from 'react';
import Category from './Category.jsx';

function Categories({isMobile, taskData, draggedEvent, setDraggedEvent, handleDragStart, addTodo, updateTodo, deleteTodo}) {
  return (
    taskData.length ? taskData.map((category, i) => {
      return <Category key={i}
        tasks={category}
        isMobile={isMobile} draggedEvent={draggedEvent}
        setDraggedEvent={setDraggedEvent} handleDragStart={handleDragStart}
        addTodo={addTodo} updateTodo={updateTodo} deleteTodo={deleteTodo}/>
    }) : null
  )
}

export default Categories;