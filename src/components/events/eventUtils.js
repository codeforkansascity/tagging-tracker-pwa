export const addNewTagInfo = async ( addressId, offlineStorage, setAddingEvent, formData = {} ) => {
    // this is dumb, I can't explain this, the transaction is a promise
    // so you shouldn't need a promise around a promise
    // but it seems to be the only way to force these to execute in order
    return new Promise((resolve, reject) => {
        offlineStorage.transaction('rw', offlineStorage.tagInfo, async () => {
            offlineStorage.tagInfo.add({
                addressId,
                eventId: null,
                formData: {}
            }).then((tagInfoId) => {
                resolve(tagInfoId);
            })
        })
        .catch(e => {
            console.log('failed to create tag info for event', e);
            alert('Failed to create tag info for event');
            setAddingEvent(false);
            reject();
        });
    });
}

// this is pretty much using a contains check since the stored datetime string has hour:minutes:seconds
// but it's still pulling all entries by address as it's not too many
const checkEventExistsByDate = async ( offlineStorage, addressId, checkDate ) => {
    return new Promise((resolve, reject) => {
        offlineStorage.transaction('rw', offlineStorage.events, () => {
            offlineStorage.events.where("addressId").equals(addressId).toArray()
            .then((events) => {
                if (events.length) {
                    // if true means already exists, reject add event
                    resolve(events.some(event => event.datetime.indexOf(checkDate) !== -1));
                } else {
                    resolve(false);
                }
            })
            .catch((err) => {
                console.log('failed checking for event duplicate', err);
                alert('failed check for adding new event');
                reject(false);
            });
        });
    });
}

export const addNewEvent = async ( tagInfoId, addressId, offlineStorage, formatTimeStr, getDateTime, setAddingEvent = false ) => {
    const todaysDate = formatTimeStr(getDateTime()) // makes YYYY-MM-DD HH:MM:SS format for MySQL DateTime;
    const eventExists = await checkEventExistsByDate(offlineStorage, addressId, todaysDate.split(" ")[0]);
    if (eventExists) {
        alert('Error: Event date already exists');
        return;
    };

    return new Promise((resolve, reject) => {
        offlineStorage.transaction('rw', offlineStorage.events, async () => {
            offlineStorage.events.add({
                addressId,
                tagInfoId,
                tagIds: [],
                datetime: todaysDate
            }).then((eventId) => {
                resolve(eventId);
            });
        })
        .catch(e => {
            console.log('failed to create event', e);
            alert('Failed to create event');
            setAddingEvent(false);
            reject();
        });
    });
}

export const updateTagInfoEventId = ( tagInfoId, eventId, offlineStorage, setAddingEvent = false ) => {
    return new Promise((resolve, reject) => {
        offlineStorage.transaction('rw', offlineStorage.tagInfo, () => {
            offlineStorage.tagInfo.where(":id").equals(tagInfoId).modify({ // should only be one match
                eventId
            }).then((updatedId) => {
                resolve(updatedId);
            })
            .catch(e => {
                console.log('failed to update tag info with event id', e);
                alert('failed to update tag info with event id');
                setAddingEvent(false);
                reject(false);
            });
        });
    });
}

export const getTagInfoObjById = async ( offlineStorage, tagInfoId ) => {
    return new Promise((resolve, reject) => {
        offlineStorage.tagInfo.get(tagInfoId)
            .then((tagInfo) => {
                resolve(tagInfo);
            })
            .catch((err) => {
                console.log('error getting tag info obj');
                reject();
            });
    });
}

// actually returning matching primaryKey(s) in Dexie
export const getEventIdByTagInfoId = async ( offlineStorage, tagInfoId ) => {
    return new Promise((resolve, reject) => {
        offlineStorage.transaction('rw', offlineStorage.events, async () => {
            const keys = await offlineStorage.events.where("tagInfoId").equals(tagInfoId).primaryKeys();
        })
        .catch(e => {
            console.log('failed to get event primary key', e);
        });
    });
} 