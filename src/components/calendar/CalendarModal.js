import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2';
import { uiCloseModal } from '../../actions/ui';
import { eventStartAddNew, eventClearActiveEvent, eventStartUpdate } from '../../actions/events';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

//si estamos en test esto no se ejecuta
if (process.env.NODE_ENV !== 'test') {
    // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
    Modal.setAppElement('#root');
}


const now = moment().minutes(0).seconds(0).add(1, 'hours'); //si son las 23:26 se va a poner en 00:00
const nowPlusOne = now.clone().add(1, 'hours');

const initEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: nowPlusOne.toDate()
}

export const CalendarModal = () => {

    const { modalOpen } = useSelector(state => state.ui);
    const { activeEvent } = useSelector(state => state.calendar)
    const dispatch = useDispatch();

    const [dateStart, setDateStart] = useState(now.toDate());
    const [dateEnd, setDateEnd] = useState(nowPlusOne.toDate());
    const [titleValid, setTitleValid] = useState(true);

    const [formValues, setFormValues] = useState(initEvent);

    const { notes, title, start, end } = formValues;


    useEffect(() => {
        if (activeEvent) {
            setFormValues(activeEvent);
        } else {
            setFormValues(initEvent); //si activeEvent esta en null, vuevlve todo a 0 por defecto
        }

    }, [activeEvent, setFormValues]);


    const handleInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const closeModal = () => {
        // TODO: cerrar el modal
        dispatch(uiCloseModal());
        dispatch(eventClearActiveEvent()); //limpiamos los datos seleccionados para el show modal
        setFormValues(initEvent);
    }

    const handleStartDateChange = (e) => {
        setDateStart(e); //recibimos la fecha seleccionada de inicio
        setFormValues({
            ...formValues,
            start: e
        });
    }

    const handleEndDateChange = (e) => {
        setDateEnd(e); //recibimos la fecha seleccionada de fin
        setFormValues({
            ...formValues,
            end: e
        });
    }

    const handleSubmitForm = (e) => {
        e.preventDefault();

        const momentStart = moment(start);
        const momentEnd = moment(end);

        if (momentStart.isSameOrAfter(momentEnd)) {
            Swal.fire('Error', 'La fecha fin debe de ser mayor a la fecha de inicio', 'error');
            return;
        }

        if (title.trim().length < 2) {
            return setTitleValid(false);
        }

        if (activeEvent) {
            dispatch(eventStartUpdate(formValues)) //actualizar un registro
        } else {
            //TODO: agregar un nuevo registro
            dispatch(eventStartAddNew(formValues));
        }



        setTitleValid(true);
        closeModal();
    }

    return (
        <Modal
            isOpen={modalOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            closeTimeoutMS={200} //tiempo en cerrarse el modal
            className='modal'
            overlayClassName='modal-fondo'
            ariaHideApp={!process.env.NODE_ENV === 'test'}
        >
            <h1> {(activeEvent) ? 'Editar Event' : 'Nuevo Evento'} </h1>
            <hr />
            <form
                className="container"
                onSubmit={handleSubmitForm}

            >

                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker
                        onChange={handleStartDateChange}
                        value={dateStart}
                        className='form-control'
                    />
                    {/* <input className="form-control" placeholder="Fecha inicio" /> */}
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker
                        onChange={handleEndDateChange}
                        value={dateEnd}
                        minDate={dateStart}
                        className='form-control'
                    />
                    {/* <input className="form-control" placeholder="Fecha inicio" /> */}
                </div>

                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input
                        type="text"
                        className={`form-control ${!titleValid && 'is-invalid'}`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange={handleInputChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={notes}
                        onChange={handleInputChange}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
        </Modal>
    )
};
