import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cr from "aws-cdk-lib/custom-resources";

import DogSportsProperties from "../../bin/dogSportsProperties";

export class SmsConstruct extends Construct {
  constructor(scope: Construct, id: string, props: DogSportsProperties) {
    super(scope, id);

    // SNS "SMS Preferences" are account-level settings (region-scoped).
    // CloudFormation doesn't provide a universally-supported resource type for this,
    // so we set the preferences via a custom resource calling SNS SetSMSAttributes.
    //
    // This does not create any topics; SMS is sent via sns:Publish to phone numbers.
    new cr.AwsCustomResource(this, "SmsPreferences", {
      onCreate: {
        service: "SNS",
        action: "setSMSAttributes",
        parameters: {
          attributes: {
            DefaultSMSType: "Transactional",
            DefaultSenderID: "Nosework",
            MonthlySpendLimit: "1", // USD; keep low for dev safety
          },
        },
        physicalResourceId: cr.PhysicalResourceId.of(`${props.namePrefix}-sms-preferences`),
      },
      onUpdate: {
        service: "SNS",
        action: "setSMSAttributes",
        parameters: {
          attributes: {
            DefaultSMSType: "Transactional",
            DefaultSenderID: "Nosework",
            MonthlySpendLimit: "1",
          },
        },
        physicalResourceId: cr.PhysicalResourceId.of(`${props.namePrefix}-sms-preferences`),
      },
      policy: cr.AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["sns:SetSMSAttributes"],
          resources: ["*"],
        }),
      ]),
    });

    // For publishing SMS directly to phone numbers, the action is sns:Publish and the resource must be "*".
    const publishPolicy = new iam.ManagedPolicy(this, "SmsPublishPolicy", {
      managedPolicyName: `${props.namePrefix}-sns-sms-publish`,
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["sns:Publish"],
          resources: ["*"],
        }),
      ],
    });

    new cdk.CfnOutput(this, "SmsPublishPolicyArn", {
      value: publishPolicy.managedPolicyArn,
      description: "Attach this policy to whatever runs the API to allow SNS SMS publish.",
    });
  }
}

