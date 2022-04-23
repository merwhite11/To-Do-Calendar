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
    if (!isLoggedIn) {
      return setMyEvents(result.calendars[0])
    }
    await axios.get('http://localhost:3000/auth/isLoggedIn', { withCredentials: true })
      .then(async (result) => {
        console.log(result);
        setIsLoading(false);
        if (result.data) {
          setIsLoggedIn(result.data.loggedIn);
          setEmail(result.data.info);
          getAllTodos(result.data.info);
        }
      })
      .catch((err) => {
        return err;
      })
  }, [isLoggedIn])

  const getAllTodos = async (user) => {
    await axios.get('/todoList/info', { params: { email: user } })
      .then((response) => {
        setMyEvents([...response.data.results[0].calendars[0].categories]);
        setUserCalendar(response.data.results[0].calendars[0]);
      })
      .then(() => setHasData(true))
      .catch((err) => {
        return err;
      });
  }

  const addTodo = (todo) => {
    axios.post('/todoList/item', { params: { userEmail: userEmail }, data: todo })
      .then((result) => {
        getAllTodos(userEmail)
      })
      .catch(err => console.error(err));
  }

  const updateTodo = (todo) => {
    console.log('Update Todo: ', todo);
    axios.put('http://localhost:3000/todoList/updateItem', { params: { userEmail: userEmail }, data: todo })
      .then((result) => {
            getAllTodos(userEmail)
        })
        .catch(err => console.error(err));
  }

  const updateCategory = (category) => {
    console.log('Update Category: ', category);
    // axios.put('/todoList/category', { params: { userEmail: userEmail }, data: category })
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch(err => console.error(err));
  }

  const deleteTodo = (todo) => {
    console.log('Delete Todo: ', todo);
    axios.delete('/todoList/item', { params: { userEmail: userEmail }, data: todo })
      .then((result) => {
        console.log(result);
      })
      .catch(err => console.error(err));
  }

  const addCategory = (category) => {

    let incomingId;

    incomingId = userCalendar.calendar_id;

    console.log(incomingId);
    console.log('userCalendar: ', userCalendar);

    axios.post('/todoList/category', { params: { calendar_id: incomingId, category: category } })
      .then((result) => {
        let catId = result.data.category_id;
        let newCat = { category_id: catId, category: category, todoitems: [] };
        let newEventsList = myEvents;
        newEventsList.push(newCat);
        setMyEvents([...newEventsList]);
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
    }, [setMyEvents, myEvents]
  );

  const newEvent = useCallback(
    (event) => {
      setMyEvents((prev) => {
        const idList = prev.map((item) => item.id)
        const newId = Math.max(...idList) + 1
        return [...prev, { ...event, id: newId }]
      })
    },
    [setMyEvents, myEvents]
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
    [setMyEvents, myEvents]
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
      setDraggedEvent(event), []
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
          setSharedEvents([...response.data.results[0].calendars[0].categories]);
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
    draggedEvent={draggedEvent} setDraggedEvent={setDraggedEvent}
    handleDragStart={handleDragStart} addCategory={addCategory}
    updateTodo={updateTodo} addTodo={addTodo} deleteTodo={deleteTodo} />);

  const myCalendar = (<MyCalendar formatForCalendar={formatForCalendar} myEvents={myEvents} moveEvent={moveEvent} resizeEvent={resizeEvent}
    changeTitle={changeTitle} onDropFromOutside={onDropFromOutside} sharedEvents={sharedEvents}
    viewingShared={viewingShared} />);


  const renderContent = () => {
    if (isMobile && !onCalendar) {
      return (
        <div>
          {naviBar}
          <div className="">
            {myEvents.length ? toDoList : null}
          </div>
        </div>
      )
    } else if (isMobile && onCalendar) {
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