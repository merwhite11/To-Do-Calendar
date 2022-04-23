import React from 'react';
import Category from './Category.jsx';

function Categories({isMobile, taskData, draggedEvent, setDraggedEvent, handleDragStart,
  addTodo, updateTodo, deleteTodo, deleteCategory}) {
  return (
    taskData.length ? taskData.map((category, i) => {
      return <Category key={i}
        tasks={category} deleteCategory={deleteCategory}
        isMobile={isMobile} draggedEvent={draggedEvent}
        setDraggedEvent={setDraggedEvent} handleDragStart={handleDragStart}
        addTodo={addTodo} updateTodo={updateTodo} deleteTodo={deleteTodo}/>
    }) : null
  )
}

export default Categories;