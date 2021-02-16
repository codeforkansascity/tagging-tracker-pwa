import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';
import Dexie from 'dexie';
import axios from 'axios';

// misc utils
import { getDateTime } from './utils/date';

// components and pages
import Navbar from './components/navbar/Navbar';
import Login from './components/login/Login';
import Addresses from './components/addresses/Addresses';
import ViewAddress from './components/view-address/ViewAddress';
import TagInfo from './components/tag-info/TagInfo';
import OwnerInfo from './components/owner-info/OwnerInfo';
import BottomNavbar from './components/bottom-navbar/BottomNavbar';
import Page404 from './pages/page404/Page404';
import AddTag from './components/add-tag/AddTag';
import DeleteTag from './components/edit-tags/EditTags';
import Events from './components/events/Events';
import EventTags from './components/event-tags/EventTags';

const App = () => {
	const [token, setToken] = useState("");
	const [searchedAddress, updateSearchedAddress] = useState("");
	const [showAddressModal, setShowAddressModal] = useState(false);
	const [appOnline, setAppOnline] = useState(true);
	const [offlineStorage, setOfflineStorage] = useState(null);
	const [modifyOwnerInfo, toggleModifyOwnerInfo] = useState(false);
	const [modifyTagInfo, toggleModifyTagInfo] = useState(false);
	const [bodyClass, setBodyClass] = useState("tagging-tracker__body"); // this will be removed when UI is updated, it's for AddTag BottomNavbar
	const [syncApp, setSyncApp] = useState(false);
	const [loggingOut, updateLoggingOut] = useState(false);
	const [deletedAddresses, setDeletedAddresses] = useState([]); // I only later realized you can have a whole state object vs individual lines like this
	const [deleteEventsMode, setDeleteEventsMode] = useState(false);
	const [deletingEvent, setDeletingEvent] = useState(false);

	/**
	  * if deploying to a example.com/target with subdirectories, baseName should be updated below
	  * otherwise leave it blank
	  * it should match what's after the example.com/ of the build-dev domain in package.json
	  * example: example.com/tagging-tracker -> tagging-tracker
	  * example: example.com/sub-folder/tagging-tracker -> sub-folder/tagging-tracker
	  * make sure package.json's build dev has the example.com/ path
	  * 
	  * update: for the package.json homepage path I had to set the /path-from-domain
	  * for the software updater to work, update the .env path for the BASE path which is used for cache sync
	  */
	const baseName = "";

	const searchAddress = (searchStr) => {
		updateSearchedAddress(searchStr);
	}

	const toggleAddressModal = (show) => {
		setShowAddressModal(show);
	}

	const clearSearchedAddress = () => {
		updateSearchedAddress("");
	}

	const updateToken = (token) => {
		setToken(token);
	}

	const updateAppOnlineState = (event) => {
		const online = event.type === "online";
		if (appOnline !== online) {
			setAppOnline(!appOnline);
		}
	}

	const checkOnlineStatus = () => {
		window.addEventListener('online', updateAppOnlineState);
		window.addEventListener('offline', updateAppOnlineState);
		return () => {
			window.removeEventListener('online', updateAppOnlineState);
			window.removeEventListener('offline', updateAppOnlineState);
		};
	}

	const setupOfflineStorage = () => {
		const db = new Dexie("LocalImageDatabase");
		db.version(4).stores({
			addresses: "++id,address,lat,lng,created,updated",
			events: "++,addressId,tagInfoId,tagIds,datetime",
			tags: "++,fileName,addressId,eventId,meta,datetime,src,thumbnail_src",
			ownerInfo: "++,addressId,formData",
			tagInfo: "++,addressId,eventId,formData"
		});
		setOfflineStorage(db);
	};

	// this is for making sure the remote side is not empty eg. in the middle of a build
	// this does throw an Uncaught promise error, haven't figured out why but it doesn't break code
	// does its job of preventing overwriting client code with nothing
	const checkRemoteNotEmpty = () => {
		return new Promise((resolve, reject) => {
			const frontEndBasePath = window.location.href.indexOf('localhost') === -1
				? process.env.REACT_APP_BASE
				: false;

			if (!frontEndBasePath) {
				resolve(false);
			} else {
				axios.get(frontEndBasePath + '/?' + Date.now()) // this is just "cache busting" as the PWA caches requests
					.then((response) => {
						if (response.status === 200 && response.data) {
							resolve(true);
						} else {
							resolve(false); // case of 403, 404
						}
					})
					.catch((error) => {
						console.log('remote cache clear test', error);
						reject(new Error('no content'));
					});
			}
		});
	}

	const checkForNewVersion = async () => {
		// https://stackoverflow.com/questions/45467842/how-to-clear-cache-of-service-worker
		// using the caches.delete() method
		// check if checked within 5 minutes
		// window.localStorage is primarily used here to avoid confusion from
		// treating Dexie(IndexedDB) as localStorage by name
		// also using localStorage because App re-renders and wipes self state
		// I didn't think this needed to be in Dexie
		const verChecked = window.localStorage.getItem('verChecked');
		if (!verChecked) {
			window.localStorage.setItem('verChecked', Date.now());
		} else if (Date.now() - verChecked > 300000) { // 5 minutes
			const hasRemoteContent = await checkRemoteNotEmpty();
			if (!hasRemoteContent || !window.caches) return; // if no remote code, don't pull down or no cache
			caches.keys().then(function(names) {
				for (let name of names)
					caches.delete(name);
			});
		}
	}

	const updateSoftware = () => {
		window.localStorage.setItem('verChecked', Date.now() - 360000); // 6 mins in the past
		checkForNewVersion();
		window.location.reload();
	}

	useEffect(() => {
		checkOnlineStatus();

		if (!offlineStorage) {
			setupOfflineStorage();
		}

		checkForNewVersion();

		window.addEventListener('load', () => {
			const ttBody = document.querySelector('.tagging-tracker');

			// I'm aware shouldn't try to detect user agent due to unreliability
			// this is tough to meet all the criteria
			// iOS PWA doesn't have the bottom Safari bar but the browser does
			// desktop doesn't include the url bar in its height
			// mobile Android includes the url bar, standalone Android needs full height unlike Safari
			// https://stackoverflow.com/questions/7944460/detect-safari-browser

			const isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
               navigator.userAgent &&
               navigator.userAgent.indexOf('CriOS') == -1 &&
               navigator.userAgent.indexOf('FxiOS') == -1;

			if (
				!ttBody.classList.contains('safari-mod')
				&& isSafari
				&& !(navigator.standalone === true || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches))
			) {
				ttBody.classList = ttBody.classList + ' safari-mod';
			}

			window.removeEventListener('load', () => {});
		});
	});

	return (
		<div className="tagging-tracker">
			<Router basename={ baseName }>
				<Route component={ (props) =>
					<Navbar {...props}
						baseDir={ baseName }
						searchAddress={searchAddress}
						searchedAddress={searchedAddress}
						toggleAddressModal={toggleAddressModal}
						checkOnlineStatus={checkOnlineStatus}
						toggleModifyOwnerInfo={toggleModifyOwnerInfo}
						modifyOwnerInfo={modifyOwnerInfo}
						modifyTagInfo={modifyTagInfo}
						toggleModifyTagInfo={toggleModifyTagInfo}
						updateSoftware={updateSoftware}
						deletedAddresses={deletedAddresses}
						setDeletedAddresses={setDeletedAddresses}
						offlineStorage={offlineStorage}
						deleteEventsMode={deleteEventsMode}
						setDeleteEventsMode={setDeleteEventsMode} />
				}/> {/* put this break here since it confused me having it against the line before */}
				<div className={ bodyClass }>
					<Switch>
						<Route
							exact
							path="/login"
							component={ (props) =>
								token
									? <Redirect to="/addresses" />
									: <Login {...props} updateToken={updateToken} token={token} />
						} />
						<Route
							path={"/view-address"}
							component={ (props) =>
								true
								? <ViewAddress
									{...props}
									offlineStorage={offlineStorage} />
								: <Redirect to="/"/> } />
						<Route
							path="/owner-info"
							component={ (props) =>
								true
									? <OwnerInfo
										{...props}
										modifyOwnerInfo={modifyOwnerInfo}
										offlineStorage={offlineStorage} />
									: <Redirect to="/"/> }/>
						<Route
							path="/tag-info"
							component={ (props) =>
								true
									? <TagInfo
										{...props}
										modifyTagInfo={modifyTagInfo}
										offlineStorage={offlineStorage} />
									: <Redirect to="/"/> }/>
						<Route
							path="/add-tag"
							component={ (props) =>
								true
									? <AddTag
										{...props}
										offlineStorage={offlineStorage}
										setBodyClass={setBodyClass}
										token={token}
										appOnline={appOnline}
									/>
									: <Redirect to="/"/> }/>
						<Route
							path="/edit-tags"
							component={ (props) =>
								true
									? <DeleteTag
										{...props}
										offlineStorage={offlineStorage} />
									: <Redirect to="/"/> }/>
						
						<Route
							path="/events"
							component={ (props) =>
								true
									? <Events
										{...props}
										offlineStorage={offlineStorage}
										deleteEventsMode={deleteEventsMode}
										deletingEvent={deletingEvent}
										setDeletingEvent={setDeletingEvent} />
									: <Redirect to="/"/> }/>
						<Route
							path="/event-tags"
							component={ (props) =>
								true
									? <EventTags
										{...props}
										offlineStorage={offlineStorage} />
									: <Redirect to="/"/> }/>
						<Route
							path={["/","/addresses"]}
							component={ (props) =>
								true 
									? <Addresses
										{...props}
										searchedAddress={searchedAddress}
										setShowAddressModal={setShowAddressModal}
										showAddressModal={showAddressModal}
										toggleAddressModal={toggleAddressModal}
										clearSearchAddress={clearSearchedAddress}
										token={token}
										offlineStorage={offlineStorage}
										getDateTime={getDateTime} />
									: <Redirect to="/"/> } />
						<Route>
							<Page404 />
						</Route>
					</Switch>
				</div>
				{/* The explanation here is the AddTag needs to keep its own state so it doesn't
					re-render while adding more images since the initial bridge between bottomNavbar
					and AddTag body was causing the entire app to re-render */}
				<Route component={ (props) =>
					(props.location.pathname !== "/login" && props.location.pathname !== "/add-tag")
						? <BottomNavbar
							{...props}
							baseDir={ baseName }
							appOnline={appOnline}
							token={token}
							syncApp={syncApp}
							setSyncApp={setSyncApp}
							offlineStorage={offlineStorage}
							loggingOut={loggingOut}
							updateLoggingOut={updateLoggingOut}
						/>
						: null
					} />
			</Router>
		</div>
	)
}

export default App;
