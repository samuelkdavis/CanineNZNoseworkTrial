import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { IdentityConstruct } from './constructs/identity';
import { DataStoreConstruct } from './constructs/dataStore';
import DogSportsProperties from '../bin/dogSportsProperties';

export class InfraStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: DogSportsProperties) {
        super(scope, id, props);
        new IdentityConstruct(this, "Identity", props);
        new DataStoreConstruct(this, "DataStore", props);
    }
}
