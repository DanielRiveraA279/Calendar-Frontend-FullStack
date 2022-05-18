import { uiCloseModal, uiOpenModal } from "../../actions/ui";
import { uiReducer } from "../../reducers/uiReducer";

const initState = {
    modalOpen: false
};

describe('Pruebas en uiReducer', () => {

    test('debe de retornar el estado por defecto', () => {

        const state = uiReducer(initState, {});

        expect(state).toEqual(initState);
    });

    test('debe de abrir y cerrar el modal', () => {
        const modalOpen = uiOpenModal(); //asigno action

        const state = uiReducer(initState, modalOpen); //ejecuto reducer

        //se espera el modal abierto, a true
        expect(state).toEqual({ modalOpen: true });

        //se espera el modal cerrado, a false
        const modalClose = uiCloseModal();
        const stateClose = uiReducer(state, modalClose);
        expect(stateClose).toEqual({ modalOpen: false });

    });

});