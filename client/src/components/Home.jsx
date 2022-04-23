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
        if (response.data) {
          if (response.data.loggedIn === false) {
            setMyEvents(result.calendars[0]);
          } else {
            setIsLoggedIn(response.data.loggedIn);
            setEmail(response.data.info);
            getAllTodos(response.data.info);
          }
        }
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
        setMyEvents(response.data.results[0].calendars[0]);
        setUserCalendar(response.data.results[0].calendars[0]);
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
        getAllTodos()
        console.log(result);
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

    console.log(incomingId);
    console.log('userCalendar: ', userCalendar);
    console.log(category);

    await axios.post('http://localhost:3000/todoList/category', { params: { calendar_id: incomingId, category: category } })
      .then((result) => {
        getAllTodos(userEmail);
      })
      .catch(err => console.error(err));
  }

  const moveEvent = useCallback (
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event;
      if (isLoggedIn === false) {
        navigate('/signin')
      } else {
        if (!allDay && droppedOnAllDaySlot) {
          event.allDay = true;
        }
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

  const changeTitle = (event) => {
    if (isLoggedIn === false) {
      navigate('/signin')
    } else {
      var title = prompt("Change title", event.title);
      setMyEvents((prev) => {
        const existing = event;
        const list = prev
        list.categories.forEach(category => {
          category.items.forEach(item => {
            if (item === existing) {
              item.title = title;
            }
          })
        })
        return list;
      })
    }
  };

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

  const naviBar = (<TopBar isLoading={isLoading} setIsLoggedIn={setIsLoggedIn}
    isLoggedIn={isLoggedIn} isMobile={isMobile} onCalendar={onCalendar}
    setOnCalendar={setOnCalendar} userEmail={userEmail} viewSharedCal={viewSharedCal} />);

  const toDoList = (<ToDoList isMobile={isMobile} taskData={myEvents.categories ? myEvents.categories.flat() : []}
    draggedEvent={draggedEvent} setDraggedEvent={setDraggedEvent} deleteCategory={deleteCategory}
    handleDragStart={handleDragStart} addCategory={addCategory}
    updateTodo={updateTodo} addTodo={addTodo} deleteTodo={deleteTodo} />);

  const myCalendar = (<MyCalendar formatForCalendar={formatForCalendar} myEvents={myEvents} moveEvent={moveEvent} resizeEvent={resizeEvent}
    changeTitle={changeTitle} onDropFromOutside={onDropFromOutside} sharedEvents={sharedEvents}
    updateTodo={updateTodo} addTodo={addTodo} deleteTodo={deleteTodo}
    viewingShared={viewingShared} />);


  const renderContent = () => {
    if (isMobile && !onCalendar) {
      console.log('myEvents: ', myEvents);
      return (
        <div>
          {naviBar}
          <div className="">
            {myEvents.length ? toDoList : null}
          </div>
        </div>
      )
    } else if (isMobile && onCalendar) {
      console.log(myEvents);
      return (
        <div>
          {naviBar}
          <div>
            {myEvents.length ? myCalendar : null}
          </div>
        </div>
      )
    } else {
      return (
        <div>
          {naviBar}
          {myCalendar}
          {toDoList ?? null}
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
