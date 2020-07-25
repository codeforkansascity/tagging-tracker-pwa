// this is trying to detect browser by user agent not really great
// but this particular app has a fixed, bottom navbar which is problematic with Safari
// since the Safari menu bar overlaps the browser
// the Safari menu bar height changes though so the magic number 44px is a best guess pulled from some site
// initially I saw that when you scroll down the Safari bottom menu goes away/comes back scrolling up
// but it seems if you don't have overflow/shorter in height then the bottom navbar will be ontop of the Safari bottom menu
// I guess Mac has this issue too? That's what I see in Sauce Labs simulator
export const checkIOS = () => {
    // const iOS = /(iPhone|iPod|iPhone Simulator|iPod Simulator|iPad|iPad Simulator|Macintosh)/g.test(navigator.userAgent);
    const iOS = true;
    if (iOS) {
        document.querySelector('.tagging-tracker__body').classList = 'tagging-tracker__body'; // clear state
        document.querySelector('.tagging-tracker__bottom-navbar').classList.add('iOS');
        document.querySelector('.tagging-tracker__body').classList.add('iOS');

        if (window.location.href.indexOf('events') !== -1 || window.location.href.indexOf('event-tags') !== -1) {
            document.querySelector('.tagging-tracker__body').classList.add('less');
        }

        if (window.location.href.indexOf('tag-info') !== -1) {
            document.querySelector('.tagging-tracker__body').classList.add('toggled-navbar');
        }

        if (window.location.href.indexOf('add-tag') !== -1) {
            document.querySelector('.tagging-tracker__body').classList.add('add-tag');
        }
    }
}

export const resizeAdjustHeight = () => {
    document.querySelector('.tagging-tracker').style.height = window.innerHeight + "px";
}

// TODO this is not great magic number is from the bottom navbar
// mainly it's bad due to that JS render flash jank
export const addPathClassToBody = (props) => {
    const curPath = props.location.pathname;

    // this is bad direct dom manipulation
    // if (curPath === "/tag-info") {
    //     if (!document.querySelector('.tagging-tracker__body').classList.contains('full-body-height')) {
    //         document.querySelector('.tagging-tracker__body').classList += " full-body-height";
    //     }
    // }

    // if (curPath !== "/addresses" || curPath !== "/") {
    //     document.querySelector('.tagging-tracker__body').style.maxHeight = (window.innerHeight - 52) + "px";
    // }
}

export const truncateText = (text, length, ellipsis) => {
    if (!text) {
        return "undefined string";
    }

    return text.substr(0, length) + ((ellipsis && text.length > length) ? '...' : '');
}