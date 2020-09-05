import React, { useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './BottomNavbar.scss';
import { deleteEvent } from '../../utils/delete'; // probably bad to do this, add delete logic to a navbar should be global

import syncIcon from './../../assets/icons/svgs/upload.svg';
import logoutIcon from './../../assets/icons/svgs/switch.svg';
import property from './../../assets/icons/svgs/property.svg';
import textDocument from './../../assets/icons/svgs/text-document.svg';
import calendar from './../../assets/icons/svgs/calendar.svg';
import addSquare from './../../assets/icons/svgs/add-square.svg';
import deleteIcon from './../../assets/icons/svgs/delete.svg';
import ajaxLoaderGray from './../../assets/gifs/ajax-loader--gray.gif';
import ajaxLoaderBlue from './../../assets/gifs/ajax-loader--blue.gif';
import edit from './../../assets/icons/svgs/pencil.svg';
import photo from './../../assets/icons/svgs/photo.svg';

import { syncUserData, deleteLocalData } from '../../utils/sync/sync';
import { checkIOS, resizeAdjustHeight, addPathClassToBody } from '../../utils/misc';

const BottomNavbar = (props) => {
    const syncBtn = useRef(null);
    const logoutBtn = useRef(null);
    const cameraBtn = useRef(null);
    const uploadBtn = useRef(null);
    const history = useHistory();
    const { token } = props;

    const [deletingEvent, setDeletingEvent] = useState(false);

    const logout = async () => {
        props.updateLoggingOut(true);
        const localStorageCleared = await deleteLocalData(props.offlineStorage);
        if (!localStorageCleared) {
            alert('failed to clear local data');
        }
        window.location.href = "/"; // token is wiped out as it's set by state not in storage
    }

    const saveToDevice = () => {
        props.saveToDevice();
    }

    // this probably shouldn't be here but just an initializer
    const sync = async () => {
        if (!props.appOnline) { // shouldn't be needed disabled buttons
            alert('Unable to sync, you are offline');
            return;
        }

        if (!props.token) {
            history.push("/login");
            return;
        }

        if (!props.syncApp) {
            props.setSyncApp(true);
            const synced = await syncUserData(props);

            if (Object.keys(synced).length) {
                if (synced.msg !== "undefined") {
                    if (synced.msg === 403) {
                        alert('You have been logged out, please login to sync');
                    } else {
                        alert(synced.msg);
                    }
                }
            } else if (synced) {
                // synced
            } else {
                alert('Failed to sync');
            }

            props.setSyncApp(false);
        }
    }

    const uploadImages = () => {
        if (!props.appOnline) {
            alert('Unable to upload, you are offline');
            return;
        }

        if (!props.token) {
            const loginDecision = window.confirm('You need to be logged in to upload. Login or use save to device to keep selected files. Pressing OK will redirect you to the login page.');
            if (loginDecision) {
                history.push("/login");
            }
            return;
        }

        props.triggerFileUpload(true);
    }

    // this is for Safari, since the prop method that is propagated up into AddTag
    // doesn't work in Safari "not a direct action by user" file input wasn't working
    const directCameraClick = () => {
        document.getElementById('add-tag-file-input').click();
    }

    // bad naming
    const confirmDeleteEvent = ( eventTitle, addressId, tagInfoId, callback ) => {
        const shouldDeleteEvent = window.confirm("Delete " + eventTitle + " ?");
        if (shouldDeleteEvent) {
            setDeletingEvent(true);
            deleteEvent(props.offlineStorage, addressId, tagInfoId, callback);
        }
    }

    // this is only here because callback doesn't have params
    const doneDeletingEvent = (remainingEvents) => {
        setDeletingEvent(false);
        history.push({
            pathname: "/events",
            state: {
                ...props.location.state,
                remainingEvents
            }
        });
    }

    const renderBottomNavbar = (routeLocation) => {
        const address = props.location.state;
        const routePath =  props.baseDir ? routeLocation.pathname.replace(props.baseDir + "/", "") : routeLocation.pathname;
        const tagInfoPath = props.location.pathname === "/tag-info";
        const eventsPath = props.location.pathname === "/events";
        const tagsPath = props.location.pathname === "/event-tags";
        const eventTagsPath = props.location.pathname === "/event-tags";

        switch(routePath) {
            case "/":
            case "/addresses":
                return <>
                    <button onClick= { sync } ref={ syncBtn } className="bottom-navbar__btn half sync"
                    type="button" disabled={ props.appOnline ? false : true }>
                        {props.syncApp
                            ? <>
                                <span>Syncing...</span>
                                <img src={ ajaxLoaderGray } alt="syncing spinner" />
                            </>
                            : <>
                                { token ? <img src={ syncIcon } alt="sync button icon" /> : null }
                                <span>{ token ? "Sync" : "Login" }</span>
                            </>
                        }
                    </button>
                    {token ? <button ref={ logoutBtn } onClick={ logout } className="bottom-navbar__btn half" type="button">
                        {props.loggingOut
                            ? <>
                                <span>Logging out...</span>
                                <img src={ ajaxLoaderGray } alt="logging out spinner" />
                            </>
                            : <>
                                <img src={ logoutIcon } alt="logout button icon" />
                                <span>Logout</span>
                            </>
                        }
                    </button> : null}
                    
                </>
            case "/view-address":
            case "/edit-tags":
                return <>
                    <Link
                        to={{ pathname: "/owner-info", state: {
                                address: address.address,
                                addressId: address.addressId // used for lookup
                        }}}
                        className="bottom-navbar__btn fourth">
                        <img src={ property } alt="home owner button icon" />
                        <span>Owner Info</span>
                    </Link>
                    <Link
                        to={{ pathname: "/events", state: {
                                address: address.address,
                                addressId: address.addressId // used for lookup
                        }}}
                        className="bottom-navbar__btn fourth">
                        <img src={ edit } alt="edit event button icon" />
                        <span>Edit Event</span>
                    </Link>
                    <Link
                        to={{ pathname: "/tag-info", state: {
                                address: address.address,
                                addressId: address.addressId // used for lookup
                        }}}
                        className="bottom-navbar__btn fourth">
                        <img src={ addSquare } alt="add event button icon" />
                        <span>Add Event</span>
                    </Link>
                    <Link
                        to={{ pathname: "/add-tag", state: {
                            address: address.address,
                            addressId: address.addressId,
                            tagInfoId: routeLocation.state.tagInfoId
                        }}}
                        className="bottom-navbar__btn fourth">
                        <img src={ addSquare } alt="add tag icon" />
                        <span>Add Tag</span>
                    </Link>
                </>
            case "/add-tag":
                return <>
                    <button ref={ cameraBtn } onClick={ directCameraClick } className="bottom-navbar__btn quarter caps-blue border small-font" type="button">
                        <span>Use Camera</span>
                    </button>
                    <button ref={ uploadBtn } onClick={ uploadImages } className="bottom-navbar__btn quarter caps-blue border small-font" type="button" disabled={ props.loadedPhotos.length ? false : true }>
                        {props.uploadInProgress
                            ? <>
                                <span>Uploading...</span>
                                <img src={ ajaxLoaderBlue } alt="uploading spinner" />
                            </>
                            : <>
                                <span>Upload</span>
                            </>
                        }
                    </button>
                    <button onClick={ saveToDevice }
                        className="bottom-navbar__btn quarter caps-blue border small-font"
                        type="button"
                        disabled={ (props.savingToDevice || !props.loadedPhotos.length) ? true : false }>
                            {props.savingToDevice
                                ? <>
                                    <span>Saving...</span>
                                    <img src={ ajaxLoaderBlue } alt="saving spinner" />
                                </>
                                : <>
                                    <span>Save To Device</span>
                                </>
                            }
                    </button>
                    <Link
                        to={{ pathname: "/event-tags", state: {
                            address: address.address,
                            addressId: address.addressId,
                            tagInfoId: routeLocation.state.tagInfoId
                        }}}
                        className="bottom-navbar__btn quarter caps-blue small-font">
                            <span>Cancel</span>
                    </Link>
                </>
            case "/events":
                return <>
                    <Link
                        to={{ pathname: "/owner-info", state: {
                                address: address.address,
                                addressId: address.addressId // used for lookup
                        }}}
                        className={"bottom-navbar__btn toggled third " + (!(tagInfoPath || eventsPath) ? "active" : "") }>
                            <img src={ property } alt="home owner button icon" />
                            <span>Owner Info</span>
                    </Link>
                    <Link
                        to={{ pathname: "/tag-info", state: {
                                address: address.address,
                                addressId: address.addressId // used for lookup
                        }}}
                        className={ "bottom-navbar__btn toggled third " + (!(eventsPath || tagInfoPath) ? "active" : "") }>
                        <img src={ addSquare } alt="add event button icon" />
                        <span>Add Event</span>
                    </Link>
                </>
            case"/event-tags":
            case"/tag-info":
                const eventTitle = props.location.state.eventTitle;
                const tagInfoId = props.location.state.tagInfoId;
                return <>
                    <button
                        onClick= { () => confirmDeleteEvent(eventTitle, address.addressId, tagInfoId, doneDeletingEvent) }
                        ref={ syncBtn }
                        className="bottom-navbar__btn fourth"
                        type="button"
                        disabled={ tagInfoId ? false : true }>
                        {deletingEvent
                            ? <>
                                <span>Deleting...</span>
                                <img src={ ajaxLoaderGray } alt="deleting event spinner" />
                            </>
                            : <>
                                <img src={ deleteIcon } alt="delete button icon" />
                                <span>Delete</span>
                            </>
                        }
                    </button>
                    <Link
                        to={{ pathname: "/tag-info", state: {
                            address: address.address,
                            addressId: address.addressId, // used for lookup
                            tagInfoId: props.location.state.tagInfoId,
                            eventTitle
                        }}}
                        className={"bottom-navbar__btn fourth " + (tagInfoPath ? "active" : "")}>
                        <img src={ textDocument } alt="tag info button icon" />
                        <span>Event Info</span>
                    </Link>
                    <Link
                        to={{ pathname: "/event-tags", state: {
                            address: address.address,
                            addressId: address.addressId, // used for lookup
                            tagInfoId, // unique per event
                            eventTitle
                        }}}
                        className={"bottom-navbar__btn fourth " + (eventTagsPath ? "active" : "") + (tagInfoId ? "" : "disabled")}
                        disabled={ tagInfoId ? false : true }>
                            <img src={ photo } alt="events button icon" />
                            <span>Pictures</span>
                    </Link>
                    <Link
                        to={{ pathname: "/add-tag", state: {
                            address: address.address,
                            addressId: address.addressId, // used for lookup
                            tagInfoId, // unique per event
                            eventTitle
                        }}}
                        className={"bottom-navbar__btn fourth "  + (tagInfoId ? "" : "disabled")}>
                        <img src={ addSquare } alt="add tag icon" />
                        <span>Add Picture</span>
                    </Link>
                </>
            default:
                return null;
        }
    }

    const getBottomNavbarClasses = () => {
        const floatingBtnPaths = [
            "/owner-info"
        ];

        const floatingBtns = floatingBtnPaths.indexOf(props.location.pathname) !== -1;

        if (floatingBtns) {
            return "tagging-tracker__bottom-navbar floating-btns";
        }

        return "tagging-tracker__bottom-navbar";
    }

    // disabling scaling need to test on iOS
    useEffect(() => {
	// 	// this modifies the layout/some css classes/styles based on if the user is using iOS/Safari
        // window.addEventListener('resize', resizeAdjustHeight);
        checkIOS();
        // addPathClassToBody(props);
        // window.removeEventListener('resize', resizeAdjustHeight);
    }); // try running once on load, seeing problems when soft keyboard goes away/appears on mobile device

    return(
        <div className={ getBottomNavbarClasses() }>
            { renderBottomNavbar(props.location) }
        </div>
    )
}

export default BottomNavbar;