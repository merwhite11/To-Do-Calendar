import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { makeStyles, Container, Button } from '@material-ui/core';
import moment from 'moment';
import './CalendarStyle.scss';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

const MyCalendar = (props) => {
  const formatForCalendar = (list) => {
    if (list.length) {
      return list.flat().map(item => { return item.items }).flat().map(item => {
        const taskCopy = item;
        taskCopy.start =  new Date(item.start);
        taskCopy.end_date = new Date(item.end_date);
        return taskCopy;
      })
    } else {
      return [];
    }
  }

  if (props.viewingShared) {
    return (
      <DragAndDropCalendar
        className='calendar'
        localizer={localizer}
        defaultView="week"
        events={formatForCalendar(props.sharedEvents).filter(item => item.in_calendar)}
        startAccessor="start"
        endAccessor="end_date"
        min={new Date(moment().hour(6).minute(0))}
        max={new Date(moment().hour(23).minute(0))}
        style={{ height: 1000 }}
      />
    )
  }

  return (
    <DragAndDropCalendar
      className='calendar'
      localizer={localizer}
      defaultView="week"
      events={formatForCalendar(props.myEvents).filter(item => item.in_calendar)}
      startAccessor="start"
      endAccessor="end_date"
      onSelectEvent={(event) => {
        props.changeTitle(event);
      }}
      min={new Date(moment().hour(6).minute(0))}
      max={new Date(moment().hour(23).minute(0))}
      onEventDrop={props.moveEvent}
      onEventResize={props.resizeEvent}
      onDropFromOutside={props.onDropFromOutside}
      style={{ height: 1000 }}
    />
  )
}

export default MyCalendar;