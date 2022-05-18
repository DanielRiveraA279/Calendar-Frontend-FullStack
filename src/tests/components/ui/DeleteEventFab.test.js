import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import { DeleteEventFab } from '../../../components/ui/DeleteEventFab';
import { eventStartDelete } from '../../../actions/events';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initState = {};
const store = mockStore(initState);
//manejamos moock
store.dispatch = jest.fn();

//Armar la estructura de redireccion para el componente <DeleteEventFab />
const wrapper = mount(
    <Provider store={store}>
        <DeleteEventFab />
    </Provider>
)

//Agregamos Mock completo para armar una llamada al evento de deleted especialmente
jest.mock('../../../actions/events', () => ({
    eventStartDelete: jest.fn()
}));


describe('Pruebas en <DeleteEventFab />', () => {

    test('debe de mostrarse correctamente', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('debe de llamar el eventStartDelete al hacer click', () => {
        wrapper.find('button').prop('onClick')(); //buscamos el boton y que se ejecute el click

        //se espera con la config del mock que este evento se ejecute al hacer click en delete
        expect(eventStartDelete).toHaveBeenCalled();

    });
});