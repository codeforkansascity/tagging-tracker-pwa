### This is on both client and remote side(Node/Express/MySQL API)
This is going to be ugly... take a bit of work to do. Generally straight forward though, just have to regroup data/get new data from the updated Dexie schema.

### Dexie schema
- addresses
    - id, address, lat, lng, created, updated
- events (new)
    - addressId, tagInfoId, tagIds, datetime
- tags
    - fileName, addressId, eventId, meta, datetime
- ownerInfo
    - addressId, formData
- tagInfo
    - addressId, eventId, formData

### Todo
- [x] update sync up client side
- [x] update mysql db schema (to match Dexie schema)
- [x] update sync up API side
- [x] update sync down API side
- [x] update sync down client side
- [x] update deployed api
    - update db schema
    - update files
    - reload systemd
- [ ] update seed file to reflect new db
    - events, tags, tag_info
- [ ] simplify environment switching(all the localhost checks)
    - several spread out eg. on login, on sync up/down

### Misc
- [ ] update delete event so it cleans up related tables
    - left behind random tags and what not before, caused problems

### Random notes
- it's `source path/to/file.sql` to import sql file through mysql cli windows when logged in