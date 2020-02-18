import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';

import backArrow from './../../assets/icons/svgs/chevron-blue.svg'; // rotated by CSS

const Navbar = (props) => {
    const searchAddressInput = useRef(null);
    const [showSettings, setShowSettings] = useState(false);

    const searchAddresses = (searchStr) => {
        props.searchAddress(searchStr);
    }

    const getNavTitle = (path, address) => {
        let navTitle = "";

        if (path === "/tag-info") {
            navTitle = "Tag Information";
        } else if (path === "/owner-info") {
            navTitle = "Owner Information";
        } else {
            navTitle = address;
        }

        return navTitle;
    }

    const getBackButtonTitle = (path, address) => {
        if (path === "/tag-info" || path === "owner-info" || path === "/add-tag" || path === "/edit-tags") {
            let addressOutput = address.substring(0, 10);

            if (address.length > 10) {
                addressOutput += "...";
            }

            return addressOutput;
        } else {
            return "Addresses";
        }
    }

    const getBackPathname = (path) => {
        if (path === "/tag-info" || path === "/owner-info" || path === "/edit-tags" || path === "/add-tag") {
            return "/view-address";
        } else {
            return "/addresses"
        }
    }

    const getBackState = (path) => {
        return {
            clearSearch: true,
            address: props.location.state.address,
            addressId: props.location.state.addressId
        };
    }

    const editSaveOwnerInfo = () => {
        props.toggleModifyOwnerInfo(!props.modifyOwnerInfo);
    }

    const editTagInfo = () => {
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
        } 
        else if (pathname === "/tag-info") {
            return (
                <button
                    type="button"
                    className="manage-address__edit-cancel"
                    onClick={ editTagInfo }
                >{ props.modifyTagInfo ? "SAVE" : "EDIT" }</button> // TODO: this should flex between save/edit/cancel if changes occurred
            );
        } else {
            return (
                <Link to={{ pathname: isEditTagsPath ? "view-address" : "/edit-tags", state: { 
                    address: props.location.state.address,
                    addressId: props.location.state.addressId
                }}} className="manage-address__edit-cancel">{
                    isAddTagPath ? "" : (isEditTagsPath ? "Cancel" : "Edit")
                }</Link>
            );
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
        switch(routeLocation.pathname) {
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
            case '/add-tag':
            case '/tag-info':
            case '/owner-info':
                return <>
                    <div className="tagging-tracker__navbar-top view-address edit-tags add-tags">
                        <Link to={{ pathname: getBackPathname(routeLocation.pathname), state: getBackState(routeLocation.pathname)}} className="manage-address__back">
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
        // if (!props.showAddressModal && props.location.pathname === "/addresses") {
        //     searchAddressInput.current.focus();
        // }

        // TODO - fix the layout so don't need this hack, though this may still be used overall
        // adjust body height based on route
        // this code shouldn't be here but due to how the app has soft routes no way to pull url from app
        // add class to body
        // better to keep it here to avoid flash/reload jank
        // const appBody = document.querySelector('.tagging-tracker__body');
        // const routePath = window.location.href.split('/')[3];
        // if (appBody) {
        //     if (routePath !== "addresses" && routePath !== "add-tag") {
        //         appBody.style.maxHeight = (window.innerHeight  - 104) + "px"; // this magic number is the navbar and bottom navbar
        //     } else {
        //         appBody.style.maxHeight = "100%";
        //     }
        // }

        // update online/offline status
        props.checkOnlineStatus();
    });

    return(
        <div className="tagging-tracker__navbar">
            { renderNavbar(props.location) }
        </div>
    )
}

export default Navbar;