export const deleteAddress = (props, addressObj, finishedDeletingAddress) => {
    const db = props.offlineStorage;
    const addressId = addressObj.addressId;
    let backupDelFailTimer;

    const doneDeleting = () => {
        clearTimeout(backupDelFailTimer);
        alert('Address deleted! Redirecting...');
        finishedDeletingAddress(addressObj);
    }

    // these are asynchronous events so when one finishes it calls the next
    const deleteAddressOwnerInfo = (dbOpened) => {
        const ownerInfo = dbOpened.ownerInfo.where("addressId").equals(addressId);
        ownerInfo.count()
            .then((count) => {
                if (count) {
                    ownerInfo.delete()
                        .then(() => {
                            console.log('owner info deleted');
                            deleteAddressTagInfo(dbOpened);
                        })
                        .catch((err) => {
                            alert('Failed to delete owner info');
                            console.log('delete owner info', err);
                        });
                } else {
                    deleteAddressTagInfo(dbOpened); // next step
                }
            })
            .catch((err) => {
                alert('Failed to delete owner info');
                console.log('delete owner info', err);
            });
    }

    const deleteAddressTagInfo = (dbOpened) => {
        const tagInfo = dbOpened.tagInfo.where("addressId").equals(addressId);
        tagInfo.count()
            .then((count) => {
                if (count) {
                    tagInfo.delete()
                        .then(() => {
                            console.log('tag info deleted');
                            deleteAddressTags(dbOpened);
                        })
                        .catch((err) => {
                            alert('Failed to delete tag info');
                            console.log('delete tags', err);
                        });
                } else {
                    deleteAddressTags(dbOpened);
                }
            })
            .catch((err) => {
                alert('Failed to delete tag info');
                console.log('delete tag info', err);
            });
    }

    const deleteAddressTags = (dbOpened) => {
        const tags = dbOpened.tags.where("addressId").equals(addressId);
        tags.count()
            .then((count) => {
                if (count) {
                    tags.delete()
                        .then(() => {
                            console.log('tags deleted');
                            deleteAddressRow(dbOpened);
                        })
                        .catch((err) => {
                            alert('Failed to delete tags');
                            console.log('delete tags', err);
                        });
                } else {
                    deleteAddressRow(dbOpened);
                }
            })
            .catch((err) => {
                alert('Failed to delete tags');
                console.log('delete tags', err);
            });
    }

    const deleteAddressRow = (dbOpened) => {
        const addresses = dbOpened.addresses.where("id").equals(addressId);
        addresses.count()
            .then((count) => {
                if (count) {
                    addresses.delete() // should only be one
                        .then(() => {
                            console.log('address deleted');
                            doneDeleting();
                        })
                        .catch((err) => {
                            alert('Failed to delete address');
                            console.log('delete address', err);
                        });
                } else {
                    doneDeleting();
                }
            })
            .catch((err) => {
                alert('Failed to delete address');
                console.log('delete address', err);
            });
    }

    if (db) {
        // this is not ideal with how it handles partial failures
        db.open().then(function (dbOpened) {
            deleteAddressOwnerInfo(dbOpened);

            // backup timer if all fails
            backupDelFailTimer = setTimeout(() => {
                alert('Failed to delete address or taking longer than usual'); // what
                finishedDeletingAddress(addressObj);
            }, 60000); // 1 min long
        }).catch (function (err) {
            // handle this failure correctly
            alert('failed to open local storage', err);
            finishedDeletingAddress(addressObj);
        });
    } else {
        alert('Failed to delete address');
        finishedDeletingAddress(addressObj);
    }
}

const getCurEvents = (db, addressId) => {
    return new Promise((resolve, reject) => {
        db.events.where("addressId").equals(addressId).toArray()
            .then((tags) => {
                resolve(tags);
            })
            .catch(() => {
                resolve(null);
            });
    });
}

export const deleteEvent = (db, addressId, tagInfoId, deleteEventCallBack) => {
    const tagInfo = db.events.where("tagInfoId").equals(tagInfoId);
    tagInfo.count()
        .then((count) => {
            if (count) {
                tagInfo.delete()
                    .then(async () => {
                        return getCurEvents(db, addressId);
                    })
                    .then((curEvents) => {
                        deleteEventCallBack(curEvents);
                    })
                    .catch((err) => {
                        alert('Failed to delete event');
                        deleteEventCallBack(); // so many of these
                    });
            }
        })
        .catch((err) => {
            alert('Failed to delete event');
            deleteEventCallBack();
        });
}