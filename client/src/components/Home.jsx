import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import MyCalendar from './calendar/MyCalendar.jsx';
import ToDoList from './to-do-list/ToDoList.jsx';
import TopBar from './TopBar.jsx';
import moment from 'moment';
import { result } from '../../../database/example.js';

const Home = ({ setIsLoading, isMobile, isLoggedIn, isLoading, setIsLoggedIn, sharedBy }) => {

  const [allTodos, setAllTodos] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [onCalendar, setOnCalendar] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState();
  const [userEmail, setEmail] = useState(null);
  const [hasData, setHasData] = useState(false);
  const [userCalendar, setUserCalendar] = useState(false);
  const [sharedEvents, setSharedEvents] = useState([]);
  const [viewingShared, setViewingShared] = useState(false);

  const navigate = useNavigate();

  useEffect(async () => {
    await axios.get('http://localhost:3000/auth/isLoggedIn', { withCredentials: true })
      .then((response) => {
        setIsLoading(false);
        if (!response.data) {
          return setMyEvents(result.calendars[0])
        }
          setIsLoggedIn(response.data.loggedIn);
          setEmail(response.data.info);
          getAllTodos(response.data.info);
      })
      .catch((err) => {
        return err;
      })
  }, [isLoggedIn])

  const getAllTodos = async (user) => {
    if (!isLoggedIn) {
      return;
    }
    await axios.get('http://localhost:3000/todoList/info', { params: { email: user } })
      .then((response) => {
        if (response.data.results.length === 0) {
          axios.post('http://localhost:3000/todoList/newUser', { params: { email: user } })
            .then(() => {
              getAllTodos(user);
            }).catch((err) => {
              return err;
            })
        } else {
          setMyEvents(response.data.results[0].calendars[0]);
          setUserCalendar(response.data.results[0].calendars[0]);
        }
      })
      .then(() => {
        setHasData(true);
      })
      .catch((err) => {
        return err;
      });
  }

  const addTodo = async (todo) => {
    await axios.post('http://localhost:3000/todoList/item', { params: { userEmail: userEmail }, data: todo })
      .then((result) => {
        getAllTodos(userEmail);
      })
      .catch(err => console.error(err));
  }

  const updateTodo = async (todo) => {
    // console.log('Update Todo: ', todo);
    await axios.put('http://localhost:3000/todoList/updateItem', { params: { userEmail: userEmail }, data: todo })
      .then((result) => {
        getAllTodos(userEmail);
      })
      .catch(err => console.error(err));
  }

  const updateCategory = async (category) => {
    console.log('Update Category: ', category);
    await axios.put('http://localhost:3000/todoList/updateCategory', { params: { userEmail: userEmail }, data: category })
      .then((result) => {
        getAllTodos(userEmail);
      })
      .catch(err => console.error(err));
  }

  const deleteTodo = async (todo) => {
    console.log('Delete Todo: ', todo);
    await axios.delete('http://localhost:3000/todoList/item', { params: { userEmail: userEmail }, data: todo })
      .then((result) => {
        getAllTodos(userEmail);
      })
      .catch(err => console.error(err));
  }


  const deleteCategory = async (category) => {
    console.log('Delete Category: ', category);
    await axios.delete('http://localhost:3000/todoList/category', { params: { userEmail: userEmail }, data: category })
      .then((result) => {
        getAllTodos(userEmail);
      })
      .catch(err => console.error(err));
  }

  const addCategory = async (category) => {
    let incomingId;

    incomingId = userCalendar.calendar_id;

    await axios.post('http://localhost:3000/todoList/category', { params: { calendar_id: incomingId, category: category } })
      .then((result) => {
        getAllTodos(userEmail);
      })
      .catch(err => console.error(err));
  }

  const moveEvent = useCallback (
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event;
      console.log(`start: ${start}, end: ${end}, allDay: ${allDay}`);
      console.log('event: ', event);
      if (isLoggedIn === false) {
        console.log('isLoggedIn moveEvent: ', isLoggedIn);
        navigate('/signin')
      } else {
        if (!allDay && droppedOnAllDaySlot) {
          event.allDay = true;
        }
        console.log('help');
        setMyEvents((prev) => {
          const existing = event;
          const list = prev
          console.log('list, existing', list, existing)
          list.categories.forEach(category => {
            console.log('category', category);
            category.items.forEach(item => {
              if (item === existing) {
                item.start = start;
                item.end_date = end;
                updateTodo(item);
              }
            })
          })
          return list;
        });
      }
    }, [setMyEvents]
  );

  const newEvent = useCallback(
    (event) => {
      setMyEvents((prev) => {
        const idList = prev.map((item) => item.id)
        const newId = Math.max(...idList) + 1
        return [...prev, { ...event, id: newId }]
      })
    },
    [setMyEvents]
  )

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      if (isLoggedIn === false) {
        navigate('/signin')
      } else {
        setMyEvents((prev) => {
          const existing = event;
          const list = prev
          list.categories.forEach(category => {
            category.items.forEach(item => {
              if (item === existing) {
                item.start = start;
                item.end_date = end;
              }
            })
          })
          return list;
        });
      }
    },
    [setMyEvents]
  );

  const handleDragStart = useCallback((event) => {
    setDraggedEvent(event)

    if (isLoggedIn === false) {
      navigate('/signin')
    } else {
      setDraggedEvent(event)
    }
  })

  const onDropFromOutside = useCallback(
    () => {
      if (isLoggedIn === false) {
        navigate('/signin')
      } else {
        setMyEvents((prev) => {
          const existing = draggedEvent;
          const list = prev
          list.categories.forEach(category => {
            category.items.forEach(item => {
              if (item === existing) {
                item.in_calendar = !item.in_calendar
                item.start = new Date(moment(item.start))
                item.end_date = new Date(moment(item.end_date))
                updateTodo(item);
              }
            })
          })
          return list;
        });
        setDraggedEvent(null)
      }
    },
    [draggedEvent, setDraggedEvent, newEvent]
  )

  const viewSharedCal = async function (sharedEmail) {
    if (sharedEmail.length === 1) {
      setSharedEvents([]);
      setViewingShared(false);
    }
    if (sharedEmail.length === 2) {
      var viewThisEmail = sharedEmail[1]['user_email'];
      await axios.get('http://localhost:3000/todoList/info', { params: { email: viewThisEmail } })
        .then((response) => {
          setSharedEvents(response.data.results[0].calendars[0]);
        })
        .then(() => setViewingShared(true))
        .catch((err) => {
          setSharedEvents([]);
          setViewingShared(false);
          return err;
        })
    }
  }

  const formatForCalendar = (list) => {
    if (list.categories) {
      return list.categories.flat().map(item => { return item.items }).flat().map(item => {
        const taskCopy = item;
        taskCopy.start = new Date(item.start);
        taskCopy.end_date = new Date(item.end_date);
        return taskCopy;
      })
    } else {
      return [];
    }
  }

  const naviBar = (<TopBar setMyEvents={setMyEvents} setAllTodos={setAllTodos}isLoading={isLoading} setIsLoggedIn={setIsLoggedIn}
    isLoggedIn={isLoggedIn} isMobile={isMobile} onCalendar={onCalendar}
    setOnCalendar={setOnCalendar} userEmail={userEmail} viewSharedCal={viewSharedCal} />);

  const toDoList = (<ToDoList isMobile={isMobile} taskData={myEvents.categories ? myEvents.categories.flat() : []}
    draggedEvent={draggedEvent} setDraggedEvent={setDraggedEvent} deleteCategory={deleteCategory}
    handleDragStart={handleDragStart} addCategory={addCategory}
    updateTodo={updateTodo} addTodo={addTodo} deleteTodo={deleteTodo} />);

  const myCalendar = (<MyCalendar formatForCalendar={formatForCalendar} myEvents={myEvents} moveEvent={moveEvent} resizeEvent={resizeEvent}
    onDropFromOutside={onDropFromOutside} sharedEvents={sharedEvents}
    updateTodo={updateTodo} addTodo={addTodo} deleteTodo={deleteTodo}
    viewingShared={viewingShared} />);


  const renderContent = () => {
    if (isMobile && !onCalendar) {
      console.log('myEvents: ', myEvents);
      return (
        <div>
          {naviBar}
          <div className="">
            {/* {myEvents.length ? toDoList : null} */}
            {toDoList}
          </div>
        </div>
      )
    } else if (isMobile && onCalendar) {
      console.log(myEvents);
      return (
        <div>
          {naviBar}
          <div>
            {/* {myEvents.length ? myCalendar : null} */}
            {myCalendar}
          </div>
        </div>
      )
    } else {
      return (
        <div>
          {naviBar}
          {myCalendar}
          {toDoList}
        </div>
      )
    }
  }

  return (
    <div>
      {renderContent()}
    </div>
  )
}

export default Home;
