##!/bin/bash

# This script is used until a bug regarding Cognito User Pools in serverless is fixed
# https://github.com/serverless/serverless/pull/3799

STACK_NAME="iot-chat-api-prod"

function fail(){
  tput setaf 1; echo "Failure: $*" && tput sgr0
  exit 1
}

function info() {
  tput setaf 6; echo "$*" && tput sgr0
}

function success() {
  tput setaf 2; echo "$*" && tput sgr0
}

function check_aws() {
  info "checking aws cli configuration..."

	if ! [ -f ~/.aws/config ]; then
		if ! [ -f ~/.aws/credentials ]; then
			fail "AWS config not found or CLI not installed. Please run \"aws configure\"."
		fi
	fi

  success "aws cli is configured"
}

function check_jq() {
  info "checking if jq is installed..."

  if ! [ -x "$(command -v jq)" ]; then
    fail "jq is not installed."
  fi

  success "jq is installed"
}

function check_stack() {
  info "checking if $STACK_NAME exists..."

  summaries=$(aws cloudformation list-stacks | jq --arg STACK_NAME "$STACK_NAME" '.StackSummaries |
    .[] | select((.StackName ==
  $STACK_NAME) and ((.StackStatus == "CREATE_COMPLETE") or (.StackStatus == "UPDATE_COMPLETE")))')
  if [ -z "$summaries" ]
  then
    fail "The StackStatus of '$STACK_NAME' is not CREATE_COMPLETE or UPDATE_COMPLETE"
  fi

  success "$STACK_NAME exists"
}

function attach_trigger() {
  info "Attaching autoConfirmUser Lambda as PreSignUp trigger"

  # Get all CloudFormation Outputs
  outputs=$(aws cloudformation describe-stacks --stack-name $STACK_NAME | jq '.Stacks | .[] |
    .Outputs | .[]')
  user_pool_id=$(echo $outputs | jq --raw-output 'select(.OutputKey == "UserPoolId") | .OutputValue')
  lambda_arn=$(echo $outputs | jq --raw-output 'select(.OutputKey == "AutoConfirmUserFnArn") | .OutputValue')

  aws cognito-idp update-user-pool --user-pool-id ${user_pool_id} --lambda-config PreSignUp=${lambda_arn}
  success "Attached PreSignUp trigger"
}

check_aws
check_jq
check_stack
attach_trigger
