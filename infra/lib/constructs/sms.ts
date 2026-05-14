import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cr from "aws-cdk-lib/custom-resources";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";

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
            MonthlySpendLimit: "5", // USD
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
            MonthlySpendLimit: "10",
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

    // SNS topics for notifications (useful even when running the API locally).
    // If you want SMS delivered to phones via a topic, you'll typically publish to the topic and have
    // subscriptions/processing decide how to deliver. Direct-to-phone SMS is also supported via sns:Publish
    // with PhoneNumber (no topic required).
    const smsTopic = new sns.Topic(this, "SmsTopic", {
      topicName: `${props.namePrefix}-sms`,
      displayName: `${props.namePrefix} SMS`,
    });

    const smsSubscriberE164 =
      this.node.tryGetContext("smsSubscriberE164") ??
      process.env.SMS_SUBSCRIBER_E164 ??
      "";

    if (smsSubscriberE164) {
      if (!smsSubscriberE164.startsWith("+")) {
        throw new Error(
          `smsSubscriberE164 must be E.164 (start with '+'). Received: ${smsSubscriberE164}`
        );
      }
      smsTopic.addSubscription(new subscriptions.SmsSubscription(smsSubscriberE164));
      new cdk.CfnOutput(this, "SmsSubscriberE164", {
        value: smsSubscriberE164,
        description: "Phone number subscribed to the SMS topic (E.164).",
      });
    } else {
      new cdk.CfnOutput(this, "SmsSubscriberE164", {
        value: "(not set)",
        description:
          "No SMS subscriber configured. Set CDK context smsSubscriberE164 or env var SMS_SUBSCRIBER_E164 to auto-subscribe a phone.",
      });
    }

    const emailTopic = new sns.Topic(this, "EmailTopic", {
      topicName: `${props.namePrefix}-email`,
      displayName: `${props.namePrefix} Email`,
    });

    new cdk.CfnOutput(this, "SmsTopicArn", {
      value: smsTopic.topicArn,
      description: "SNS topic for SMS-related notifications (publish target).",
    });

    new cdk.CfnOutput(this, "EmailTopicArn", {
      value: emailTopic.topicArn,
      description: "SNS topic for email-related notifications (publish target).",
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
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["sns:Publish"],
          resources: [smsTopic.topicArn, emailTopic.topicArn],
        }),
      ],
    });

    new cdk.CfnOutput(this, "SmsPublishPolicyArn", {
      value: publishPolicy.managedPolicyArn,
      description: "Attach this policy to whatever runs the API to allow SNS SMS publish.",
    });
  }
}

