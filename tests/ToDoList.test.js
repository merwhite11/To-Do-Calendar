import React from 'react';
import {render, waitFor, screen} from '@testing-library/react';
import Enzyme from 'enzyme';
import { shallow, mount, ShallowWrapper, instance } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from '../client/src/App';
import Home from '../client/src/components/Home';
import ToDoList from '../client/src/components/to-do-list/ToDoList';
import { result } from '../database/example.js'

Enzyme.configure({ adapter: new Adapter() });

describe ('ToDoList Component Testing', () => {
  const events = shallow(<Home/>)
    render(<ToDoList/>);
    console.log('events', evnets)
  });

