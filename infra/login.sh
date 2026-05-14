#!/bin/bash

# on initial setup, have a ~/.aws/credentials file with a [default] profile with the long term creds.
# use `aws configure` to set up a user with the default profile`
# call with `. ./infra/login.sh <MFA_TOKEN>`. If you leave off the first dot the env vars wont be set in your current shell.
# Make sure to use the AWS CLI mfa code, not the AWS console one.

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    echo "ERROR: This script must be sourced, not executed."
    echo "Run it as: . ./infra/login.sh <MFA_TOKEN>"
    exit 1
fi
export AWS_PROFILE=default
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

echo "AWS access may be blocked by the IP whitelist."