import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Billing } from "aws-cdk-lib/aws-dynamodb";

export class DataStoreConstruct extends Construct {

    constructor(scope: Construct, id: string, props) {
        super(scope, id);
        const globalTable = new dynamodb.TableV2(this, 'dogs', {
            partitionKey: { name: 'Id', type: dynamodb.AttributeType.STRING },
            removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
        });

        new cdk.CfnOutput(this, 'DogsTableName', {
            value: globalTable.tableName,
            description: 'The name of the DynamoDB table for storing dog data',
            exportName: 'DogsTableName',
        });
    }
}