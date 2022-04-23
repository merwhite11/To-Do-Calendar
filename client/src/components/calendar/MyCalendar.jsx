import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { makeStyles, Container, Button } from '@material-ui/core';
import moment from 'moment';
import './CalendarStyle.scss';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import TaskOptionsModal from '../TaskOptionsModal.jsx';

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

const MyCalendar = (props) => {
  const [todo, setTodo] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const handleOnSelectEvent = (event) => {
    setTodo(event);
    setModalOpen(true);
  }

  if (props.viewingShared) {
    console.log(props.viewingShared, props.formatForCalendar(props.sharedEvents));
    return (
      <DragAndDropCalendar
        className='calendar'
        localizer={localizer}
        defaultView="week"
        events={props.formatForCalendar(props.sharedEvents).filter(item => item.in_calendar)}
        startAccessor="start"
        endAccessor="end_date"
        min={new Date(moment().hour(6).minute(0))}
        max={new Date(moment().hour(23).minute(0))}
        style={{ height: 1000 }}
      />
    )
  }

  return (
    <>
      <DragAndDropCalendar
        className='calendar'
        localizer={localizer}
        defaultView="week"
        events={props.formatForCalendar(props.myEvents) ? props.formatForCalendar(props.myEvents).filter(item => item.in_calendar) : []}
        startAccessor="start"
        endAccessor="end_date"
        onSelectEvent={(event) => {
          handleOnSelectEvent(event);
        }}
        min={new Date(moment().hour(0).minute(0))}
        max={new Date(moment().hour(23).minute(59))}
        onEventDrop={props.moveEvent}
        onEventResize={props.resizeEvent}
        onDropFromOutside={props.onDropFromOutside}
        style={{ height: 1000 }}
      />
      {modalOpen === true && <TaskOptionsModal setModalOpen={setModalOpen} modalOpen={modalOpen} task={todo}
      addTodo={props.addTodo} updateTodo={props.updateTodo}
      deleteTodo={props.deleteTodo} newTodo={false}/>}
    </>
  )
}

export default MyCalendar;