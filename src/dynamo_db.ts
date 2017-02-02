'use strict';

interface dynamoRequest {
  TableName: string,
  Limit? : number,
  ScanIndexForward?: boolean,
  KeyConditions?: any,
  Item?: any
}

var aws = require('aws-sdk');
var dynamo = new aws.DynamoDB();

export default class DynamoDB{

  private tableName: string;
  private listLimit: number = 50;

  constructor(tableName: string, stage:string){
    this.tableName = `${stage}-${tableName}`;
  }

  async find(id: string, pk?: string){

    pk = pk || "id";
    var dynamoRequest: dynamoRequest = {
        "TableName" : this.tableName
    };

    dynamoRequest.Limit = this.listLimit;
    dynamoRequest.ScanIndexForward = false;
    dynamoRequest.KeyConditions = {};
    dynamoRequest.KeyConditions[pk] = {
        AttributeValueList:[{"S" : id}],
        ComparisonOperator:'EQ'
    };

    return new Promise(function(done, reject){
      dynamo.query(dynamoRequest, function (err:any, data:any) {
        if (err) {
          reject(err);
        } else {
          done(DynamoDB.parseData(data));
        }
      });
    });
  }

  async put(data: any){
    var dynamoRequest: dynamoRequest = {
      "TableName" : this.tableName
    };

    var item:any= {};
    Object.keys(data).forEach((key)=>{
      item[key] = {"S": String(data[key])};
    })
    dynamoRequest.Item = item;

    return new Promise(function(done, reject){
      dynamo.putItem(dynamoRequest, function (err:any, response:any) {
        if (err) {
          reject({
            message: err,
            input: data,
            response: response
          });
        } else {
          done(response);
        }
      });
    });
  }

  private static parseData(data:any){
    var count = data["Count"];
    var scanned = data["ScannedCount"];

    var items:any = data["Items"].map(function(item:any){
      var row:any = {};
      Object.keys(item).forEach((key)=>{
        row[key] = Object.keys(item[key]).map((type)=>{
          return item[key][type];
        }).join(" ");
      });
      return row;
    });

    return {
      rows: items,
      count: count,
      scanned: scanned
    };
  }
}
