import React from 'react'
import {
  BrowserRouter,
  Route
} from 'react-router-dom'

import Home from './app/home'

// EVOTING HACK:
//
// It HTTPS, then redirect to HTTP, because we know that the evoting conodes cannot talk
// HTTPS.
//
if (document.location.href.substr(0, 6) === 'https:') {
  var to=document.location.href;
  document.location.href = to.replace("https://", "http://");
}

/**
 * Entry point of the application
 * External routes are used to integrate modules in an IFrame for distant website
 *
 * @author Gaylor Bosson (gaylor.bosson@epfl.ch)
 * @constructor
 */
const App = () => (
  <BrowserRouter>
    <div>
      <Route exact path="/" component={Home}/>
    </div>
  </BrowserRouter>
);

export default App
