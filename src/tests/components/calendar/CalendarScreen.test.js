import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import '@testing-library/jest-dom';
import { act } from '@testing-library/react';

import { CalendarScreen } from '../../../components/calendar/CalendarScreen';
import { messages } from '../../../helpers/calendar.messages.es'
import { types } from '../../../types/types';
import { eventSetActive, eventStartLoading } from '../../../actions/events';

jest.mock('../../../actions/events', () => ({
    eventSetActive: jest.fn(),
    eventStartLoading: jest.fn(),
}));

Storage.prototype.setItem = jest.fn(); //mock de localStorage

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {
    calendar: {
        events: []
    },
    auth: {
        uid: '123',
        name: 'Daniel'
    },
    ui: {
        openModal: false
    }
};

const store = mockStore(initState);
//manejamos moock
store.dispatch = jest.fn();

//Armar la estructura de redireccion para el componente <DeleteEventFab />
const wrapper = mount(
    <Provider store={store}>
        <CalendarScreen />
    </Provider>
)

describe('Pruebas en <CalendarScreen>', () => {

    test('debe de mostrarse correctamente', () => {
        expect(wrapper).toMatchSnapshot();
    })

    test('pruebas con las interacciones del calendario', () => {
        const calendar = wrapper.find('Calendar'); //buscamos el componente <Calendar />
        const calendarMessages = calendar.prop('messages') //nos posicionamos en la prop messages del componente <Calendar />

        expect(calendarMessages).toEqual(messages) //comparamos los valores de messages

        calendar.prop('onDoubleClickEvent')(); //posicionamos en la prop

        //y esperamos que se ejecute un dispatch y que llame a este type
        expect(store.dispatch).toHaveBeenCalledWith({ type: types.uiOpenModal });

        calendar.prop('onSelectEvent')({ start: 'Hola' }) //se le pasa ese valor por defecto a la prop
        expect(eventSetActive).toHaveBeenCalledWith({ start: 'Hola' }) //se espera que este evento tenga el mismo objeto asignado


        //act: action
        act(() => {
            calendar.prop('onView')('week');
            expect(localStorage.setItem).toHaveBeenCalledWith('lastView', 'week');
        })


    })
})