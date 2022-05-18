import { fetchConToken, fetchSinToken } from '../../helpers/fetch';

describe('Pruebas en el helper Fetch', () => {
    let token = '';

    test('fetchSinToken debe de funcionar', async () => {
        const resp = await fetchSinToken('auth', { email: 'danielRivera@gmail.com', password: '1234568' }, 'POST');

        expect(resp instanceof Response).toBe(true);

        const body = await resp.json();
        expect(body.ok).toBe(true);

        //capturamos token para utilizarlos en las demas pruebas
        token = body.token;

    });

    test('fetchSinToken debe de funcionar', async () => {
        //guardamos token en localStorage
        localStorage.setItem('token', token);

        //colocamos un id valido para mongo, pero que no exista en su base de datos
        const resp = await fetchConToken('events/6220f3a250c5b6c8d9b72ef1', {}, 'DELETE');
        const body = await resp.json();

        expect(body.msg).toBe('Evento no existe por ese id');
    });

});