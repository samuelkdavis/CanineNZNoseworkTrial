import { Construct } from "constructs";
import * as cognito from 'aws-cdk-lib/aws-cognito';
import DogSportsProperties from "../../bin/dogSportsProperties";

export class IdentityConstruct extends Construct {

    constructor(scope: Construct, id: string, props: DogSportsProperties) {
        super(scope, id);

        const userPool = new cognito.UserPool(this, 'dev-nosework', {
            userPoolName: props.namePrefix + '-user-pool',
            signInCaseSensitive: false,
            selfSignUpEnabled: true,
            // userVerification: {
            //   emailStyle: cognito.VerificationEmailStyle.LINK,
            //   emailSubject: 'Invite to join our awesome app!',
            //   emailBody: 'You have been invited to join our awesome app! {##Verify Your Email##}',
            // },
            autoVerify: { email: true, phone: true },
        });

        const provider = new cognito.UserPoolIdentityProviderAmazon(this, 'Amazon', {
            userPool: userPool,
            clientId: 'amzn-client-id',
            clientSecret: 'amzn-client-secret',
        });

        const client = userPool.addClient('app-client', {
            supportedIdentityProviders: [
                cognito.UserPoolClientIdentityProvider.AMAZON,
            ],
        });

        client.node.addDependency(provider);
    }
}