import React, { useState  } from 'react';
import { useHistory } from 'react-router-dom';
import './ViewAddress.scss';
import { getImagePreviewAspectRatioClass } from './../../utils/image';
import ajaxLoaderGray from './../../assets/gifs/ajax-loader--gray.gif';

// this is primarily due to the format juggling
// from a plain blob to a objectURL, this is not great, temporary code/short foresight
const checkRenderedImageUrl = (url) => {
    console.log(url);
    if ("type" in url) {
        if (url.type === "Buffer") {
            console.log(URL.createObjectURL(new Blob(url.data)));
            return URL.createObjectURL(new Blob(url.data));
        }

        return URL.createObjectURL(url);
    }

    if (typeof url === "Blob") {
        return URL.createObjectURL(url);
    }

    if (url.indexOf('blog:') !== -1) {
        return url.split('/')[3];
    }

    return url;
}

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
                console.log(image);
                return <div key={ index } style={{
                    backgroundImage: `url(${checkRenderedImageUrl(image.thumbnail_src)})`
                }} alt="address thumbnail" className={ "address__tag-image " + getImagePreviewAspectRatioClass(localImages[index]) } />
            });
        } else {
            return <div className="tagging-tracker__view-address-loading css-delayed-fade-in">
                <span>Loading tags...</span>
                <img src={ ajaxLoaderGray } alt="loading tags spinner" />
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