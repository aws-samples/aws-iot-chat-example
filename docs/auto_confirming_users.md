# Auto Confirming Users

First off, we write our Lambda function that will confirm a user.

```js
// api/src/user/confirm.js
export const main = async (event, context, callback) => {
  event.response.autoConfirmUser = true;
  callback(null, event);
};
```

Next, we define our Lambda function in `serverless.yml`

```diff
# api/serverless.yml
resources:
  Resources:
+   AutoConfirmUser:
+     handler: src/user/confirm.main
```

We will use a post-deploy script to add the user pool PreSignUp trigger. This trigger will invoke our Lambda function.

```
$ npm install --save serverless-hooks-plugin
```

```diff
# api/serverless.yml
plugins:
+ - serverless-hooks-plugin

custom:
+ hooks:
+   after:aws:deploy:finalize:cleanup:
+     - ./scripts/attachConfirmUserTrigger.sh
```

Export the Lambda function ARN and user pool id as a CloudFormation outputs that can be queried by a script.

```diff
# api/serverless.yml
resources:
  Outputs:
+   UserPoolId:
+     Description: "The ID of the user pool that is created."
+     Value:
+       Ref: UserPool

+   AutoConfirmUserFnArn:
+     Description: "The ARN of the Auto Confirm User Lambda function"
+     Value:
+       Fn::GetAtt:
+         - AutoConfirmUserLambdaFunction
+         - Arn
```

The following bash function retrieves the lambda function ARN and updates the user pool's triggers.

```sh
# api/scripts/attachConfirmUserTrigger.sh
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
```

One last step is that we must give Amazon Cognito permission to invoke the Lambda function.

```diff
# api/serverless.yml
resources:
  Resources:
+   ConfirmUserInvocationPermission:
+     Type: AWS::Lambda::Permission
+     Properties:
+       Action: lambda:InvokeFunction
+       FunctionName:
+         Fn::GetAtt: AutoConfirmUserLambdaFunction.Arn
+       Principal: cognito-idp.amazonaws.com
+       SourceArn:
+         Fn::GetAtt: UserPool.Arn
```

Now, whenever a user registers a new account, the PreSignUp trigger on the user pool will invoke the AutoConfirmUser lambda function which will mark the user as confirmed, allowing him/her to log into the application without going through the MFA flow.
