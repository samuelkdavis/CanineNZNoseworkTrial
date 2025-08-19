# How to run

```
cd frontend
npm install
npm run dev
```

# Technology
vite, react

# Steps so far

``` bash
npm create vite@latest

cd infra
npm init
cdk init app --language=typescript
```


# Notes
older versions of node may have issues

https://medium.com/@johnelisaaa/setting-up-amazon-cognito-for-your-react-app-787de7999c07
Jira project: https://samuelkdavis.atlassian.net/jira/software/projects/BROWSE/boards/3/backlog

How to show/hide UI elements based on permissions: https://dezoito.github.io/2021/09/09/react-mirror-backend-permissions.html

Use react router middleware at some point: https://www.reddit.com/r/reactjs/comments/1j5rcy4/react_router_middleware_is_here/ - currently unstable

add claims to cognito token - pre-token generation lambda trigger:
You can customize the access and ID tokens that Amazon Cognito passes to your app. In a Pre token generation Lambda trigger, you can add, modify, and suppress token claims. The pre token generation trigger is a Lambda function that Amazon Cognito sends a default set of claims to. The claims include OAuth 2.0 scopes, user pool group membership, user attributes, and others. The function can then take the opportunity to make changes at runtime and return updated token claims to Amazon Cognito.


To inject the correct aws profile for local development:
* Add the developer profile to appsettings.Development.json
* Add AWS support boilerplate in program.cs
* Use dependency injection to resolve dynamodb and other resources

Roles:
* developer (me)
* admin (kelly, supreet)
* staff (scent squad)
* guests (default)
Add /debug screen