import React from 'react'

import './html-iframe.css'
import IFrameService from '../../services/iframe'

/**
 * Show a fixed IFrame when the user click on an HTML skipchain
 *
 * @author Gaylor Bosson (galor.bosson@epfl.ch)
 */
export default class HTMLIFrame extends React.Component {

  /**
   * @constructor
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      html: null
    };

    this.handleBack = this.handleBack.bind(this);
  }

  /**
   * update the html state to show the content in the IFrame
   * @param {String} html - the html content to show
   */
  onOpenHTML(html) {
    this.setState({html});
  }

  /**
   * Reset the content of the html state to hide the IFrame
   */
  onCloseHTML() {
    this.setState({
      html: null
    });
  }

  /**
   * Handle the back action that will close the IFrame
   * We use the service instead of the state to trigger the event to possible other components
   */
  handleBack() {
    IFrameService.back();
  }

  /**
   * @override
   * @see https://facebook.github.io/react/docs/react-component.html
   */
  componentWillMount() {
    IFrameService.subscribe(this);
  }

  /**
   * @override
   * @see https://facebook.github.io/react/docs/react-component.html
   */
  componentWillUnmount() {
    IFrameService.unsubscribe(this);
  }

  /**
   * @override
   * @see https://facebook.github.io/react/docs/react-component.html
   * @returns {XML}
   */
  render() {
    // EVOTING HACK: We are stealing this iframe to do our own user education.
    return (
	<div style={{padding: '20px'}}>
	<p>Félicitations, vous avez trouvé la page "Comment ça marche". Si vous voulez juste voter, cliquez sur "retour" dans votre navigateur.</p>
	<p>Congratulations, you&#39;ve found the "How this Works" page. If you just want to vote, click "back" in your browser.</p>
	<p>Otherwise, take a moment to <a href="https://github.com/dedis/epfl-evoting/tree/master/evoting/about">read an explanation</a> of what you see here.
	This page works best from the EPFL network, so if you are outside you may want to turn on your VPN now.</p>
	</div>
    );
  }
}
