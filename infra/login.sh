#!/bin/bash

# call with `. ./infra/login.sh <MFA_TOKEN>`. If you leave off the first dot the env vars wont be set in your current shell.

mfa_token=$1
CREDENTIALS=$(aws sts get-session-token --serial-number "arn:aws:iam::956470542728:mfa/ProtonPass" --output json --token-code $mfa_token)

ACCESS_KEY_ID=$(echo "$CREDENTIALS" | jq -r '.Credentials.AccessKeyId')
SECRET_ACCESS_KEY=$(echo "$CREDENTIALS" | jq -r '.Credentials.SecretAccessKey')
SESSION_TOKEN=$(echo "$CREDENTIALS" | jq -r '.Credentials.SessionToken')
EXPIRATION=$(echo "$CREDENTIALS" | jq -r '.Credentials.Expiration')

echo "Temporary credentials obtained:"
echo "Access Key ID: $ACCESS_KEY_ID"
echo "Expiration: $EXPIRATION"

PROFILE_NAME="developer"

# Should be saved in ~/.aws/credentials
aws configure set aws_access_key_id "$ACCESS_KEY_ID" --profile "$PROFILE_NAME"
aws configure set aws_secret_access_key "$SECRET_ACCESS_KEY" --profile "$PROFILE_NAME"
aws configure set aws_session_token "$SESSION_TOKEN" --profile "$PROFILE_NAME"

export AWS_PROFILE=$PROFILE_NAME
echo "AWS_PROFILE set to $PROFILE_NAME"