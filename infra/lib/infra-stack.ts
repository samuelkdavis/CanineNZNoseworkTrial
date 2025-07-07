import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cognito-readme.html
    const userPool = new cognito.UserPool(this, 'dev-nosework', {
      userPoolName: 'dev-nosework-userpool',
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


    const myFunction = new lambda.Function(this, "HelloWorldFunction", {
      runtime: lambda.Runtime.NODEJS_20_X, // Provide any supported Node.js runtime
      handler: "index.handler",
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          return {
            statusCode: 200,
            body: JSON.stringify('Hello World!'),
          };
        };
      `),
    });
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'InfraQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
