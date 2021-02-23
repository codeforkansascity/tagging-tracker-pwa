### 02/22/2021
- [ ] update how login token state is managed
    - [ ] add it to Dexie db
        - [ ] update Dexie db schema
        - [ ] update state setters to populate/pull from this db field
    - [ ] update client side token lifetime I think it's 15mins right now
    - [ ] have to update new workflow
        - on refresh/mount app checks for token in table/if one exists sets it
          it may be outdated
        - there should probably be a "forced to login" thing at some point but the whole point of this app
          is for it to be usable without internet connection eg. can't login if you don't hit a server
          so yeah... you'll hit a point where it asks you to login say at sync time

Hmm... my mac doesn't have the environment setup that's great... also the seeder works but the users don't exist.
Should have seeded those as well but can call the function `createUser` manually in the utils folder of backend

Ehh... also when you directly call the function have to specify the path for env directly, it's normally "inherited" from `index.js` call but that starts at the root.

After that you're able to login