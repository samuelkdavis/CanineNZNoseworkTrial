import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { IdentityConstruct } from './constructs/identity';
import { DataStoreConstruct } from './constructs/dataStore';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new IdentityConstruct(this, "nosework-identity", {});
    new DataStoreConstruct(this, "nosework-data-store", {});
  }
}
