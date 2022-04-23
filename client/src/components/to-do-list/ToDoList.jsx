import React, {useState, useEffect} from 'react';
import Categories from './Categories.jsx';
import Category from './Category.jsx';
import Tasks from './Tasks.jsx';
import TaskOptionsModal from '../TaskOptionsModal.jsx';
import Home from '../Home.jsx'
import { makeStyles, Container, Button, Modal, Paper } from '@material-ui/core';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import AddCategoryModal from './newCategory.jsx';
import AddToDoModal from './newToDo.jsx'

const useStyles = makeStyles({
  mobileMain: {
    width: '100%',
    display: 'inline-block'
  },
  desktopMain: {
    width: '45%',
    display: 'inline-block',
    height: '100%'
  },
  paper: {
    display: 'inline-block',
    padding: '1rem',
    width: '100%',
    color: 'black',
    minHeight: '80vh',
    overflowY: 'scroll'
  },
  todoListTopContainer: {
    display: 'inline-block',
    width: '100%',
    marginBottom: '8px'
  },
  button: {
    wordWrap: 'initial',
    backgroundColor: '#1976d2',
    color: 'white',
    marginRight: '4px'
  },
  categories: {
    paddingLeft: '0px',
    paddingRight: '0px'
  }
});

function ToDoList({isMobile, draggedEvent, setDraggedEvent, handleDragStart, taskData, addCategory, addTodo, updateTodo, deleteTodo, deleteCategory}) {
  const [newCatModalOpen, setNewCatModalOpen] = useState(false);
  const [newToDoModalOpen, setNewToDoModalOpen] = useState(false);
  const classes = useStyles();

  const openSetNewCat = (boo) => {
    if (boo === false) {
      setNewCatModalOpen(false);
    } else {
      setNewCatModalOpen(true);
    }
  }

  const openSetNewToDo = (boo) => {
    if (boo === false) {
      setNewToDoModalOpen(false);
    } else {
      setNewToDoModalOpen(true);
    }
  }

  return (
    <Container className={isMobile ? classes.mobileMain : classes.desktopMain}>
      <Paper elevation={1} className={classes.paper}>
        <Container>
          <Container className={classes.todoListTopContainer}>
            <div style={{display: 'flex', justifyContent: 'center', width: '100%', fontSize: '24px', fontWeight: '600', marginBottom: '12px'}}>To-Do List</div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Button className={classes.button} variant="contained" onClick={() => {openSetNewCat(true)}}>New Category</Button>
              <AddCategoryModal open={newCatModalOpen} closeCat={openSetNewCat} addCategory={addCategory} />
              <Button className={classes.button} variant="contained" onClick={() => {openSetNewToDo(true)}}>New Task</Button>
              <AddToDoModal open={newToDoModalOpen} closeCat={openSetNewToDo} addTodo={addTodo} taskData={taskData}/>
            </div>
          </Container>
          <Container className={classes.categories}>
            <Categories taskData={taskData} isMobile={isMobile} draggedEvent={draggedEvent}
              setDraggedEvent={setDraggedEvent} handleDragStart={handleDragStart} deleteCategory={deleteCategory}
              addTodo={addTodo} updateTodo={updateTodo} deleteTodo={deleteTodo}/>
          </Container>
        </Container>
      </Paper>
    </Container>
    )
};

export default ToDoList;