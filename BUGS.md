### 03/01/20201
- [ ] delete is not thorough, events table has left over data (Dexie)
- see notes here on Node side
- mostly need to test workflow in Safari... may not matter in long run may just commit to RN
- pushing enter to save address, two entries (unusual workflow in mobile perhaps)

### previous
- [ ] the weird height thing after you type, happens in PWA on Android
    - I think this is for the bottom navbar issue in Safari, maybe the user agent detection isn't working or the resize handler is firing incorrectly
- [ ] top navbar, back link is too long/can click even if not trying to
    - requires restructuring, can't think of simple CSS fix, not worth it, need to refactor/build new version