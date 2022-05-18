import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import '@testing-library/jest-dom';

import moment from 'moment'
import { CalendarModal } from '../../../components/calendar/CalendarModal';
import { eventStartUpdate, eventClearActiveEvent, eventStartAddNew } from '../../../actions/events';
import { act } from '@testing-library/react';

jest.mock('../../../actions/events', () => ({
    eventStartUpdate: jest.fn(),
    eventClearActiveEvent: jest.fn(),
    eventStartAddNew: jest.fn()
}));

Storage.prototype.setItem = jest.fn(); //mock de localStorage

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowPlus1 = now.clone().add(1, 'hours');

const initState = {
    calendar: {
        events: [],
        activeEvent: {
            title: 'Hola Mundo',
            notes: 'Algunas notas',
            start: now.toDate(),
            end: nowPlus1.toDate()
        }
    },
    auth: {
        uid: '123',
        name: 'Daniel'
    },
    ui: {
        modalOpen: true
    }
};

const store = mockStore(initState);
//manejamos moock
store.dispatch = jest.fn();

//Armar la estructura de redireccion para el componente <DeleteEventFab />
const wrapper = mount(
    <Provider store={store}>
        <CalendarModal />
    </Provider>
)

describe('Pruebas en <CalendarModal />', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe de mostrar el modal', () => {

        // expect(wrapper.find('.modal').exists()).toBe(true);
        expect(wrapper.find('Modal').prop('isOpen')).toBe(true);
    });

    test('debe de llamar la accion de actualizar y cerrar el modal', () => {

        wrapper.find('form').simulate('submit', {
            preventDefault() { }
        });

        //el initState tiene registro para modificar en su activeEvent
        expect(eventStartUpdate).toHaveBeenCalledWith(initState.calendar.activeEvent);
        expect(eventClearActiveEvent).toHaveBeenCalled(); //verificamos que se halla llamado
    });

    test('debe de mostrar error si falta el titulo', () => {
        wrapper.find('form').simulate('submit', {
            preventDefault() { }
        });

        expect(wrapper.find('input[name="title"]').hasClass('is-invalid')).toBe(true);
    });

    test('debe de crear un nuevo evento', () => {
        const initState = {
            calendar: {
                events: [],
                activeEvent: null //esto es null osea que tenemos que crear nuevo registro
            },
            auth: {
                uid: '123',
                name: 'Daniel'
            },
            ui: {
                modalOpen: true
            }
        };

        const store = mockStore(initState);
        store.dispatch = jest.fn();

        const wrapper = mount(
            <Provider store={store}>
                <CalendarModal />
            </Provider>
        );

        //simulacion del input con esos valores
        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'Hola pruebas'
            }
        });

        //simulacion del submit
        wrapper.find('form').simulate('submit', {
            preventDefault() { }
        });

        //evento despachado y el valor que le enviamos
        expect(eventStartAddNew).toHaveBeenCalledWith({
            end: expect.anything(), //cualquier dato
            start: expect.anything(),
            title: 'Hola pruebas', //lo mismo que le pusimos mas arriba o en el input como simulacion
            notes: ''
        });

        expect(eventClearActiveEvent).toHaveBeenCalled(); //esto tambien tuvo que ser llamado

    });

    test('debe de validar las fechas', () => {
        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'Hola pruebas'
            }
        });

        const hoy = new Date();

        act(() => {
            //en el DateTimePicker para fechas de finalizacion NO la de inicializacion
            wrapper.find('DateTimePicker').at(1).prop('onChange')(hoy)
        });

        wrapper.find('form').simulate('submit', {
            preventDefault() { }
        });

    });


})