// this is trying to detect browser by user agent not really great
// but this particular app has a fixed, bottom navbar which is problematic with Safari
// since the Safari menu bar overlaps the browser
// the Safari menu bar height changes though so the magic number 44px is a best guess pulled from some site
// initially I saw that when you scroll down the Safari bottom menu goes away/comes back scrolling up
// but it seems if you don't have overflow/shorter in height then the bottom navbar will be ontop of the Safari bottom menu
// I guess Mac has this issue too? That's what I see in Sauce Labs simulator
export const checkIOS = () => {
    const iOS = /(iPhone|iPod|iPhone Simulator|iPod Simulator|iPad|iPad Simulator|Macintosh)/g.test(navigator.userAgent);

    if (iOS) {
        document.querySelector('.tagging-tracker__bottom-navbar').classList.add('iOS');
    }
}

export const resizeAdjustHeight = () => {
    document.querySelector('.tagging-tracker').style.height = window.innerHeight + "px";
}