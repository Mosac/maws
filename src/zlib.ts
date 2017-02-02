'use strict';

const zlib = require('zlib');

export default class Zlib{
  static toBase64(str: string){
    return zlib.deflateSync(str).toString('base64')
  }

  static toString(base64: string){
    return zlib.inflateSync(new Buffer(base64, 'base64')).toString();
  }
}
