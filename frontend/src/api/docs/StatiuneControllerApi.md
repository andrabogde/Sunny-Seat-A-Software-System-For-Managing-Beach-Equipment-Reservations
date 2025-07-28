# ApiDocumentation.StatiuneControllerApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createStatiuneUsingPOST**](StatiuneControllerApi.md#createStatiuneUsingPOST) | **POST** /statiuni | createStatiune
[**deleteStatiuneUsingDELETE**](StatiuneControllerApi.md#deleteStatiuneUsingDELETE) | **DELETE** /statiuni/{id} | deleteStatiune
[**getAllStatiuniUsingGET**](StatiuneControllerApi.md#getAllStatiuniUsingGET) | **GET** /statiuni | getAllStatiuni
[**getStatiuneByIdUsingGET**](StatiuneControllerApi.md#getStatiuneByIdUsingGET) | **GET** /statiuni/{id} | getStatiuneById
[**patchStatiuneUsingPATCH**](StatiuneControllerApi.md#patchStatiuneUsingPATCH) | **PATCH** /statiuni/{id} | patchStatiune
[**updateStatiuneUsingPUT**](StatiuneControllerApi.md#updateStatiuneUsingPUT) | **PUT** /statiuni/{id} | updateStatiune



## createStatiuneUsingPOST

> Statiune createStatiuneUsingPOST(statiune)

createStatiune

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.StatiuneControllerApi();
let statiune = new ApiDocumentation.Statiune(); // Statiune | statiune
apiInstance.createStatiuneUsingPOST(statiune, (error, data, response) => {
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
 **statiune** | [**Statiune**](Statiune.md)| statiune | 

### Return type

[**Statiune**](Statiune.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## deleteStatiuneUsingDELETE

> deleteStatiuneUsingDELETE(id)

deleteStatiune

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.StatiuneControllerApi();
let id = 56; // Number | id
apiInstance.deleteStatiuneUsingDELETE(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| id | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


## getAllStatiuniUsingGET

> [Statiune] getAllStatiuniUsingGET()

getAllStatiuni

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.StatiuneControllerApi();
apiInstance.getAllStatiuniUsingGET((error, data, response) => {
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

[**[Statiune]**](Statiune.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getStatiuneByIdUsingGET

> Statiune getStatiuneByIdUsingGET(id)

getStatiuneById

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.StatiuneControllerApi();
let id = 56; // Number | id
apiInstance.getStatiuneByIdUsingGET(id, (error, data, response) => {
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
 **id** | **Number**| id | 

### Return type

[**Statiune**](Statiune.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## patchStatiuneUsingPATCH

> Statiune patchStatiuneUsingPATCH(id, patchDTO)

patchStatiune

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.StatiuneControllerApi();
let id = 56; // Number | id
let patchDTO = new ApiDocumentation.StatiuneDTO(); // StatiuneDTO | patchDTO
apiInstance.patchStatiuneUsingPATCH(id, patchDTO, (error, data, response) => {
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
 **id** | **Number**| id | 
 **patchDTO** | [**StatiuneDTO**](StatiuneDTO.md)| patchDTO | 

### Return type

[**Statiune**](Statiune.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateStatiuneUsingPUT

> Statiune updateStatiuneUsingPUT(id, updatedStatiune)

updateStatiune

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.StatiuneControllerApi();
let id = 56; // Number | id
let updatedStatiune = new ApiDocumentation.Statiune(); // Statiune | updatedStatiune
apiInstance.updateStatiuneUsingPUT(id, updatedStatiune, (error, data, response) => {
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
 **id** | **Number**| id | 
 **updatedStatiune** | [**Statiune**](Statiune.md)| updatedStatiune | 

### Return type

[**Statiune**](Statiune.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

