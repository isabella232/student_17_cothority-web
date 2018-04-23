import React from 'react'
import {Table} from 'reactstrap'

import Election from '../election/election'
import LoadingSpinner from '../loading/loading-spinner'

import GenesisService from '../../services/genesis'
import cothority from '@dedis/cothority'

export default class ChainStatus extends React.Component {

  /**
   * @constructor
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      blocks: [],
      isLoading: false,
    };

    this.handleLinkChange = this.handleLinkChange.bind(this);
  }

  onGenesisUpdate(blocks, genesisList) {
    this.setState({
      'blocks': blocks,
    })
  }

  handleLinkChange(linkBlock) {
  }
  
  /**
   * @override
   * @see https://facebook.github.io/react/docs/react-component.html
   */
  componentDidMount() {
    GenesisService.subscribe(this);
  }

  /**
   * @override
   * @see https://facebook.github.io/react/docs/react-component.html
   */
  componentWillUnmount() {
    GenesisService.unsubscribe(this);
  }

  /**
   * @override
   * @see https://facebook.github.io/react/docs/react-component.html
   * @returns {XML}
   */
  render() {
    const rows = generateRows(this.state.blocks);
    const loading = this.state.isLoading ? generateLoading() : null;

    return (
      <div className="chain-status">
        <div className="chain-status-info">
          <div>
            Number of blocks: <strong>{this.state.blocks.length}</strong>
          </div>
        </div>
        <Table hover>
          <thead>
            <tr>
              <th>Index</th>
              <th>Contents</th>
            </tr>
          </thead>
        <tbody>
	{rows}
          </tbody>
        </Table>

        {loading}
      </div>
    );
  }
}

/**
 * Return the loading component
 * @returns {XML}
 */
function generateLoading() {
  return (
    <div className="chain-status-loading">
      <LoadingSpinner/>
    </div>
  );
}

/**
 * Generate a table row from a list of status responses
 * @param status {Object}
 */
function generateRows(blocks) {
  return blocks.map(block => {
    return (
      <tr key={block.Index}>
        <td>{block.Index}</td>
        <td>{blockContents(block)}</td>
      </tr>
    );
  });
}

function blockContents(b) {
  if (b.Data.length === 0) {
    return "none"
  }
  
  const model = cothority.protobuf.root.lookup("Transaction");
  var tx;
  try {
    tx = model.decode(b.Data);
    //console.log(tx);
  } catch(e) {
    console.log(e)
    return 'Failed to decode ' + e.instance.$type.name + ': ' + e.toString()
  }
  
  if (tx['master'] !== null) {
    var m = tx.master;
    return 'Master: Admins ' + m.admins + ', Front-end public key: ' + hex(m.key);
  }
  if (tx['link'] !== null) {
    return ( <Election addr={b.Roster.list[0].address} electionID={hex(tx.link.master)}/> );
  }
  return 'Unknown type';
}

function hex(arr) {
  const hexEncodeArray = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f',
  ];

  var s = '';
  for (var i = 0; i < arr.length; i++) {
    var code = arr[i];
    s += hexEncodeArray[code >>> 4];
    s += hexEncodeArray[code & 0x0F];
  }
  return s
}

