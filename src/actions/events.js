import Swal from "sweetalert2";
import { fetchConToken } from "../helpers/fetch";
import { prepareEvents } from "../helpers/prepareEvents";
import { types } from "../types/types";

export const eventStartAddNew = (event) => {
    return async (dispatch, getState) => {

        const { uid, name } = getState().auth;

        try {
            const resp = await fetchConToken('events', event, 'POST');
            const body = await resp.json();

            if (body.ok) {
                event.id = body.evento.id;
                event.user = {
                    _id: uid,
                    name: name
                }
            }

            console.log('Resultado', event);
            dispatch(eventAddNew(event));

        } catch (error) {
            console.log(error);
        }
    }
}

const eventAddNew = (event) => ({
    type: types.eventAddNew,
    payload: event
});

export const eventSetActive = (event) => ({
    type: types.eventSetActive,
    payload: event
});


export const eventClearActiveEvent = () => ({ type: types.eventClearActiveEvent })

export const eventStartUpdate = (event) => {
    return async (dispatch) => {
        try {
            const resp = await fetchConToken(`events/${event.id}`, event, 'PUT');
            const body = await resp.json();

            if (body.ok) {
                dispatch(eventUpdated(event));
            } else {
                Swal.fire('Error', body.msg, 'error');
            }

        } catch (error) {

        }
    }
}


export const eventUpdated = (event) => ({
    type: types.eventUpdated,
    payload: event
});

export const eventStartDelete = () => {
    return async (dispatch, getState) => {

        const { id } = getState().calendar.activeEvent; //desestructuramos id de la nota activa

        try {
            const resp = await fetchConToken(`events/${id}`, {}, 'DELETE');
            const body = await resp.json();

            if (body.ok) {
                dispatch(eventDeleted());
            } else {
                Swal.fire('Error', body.msg, 'error');
            }

        } catch (error) {

        }
    }
}

const eventDeleted = (event) => ({
    type: types.eventDeleted,
    payload: event
});


export const eventStartLoading = () => {
    return async (dispatch) => {
        try {
            const resp = await fetchConToken('events');
            const body = await resp.json();

            //preparamos events convertiendo a fechas end y start
            const events = prepareEvents(body.eventos);
            dispatch(eventLoaded(events));

        } catch (error) {
            console.log(error);
        }
    }
}

const eventLoaded = (events) => ({
    type: types.eventLoaded,
    payload: events
});

export const eventLogout = () => ({ type: types.eventLogout });