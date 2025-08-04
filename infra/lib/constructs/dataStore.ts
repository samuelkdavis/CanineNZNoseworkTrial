import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class DataStoreConstruct extends Construct {

    constructor(scope: Construct, id: string, props) {
        super(scope, id);
        const globalTable = new dynamodb.TableV2(this, 'GlobalTable', {
            partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
            // const table = new dynamodb.Table(this, 'MyTable', {
            //     partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
            // });
        }
        );
    }
}