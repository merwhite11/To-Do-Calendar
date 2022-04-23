import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Button, TextField, Modal, Stack, InputLabel, Select, MenuItem, Container, makeStyles, IconButton} from '@material-ui/core';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { format } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const useStyles = makeStyles(theme => ({
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    height: 600,
    backgroundColor: 'white',
    boxShadow: 24,
    display: 'inline-block',
    borderRadius: '3px',
    padding: '1rem'
  },
  input: {
    margin: '1rem',
    width: 250
  }
}));

var AddToDoModal = (props) => {
  const classes = useStyles();

  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [category, setCategory] = useState('');

  let userCats = [];

  if (props.taskData) {
    userCats = props.taskData;
  }

  const handleAddTodo = () => {
    console.log('cat state:', category);
    let newItem = {};

    newItem.title = title;
    newItem.description = description;
    newItem.start = startDate;
    newItem.end_date = endDate;
    newItem.category_id = category;
    newItem.in_calendar = false;

    let hours = endDate.getHours() - startDate.getHours();
    let minutes = endDate.getMinutes() - startDate.getMinutes();
    if (minutes < 0) {
      const convertedHours = (hours * 60) + minutes;
      hours = Math.floor(convertedHours/60)
      minutes = convertedHours % 60
    };
    const duration = hours + ':' + minutes;
    console.log('duration: ', duration);
    newItem.duration = duration;

    props.addTodo(newItem);
    props.closeCat(false)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Modal open={props.open} onClose={() => props.closeCat(false)}>
        <Container className={classes.modal}>
          <TextField label="Title" id="title" type="text" className={classes.input} onChange={(newValue) => setTitle(newValue.target.value)} />
          <TextField label="Description" id="description" type="text" className={classes.input} onChange={(newValue) => setDescription(newValue.target.value)} />
          <Select id="category" label="Category" className={classes.input} value={category} onChange={(newValue) => setCategory(newValue.target.value)}>
          {userCats.map(option => {
          return (
            <MenuItem key={option.category_id} value={option.category_id}>
              {option.category}
            </MenuItem>
                 )
          })}
          </Select>
          <DesktopDateTimePicker renderInput={(props) => <TextField className={classes.input} {...props} />} label="Start Time" value={startDate || new Date()} onChange={(newValue) => setStartDate(newValue)} />
          <DesktopDateTimePicker renderInput={(props) => <TextField className={classes.input} {...props} />} label="End Time" value={endDate || new Date()} onChange={(newValue) => setEndDate(newValue)} />
          <Button variant="contained" onClick={() => handleAddTodo()}>Submit</Button>
        </Container>
      </Modal>
    </LocalizationProvider>
  );
};

export default AddToDoModal;