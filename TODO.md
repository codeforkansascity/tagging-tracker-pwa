## Functionality
- [ ] Safari issues most notably: file input and CSS problems eg. height cut off by bottom navbar/alignment(flex)
- [ ] cancelling camera upload process leaves button not clickable/state not updated
- [ ] automatic cache clearing vs. manual "Software Update" gear icon

### Display
- [ ] use perfect square/portioning for photos eg. tiles

### Slack tasks
- [ ] On Tag Info: For date of picture and date of abatement - is it possible to add a drop down calendar to select the date? If not, that's totally fine
- [ ] On Tag Info: for vacant property and land bank property - change "Other" option to "Unknown"
- [ ] On Tag Info: On Surface options - remove "Bare" from Bare Brick or Stone, Bare Concrete, Bare Wood
- [ ] On Tag Info: Options for Need other code enforcement? - delete "Bare brick or stone" and "glass" and add "Trash"
- [ ] On Tag Info: Add Type of Property with options for Commercial, Residential, Public

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
- [ ] on owner/tag info the bottom navbar is just floating in the air/not pinned
- [ ] bottom navbar items not veritcally centered(flex)
- [ ] use camera doesn't trigger camera/file select
- [ ] set max width to 1024px

### Questionable
- [ ] deleting files by filename on the `Edit Tag` page

### Extra
- [ ] storage persistence for estimates on available storage should that be a problem
- [ ] remove previewed files(don't want to upload)
- [ ] sometimes there are some `unmounted state` errors
- [ ] fix double promises(`Promise` inside `async` function)
- [ ] caching intent eg. user selects a bunch of pictures for upload/but can't upload because not logged in
- [ ] change how logic works regarding not pulling from `Dexie` all the timem, use state variables

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