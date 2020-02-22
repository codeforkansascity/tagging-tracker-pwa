import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './EditTags.scss';
import { getImagePreviewAspectRatioClass } from './../../utils/image';
import closeIcon from './../../assets/icons/svgs/close.svg';

// this is bad but poor design
let fileNameOfImageToDelete;

const EditTags = (props) => {
    const offlineStorage = props.offlineStorage;
    const history = useHistory();
    const [localImages, setLocalImages] = useState(null);
    const [deletePrompt, toggleDeletePrompt] = useState(false);
    const [deleteInProgress, setDeleteInProgress] = useState(false); // eslint-disable-line
    
    if (typeof props.location.state === "undefined") {
        history.push("/addresses");
    }

    const deleteImage = (addressId, fileName) => {   
        offlineStorage.transaction('rw', offlineStorage.tags, () => {
            if (
                offlineStorage.tags.where("addressId").equals(addressId).toArray()
                    .then((images) => {
                        images.some((image) => { // eslint-disable-line
                            if (image.fileName === fileName) {
                                offlineStorage.tags.where("fileName").equals(fileName).delete().then((deleteCount) => {
                                    if (deleteCount) {
                                        offlineStorage.tags
                                            .where("addressId").equals(props.location.state.addressId)
                                            .toArray().then((tags) => {
                                                setLocalImages(tags);
                                            });
                                    }
                                })
                            }
                        })
                    })
                    .catch((e) => {
                        console.log('deleted tag', e);
                        return false;
                    })
            ) {
                setDeleteInProgress(true);
            } else {
                alert('Failed to delete tag');
            }
        })
        .catch(e => {
            alert('Failed to delete tag');
            console.log('delete tag', e);
        });
    }

    const showDeletePrompt = (fileName) => {
        fileNameOfImageToDelete = fileName;
        toggleDeletePrompt(true);
    }

    const renderDeletePrompt = (addressId, fileName) => {
        return (
            <div className={"tagging-tracker__edit-tags-delete-prompt" + (deletePrompt ? "" : " hidden")}>
                <h4>Delete Tag {fileName}</h4>
                <p>This will delete all information and photos of the tag</p>
                <div className="edit-tags-delete-prompt__delete-btns">
                    <button onClick={() => { deleteImage(addressId, fileName) }} className="delete-btns__delete" type="button">Delete</button>
                    <button onClick={() => { toggleDeletePrompt(false) }} className="delete-btns__cancel" type="button">Cancel</button>
                </div>
            </div>
        )
    }

    const renderTags = () => {
        if (offlineStorage && !localImages) {
            offlineStorage.open().then(function (offlineStorage) {
                offlineStorage.tags.toArray().then((tags) => {
                    !tags.length
                        ? setLocalImages([])
                        :  offlineStorage.tags
                            .where("addressId").equals(props.location.state.addressId)
                            .toArray().then((tags) => {
                                setLocalImages(tags);
                            });
                });
            }).catch (function (err) {
                // handle this failure correctly
                alert('failed to open local storage');
            });
        }
        
        if (Array.isArray(localImages)) {
            return localImages.map((image, index) => {
                return <div key={ index }
                    style={{
                        backgroundImage: `url(${image.thumbnail_src})`
                    }} alt="address thumbnail"
                    onClick={ () => { showDeletePrompt(image.meta.name) } }
                    className={ "address__tag-image delete " + getImagePreviewAspectRatioClass(localImages[index]) }>
                    <div style={{ backgroundImage: `url(${closeIcon})` }} className="tagging-tracker__edit-tags-close-btn"></div>
                </div>
            });
        }
    }

    useEffect(() => {
        if (fileNameOfImageToDelete) {
            fileNameOfImageToDelete = "";
        }
        toggleDeletePrompt(false);
    }, [localImages]);
    
    // TODO this code is almost an exact copy of ViewAddress may have flexed states
    // I used same class to steal styling
    return(
        <div className="tagging-tracker__edit-tags tagging-tracker__view-address">
            { renderTags() }
            { renderDeletePrompt(props.location.state.addressId, fileNameOfImageToDelete) }
        </div>
    )
}

export default EditTags;