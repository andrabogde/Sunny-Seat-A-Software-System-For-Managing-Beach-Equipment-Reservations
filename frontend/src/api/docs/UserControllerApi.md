# ApiDocumentation.UserControllerApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**cancelAccountUsingPOST**](UserControllerApi.md#cancelAccountUsingPOST) | **POST** /cancel-account | cancelAccount
[**changePasswordUsingPOST**](UserControllerApi.md#changePasswordUsingPOST) | **POST** /change-password | changePassword
[**disableTwoFactorUsingPUT**](UserControllerApi.md#disableTwoFactorUsingPUT) | **PUT** /disable-two-factor | disableTwoFactor
[**getCurrentUserUsingGET**](UserControllerApi.md#getCurrentUserUsingGET) | **GET** /user/me | getCurrentUser
[**getPlaceDetailsUsingGET**](UserControllerApi.md#getPlaceDetailsUsingGET) | **GET** /test | getPlaceDetails
[**getTwoFactorSetupUsingPOST**](UserControllerApi.md#getTwoFactorSetupUsingPOST) | **POST** /two-factor-setup | getTwoFactorSetup
[**logoutUsingPOST**](UserControllerApi.md#logoutUsingPOST) | **POST** /logout | logout
[**updateProfileUsingPUT**](UserControllerApi.md#updateProfileUsingPUT) | **PUT** /update-profile | updateProfile
[**verifyTwoFactorUsingPOST**](UserControllerApi.md#verifyTwoFactorUsingPOST) | **POST** /verify-two-factor | verifyTwoFactor



## cancelAccountUsingPOST

> Object cancelAccountUsingPOST(opts)

cancelAccount

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.UserControllerApi();
let opts = {
  'accountNonExpired': true, // Boolean | 
  'accountNonLocked': true, // Boolean | 
  'attributes': {key: null}, // Object | 
  'authorities0Authority': "authorities0Authority_example", // String | 
  'credentialsNonExpired': true, // Boolean | 
  'email': "email_example", // String | 
  'enabled': true, // Boolean | 
  'id': 789, // Number | 
  'name': "name_example", // String | 
  'password': "password_example", // String | 
  'username': "username_example" // String | 
};
apiInstance.cancelAccountUsingPOST(opts, (error, data, response) => {
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
 **accountNonExpired** | **Boolean**|  | [optional] 
 **accountNonLocked** | **Boolean**|  | [optional] 
 **attributes** | [**Object**](.md)|  | [optional] 
 **authorities0Authority** | **String**|  | [optional] 
 **credentialsNonExpired** | **Boolean**|  | [optional] 
 **email** | **String**|  | [optional] 
 **enabled** | **Boolean**|  | [optional] 
 **id** | **Number**|  | [optional] 
 **name** | **String**|  | [optional] 
 **password** | **String**|  | [optional] 
 **username** | **String**|  | [optional] 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## changePasswordUsingPOST

> Object changePasswordUsingPOST(changePasswordDto, opts)

changePassword

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.UserControllerApi();
let changePasswordDto = new ApiDocumentation.ChangePasswordDto(); // ChangePasswordDto | changePasswordDto
let opts = {
  'accountNonExpired': true, // Boolean | 
  'accountNonLocked': true, // Boolean | 
  'attributes': {key: null}, // Object | 
  'authorities0Authority': "authorities0Authority_example", // String | 
  'credentialsNonExpired': true, // Boolean | 
  'email': "email_example", // String | 
  'enabled': true, // Boolean | 
  'id': 789, // Number | 
  'name': "name_example", // String | 
  'password': "password_example", // String | 
  'username': "username_example" // String | 
};
apiInstance.changePasswordUsingPOST(changePasswordDto, opts, (error, data, response) => {
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
 **changePasswordDto** | [**ChangePasswordDto**](ChangePasswordDto.md)| changePasswordDto | 
 **accountNonExpired** | **Boolean**|  | [optional] 
 **accountNonLocked** | **Boolean**|  | [optional] 
 **attributes** | [**Object**](.md)|  | [optional] 
 **authorities0Authority** | **String**|  | [optional] 
 **credentialsNonExpired** | **Boolean**|  | [optional] 
 **email** | **String**|  | [optional] 
 **enabled** | **Boolean**|  | [optional] 
 **id** | **Number**|  | [optional] 
 **name** | **String**|  | [optional] 
 **password** | **String**|  | [optional] 
 **username** | **String**|  | [optional] 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## disableTwoFactorUsingPUT

> Object disableTwoFactorUsingPUT(opts)

disableTwoFactor

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.UserControllerApi();
let opts = {
  'accountNonExpired': true, // Boolean | 
  'accountNonLocked': true, // Boolean | 
  'attributes': {key: null}, // Object | 
  'authorities0Authority': "authorities0Authority_example", // String | 
  'credentialsNonExpired': true, // Boolean | 
  'email': "email_example", // String | 
  'enabled': true, // Boolean | 
  'id': 789, // Number | 
  'name': "name_example", // String | 
  'password': "password_example", // String | 
  'username': "username_example" // String | 
};
apiInstance.disableTwoFactorUsingPUT(opts, (error, data, response) => {
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
 **accountNonExpired** | **Boolean**|  | [optional] 
 **accountNonLocked** | **Boolean**|  | [optional] 
 **attributes** | [**Object**](.md)|  | [optional] 
 **authorities0Authority** | **String**|  | [optional] 
 **credentialsNonExpired** | **Boolean**|  | [optional] 
 **email** | **String**|  | [optional] 
 **enabled** | **Boolean**|  | [optional] 
 **id** | **Number**|  | [optional] 
 **name** | **String**|  | [optional] 
 **password** | **String**|  | [optional] 
 **username** | **String**|  | [optional] 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getCurrentUserUsingGET

> UserDto getCurrentUserUsingGET(opts)

getCurrentUser

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.UserControllerApi();
let opts = {
  'accountNonExpired': true, // Boolean | 
  'accountNonLocked': true, // Boolean | 
  'attributes': {key: null}, // Object | 
  'authorities0Authority': "authorities0Authority_example", // String | 
  'credentialsNonExpired': true, // Boolean | 
  'email': "email_example", // String | 
  'enabled': true, // Boolean | 
  'id': 789, // Number | 
  'name': "name_example", // String | 
  'password': "password_example", // String | 
  'username': "username_example" // String | 
};
apiInstance.getCurrentUserUsingGET(opts, (error, data, response) => {
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
 **accountNonExpired** | **Boolean**|  | [optional] 
 **accountNonLocked** | **Boolean**|  | [optional] 
 **attributes** | [**Object**](.md)|  | [optional] 
 **authorities0Authority** | **String**|  | [optional] 
 **credentialsNonExpired** | **Boolean**|  | [optional] 
 **email** | **String**|  | [optional] 
 **enabled** | **Boolean**|  | [optional] 
 **id** | **Number**|  | [optional] 
 **name** | **String**|  | [optional] 
 **password** | **String**|  | [optional] 
 **username** | **String**|  | [optional] 

### Return type

[**UserDto**](UserDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getPlaceDetailsUsingGET

> Object getPlaceDetailsUsingGET()

getPlaceDetails

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.UserControllerApi();
apiInstance.getPlaceDetailsUsingGET((error, data, response) => {
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

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getTwoFactorSetupUsingPOST

> TwoFactorSetupDto getTwoFactorSetupUsingPOST(opts)

getTwoFactorSetup

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.UserControllerApi();
let opts = {
  'accountNonExpired': true, // Boolean | 
  'accountNonLocked': true, // Boolean | 
  'attributes': {key: null}, // Object | 
  'authorities0Authority': "authorities0Authority_example", // String | 
  'credentialsNonExpired': true, // Boolean | 
  'email': "email_example", // String | 
  'enabled': true, // Boolean | 
  'id': 789, // Number | 
  'name': "name_example", // String | 
  'password': "password_example", // String | 
  'username': "username_example" // String | 
};
apiInstance.getTwoFactorSetupUsingPOST(opts, (error, data, response) => {
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
 **accountNonExpired** | **Boolean**|  | [optional] 
 **accountNonLocked** | **Boolean**|  | [optional] 
 **attributes** | [**Object**](.md)|  | [optional] 
 **authorities0Authority** | **String**|  | [optional] 
 **credentialsNonExpired** | **Boolean**|  | [optional] 
 **email** | **String**|  | [optional] 
 **enabled** | **Boolean**|  | [optional] 
 **id** | **Number**|  | [optional] 
 **name** | **String**|  | [optional] 
 **password** | **String**|  | [optional] 
 **username** | **String**|  | [optional] 

### Return type

[**TwoFactorSetupDto**](TwoFactorSetupDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## logoutUsingPOST

> Object logoutUsingPOST(opts)

logout

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.UserControllerApi();
let opts = {
  'accountNonExpired': true, // Boolean | 
  'accountNonLocked': true, // Boolean | 
  'attributes': {key: null}, // Object | 
  'authorities0Authority': "authorities0Authority_example", // String | 
  'credentialsNonExpired': true, // Boolean | 
  'email': "email_example", // String | 
  'enabled': true, // Boolean | 
  'id': 789, // Number | 
  'name': "name_example", // String | 
  'password': "password_example", // String | 
  'username': "username_example" // String | 
};
apiInstance.logoutUsingPOST(opts, (error, data, response) => {
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
 **accountNonExpired** | **Boolean**|  | [optional] 
 **accountNonLocked** | **Boolean**|  | [optional] 
 **attributes** | [**Object**](.md)|  | [optional] 
 **authorities0Authority** | **String**|  | [optional] 
 **credentialsNonExpired** | **Boolean**|  | [optional] 
 **email** | **String**|  | [optional] 
 **enabled** | **Boolean**|  | [optional] 
 **id** | **Number**|  | [optional] 
 **name** | **String**|  | [optional] 
 **password** | **String**|  | [optional] 
 **username** | **String**|  | [optional] 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## updateProfileUsingPUT

> Object updateProfileUsingPUT(userDto, opts)

updateProfile

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.UserControllerApi();
let userDto = new ApiDocumentation.UserDto(); // UserDto | userDto
let opts = {
  'accountNonExpired': true, // Boolean | 
  'accountNonLocked': true, // Boolean | 
  'attributes': {key: null}, // Object | 
  'authorities0Authority': "authorities0Authority_example", // String | 
  'credentialsNonExpired': true, // Boolean | 
  'email': "email_example", // String | 
  'enabled': true, // Boolean | 
  'id': 789, // Number | 
  'name': "name_example", // String | 
  'password': "password_example", // String | 
  'username': "username_example" // String | 
};
apiInstance.updateProfileUsingPUT(userDto, opts, (error, data, response) => {
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
 **userDto** | [**UserDto**](UserDto.md)| userDto | 
 **accountNonExpired** | **Boolean**|  | [optional] 
 **accountNonLocked** | **Boolean**|  | [optional] 
 **attributes** | [**Object**](.md)|  | [optional] 
 **authorities0Authority** | **String**|  | [optional] 
 **credentialsNonExpired** | **Boolean**|  | [optional] 
 **email** | **String**|  | [optional] 
 **enabled** | **Boolean**|  | [optional] 
 **id** | **Number**|  | [optional] 
 **name** | **String**|  | [optional] 
 **password** | **String**|  | [optional] 
 **username** | **String**|  | [optional] 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## verifyTwoFactorUsingPOST

> TwoFactorDto verifyTwoFactorUsingPOST(twoFactorVerificationRequestDto, opts)

verifyTwoFactor

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.UserControllerApi();
let twoFactorVerificationRequestDto = new ApiDocumentation.TwoFactorVerificationRequestDto(); // TwoFactorVerificationRequestDto | twoFactorVerificationRequestDto
let opts = {
  'accountNonExpired': true, // Boolean | 
  'accountNonLocked': true, // Boolean | 
  'attributes': {key: null}, // Object | 
  'authorities0Authority': "authorities0Authority_example", // String | 
  'credentialsNonExpired': true, // Boolean | 
  'email': "email_example", // String | 
  'enabled': true, // Boolean | 
  'id': 789, // Number | 
  'name': "name_example", // String | 
  'password': "password_example", // String | 
  'username': "username_example" // String | 
};
apiInstance.verifyTwoFactorUsingPOST(twoFactorVerificationRequestDto, opts, (error, data, response) => {
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
 **twoFactorVerificationRequestDto** | [**TwoFactorVerificationRequestDto**](TwoFactorVerificationRequestDto.md)| twoFactorVerificationRequestDto | 
 **accountNonExpired** | **Boolean**|  | [optional] 
 **accountNonLocked** | **Boolean**|  | [optional] 
 **attributes** | [**Object**](.md)|  | [optional] 
 **authorities0Authority** | **String**|  | [optional] 
 **credentialsNonExpired** | **Boolean**|  | [optional] 
 **email** | **String**|  | [optional] 
 **enabled** | **Boolean**|  | [optional] 
 **id** | **Number**|  | [optional] 
 **name** | **String**|  | [optional] 
 **password** | **String**|  | [optional] 
 **username** | **String**|  | [optional] 

### Return type

[**TwoFactorDto**](TwoFactorDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

