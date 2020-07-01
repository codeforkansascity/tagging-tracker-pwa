import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Events.scss';
import { getDateTime, formatTimeStr, flipDateFormat } from '../../utils/date';
import { addNewTagInfo, addNewEvent, updateTagInfoEventId } from './eventUtils';
import { deleteEvent } from '../../utils/delete';

import closeIcon from './../../assets/icons/svgs/close.svg';
import rightArrow from './../../assets/icons/svgs/chevron.svg';

const Events = (props) => {
    const offlineStorage = props.offlineStorage;
    const address = props.location.state;
    const addressId = props.location.state.addressId;
    const [events, setEvents] = useState([]);

    const renderNoEvents = (
        <div className="tagging-tracker__events-add-event">
            No Events
        </div>
    )

    const renderEvents = (
        <div className="tagging-tracker__events">
            {
                events.reverse().map((event, id) => {
                    return (
                        <Link
                            key={ id }
                            to={{ pathname: "/tag-info", state: {
                                addressId: event.addressId,
                                address: props.location.state.address,
                                tagInfoId: event.tagInfoId, // used for lookup
                                eventTitle: `Event ${ event.datetime ? flipDateFormat(event.datetime.split(" ")[0], true) : "" }` 
                            }}}
                            className="tagging-tracker__event">
                            { props.deleteEventsMode ? <button type="button" id="event-delete-btn">
                                <img src={ closeIcon } alt="delete event icon" />
                            </button> : null }
                            <div id="event-text">
                                <span className="text">Event</span>
                                <span className="date">{ event.datetime.split(" ")[0] }</span>
                            </div>
                            <img id="event-view-icon" src={ rightArrow } alt="open event icon" />
                        </Link>
                    )
                })
            }
        </div>
    )

    // check if delete event show update rendered events with remaining events
    useEffect(() => {
        if (offlineStorage) { // wait for offlineStorage to be ready
            const remainingEvents = typeof props.location.state.remainingEvents !== "undefined" ?
                props.location.state.remainingEvents : null;
            if (remainingEvents) {
                setEvents(remainingEvents);
            }
        }
    }, []);

    // check set any events
    useEffect(() => {
        if (offlineStorage) { // wait for offlineStorage to be ready
            offlineStorage.events.where("addressId").equals(addressId).toArray().then((events) => {
                setEvents(events);
            });
        }
    }, [offlineStorage]);

    return ( events.length ? renderEvents : renderNoEvents )
}

export default Events;