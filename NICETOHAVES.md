- detect device launch with regard to Safari styling
  - due to the bottom navbar in Safari, the bottom navbar of the app is overlapped
    however in standalone mode, that Safari bottom navbar is gone
    currently I opted for the styles to be applied for PWA so PWA looks good, web looks bad(bottom app navbar covered)
    it is possible to detect what launched by a url in package.json so you can launch a specific route with say a hash
    and that will get picked up by the app/store that initial state/persist a global class on the app to honor those styles
    it's possible but not really worth it at this time, ideally you don't spend much time looking at the app in the browser
    you just install it and it use it like a native app