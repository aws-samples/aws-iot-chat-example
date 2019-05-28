#!/bin/bash

# To tear down the stack, we must detach principals from policies. This script will be run as a before:remove hook to prevent the following error
# An error occurred: PublicSubscribePolicy - The policy cannot be deleted as the policy is attached to one or more principals (name=PublicSubscribePolicy).

AWS_PROFILE_NAME=$1

function fail() {
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

function detach_policies() {
  info "Fetching list of policies"
  policies=$(aws iot list-policies | jq --raw-output '.policies | .[] | .policyName')
  success "Got list of policies"

  for policy in $policies; do
    if ! [[ $policy =~ ^IotChat ]]; then
      info "Skipping $policy because it is not for iot-chat-app"
      continue
    fi
    info "Fetching list of targets for $policy"
    targets=$(aws iot list-targets-for-policy --policy-name $policy --profile $AWS_PROFILE_NAME | jq --raw-output '.targets | .[]')
    success "Got list of targets for $policy"

    for full_target in $targets; do
      target=$(echo $full_target | sed -n 's/^[0-9]*://p')

      info "Detaching $policy from $target"

      aws iot detach-policy --policy-name $policy --target $target --profile $AWS_PROFILE_NAME
      success "Detached $policy from $target"
    done

    info "Deleting $policy"
    aws iot delete-policy --policy-name $policy --profile $AWS_PROFILE_NAME
    success "Deleted $policy"
  done
}

check_aws
check_jq
detach_policies
