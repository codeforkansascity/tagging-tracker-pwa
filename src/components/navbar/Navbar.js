import React, { useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Navbar.scss';
import { deleteAddress } from '../../utils/delete';

import backArrow from './../../assets/icons/svgs/chevron-blue.svg'; // rotated by CSS
import { truncateText } from '../../utils/misc';

const Navbar = (props) => {
    const searchAddressInput = useRef(null);
    const history = useHistory();
    const [showSettings, setShowSettings] = useState(false);
    const [deletingAddress, setDeletingAddress] = useState(false);

    const searchAddresses = (searchStr) => {
        props.searchAddress(searchStr);
    }

    const getNavTitle = (path, address) => {
        let navTitle = "";

        if (path === "/tag-info") {
            navTitle = "Tag Information";
        } else if (path === "/owner-info") {
            navTitle = "Owner Information";
        } else if (path === "/events") {
            navTitle = `${truncateText(address,40,true)} Events`;
        } else if (path === "/event-tags" || path === "/add-tag" || path === "/edit-tags") {
             navTitle = props.location.state.eventTitle;
        } else {
            navTitle = address;
        }

        return navTitle;
    }

    const getBackButtonTitle = (path, address) => {
        const matchPaths = [
            "/events",
            "/event-tags"
        ];

        const pathMatches = matchPaths.indexOf(path) !== -1; // what path
        const notEventTags = path !== "/event-tags";

        if (pathMatches) {
            let addressOutput;

            if (address && notEventTags) {
                addressOutput = address.substring(0, 10);

                if (address.length > 10) {
                    addressOutput += "...";
                }
            } else {
                addressOutput = "Events";
            }

            return addressOutput;
        } else if (path === "/event-tags" || path === "/owner-info" || path === "/tag-info") {
            return "Events";
        } else if (path.indexOf('tag') !== -1) {
            return "Event";
        } else {
            return "Addresses";
        }
    }

    const getBackPathname = (path) => {
        if (path === "/owner-info") {
            return "/events";
        } else if (path.indexOf('tag') !== -1) {
            return "/events";
        } else {
            return "/addresses"
        }
    }

    const getBackState = (path, address) => { // address is extra/new due to events workflow
        return {
            clearSearch: true,
            address,
            addressId: props.location.state.addressId,
            tagInfoId: props.location.state.tagInfoId,
            eventTitle: (typeof props.location.state.eventTitle !== "undefined"
                ? props.location.state.eventTitle : null)
        };
    }

    const editSaveOwnerInfo = () => {
        props.toggleModifyOwnerInfo(!props.modifyOwnerInfo);
    }

    const editTagInfo = () => {
        if (props.modifyTagInfo) {
            history.push({
                pathname: "/events",
                state: {
                    ...props.location.state,
                    eventTitle: (typeof props.location.state.eventTitle !== "undefined"
                        ? props.location.state.eventTitle : null)
                }
            });
        }
        props.toggleModifyTagInfo(!props.modifyTagInfo);
    }

    const generateEditBtn = () => {
        const pathname = props.location.pathname;
        const isEditTagsPath = pathname.indexOf('edit') !== -1;
        const isAddTagPath = pathname.indexOf('add-tag') !== -1;

        if (pathname === "/owner-info") {
            return (
                <button
                    type="button"
                    className="manage-address__edit-cancel"
                    onClick={ editSaveOwnerInfo }
                >{ props.modifyOwnerInfo ? "SAVE" : "EDIT" }</button> // TODO: this should flex between save/edit/cancel if changes occurred
            );
        } else if (pathname === "/tag-info") {
            return (
                <button
                    type="button"
                    className="manage-address__edit-cancel"
                    onClick={ editTagInfo }
                >{ props.modifyTagInfo ? "SAVE" : "EDIT" }</button> // TODO: this should flex between save/edit/cancel if changes occurred
            );
        } else if (pathname === "/events") {
            return <button
                type="button"
                className="manage-address__edit-cancel"
                onClick={ () => {setDeletingAddress(!deletingAddress)} }
                disabled={ props.deletingEvents ? true : false }>
                    Delete
            </button>;
        } else {
            return isEditTagsPath
                ? (
                    <button
                        type="button"
                        className="manage-address__edit-cancel"
                        onClick={ deleteAddressCallback }
                        disabled={ deletingAddress ? true : false }
                    >Delete</button>
                )
                : (
                <Link to={{ pathname: "/edit-tags", state: {
                    address: props.location.state.address,
                    addressId: props.location.state.addressId,
                    tagInfoId: props.location.state.tagInfoId,
                    eventTitle: (typeof props.location.state.eventTitle !== "undefined"
                    ? props.location.state.eventTitle : null)
                }}} className="manage-address__edit-cancel">{
                    isAddTagPath ? "" : (isEditTagsPath ? "Delete" : "Edit")
                }</Link>
            );
        }
    }

    const finishedDeletingAddress = (addressObj) => {
        // finished deleting, go back to main addresses view
        setDeletingAddress(false);
        if (Object.keys(addressObj).length) {
            const tmpArr = props.deletedAddresses;
            tmpArr.push(addressObj.address); // the primary "key" is the address string
            props.setDeletedAddresses(tmpArr);
        }
        history.push("/addresses");
    }

    const deleteAddressCallback = () => {
        const addressObj = props.location.state;
        const shouldDeleteAddress = window.confirm("Delete address " + addressObj.address + " ?");
        if (shouldDeleteAddress) {
            setDeletingAddress(true);
            deleteAddress(props, addressObj, finishedDeletingAddress);
        }
    }

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    }

    const generateSettingsMenu = (show) => {
        if (!show) {
            return null;
        }

        return <div className="navbar-top__settings-menu">
            <button onClick={ props.updateSoftware } type="button">Update Software</button>{/* LOL */}
        </div>;
    }

    const renderNavbar = (routeLocation) => {
        const routePath = props.baseDir ? routeLocation.pathname.replace(props.baseDir + "/", "") : routeLocation.pathname;
        switch(routePath) {
            case '/':
            case '/addresses':
                return <>
                    <div className="tagging-tracker__navbar-top addresses">
                        <button className="add" onClick={  () => {props.toggleAddressModal(true)}  } />
                        <h2>Addresses</h2>
                        <div className="navbar-top__settings">
                            <button className="gear-icon" type="button" onClick={ toggleSettings }></button>
                            { generateSettingsMenu(showSettings) }
                        </div>
                    </div>
                    <input type="text" value={props.searchedAddress} placeholder="search" ref={ searchAddressInput } onChange={ (e) => { searchAddresses(e.target.value)} }></input>
                </>;
            case '/view-address':
            case '/edit-tags':
            case '/tag-info':
            case '/owner-info':
            case '/events':
            case '/event-tags':
            case '/tags':
            case '/add-tag':
                return <>
                    <div className="tagging-tracker__navbar-top view-address edit-tags add-tags">
                        <Link to={{ pathname: getBackPathname(routeLocation.pathname), state: getBackState(routeLocation.pathname, props.location.state.address)}} className="manage-address__back">
                            <img src={ backArrow } alt="back arrow" />
                            <h4>{ getBackButtonTitle(routeLocation.pathname, props.location.state.address) }</h4>
                        </Link>
                        <h2 className="manage-address__name">
                            { getNavTitle(routeLocation.pathname, props.location.state.address) }
                        </h2>
                        { generateEditBtn() }
                    </div>
                </>;
            default:
                return "";
        }
    };

    // focus
    useEffect(() => {
        if (!props.showAddressModal && props.location.pathname === "/addresses" && searchAddressInput.current.value.length > 0) {
            searchAddressInput.current.focus();
        }

        // update online/offline status
        props.checkOnlineStatus();
    });

    // delete address
    useEffect(() => {
        if (deletingAddress) {
            deleteAddressCallback();
        }
    }, [deletingAddress]);

    return(
        <div className="tagging-tracker__navbar">
            { renderNavbar(props.location) }
        </div>
    )
}

export default Navbar;