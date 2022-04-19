//state array passed down as props
//maps through array to render individual category component
import React from 'react';
import Category from './Category.jsx';

function Categories({addTask, openModal, isMobile, taskData, deleteTask,
  draggedEvent, setDraggedEvent, handleDragStart}) {
    // console.log('tasks in categories', taskData)
  return(
    taskData.map((category, i) => {
    return <Category key={i}
    tasks={category}
    addTask={addTask}
    isMobile={isMobile} draggedEvent={draggedEvent}
    setDraggedEvent={setDraggedEvent} handleDragStart={handleDragStart}/>
    })
  )

    // return <Category
    // tasks={categorizedTasks}
    // addTask={addTask} openModal={openModal}
    // isMobile={isMobile} deleteTask={deleteTask} draggedEvent={draggedEvent}
    // setDraggedEvent={setDraggedEvent} handleDragStart={handleDragStart}/>
    }

export default Categories;