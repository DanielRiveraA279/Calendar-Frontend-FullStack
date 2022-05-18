import moment from 'moment';

export const prepareEvents = (events = []) => {

    return events.map(
        (e) => ({
            ...e,
            end: moment(e.end).toDate(), //conversion de string a date
            start: moment(e.start).toDate(), //conversion de string a date
        })
    )
}