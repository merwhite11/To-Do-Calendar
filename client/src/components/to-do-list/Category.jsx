import React, {useState, useEffect, useCallback, Suspense} from 'react';
import Task from './Task.jsx';
import Tasks from './Tasks.jsx';
import { makeStyles, Paper, Container, Grid, ButtonGroup, Button, TextField, Toolbar } from '@material-ui/core';
import TaskOptionsModal from '../TaskOptionsModal.jsx';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'inline-block',
    padding: '1rem',
    width: '100%',
    color: 'black'
  }
}))

const newTask = {
  title: '',
  description: '',
  start: new Date(),
  end_date: new Date(),
  in_calendar: false
}

function Category({tasks, isMobile, draggedEvent, setDraggedEvent, handleDragStart,
  addTodo, updateTodo, deleteTodo, deleteCategory}) {
  const classes = useStyles();
  const [totalTime, setTotalTime] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const todos = tasks.items;
  const categoryId = tasks.category_id;
  let accumulation = 0;
  let accumulationHours = 0;
  let accumulationMins = 0;
  const onCalendarTasks = todos.filter(task => task.in_calendar);
  onCalendarTasks.map(item => {
    if (item.end_date < new Date()) {
      const numberDuration = item.duration.split(':')
      let hours = Number(numberDuration[0])
      let minutes = Number(numberDuration[1])
      const combinedTime = (hours * 60 ) + minutes
      accumulation += combinedTime;
      }
      accumulationHours = Math.floor(accumulation / 60)
      accumulationMins = accumulation % 60
    })


  return (
    <Container>
      <Paper elevation={2} className={classes.paper}>
        <Container sx={{display: 'flex'}}>
          <div>{tasks.category}</div>
          <div>Time Spent So Far: {accumulationHours} hours {accumulationMins} minutes</div>
          <Button onClick={() => {
            setModalOpen(true);
          }}>Add Task</Button>
          <Button sx={{backgroundColor: 'red', color: 'blue'}}onClick={() => {
            deleteCategory(tasks);
          }}>Delete Category</Button>
          {modalOpen === true &&
          <TaskOptionsModal setModalOpen={setModalOpen} modalOpen={modalOpen} task={newTask}
          categoryId={categoryId} addTodo ={addTodo} updateTodo={updateTodo}
          deleteTodo={deleteTodo} newTodo={true}/>}
        </Container>
        <Container sx={{ display: 'inline-block'}}>
          { todos !== undefined && <Tasks tasks={todos} isMobile={isMobile}
            draggedEvent={draggedEvent} setDraggedEvent={setDraggedEvent}
            handleDragStart={handleDragStart}
            updateTodo={updateTodo} deleteTodo={deleteTodo}
            modalOpen={modalOpen} setModalOpen={setModalOpen}/>
          }
        </Container>
    </Paper>
  </Container>
)}

export default Category;