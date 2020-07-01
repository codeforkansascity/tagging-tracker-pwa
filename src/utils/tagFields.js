export const tagInfoFields = {
    "Date of entry:": { // TODO: these should be date time with date pickers
        type: "date"
    },
    "Date of abatement:": { // TODO: these should be date time with date pickers
        type: "date"
    },
    "Number of tags:": {
        type: "number"
    },
    "Tag text (separated by commas):": {
        type: "input"
    },
    "Small tag text (separated by commas):": {
        type: "input"
    },
    "Square footage covered:": {
        type: "number"
    },
    "Racial or hate tone?": {
        type: "radio",
        options: {
            yes: "Yes",
            no: "No",
            other: "Other"
        }
    },
    "Gang related:": {
        type: "radio",
        options: {
            yes: "Yes",
            no: "No",
            other: "Other"
        }
    },
    "Crossed out tag:": {
        type: "radio",
        options: {
            yes: "Yes",
            no: "No",
            other: "Other"
        }
    },
    "Type of property:": {
        type: "radio",
        options: {
            commercial: "Commercial",
            residential: "Residential",
            public: "Public"
        }
    },
    "Vacant property:": {
        type: "radio",
        options: {
            yes: "Yes",
            no: "No",
            other: "unknown"
        }
    },
    "Land bank property:": {
        type: "radio",
        options: {
            yes: "Yes",
            no: "No",
            other: "unknown"
        }
    },
    "Surface:": {
        type: "checkbox",
        options: {
            brick: "Brick or Stone",
            concrete: "Concrete",
            wood: "Wood",
            glass: "Glass",
            painted: "Painted",
            others: "other"
        }
    },
    "Surface other:": {
        type: "input"
    },
    "Need other code enforcement?": {
        type: "checkbox",
        options: {
            buildingDisrepair: "Building disrepair",
            weeds: "Weeds",
            trash: "Trash",
            illegalDumping: "Illegal dumping",
            others: "other"
        }
    },
    "Other code enforcement:": {
        type: "input"
    }
};