import * as cdk from 'aws-cdk-lib';

export default interface DogSportsProperties extends cdk.StackProps {
    namePrefix: string;
    identity: {
        callbackUrl: string;
        logoutUrl: string;
    }

}