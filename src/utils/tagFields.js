export const tagInfoFields = {
    "Date of picture:": { // TODO: these should be date time with date pickers
        type: "date"
    },
    "Date of abatement:": { // TODO: these should be date time with date pickers
        type: "date"
    },
    "Number of tags:": {
        type: "number"
    },
    "Tag text:": {
        type: "input"
    },
    "Small tag text:": {
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
    "Gang related": {
        type: "radio",
        options: {
            yes: "Yes",
            no: "No",
            other: "Other"
        }
    },
    "Crossed out tag": {
        type: "radio",
        options: {
            yes: "Yes",
            no: "No",
            other: "Other"
        }
    },
    "Vacant property": {
        type: "radio",
        options: {
            yes: "Yes",
            no: "No",
            other: "Other"
        }
    },
    "Land bank property": {
        type: "radio",
        options: {
            yes: "Yes",
            no: "No",
            other: "Other"
        }
    },
    "Surface:": {
        type: "checkbox",
        options: {
            brick: "Bare Brick or Stone",
            concrete: "Bare Concrete",
            wood: "Bare Wood",
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
            no: "Bare Brick or Stone",
            buildingDisrepair: "Building disrepair",
            weeds: "Weeds",
            trash: "Glass",
            illegalDumping: "Illegal dumping",
            others: "other"
        }
    },
    "Other code enforcement:": {
        type: "input"
    }
};