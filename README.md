# Introduction
This is a template for creating lambdas using DynamoDB using [serverless](https://serverless.com). 

## Lambdas
Using this template you can create multiple lambda functions on your local machine.

## DynamoDB
Using this template you can create tables in DynamoDB without using the AWS Management Console.

## IAM
Using this template you can create an IAM role which will allow you to access your tables in dynamodb from lambda.

## Commands
List of commands you might want to know

---

### Creating a new project using the template
```
serverless create --template-path ../local-path-to-your-template --path name-of-your-project
```

### Create a new function
```
sls create function -f functionName --handler src/functions/functionName.functionName
```

### Testing
Using [jest](https://jestjs.io) for testing and you test by running the command below
```
yarn run jest
```