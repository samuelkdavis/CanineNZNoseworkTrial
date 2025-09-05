import { Construct } from "constructs";
import * as cognito from 'aws-cdk-lib/aws-cognito';
import DogSportsProperties from "../../bin/dogSportsProperties";
import { aws_cognito, CfnOutput } from "aws-cdk-lib";

export class IdentityConstruct extends Construct {

    constructor(scope: Construct, id: string, props: DogSportsProperties) {
        super(scope, id);

        const userPool = new cognito.UserPool(this, 'UserPool', {
            userPoolName: props.namePrefix + '-user-pool',
            signInCaseSensitive: false,
            selfSignUpEnabled: true,
            signInAliases: {
                email: true,
                username: true,
            },
            // userVerification: {
            //   emailStyle: cognito.VerificationEmailStyle.LINK,
            //   emailSubject: 'Invite to join our awesome app!',
            //   emailBody: 'You have been invited to join our awesome app! {##Verify Your Email##}',
            // },
            autoVerify: { email: true, phone: true },
        });

        // const provider = new cognito.UserPoolIdentityProviderAmazon(this, 'AmazonProvider', {
        //     userPool: userPool,
        //     clientId: 'amzn-client-id',
        //     clientSecret: 'amzn-client-secret'
        // });

        const client = userPool.addClient('AppClient', {
            userPoolClientName: props.namePrefix + '-app-client',
            // supportedIdentityProviders: [
            //     cognito.UserPoolClientIdentityProvider.AMAZON,
            // ],

            oAuth: {
                flows: {
                    authorizationCodeGrant: true
                },
                scopes: [
                    cognito.OAuthScope.EMAIL,
                    cognito.OAuthScope.PHONE,
                    cognito.OAuthScope.PROFILE,
                ],
                callbackUrls: [props.identity.callbackUrl],
                logoutUrls: [props.identity.logoutUrl],
            },
            authFlows: {
                userSrp: true,
                user: true
            },
        });

        // client.node.addDependency(provider);

        const domain = userPool.addDomain('CognitoDomain', {
            cognitoDomain: {
                domainPrefix: `dog-auth`, // Replace with your desired prefix
            },
            managedLoginVersion: cognito.ManagedLoginVersion.NEWER_MANAGED_LOGIN,
        });

        // domain.node.addDependency(provider);

        //todo add admin group

        new aws_cognito.CfnManagedLoginBranding(this, "ManagedLoginBranding", {
            userPoolId: userPool.userPoolId,
            clientId: client.userPoolClientId,
            returnMergedResources: true,
            useCognitoProvidedValues: true,
        });

        new CfnOutput(this, "UserPoolClientId", {
            value: client.userPoolClientId,
        });

        new CfnOutput(this, "UserPoolId", {
            value: userPool.userPoolId,
        });

        // new CfnOutput(this, "UserPoolCustomDomain", {
        //     value: domainName,
        // });
    }
}