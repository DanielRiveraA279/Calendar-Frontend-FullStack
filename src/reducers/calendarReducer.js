import { types } from '../types/types';

// {
//     id: new Date().getTime(),
//     title: 'Cumple del jefe',
//     start: moment().toDate(),
//     end: moment().add(2, 'hours').toDate(),
//     notes: 'Comprar el pastel',
//     user: {
//         _id: '1234',
//         name: 'Daniel Antonio Rivera'
//     }
// }

const initialState = {
    events: [],
    activeEvent: null
};

export const calendarReducer = (state = initialState, action) => {
    switch (action.type) {

        case types.eventSetActive:
            return {
                ...state,
                activeEvent: action.payload
            }
        case types.eventAddNew:
            return {
                ...state,
                events: [
                    ...state.events,
                    action.payload
                ]
            }
        case types.eventClearActiveEvent:
            return {
                ...state,
                activeEvent: null
            }
        case types.eventUpdated:
            return {
                ...state,
                events: state.events.map(
                    e => (e.id === action.payload.id) ? action.payload : e
                )
            }
        case types.eventDeleted:
            return {
                ...state,
                events: state.events.filter(
                    e => (e.id !== state.activeEvent.id) //actualizamos el nuevo array sin el event seleccionado
                ),
                activeEvent: null
            }
        case types.eventLoaded:
            return {
                ...state,
                events: [...action.payload]
            }
        case types.eventLogout:
            return {
                ...initialState
            }
        default:
            return state;
    }
}