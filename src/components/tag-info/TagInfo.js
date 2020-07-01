import React, { createRef, useState, useRef, useEffect } from 'react';
import './TagInfo.scss';

import { getDateTime, formatTimeStr } from './../../utils/date';
import { tagInfoFields } from './../../utils/tagFields';
import { addNewTagInfo, addNewEvent, updateTagInfoEventId } from './../events/eventUtils';

// TODO: there is this functionality of "Others: type here" but that will take some work to make a dynamic input field

/**
 * So this is probably pretty confusing I get that, I was trying to make dynamic forms which it does work pretty well but has verbose code
 * The field types and values are defined in a util file called tagFields.js
 * The tagInfoFieldKeys below are used to map the refs so the inputs can be selected(for getting current value)
 * The nameValueMap is used to map the values for render
 * The main things to keep in mind is your tagFields.js structure has to match the structures here
 * Note the option-#-# when nested values are inside an input group eg. radio/checkbox you increment the sub group vs. incrementing a new level
 * OwnerInfo is built similarly but it's much simpler since it has no depth and just text input
 * @param {Object} props 
 */
const TagInfo = (props) => {
    const [tagInfo, setTagInfo] = useState(null);
    const [tagInfoId, setTagInfoId] = useState(null);
    const { modifyTagInfo } = props;

    // these have to match the order of the keys in tagFields.js
    const tagInfoFieldKeys = {
        "Date of entry:": "", // TODO - change to type date
        "Date of abatement:": "", // TODO - change to type date, picker is extra but format guarding would be good
        "Number of tags:": "",
        "Tag text (separated by commas):": "",
        "Small tag text (separated by commas):": "",
        "Square footage covered:": "",
        "Racial or hate tone?": "",
        "Gang related:": "",
        "Crossed out tag:": "",
        "Type of property:": "",
        "Vacant property:": "",
        "Land bank property:": "",
        "Surface:": "",
        "Surface other:": "",
        "Need other code enforcement?": "",
        "Other code enforcement:": ""
    }

    // note these options have to line up with what are in tagFields.js
    // eg. 5 options here, 5 options there
    // and these fields in general map with above by group
    const nameValueMap = {
        "option-0": "dateOfPicture",
        "option-1": "dateOfAbatement",
        "option-2": "numberOfTags",
        "option-3": "tagText",
        "option-4": "smallTagText",
        "option-5": "squareFootageCovered",
        "option-6-0": "racialOrHateTone",
        "option-6-1": "racialOrHateTone",
        "option-6-2": "racialOrHateTone",
        "option-7-0": "gangRelated",
        "option-7-1": "gangRelated",
        "option-7-2": "gangRelated",
        "option-8-0": "crossedOutTag",
        "option-8-1": "crossedOutTag",
        "option-8-2": "crossedOutTag",
        "option-9-0": "typeOfProperty",
        "option-9-1": "typeOfProperty",
        "option-9-2": "typeOfProperty",
        "option-10-0": "vacantProperty",
        "option-10-1": "vacantProperty",
        "option-10-2": "vacantProperty",
        "option-11-0": "landBankProperty",
        "option-11-1": "landBankProperty",
        "option-11-2": "landBankProperty",
        "option-12-0": "surface",
        "option-12-1": "surface",
        "option-12-2": "surface",
        "option-12-3": "surface",
        "option-12-4": "surface",
        "option-12-5": "surface",
        "option-13-0": "otherSurface",
        "option-14-0": "needOtherCodeEnforcement",
        "option-14-1": "needOtherCodeEnforcement",
        "option-14-2": "needOtherCodeEnforcement",
        "option-14-3": "needOtherCodeEnforcement",
        "option-14-4": "needOtherCodeEnforcement",
        "option-15-0": "otherCodeEnforcement"
    };

    const tagInfoInputElements = useRef(Object.keys(tagInfoFieldKeys).map(
        // these are manually mapped based on tagFields.js not great, mainly for the nested inputs eg. radio/checkbox
        (fieldKey) => {
            const fieldType = tagInfoFields[fieldKey].type;
            if (fieldType === "input" || fieldType === "number" || fieldType === "date") {
                return createRef();
            } else {
                const subFields = tagInfoFields[fieldKey].options;

                return {subRefs: 
                    Object.keys(subFields).map((subFieldKey) => {
                        return createRef();
                    })
                };
            }
        }
    ));

    let updateDone = true; // bad

    const updateTagInfo = async () => {
        const offlineStorage = props.offlineStorage;
        const mappedFieldValues = {}

        tagInfoInputElements.current.forEach((element) => {
            let elementType = "";

            if (typeof element.current !== "undefined" && typeof element.current.type !== "undefined") {
                elementType = element.current.type;
            }

            if (typeof element.subRefs !== "undefined" && Array.isArray(element.subRefs)) {
                element.subRefs.forEach((subElement) => {
                    mappedFieldValues[subElement.current.id] = subElement.current.checked;
                });
            } else if (elementType === "text" || elementType === "number" || elementType === "date") {
                mappedFieldValues[element.current.name] = element.current.value;
            } else {
                mappedFieldValues[element.current.name] = element.current.checked;
            }
        });

        if (updateDone) {
            updateDone = false;
            const existingTagInfoId = props.location.state.tagInfoId || tagInfoId; // first one has precedence

            if (existingTagInfoId) {
                offlineStorage.transaction('rw', offlineStorage.tagInfo, async() => {
                    if (
                        await offlineStorage.tagInfo.where(":id").equals(existingTagInfoId).modify({
                            formData: mappedFieldValues
                        }, props.location.state.addressId).then((insertedId) => {
                            return true;
                        })
                    ) {
                        setTagInfo(mappedFieldValues);
                        updateDone = true;
                    } else {
                        alert('Failed to update tag information');
                    }
                })
                .catch(e => {
                    alert('Failed to update tag information');
                    console.log('tag info', e);
                });
            } else {
                const addressId = props.location.state.addressId;
                const tagInfoId = await addNewTagInfo(addressId, offlineStorage, false, mappedFieldValues);
                const eventId = await addNewEvent(tagInfoId, addressId, offlineStorage, formatTimeStr, getDateTime);
                await updateTagInfoEventId(tagInfoId, eventId, offlineStorage);
                setTagInfo(mappedFieldValues);
                setTagInfoId(tagInfoId);
            }
        }
    }

    const generateInputType = (fieldGroup, mainIndex, field) => {
        const fieldType = fieldGroup.type;

        if (fieldType === "input") {
            nameValueMap[`option-${mainIndex}`] = null;
            return (
                <input defaultValue={ tagInfo ? tagInfo[`option-${mainIndex}`] : "" } name={ `option-${mainIndex}` } onKeyUp={ updateTagInfo } onBlur={ updateTagInfo } ref={tagInfoInputElements.current[mainIndex]} className="grow" type="text" disabled={ modifyTagInfo ? false : true } />
            )
        } else if (fieldType === "number") {
            nameValueMap[`option-${mainIndex}`] = null;
            return (
                <input defaultValue={ tagInfo ? tagInfo[`option-${mainIndex}`] : "" } name={ `option-${mainIndex}` } placeholder="0" onKeyUp={ updateTagInfo } onBlur={ updateTagInfo } ref={tagInfoInputElements.current[mainIndex]} className="grow" type="number" min="0" disabled={ modifyTagInfo ? false : true } />
            )
        } else if (fieldType === "date") {
            return (
                <input defaultValue={ tagInfo ? tagInfo[`option-${mainIndex}`] : "" } name={ `option-${mainIndex}` } onKeyUp={ updateTagInfo } onBlur={ updateTagInfo } ref={tagInfoInputElements.current[mainIndex]} className="grow" type="date" min={getDateTime('MM-DD-YYYY')} disabled={ modifyTagInfo ? false : true } />
            )
        } else if (fieldType === "radio" || fieldType === "checkbox") {
            const optionKeys = Object.keys(fieldGroup.options);

            if (optionKeys.length) {
                // TODO: redundant code here
                if (fieldType === "checkbox") {
                    return (
                        <div className="padding-left">
                            {
                                optionKeys.map((optionKey, index) => {
                                    return (
                                        <span key={index} className="option-group">
                                            <input checked={ tagInfo ? tagInfo[`option-${mainIndex}-${index}`] : false } onChange={ updateTagInfo } onKeyUp={ updateTagInfo } ref={tagInfoInputElements.current[mainIndex].subRefs[index]} id={`option-${mainIndex}-${index}`}
                                                name={ `option-${mainIndex}-${index}`} type={ fieldType } disabled={ modifyTagInfo ? false : true } />
                                            <label htmlFor={`option-${mainIndex}-${index}`}>{ fieldGroup.options[optionKey] }</label>
                                        </span>
                                    )
                                })
                            }
                        </div>
                    )
                } else {
                    return optionKeys.map((optionKey, index) => {
                        return (
                            <span key={index} className="option-group">
                                <input checked={ tagInfo ? tagInfo[`option-${mainIndex}-${index}`] : false } onChange={ updateTagInfo } onKeyUp={ updateTagInfo } id={`option-${mainIndex}-${index}`} name={ nameValueMap[`option-${mainIndex}-${index}`]}
                                    ref={tagInfoInputElements.current[mainIndex].subRefs[index]} type={ fieldType } disabled={ modifyTagInfo ? false : true } />
                                <label htmlFor={`option-${mainIndex}-${index}`}>{ fieldGroup.options[optionKey] }</label>
                            </span>
                        )
                    });
                }
            }
        } else {
            return "[unknown field type]";
        }
    }

    const getSpanClass = (fieldType) => {
        if (fieldType === "radio") {
            return "option-group-label";
        }
        if (fieldType === "checkbox") {
            return "full";
        } else {
            return "input-label";
        }
    }

    const modifyClassWrapper = (field) => {
        if (
            field === "Type of property:" ||
            field === "Vacant property:" ||
            field === "Land bank property:" ||
            field === "Tag text (separated by commas):" ||
            field === "Small tag text (separated by commas):" // super jank I know
        ) {
            return " full-column-left";
        }

        return "";
    }

    const renderTagInfo = () => {
        return Object.keys(tagInfoFields).map((field, index) => {
            return (
                // bad
                <div key={index} className={"tag-info-field-row" + (tagInfoFields[field].type === "checkbox" ? " checkbox" : " box") + modifyClassWrapper(field) }>
                    <span className={ getSpanClass(tagInfoFields[field].type) }>{ field }</span>
                    { generateInputType(tagInfoFields[field], index, field) }
                </div>
            )
        });
    };

    // this loads tag info by id in local store(Dexie/IndexedDB)
    useEffect(() => {
        if (!tagInfo) {
            const tagInfoId = props.location.state.tagInfoId;
            const offlineStorage = props.offlineStorage;

            if (tagInfoId && offlineStorage) {
                offlineStorage.tagInfo.get(tagInfoId, (tagInfo) => {
                    if (tagInfo) {
                        setTagInfo(tagInfo.formData);
                    }
                }).catch (function (err) {
                    alert('failed to load tagInfo');
                    console.log('tag info', err);
                });
            }
        }
    }, [props, tagInfo]);

    return(
        <div className="tagging-tracker__tag-info">
            { renderTagInfo() }
        </div>
    )
}

export default TagInfo;