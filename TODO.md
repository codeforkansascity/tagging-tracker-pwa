### Performance
- regarding Safari, storage issue should not be a problem, according to this [webkit spec](https://trac.webkit.org/changeset/237700/webkit/), the size limitation for Safari is half the free space if less than 1GB or at least 500MB
    - from a test on a computer(with ethernet with 200Mbps) it took about a minute to pull down 85MB+ of images, those are probably bigger when turned to base64
    - NOPE it's the upload that took a while, download was only a couple seconds
- [ ] address sync performance issue
    - [ ] rewrite sync logic to not sync everything, specifically the images, can sync the thumbnails
    - [ ] large images not needed since only small thumbnails are used, however, they should be available for the click thumbnail to view full size
        - but that can be done on demand/cached locally in session
        - address sync up and down to ignore the full size src, so it is not deleted
    - [ ] at somepoint - address the sync pagination
- [ ] pagination issue with Dexie eg. 36 rows being pulled to load 36 images throws [max ipc length](https://stackoverflow.com/questions/52717593/maximum-ipc-message-size-exceeded) issue
    - [ ] need to add scroll load
- [ ] take out large columns that should not be indexed
    - so... I did not read thoroughly enough, you're not supposed to specify columns that should not be indexed in stores... I thought that was just a schema definition but [this page](https://dexie.org/docs/Version/Version.stores()) says to not include big stuff but can still insert it later as per example.

### Feature to open large image from thumbnail
- [ ] put a warning first time opening big picture(from thumbnail click) that it will use data

### UX
- [ ] typing into logging field seems whack, probably due to state being tied to `onKeyUp`

### Fixing Safari
- [x] add Safari detecting through `navigator.userAgent` parsing
- [x] address height/bottom navbar, uses `window.innerHeight`
- [x] address collapsing buttons in bottom navbar, addressed by `iOS` class and not using `flex: 0;`
- [ ] look into weird alignment of add tag buttons in bottom navbar
- [x] file input doesn't trigger camera/file manager
- [ ] height issue in iPad

### Async processes(add spinner)
- [ ] delete image
- [ ] upload

### TODOs in code, just search, will find a lot related to optimizing/best practices/etc...

### Functionality
- [x] Safari issues most notably: file input and CSS problems eg. height cut off by bottom navbar/alignment(flex)
- [ ] cancelling camera upload process leaves button not clickable/state not updated
- [ ] automatic cache clearing vs. manual "Software Update" gear icon

### Display
- [ ] use perfect square/portioning for photos eg. tiles

### Slack tasks
- [ ] Extra - On Tag Info: For date of picture and date of abatement - is it possible to add a drop down calendar to select the date? If not, that's totally fine
    - this is probably browser specific but it's there/I've seen it work in Chrome and Safari since it's a date time type input, proof below Chrome vs. Safari
    - it mostly works but in some cases it doesn't work, proven to work on device and chrome browser
    - this will need some kind of library for the date picker maybe npm has it/reactjs
        - yeah Firefox and Safari don't support it apparently
    - this also works on iPad from testing
    ![date-input-type-check](./date-input-type-check.png)

- [x] On Tag Info: for vacant property and land bank property - change "Other" option to "Unknown"
- [x] On Tag Info: On Surface options - remove "Bare" from Bare Brick or Stone, Bare Concrete, Bare Wood
- [x] On Tag Info: Options for Need other code enforcement? - delete "Bare brick or stone" and "glass" and add "Trash"
- [x] On Tag Info: Add Type of Property with options for Commercial, Residential, Public
    - added this but breaks old structure due to where it's positioned eg. not at end, form is incrementally rendered with mapped fields so order matters
    - at least no real data yet

### Login/Logout
- [ ] add spinner to logout process

### Sync
- [ ] consider better way than empty pulldown or not empty overwrite up
- [ ] some kind of diffing
- [ ] some kind of down sync pagination

## Device/OS/Browser

### Safari
These are visual problems noted on Safari when testing with an iPhone X(AWS Device Farm)
Unfortunately there are quite a few problems visually
- [ ] the bottom navbar is cut off
    - set by JS, it looks good from a tester with a real device, doesn't look good in SauceLabs real devices,
        but looks good in responsive mode Safari
- [x] on owner/tag info the bottom navbar is just floating in the air/not pinned
    - overflow css issue(doesn't like one-liner wants `overflow-x`, `overflow-y`)
- [ ] bottom navbar items not veritcally centered(flex)
- [x] use camera doesn't trigger camera/file select
- [x] set max width to 1024px

### Questionable
- [x] deleting files by filename on the `Edit Tag` page
    - addressed with new backward-compatible timestamp

### Extra
- [ ] storage persistence for estimates on available storage should that be a problem
- [ ] remove previewed files(don't want to upload)
- [ ] sometimes there are some `unmounted state` errors
- [ ] fix double promises(`Promise` inside `async` function)
- [ ] caching intent eg. user selects a bunch of pictures for upload/but can't upload because not logged in
- [ ] change how logic works regarding not pulling from `Dexie` all the time, use state variables

### Optional
- [ ] adding in auto complete for address search, not hard but concern is cost/necessary
- [ ] recaptcha on login, currently using random domain and using Node... though it's on a dinky single core VPS so not sure if DDOS is a concern
- [ ] way to register accounts, currently done manually eg. on Node side
- [ ] self location with `navigator` and then use reverse geocode to get address

### Research
- [ ] using raw images over base64
- [ ] dynamic proxy based on environment, may be tied to build script altready in `package.json`
- [ ] the mockup didn't show other options for address like state/zip so I guess it's just for KC?
- [ ] better way with dealing collapsing height due to device soft keyboard

### Good pratice
- [ ] don't develop on live url