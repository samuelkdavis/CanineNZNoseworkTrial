#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InfraStack as DogSportsStack } from '../lib/infra-stack';
import DogSportsProperties from './dogSportsProperties';
const app = new cdk.App();
const environment = "dev";
const applicationName = "dogSports";
const callbackUrl = "http://localhost:5173";
const logoutUrl = "http://localhost:5173";

const props: DogSportsProperties = {
    env: {
        account: '956470542728',
        region: 'ap-southeast-2',
    },
    namePrefix: `${environment}-${applicationName}`,
    identity: {
        callbackUrl: callbackUrl,
        logoutUrl: logoutUrl,
    }
};

new DogSportsStack(app, 'DogSports', props);