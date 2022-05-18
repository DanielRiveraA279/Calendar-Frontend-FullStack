
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import { LoginScreen } from '../../components/auth/LoginScreen';
import { startLogin, startRegister } from '../../actions/auth';
import Swal from 'sweetalert2';


const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initState = {};
const store = mockStore(initState);

//manejamos moock
store.dispatch = jest.fn();

//Armar la estructura de redireccion para el componente <DeleteEventFab />
const wrapper = mount(
    <Provider store={store}>
        <LoginScreen />
    </Provider>
)


//Agregamos Mock completo para armar una llamada a actions
jest.mock('../../actions/auth', () => ({
    startLogin: jest.fn(),
    startRegister: jest.fn()
}));

jest.mock('sweetalert2', () => ({
    fire: jest.fn(),
}));

describe('Pruebas en <LoginScreen />', () => {

    //Limpiar los mocks para que se resete todos las llamadas que se hacen en cada test
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('debe mostrarse correctamente', () => {

        expect(wrapper).toMatchSnapshot();
    });

    test('debe de llamar el dispatch del login', () => {

        //validar y enviar email al input lEmail
        wrapper.find('input[name="lEmail"]').simulate('change', {
            target: {
                name: 'lEmail',
                value: 'danielRivera@gmail.com'
            }
        })

        wrapper.find('input[name="lPassword"]').simulate('change', {
            target: {
                name: 'lPassword',
                value: '1234568'
            }
        })

        //buscamos el primer form
        wrapper.find('form').at(0).prop('onSubmit')({
            preventDefault() { } //lo que ejecuta, un metodo
        })

        //validamos llamada al action validando los parametros
        expect(startLogin).toHaveBeenCalledWith('danielRivera@gmail.com', '1234568')
    })

    test('No halla registro si las constraseñas son diferentes', () => {


        wrapper.find('input[name="rPassword1"]').simulate('change', {
            target: {
                name: 'rPassword1',
                value: '123456'
            }
        })

        wrapper.find('input[name="rPassword2"]').simulate('change', {
            target: {
                name: 'rPassword1',
                value: '1234567' //ponemos clave diferente
            }
        })

        //buscamos segundo formulario el de registro
        wrapper.find('form').at(1).prop('onSubmit')({
            preventDefault() { } //lo que ejecuta, un metodo
        })

        //que el Action no halla sido llamado, porque dio un error de valdiacion
        expect(startRegister).not.toHaveBeenCalled();

        //que el Swal halla sido llamado, porque entro en la validacion de claves diferentes
        expect(Swal.fire).toHaveBeenCalledWith('Error', 'Las contraseñas deben de ser iguales', 'error')
    })

    test('Registro con contraseñas iguales', () => {
        wrapper.find('input[name="rPassword1"]').simulate('change', {
            target: {
                name: 'rPassword1',
                value: '123456'
            }
        })

        wrapper.find('input[name="rPassword2"]').simulate('change', {
            target: {
                name: 'rPassword1',
                value: '123456'
            }
        })

        //buscamos segundo formulario el de registro
        wrapper.find('form').at(1).prop('onSubmit')({
            preventDefault() { } //lo que ejecuta, un metodo
        })

        expect(Swal.fire).not.toHaveBeenCalled(); //que mensaje de validacion no halla sido llamado
        //que halla sido llamado, y le pasamos los valores al action
        expect(startRegister).toHaveBeenCalledWith("test2@test.com", "123456", "test 2");

    })
})