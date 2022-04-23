import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Button, Box, Grid, Card, CardHeader, CardContent, CardActions, Collapse, makeStyles, Typography, Toolbar, TextField,  TextareaAutosize, Stack } from '@material-ui/core';
const TaskOptionsModal = React.lazy(() => import('../TaskOptionsModal.jsx'));

const useStyles = makeStyles({
  grid: {
    display: 'inline-block',
    alignItems: 'center'
  },
  header: {
    fontSize: 12
  },
  textArea: {
    padding: '1rem',
    width: '90%',
    color: 'black'
  },
  card: {
    display: 'flex',
    border: '1rem solid black',
  }
});

function Task({task, isMobile, draggedEvent, setDraggedEvent, handleDragStart, clickedTask, updateTodo, deleteTodo}) {

  const [todo, setTodo] = useState(task);
  const [modalOpen, setModalOpen] = useState(false);
  const [startTime, setStartTime] = useState(task.start);
  const [endTime, setEndTime] = useState(task.end_date);
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();

  const convertDuration = (duration) => {
    const splitDuration = duration.split(':');
    let hours = splitDuration[0];
    const hoursDigits = hours.split('');
    if (hoursDigits[0] === '0' && hoursDigits.length === 2) {
      hours = hoursDigits[1];
    };
    let minutes = splitDuration[1];
    const minutesDigits = minutes.split('')
    if (minutesDigits[0] === '0') {
      minutes = minutesDigits[1];
    };
    setHours(hours);
    setMinutes(minutes);
  }

  const updateTask = (task) => {
    console.log('task in updateTask', task)
    const todoCopy = todo;
    todoCopy.title = task.title;
    todoCopy.description = task.description;
    todoCopy.start = task.start || new Date();
    todoCopy.end_date = task.end_date || new Date();
    todoCopy.in_calendar = task.in_calendar;
    todoCopy.category_id = task.category_id;

    let hours = endTime.getHours() - startTime.getHours();
    let minutes = endTime.getMinutes() - startTime.getMinutes();

    if (minutes < 0) {
      const convertedHours = (hours * 60) + minutes;
      hours = Math.floor(convertedHours/60);
      minutes = convertedHours % 60;
    }

    const duration = hours + ':' + minutes;
    todoCopy.duration = duration;
    console.log('duration', duration)

    // setTodo(task);
    // newTodo(task);
    setTodo(todoCopy)
  }

  const classes = useStyles();

  useEffect(() => {
    convertDuration(todo.duration);
  }, []);

  const newTodo = useCallback((todo) => {
    console.log('todo.duration in call', todo.duration)
    convertDuration(todo.duration)
  }, [todo]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Grid item xs={12} lg={12}>
        <Grid item xs={12}>
          <Card onDragStart={() => handleDragStart(task)} draggable='true'>
            {modalOpen === true && <TaskOptionsModal setModalOpen={setModalOpen} modalOpen={modalOpen} task={task} updateTodo={updateTodo} deleteTodo={deleteTodo} updateTask={updateTask}/>}
            <CardContent>
              <div style={{display: 'flex', flexDirection: 'row', gap: '5%'}}>
                <Typography>
                  {task.title}
                </Typography>
                <div>Duration:</div>
                <Box>{hours} {hours === '1' ? 'hour' : 'hours'}</Box>
                <Box>{minutes} {minutes === '1' ? 'minute' : 'minutes'}</Box>
              </div>
              <Typography>
                {task.description}
              </Typography>
            <CardActions>
              <Button variant="contained" size="small" onClick={() => setModalOpen(true)}>Edit</Button>
            </CardActions>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Suspense>
  );
};

export default Task;