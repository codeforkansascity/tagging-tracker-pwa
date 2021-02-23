### 02/22/2021
- [ ] update how login token state is managed
    - [x] add it to Dexie db
        - [x] update Dexie db schema
        - [x] update state setters to populate/pull from this db field
    - [ ] update client side token lifetime I think it's 15mins right now
    - [x] have to update new workflow
        - on refresh/mount app checks for token in table/if one exists sets it
          it may be outdated
        - there should probably be a "forced to login" thing at some point but the whole point of this app
          is for it to be usable without internet connection eg. can't login if you don't hit a server
          so yeah... you'll hit a point where it asks you to login say at sync time

Hmm... my mac doesn't have the environment setup that's great... also the seeder works but the users don't exist.
Should have seeded those as well but can call the function `createUser` manually in the utils folder of backend

Ehh... also when you directly call the function have to specify the path for env directly, it's normally "inherited" from `index.js` call but that starts at the root.

After that you're able to login

After first implementation

Overall this code is not great... I mean the functionality is there but structurally it's architected poorly and that's on me. I wanted this app to get off the ground fast/get used and iterate.

Anyway there are still functional changes to do and implementation... it does seem like the most "user friend/less resistance way" are native apps.

What is not pretty is the version management of the `IndexedDB` store when the schema changes like it did now I believe you're supposed to push out a new version of the db. I have to check if that's factored into the manual "software update" (gear icon) which was supposed to be automatically happening but needed to dump more time into that eg. some kind of web worker/background task on the PWA or possibly ping from a remote place to the phone.