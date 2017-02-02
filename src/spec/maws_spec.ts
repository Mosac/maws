///<reference types="@types/jasmine" />
'use strict';

import Zlib from "../zlib";
import DynamoDB from "../dynamo_db";

describe("Maws", function(){
  describe("check zlib", function(){
    it("gen deflated", function(){
      var deflated = Zlib.toBase64("test");
      expect(deflated).toEqual("eJwrSS0uAQAEXQHB");
    });

    it("inflate", function(){
      var deflated = "eJwrSS0uAQAEXQHB";
      var inflated = Zlib.toString(deflated);
      expect(inflated).toEqual("test");
    })
  });
});

describe("DynamoDB", function(){
  it("parse data", function(){
    let db = new DynamoDB("Example", "dev");
    expect((db as any).tableName).toEqual("dev-Example");

    var testData:any = {
      Count: 1,
      ScannedCount: 1,
      Items: [
        {
          id: {"S": "120"}
        }
      ]
    };

    var expectData:any = {
      count: 1,
      scanned: 1,
      rows:[
        {
          id: "120"
        }
      ]
    };

    expect((DynamoDB as any).parseData(testData)).toEqual(expectData);
  });
});
