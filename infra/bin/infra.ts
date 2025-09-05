#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InfraStack as DogSportsStack } from '../lib/infra-stack';

const app = new cdk.App();
const environment = "dev";
const applicationName = "dogSports";



new DogSportsStack(app, 'DogSports', {
    env: {
        account: '956470542728',
        region: 'ap-southeast-2',
    },
    namePrefix: `${environment}-${applicationName}`
});