### Feature Requests
- [ ] (easy) extra fields on event screen(tag info)
- [ ] (easy) add address autocomplete
  - assuming using Google Maps(may cost money, may be free)
- [ ] (hard) upload multiple photos
  - requires front end and backend work
  - front end has to store/loop through upload process
  - backend has to process the sets or streams of multiple files
    but may not be different from uploading multiple events which can also have several images per event
- [ ] (medium) update event workflow so don't have to save event before adding images
  - there is a reason for this, it's a dumb code on my part with regard to the saving/communication between top navbar and body(separate components)
    easier to just leave/saves data and come back
  - investigate being able to save without leaving or just automatically save the event... bad thing is if it's empty shouldn't save,
    would have to delete it which is a capability