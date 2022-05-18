import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import { NavBar } from '../ui/NavBar';
import { messages } from '../../helpers/calendar.messages.es';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';

import 'moment/locale/es'; //configuracion para las semanas en espanol
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import { eventClearActiveEvent, eventSetActive, eventStartLoading } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';

//config para espanol
moment.locale('es');

//configurar momentLocalizer para que muestre el calendar
const localizer = momentLocalizer(moment);

// const events = [
//     {
//         title: 'Cumple del jefe',
//         start: moment().toDate(),
//         end: moment().add(2, 'hours').toDate(),
//         bgcolor: '#fafafa',
//         notes: 'Comprar el pastel',
//         user: {
//             _id: '1234',
//             name: 'Daniel Antonio Rivera'
//         }
//     }
// ]

export const CalendarScreen = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector(state => state.calendar);
    const { uid } = useSelector(state => state.auth);

    //TODO: leer 

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

    useEffect(() => {
        dispatch(eventStartLoading());
    }, [dispatch]);

    //evento para doble click
    const onDoubleClick = (e) => {
        dispatch(uiOpenModal());
    }

    //evento para un solo click
    const onSelectEvent = (e) => {
        // console.log(e);
        dispatch(eventSetActive(e));
    }

    //evento para saber en que vista estamos ejemp. mes, semana, dia, etc
    const onViewChange = (e) => {
        setLastView(e); //actualizamos con el ultimo cambio de vista que tiene
        localStorage.setItem('lastView', e); //grabamos la vista actual
    }

    //consigue la info o data que seleccione
    const eventStyleGetter = (event, start, end, isSelected) => {
        const style = {
            backgroundColor: (uid === event.user._id) ? '#367CF7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            display: 'block',
            color: 'white'
        }

        return {
            style
        }
    }

    const onSelectSlot = (e) => {
        // console.log(e)
        dispatch(eventClearActiveEvent()); //para que se limpie el state, cada vez que clickeamos a fuera de una nota
    }

    return (
        <div className='calendar-screen'>
            <NavBar />

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                messages={messages}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={onSelectEvent}
                onDoubleClickEvent={onDoubleClick}
                onView={onViewChange}
                onSelectSlot={onSelectSlot}
                selectable={true}
                view={lastView}
                components={{
                    event: CalendarEvent
                }}
            />

            <AddNewFab />

            {
                (activeEvent) && <DeleteEventFab />
            }

            <CalendarModal />
        </div>
    );
};
