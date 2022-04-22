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

function Category({tasks, isMobile, draggedEvent, setDraggedEvent, handleDragStart, addTodo, updateTodo, deleteTodo}) {
  const classes = useStyles();
  const [todos, setTodos] = useState(tasks.items || null)
  const [catId, setCatId] = useState(tasks.category_id || null)
  const [totalTime, setTotalTime] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [cumulativeHours, setCumulativeHours] = useState(0)
  const [cumulativeMins, setCumulativeMins] = useState(0)

  useEffect(() => {
    setTodos(tasks.items)
    setCatId(tasks.category_id)
  }, [])

  // console.log('todos in category', todos)
  // const onCalendarTasks = todos.filter(task => task.in_calendar);
  // let accumulation = 0
  // // console.log('oncal', onCalendarTasks)
  // onCalendarTasks.map((task) => {
  //   console.log('new date', new Date())
  //   if(task.end_date < new Date()) {
  //     accumulation += task.duration
  //     // console.log('acc', accumulation)
  //   }
  // })

  // const convertDuration = (duration) => {
  //   const splitDuration = duration.split(':')
  //   let hours = splitDuration[0]
  //   const hoursDigits = hours.split('')
  //   if (hoursDigits[0] === '0' && hoursDigits.length === 2) {
  //     hours = hoursDigits[1]
  //   }
  //   let minutes = splitDuration[1]
  //   const minutesDigits = minutes.split('')
  //   if (minutesDigits[0] === '0') {
  //     minutes = minutesDigits[1]
  //   }
    // setCumulativeHours(hours)
    // setCumulativeMins(minutes)
  // }

  // convertDuration(accumulation)

  return (
    <Container>
      <Paper elevation={2} className={classes.paper}>
        <Container sx={{display: 'flex'}}>
          <div>{tasks.category}</div>
          <div>Time Spent So Far: 0</div>
          <Button onClick={() => {
            setModalOpen(true);
          }}>Add Task</Button>
          {modalOpen === true &&
          <TaskOptionsModal setModalOpen={setModalOpen} modalOpen={modalOpen} task={''}
          categoryId={categoryId} addTodo ={addTodo} updateTodo={updateTodo}
          deleteTodo={deleteTodo} newTodo={true}/>}
        </Container>
        <Container sx={{ display: 'inline-block'}}>
          <Tasks tasks={todos} isMobile={isMobile}
          draggedEvent={draggedEvent} setDraggedEvent={setDraggedEvent}
          handleDragStart={handleDragStart}
          updateTodo={updateTodo} deleteTodo={deleteTodo}
          modalOpen={modalOpen} setModalOpen={setModalOpen}/>
        </Container>
    </Paper>
  </Container>
)}

export default Category;