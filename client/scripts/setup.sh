#!/bin/bash

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

function navigate_to_correct_directory() {
  cd "${0%/*}" # Directory where script lives
  cd ../src/config # client/src/config
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

function generate_config() {
  info "generating config file..."

  # Get all CloudFormation Outputs
  outputs=$(aws cloudformation describe-stacks --stack-name $STACK_NAME | jq '.Stacks | .[] |
    .Outputs | .[]')

  # ServiceEndpoint (API Gateway)
  service_endpoint=$(echo $outputs | jq --raw-output 'select(.OutputKey == "ServiceEndpoint") |
    .OutputValue')
  jq --null-input --arg SERVICE_ENDPOINT ${service_endpoint} '{ AwsApiGatewayInvokeUrl: $SERVICE_ENDPOINT }' > config.json
  success "Found Api Gateway Invoke Url"

  # User Pool Id
  user_pool_id=$(echo $outputs | jq --raw-output 'select(.OutputKey == "UserPoolId") | .OutputValue')
  jq  --arg USER_POOL_ID $user_pool_id '. + { UserPoolId: $USER_POOL_ID }' config.json > temp.json \
    && mv temp.json config.json
  success "Found User Pool Id"

  # User Pool Client Id
  user_pool_client_id=$(echo $outputs | jq --raw-output 'select(.OutputKey == "ReactAppClientId") | .OutputValue')
  jq --arg USER_POOL_CLIENT_ID $user_pool_client_id '. + { UserPoolClientId: $USER_POOL_CLIENT_ID }' config.json > temp.json \
    && mv temp.json config.json
  success "Found User Pool Client Id"

  # Identity Pool Id
  identity_pool_id=$(echo $outputs | jq --raw-output 'select(.OutputKey == "IdentityPoolId") | .OutputValue')
  jq --arg IDENTITY_POOL_ID $identity_pool_id '. + { IdentityPoolId: $IDENTITY_POOL_ID }' config.json > temp.json \
    && mv temp.json config.json
  success "Found Identity Pool Id"

  # IoT Endpoint
  iot_endpoint=$(aws iot describe-endpoint --endpoint-type iot:Data-ATS | jq '.endpointAddress')
  iot_endpoint=${iot_endpoint//\"}
  jq --arg IOT_ENDPOINT $iot_endpoint '. + { AwsIotHost: $IOT_ENDPOINT }' config.json > temp.json \
    && mv temp.json config.json
  success "Found IoT Endpint"

  # Region
  region=$(aws configure get region)
  jq --arg AWS_REGION $region '. + { AwsRegion: $AWS_REGION }' config.json > temp.json \
    && mv temp.json config.json
  success "Found Region"

  # LogLevel
  log_level=silent
  jq --arg LOG_LEVEL $log_level '. + { LogLevel: $LOG_LEVEL }' config.json > temp.json \
    && mv temp.json config.json
  success "Set log level"

  # Mqtt debug level
  mqtt_debug_level=false
  jq --arg MQTT_DEBUG_LEVEL $mqtt_debug_level '. + { MqttDebugLevel: $MQTT_DEBUG_LEVEL }' config.json > temp.json \
    && mv temp.json config.json
  success "Set MQTT Debug level"

  # Social App Ids
  facebook_app_id=$(echo $outputs | jq --raw-output 'select(.OutputKey == "FacebookAppId") | .OutputValue')
  google_app_id=$(echo $outputs | jq --raw-output 'select(.OutputKey == "GoogleAppId") | .OutputValue')
  jq --arg FACEBOOK_APP_ID $facebook_app_id \
     --arg GOOGLE_APP_ID $google_app_id \
     '. + { FacebookAppId: $FACEBOOK_APP_ID, GoogleAppId: $GOOGLE_APP_ID }' config.json > temp.json \
       && mv temp.json config.json
  success "Set social app ids"

  success "config file created"
}

navigate_to_correct_directory
check_aws
check_jq
check_stack
generate_config
