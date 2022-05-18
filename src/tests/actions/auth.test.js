import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';

import '@testing-library/jest-dom';

import { startChecking, startLogin, startRegister } from '../../actions/auth';
import { types } from '../../types/types';

//importamos todo dentro de fetchModule
import * as fetchModule from '../../helpers/fetch';

//saber si se llamo este alert
jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));

//conexion con redux-thunk para los test asincronos
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initState = {};
let store = mockStore(initState);

Storage.prototype.setItem = jest.fn(); //para utilizar de esta manera 'localStorage.setItem'

describe('Pruebas en las acciones Auth', () => {

    //se ejecuta antes que comiencen los test a correr
    beforeEach(() => {
        store = mockStore(initState);
        jest.clearAllMocks(); //limpia la cache del mock, para que no traiga datos basuras
    });

    test('startlogin correcto', async () => {
        await store.dispatch(startLogin('danielRivera@gmail.com', '1234568'));
        const actions = store.getActions(); //conseguir el action que se disparo en el startLogin

        //evaluar resultados obtenidos del action
        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: expect.any(String), //id se espera que devuelva cualquier valor pero tipo String
                name: expect.any(String) //name se espera que devuelva cualquier valor pero tipo String
            }
        });

        //se llama al LocalStorage una sola vez, con el token guardado, y de tipo String
        expect(localStorage.setItem).toHaveBeenCalledWith('token', expect.any(String));
        //se llama al LocalStorage un sola vez, con la fecha guardada, y de tipo Number
        expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));

        //obtener el token de un arreglo que contiene otro arreglo hijo
        //token = localStorage.setItem.mock.calls[0][1];
    });

    test('startLogin incorrecto', async () => {
        await store.dispatch(startLogin('danielRivera@gmail.com', '12345689'));
        const actions = store.getActions();

        expect(actions).toEqual([]);
        expect(Swal.fire).toHaveBeenCalledWith('Error', 'Password incorrecto', 'error'); //saber si se llamo el alert de error
    });

    test('startRegister correcto', async () => {

        //Mock que simula un result, que devolveria la api
        fetchModule.fetchSinToken = jest.fn(() => ({
            json() {
                return {
                    ok: true,
                    uid: '123',
                    name: 'danielRivera',
                    token: 'ABC123ABC123ABC123'
                }
            }
        }));

        await store.dispatch(startRegister('pao2@gmail.com', '123456', 'pao'));

        const actions = store.getActions();

        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'danielRivera'
            }
        })

        //se espera que devuelvo el token
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'ABC123ABC123ABC123');
        expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));
    });

    test('startChecking correcto', async () => {

        //Mock que simula un result que devolveria la api
        fetchModule.fetchConToken = jest.fn(() => ({
            json() {
                return {
                    ok: true,
                    uid: '123',
                    name: 'danielRivera',
                    token: 'ABC123ABC123ABC123'
                }
            }
        }));

        await store.dispatch(startChecking());
        const actions = store.getActions();

        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'danielRivera'
            }
        });

        //verificamos que el token se envio
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'ABC123ABC123ABC123');
    });

});