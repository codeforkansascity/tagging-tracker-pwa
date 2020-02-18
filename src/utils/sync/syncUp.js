import axios from 'axios';

/**
 * The sync works by a sync id, so a sync table keeps track of when a user synced
 * This sync id is used to find the synced rows throughout the tables which have the matching sync id
 * Using most recent for what to use for pulling down, then pushing up doesn't replace data
 * Just adds more, it is arguable that this is a waste/the same as just deleting stuff on remote side
 * But maybe a diff/look back is nice too in case you didn't want to delete something(address)
 * though currently not possible(no UI/methods)
 */

const getLocalAddresses = async (localStorage) => {
    return new Promise(resolve => {
        localStorage.addresses.toArray().then((addresses) => {
            if (addresses.length) {
                resolve(addresses);
            } else {
                resolve(false);
            }
        })
        .catch((err) => {
            console.log('sync addresses err', err);
            resolve(false);
        });
    });
}

const getLocalTags = async (localStorage) => {
    return new Promise(resolve => {
        localStorage.tags.toArray().then((tags) => {
            if (tags.length) {
                resolve(tags);
            } else {
                resolve(false);
            }
        })
        .catch((err) => {
            console.log('sync tags err', err);
            resolve(false);
        });
    });
}

const getLocalOwnerInfo = async (localStorage) => {
    return new Promise(resolve => {
        localStorage.ownerInfo.toArray().then((ownerInfos) => {
            if (ownerInfos.length) {
                resolve(ownerInfos);
            } else {
                resolve(false);
            }
        })
        .catch((err) => {
            console.log('sync ownerInfo err', err);
            resolve(false);
        });
    });
}

const getTagInfo = async (localStorage) => {
    return new Promise(resolve => {
        localStorage.tagInfo.toArray().then((tagInfos) => {
            if (tagInfos.length) {
                resolve(tagInfos);
            } else {
                resolve(false);
            }
        })
        .catch((err) => {
            console.log('sync tagInfos err', err);
            resolve(false);
        });
    });
}

const bundleData = async (props) => {
    const localStorage = props.offlineStorage;
    const bundledData = {};

    return new Promise(resolve => {
        // addresses
        localStorage.addresses.count().then(async (count) => {
            if (count > 0) {
                const addresses = await getLocalAddresses(localStorage);
                const tags = await getLocalTags(localStorage);
                const ownerInfo = await getLocalOwnerInfo(localStorage);
                const tagInfo = await getTagInfo(localStorage);

                if (addresses) {
                    bundledData['addresses'] = addresses;
                }

                if (tags) {
                    bundledData['tags'] = tags;
                }

                if (ownerInfo) {
                    bundledData['ownerInfo'] = ownerInfo;
                }

                if (tagInfo) {
                    bundledData['tagInfo'] = tagInfo;
                }

                resolve(bundledData);
            } else {
                resolve(bundledData);
            }
        })
        .catch((err) => {
            console.timeLog('sync bundle data err', err);
            resolve(false);
        });
    });
}

export const syncUp = async (props) => {
    const bundledData = await bundleData(props);

    return new Promise(resolve => {
        if (Object.keys(bundledData).length === 0 || !bundledData) {
            resolve({msg: 'No data to sync'});
        } else {
            // sync to remote server
            const baseApiPath = window.location.href.indexOf('localhost') !== -1
                ? process.env.REACT_APP_API_BASE_LOCAL
                : process.env.REACT_APP_API_BASE;
            const postUrl = baseApiPath + '/sync-up';
            
            axios.post(postUrl, {
                headers: { Authorization: `Bearer ${props.token}` },
                bundledData
            }).then((res) => {
                if (res.status === 201) {
                    resolve(true);
                } else {
                    if (res.status === 403) {
                        alert("Your session has expired, please login again");
                        window.location.href = "/login"; // flush app state
                    } else {
                        resolve(false);
                    }
                }
            })
            .catch((err) => {
                console.log('sync err', err);
                console.log(err.response);

                if (typeof err.response !== "undefined" && typeof err.response.status !== "undefined" && typeof err.response.status === 403) {
                    resolve({msg: 403});
                }

                resolve(false);
            });
        }
    });
}