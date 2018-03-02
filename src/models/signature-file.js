import Moment from 'moment'
import {buf2hex, hex2buf} from '../utils/buffer'

/**
 * This model defines the structure of the signature file the user can download after a signature request
 *
 * @author Gaylor Bosson (gaylor.bosson@epfl.ch)
 */
export default class SignatureFile {

  /**
   * @constructor
   */
  constructor() {
    this.filename = null;
    this.signature = null;
    this.hash = null;
    this.skipchainID = null;
    this.blockID = null;
    this.offlineServers = null;
  }

  /**
   * @param {String} name
   */
  setFileName(name) {
    this.filename = name;
  }

  /**
   * @returns {String}
   */
  getFilename() {
    return this.filename;
  }

  /**
   *
   * @param {Uint8Array} signature
   */
  setSignature(signature) {
    this.signature = buf2hex(signature);
  }

  /**
   *
   * @returns {Uint8Array}
   */
  getSignature() {
    return hex2buf(this.signature);
  }

  /**
   *
   * @param {Uint8Array} hash
   */
  setHash(hash) {
    this.hash = buf2hex(hash);
  }

  /**
   * Return the hash in hex or buffer form
   * @param {Boolean} hex
   * @returns {Uint8Array}
   */
  getHash(hex = false) {
    return hex ? this.hash : hex2buf(this.hash);
  }

  /**
   *
   * @param {String|Uint8Array} id
   */
  setSkipchainID(id) {
    if (typeof id !== 'string') {
      id = buf2hex(id);
    }

    this.skipchainID = id;
  }

  /**
   *
   * @param {Boolean} hex
   * @returns {String|Uint8Array}
   */
  getSkipchainID(hex = false) {
    return hex ? this.skipchainID : hex2buf(this.skipchainID);
  }

  /**
   *
   * @param {Uint8Array|String} id
   */
  setBlockID(id) {
    if (typeof id !== 'string') {
      id = buf2hex(id);
    }

    this.blockID = id;
  }

  /**
   *
   * @param {Boolean} hex
   * @returns {String|Uint8Array}
   */
  getBlockID(hex = false) {
    return hex ? this.blockID : hex2buf(this.blockID);
  }

  /**
   *
   * @param {Array} servers
   */
  setOfflineServers(servers) {
    this.offlineServers = servers;
  }

  /**
   *
   * @returns {Array}
   */
  getOfflineServers() {
    return this.offlineServers || [];
  }

  /**
   * Create the JSON and download the file to the user's computer
   */
  save() {
    const body = {
      filename: this.filename,
      signature: this.signature,
      hash: this.hash,
      skipchainID: this.skipchainID,
      blockID: this.blockID,
      offlineServers: this.offlineServers || []
    };

    const date = Moment().format("YYYY-MM-DD-HH-mm-ss");
    saveAs(new Blob([JSON.stringify(body, null, '\t')], {type : 'application/json'}), `signature_${date}.json`); // eslint-disable-line
  }

  /**
   * Parse a given string from a signature file and populate the fields
   * @param {String} content
   */
  parse(content) {
    let data;
    try {
      data = JSON.parse(content);
    } catch (e) {
      throw new Error("Signature file malformed");
    }

    if (!data.skipchainID || !data.blockID || !data.hash || !data.signature) {
      throw new Error("Missing data in signature file.");
    }

    this.filename = data.filename || '';
    this.signature = data.signature;
    this.hash = data.hash;
    this.skipchainID = data.skipchainID;
    this.blockID = data.blockID;
    this.offlineServers = data.offlineServers || [];
  }
}
