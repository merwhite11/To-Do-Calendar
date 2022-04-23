import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Button, TextField, Modal, Stack, InputLabel, Select, MenuItem, Container, makeStyles } from '@material-ui/core';

import { format } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';

const useStyles = makeStyles({
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    boxShadow: 24,
    display: 'inline-block',
    borderRadius: '15px',
    padding: '1rem'
  },
  input: {
    width: '90%',
    margin: '1rem'
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '0.5rem 0 0 0'
  },
  done: {
    margin: '0.5rem 0.5rem 0.5rem 0rem'
  },
  addTo: {
    backgroundColor: '#1976d2',
    color: 'white',
    margin: '0.5rem'
  },
  delete: {
    backgroundColor: 'red',
    color: 'white',
    margin: '0.5rem'
  }
});

var TaskOptionsModal = (props) => {
  const [userTask, setUserTask] = useState(props.task || {})
  const [todoTitle, setTodoTitle] = useState(props.task.title || '');
  const [todoDescription, setTodoDescription] = useState(props.task.description || '');
  const [startTime, setStartTime] = useState(props.task.start);
  const [endTime, setEndTime] = useState(props.task.end_date);
  // const [duration, setDuration] = useState(props.task.duration || 0)
  const [inCalendar, setInCalendar] = useState(props.task.in_calendar || false);

  const classes = useStyles();

  const handleTextInput = (event, field) => {
    const text = event.target.value;
    field === 'title' ? setTodoTitle(text) : setTodoDescription(text);
  }

  const handleEditDone = () => {
    const taskCopy = userTask;
    taskCopy.title = todoTitle;
    taskCopy.description = todoDescription;
    taskCopy.start = userTask.start || new Date();
    taskCopy.end_date = userTask.end_date || new Date();
    taskCopy.in_calendar = inCalendar;
    taskCopy.category_id = props.categoryId;
    // duration fix
    var momentStart = moment(taskCopy.start)
    var momentEnd = moment(taskCopy.end_date);
    taskCopy.duration = momentEnd.diff(momentStart, 'hours').toString() + ' hours';
    props.addTodo(taskCopy);
    setUserTask(taskCopy);

    props.newTodo ? props.addTodo(userTask) : (props.updateTodo(userTask), props.updateTask(userTask));
    props.setModalOpen(false);
  }

  const handleAddTo = () => {
    if (props.task.in_calendar === true) {
      console.log('true')
      const taskCopy = userTask;
      taskCopy.in_calendar = false;
      props.updateTodo(taskCopy);
    } else if (props.task.in_calendar === false) {
      console.log('false')
      const taskCopy = userTask;
      console.log('taskCopy:', taskCopy);
      // console.log('userTask:', userTask);
      taskCopy.in_calendar = true;
      props.updateTodo(taskCopy);
    }

  }

  const handleTimeChange = (time, frame) => {
    const taskCopy = userTask;
    taskCopy[frame] = time;
    setUserTask(taskCopy)
  }

  const handleTodoDelete = () => {
    props.deleteTodo(props.task);
    props.setModalOpen(false);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Modal open={props.modalOpen} onClose={() => props.setModalOpen(false)}>
        <Container className={classes.modal}>
          <TextField label="Title" className={classes.input} defaultValue={props.task.title} onChange={(newValue) => {handleTextInput(newValue, 'title')}} />
          <TextField multiline label="Description" className={classes.input} defaultValue={props.task.description} onChange={(newValue) => handleTextInput(newValue, 'description')}/>

          <DesktopDateTimePicker renderInput={(props) => <TextField className={classes.input} {...props} />} label="Start Time"
            value={startTime} onChange={(newValue) => {
              handleTimeChange(newValue, 'start')
              setStartTime(newValue)}} />
          <DesktopDateTimePicker renderInput={(props) => <TextField className={classes.input} {...props} />} label="End Time"
            value={endTime} onChange={(newValue) => {
              handleTimeChange(newValue, 'end_date')
              setEndTime(newValue)}}/>

          <Container className={classes.container}>
            <Button className={classes.done} variant="contained" size="medium" onClick={() => handleEditDone()}>Done</Button>
            <Button className={classes.addTo} variant="contained" size="medium" onClick={() => handleAddTo()}>{props.task.in_calendar ? 'Add to TodoList' : 'Add to Calendar'}</Button>
            <Button className={classes.delete} variant="contained" size="medium" onClick={() => handleTodoDelete()}>Delete</Button>
          </Container>
        </Container>
      </Modal>
    </LocalizationProvider>
  );
};

export default TaskOptionsModal;

