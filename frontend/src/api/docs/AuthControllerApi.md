# ApiDocumentation.AuthControllerApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**activateUserAccountUsingPOST**](AuthControllerApi.md#activateUserAccountUsingPOST) | **POST** /auth/activate-account | activateUserAccount
[**authenticateUserUsingPOST**](AuthControllerApi.md#authenticateUserUsingPOST) | **POST** /auth/login | authenticateUser
[**confirmEmailChangeUsingPOST**](AuthControllerApi.md#confirmEmailChangeUsingPOST) | **POST** /auth/confirm-email-change | confirmEmailChange
[**forgottenPasswordUsingPOST**](AuthControllerApi.md#forgottenPasswordUsingPOST) | **POST** /auth/forgotten-password | forgottenPassword
[**loginRecoveryCodeUsingPOST**](AuthControllerApi.md#loginRecoveryCodeUsingPOST) | **POST** /auth/login/recovery-code | loginRecoveryCode
[**passwordResetUsingPOST**](AuthControllerApi.md#passwordResetUsingPOST) | **POST** /auth/password-reset | passwordReset
[**refreshAuthUsingGET**](AuthControllerApi.md#refreshAuthUsingGET) | **GET** /auth/access-token | refreshAuth
[**registerUserUsingPOST**](AuthControllerApi.md#registerUserUsingPOST) | **POST** /auth/signup | registerUser
[**verifyLoginUsingPOST**](AuthControllerApi.md#verifyLoginUsingPOST) | **POST** /auth/login/verify | verifyLogin



## activateUserAccountUsingPOST

> Object activateUserAccountUsingPOST(tokenAccessRequestDto)

activateUserAccount

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.AuthControllerApi();
let tokenAccessRequestDto = new ApiDocumentation.TokenAccessRequestDto(); // TokenAccessRequestDto | tokenAccessRequestDto
apiInstance.activateUserAccountUsingPOST(tokenAccessRequestDto, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tokenAccessRequestDto** | [**TokenAccessRequestDto**](TokenAccessRequestDto.md)| tokenAccessRequestDto | 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## authenticateUserUsingPOST

> AuthResponseDto authenticateUserUsingPOST(loginRequestDto)

authenticateUser

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.AuthControllerApi();
let loginRequestDto = new ApiDocumentation.LoginRequestDto(); // LoginRequestDto | loginRequestDto
apiInstance.authenticateUserUsingPOST(loginRequestDto, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **loginRequestDto** | [**LoginRequestDto**](LoginRequestDto.md)| loginRequestDto | 

### Return type

[**AuthResponseDto**](AuthResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## confirmEmailChangeUsingPOST

> Object confirmEmailChangeUsingPOST(tokenAccessRequestDto)

confirmEmailChange

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.AuthControllerApi();
let tokenAccessRequestDto = new ApiDocumentation.TokenAccessRequestDto(); // TokenAccessRequestDto | tokenAccessRequestDto
apiInstance.confirmEmailChangeUsingPOST(tokenAccessRequestDto, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tokenAccessRequestDto** | [**TokenAccessRequestDto**](TokenAccessRequestDto.md)| tokenAccessRequestDto | 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## forgottenPasswordUsingPOST

> Object forgottenPasswordUsingPOST(forgottenPasswordRequestDto)

forgottenPassword

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.AuthControllerApi();
let forgottenPasswordRequestDto = new ApiDocumentation.ForgottenPasswordRequestDto(); // ForgottenPasswordRequestDto | forgottenPasswordRequestDto
apiInstance.forgottenPasswordUsingPOST(forgottenPasswordRequestDto, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **forgottenPasswordRequestDto** | [**ForgottenPasswordRequestDto**](ForgottenPasswordRequestDto.md)| forgottenPasswordRequestDto | 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## loginRecoveryCodeUsingPOST

> AuthResponseDto loginRecoveryCodeUsingPOST(loginVerificationRequestDto)

loginRecoveryCode

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.AuthControllerApi();
let loginVerificationRequestDto = new ApiDocumentation.LoginVerificationRequestDto(); // LoginVerificationRequestDto | loginVerificationRequestDto
apiInstance.loginRecoveryCodeUsingPOST(loginVerificationRequestDto, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **loginVerificationRequestDto** | [**LoginVerificationRequestDto**](LoginVerificationRequestDto.md)| loginVerificationRequestDto | 

### Return type

[**AuthResponseDto**](AuthResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## passwordResetUsingPOST

> Object passwordResetUsingPOST(passwordResetRequestDto)

passwordReset

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.AuthControllerApi();
let passwordResetRequestDto = new ApiDocumentation.PasswordResetRequestDto(); // PasswordResetRequestDto | passwordResetRequestDto
apiInstance.passwordResetUsingPOST(passwordResetRequestDto, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **passwordResetRequestDto** | [**PasswordResetRequestDto**](PasswordResetRequestDto.md)| passwordResetRequestDto | 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## refreshAuthUsingGET

> TokenResponseDto refreshAuthUsingGET()

refreshAuth

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.AuthControllerApi();
apiInstance.refreshAuthUsingGET((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**TokenResponseDto**](TokenResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## registerUserUsingPOST

> Object registerUserUsingPOST(signUpRequestDto)

registerUser

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.AuthControllerApi();
let signUpRequestDto = new ApiDocumentation.SignUpRequestDto(); // SignUpRequestDto | signUpRequestDto
apiInstance.registerUserUsingPOST(signUpRequestDto, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **signUpRequestDto** | [**SignUpRequestDto**](SignUpRequestDto.md)| signUpRequestDto | 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## verifyLoginUsingPOST

> AuthResponseDto verifyLoginUsingPOST(loginVerificationRequestDto)

verifyLogin

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.AuthControllerApi();
let loginVerificationRequestDto = new ApiDocumentation.LoginVerificationRequestDto(); // LoginVerificationRequestDto | loginVerificationRequestDto
apiInstance.verifyLoginUsingPOST(loginVerificationRequestDto, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **loginVerificationRequestDto** | [**LoginVerificationRequestDto**](LoginVerificationRequestDto.md)| loginVerificationRequestDto | 

### Return type

[**AuthResponseDto**](AuthResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

