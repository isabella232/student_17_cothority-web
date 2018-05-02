import React from 'react'
import {Table} from 'reactstrap'

import SkipChainService from '../../services/skipchain'
import ByteBuffer from 'bytebuffer'
import {tcp2ws} from '../../utils/network'
import cothority from '@dedis/cothority'

export default class Election extends React.Component {
  /**
   * @constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.electionID = new Uint8Array(ByteBuffer.fromHex(this.props.electionID).buffer);
    this.state = {
      blocks: []
    }

    SkipChainService._getUpdates([ tcp2ws(this.props.addr) ], this.electionID)
      .then((data) => {
	this.setState( {
	  blocks: data
	})
      })
  }

  /**
   * @override
   * @see https://facebook.github.io/react/docs/react-component.html
   * @returns {XML}
   */
  render() {
    const rows = generateRows(this.state.blocks);

    return (
      <div> Election
        <Table hover style={{ background: 'white' }}>
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
	</div>
    );
  }
}

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
  //console.log("block", b)
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

  if (tx.election !== null) {
    return "Election: " + tx.election.name["en"] + ", ID: " + hex(b.Hash)
  }
  if (tx.ballot !== null) {
    return "Encrypted ballot cast by: " + tx.user
  }
  if (tx.mix !== null) {
    const addrs = b.Roster.list.filter( (x) => hexEqual(x.id, tx.mix.nodeid))
    return "Ballot shuffle operation by: " + tx.user + " on node " + addrs[0].address;
  }
  if (tx.partial !== null) {
    const addrs = b.Roster.list.filter( (x) => hexEqual(x.id, tx.partial.nodeid))
    return "Partial ballot decryption by: " + tx.user + " on node " + addrs[0].address;
  }
  
  return 'Unknown type';
}

function hexEqual(a, b) {
  if (a.length !== b.length) {
    return false
  }
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
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

