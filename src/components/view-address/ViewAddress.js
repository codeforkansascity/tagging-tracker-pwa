import React, { useState  } from 'react';
import { useHistory } from 'react-router-dom';
import './ViewAddress.scss';
import { getImagePreviewAspectRatioClass } from './../../utils/image';
import ajaxLoaderGray from './../../assets/gifs/ajax-loader--gray.gif';

const ViewAddress = (props) => {
    const history = useHistory();
    const [localImages, setLocalImages] = useState(null);
    
    if (typeof props.location.state === "undefined") {
        history.push("/addresses");
    }

    const renderTags = () => {
        const db = props.offlineStorage;

        if (db && !localImages) {
            db.open().then(function (db) {
                db.tags.toArray().then((tags) => {
                    !tags.length
                        ? setLocalImages([])
                        :  db.tags
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
                return <div key={ index } style={{
                    backgroundImage: `url(${image.thumbnail_src})`
                }} alt="address thumbnail" className={ "address__tag-image " + getImagePreviewAspectRatioClass(localImages[index]) } />
            });
        } else {
            return <div className="tagging-tracker__view-address-loading">
                <span>Loading tags...</span>
                <img src={ ajaxLoaderGray } alt="sync button" />
            </div>;
        }
    }

    return(
        <div className="tagging-tracker__view-address">
            { renderTags() }
        </div>
    )
}

export default ViewAddress;