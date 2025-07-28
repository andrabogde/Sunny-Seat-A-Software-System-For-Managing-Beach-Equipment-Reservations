# ApiDocumentation.StareEchipamentPlajaControllerApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**actualizeazaPartialUsingPATCH**](StareEchipamentPlajaControllerApi.md#actualizeazaPartialUsingPATCH) | **PATCH** /stari-echipamente-plaja/{id} | actualizeazaPartial
[**createStareEchipamentPlajaUsingPOST**](StareEchipamentPlajaControllerApi.md#createStareEchipamentPlajaUsingPOST) | **POST** /stari-echipamente-plaja | createStareEchipamentPlaja
[**deleteStareEchipamentPlajaUsingDELETE**](StareEchipamentPlajaControllerApi.md#deleteStareEchipamentPlajaUsingDELETE) | **DELETE** /stari-echipamente-plaja/{id} | deleteStareEchipamentPlaja
[**getAllStariEchipamentePlajaUsingGET**](StareEchipamentPlajaControllerApi.md#getAllStariEchipamentePlajaUsingGET) | **GET** /stari-echipamente-plaja | getAllStariEchipamentePlaja
[**getStareEchipamentPlajaByIdUsingGET**](StareEchipamentPlajaControllerApi.md#getStareEchipamentPlajaByIdUsingGET) | **GET** /stari-echipamente-plaja/{id} | getStareEchipamentPlajaById
[**updateStareEchipamentPlajaUsingPUT**](StareEchipamentPlajaControllerApi.md#updateStareEchipamentPlajaUsingPUT) | **PUT** /stari-echipamente-plaja/{id} | updateStareEchipamentPlaja



## actualizeazaPartialUsingPATCH

> StareEchipamentPlaja actualizeazaPartialUsingPATCH(id, dto)

actualizeazaPartial

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.StareEchipamentPlajaControllerApi();
let id = 56; // Number | id
let dto = new ApiDocumentation.StareEchipamentPlajaDTO(); // StareEchipamentPlajaDTO | dto
apiInstance.actualizeazaPartialUsingPATCH(id, dto, (error, data, response) => {
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
 **dto** | [**StareEchipamentPlajaDTO**](StareEchipamentPlajaDTO.md)| dto | 

### Return type

[**StareEchipamentPlaja**](StareEchipamentPlaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## createStareEchipamentPlajaUsingPOST

> StareEchipamentPlaja createStareEchipamentPlajaUsingPOST(stareEchipamentPlaja)

createStareEchipamentPlaja

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.StareEchipamentPlajaControllerApi();
let stareEchipamentPlaja = new ApiDocumentation.StareEchipamentPlaja(); // StareEchipamentPlaja | stareEchipamentPlaja
apiInstance.createStareEchipamentPlajaUsingPOST(stareEchipamentPlaja, (error, data, response) => {
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
 **stareEchipamentPlaja** | [**StareEchipamentPlaja**](StareEchipamentPlaja.md)| stareEchipamentPlaja | 

### Return type

[**StareEchipamentPlaja**](StareEchipamentPlaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## deleteStareEchipamentPlajaUsingDELETE

> deleteStareEchipamentPlajaUsingDELETE(id)

deleteStareEchipamentPlaja

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.StareEchipamentPlajaControllerApi();
let id = 56; // Number | id
apiInstance.deleteStareEchipamentPlajaUsingDELETE(id, (error, data, response) => {
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


## getAllStariEchipamentePlajaUsingGET

> [StareEchipamentPlaja] getAllStariEchipamentePlajaUsingGET()

getAllStariEchipamentePlaja

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.StareEchipamentPlajaControllerApi();
apiInstance.getAllStariEchipamentePlajaUsingGET((error, data, response) => {
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

[**[StareEchipamentPlaja]**](StareEchipamentPlaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getStareEchipamentPlajaByIdUsingGET

> StareEchipamentPlaja getStareEchipamentPlajaByIdUsingGET(id)

getStareEchipamentPlajaById

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.StareEchipamentPlajaControllerApi();
let id = 56; // Number | id
apiInstance.getStareEchipamentPlajaByIdUsingGET(id, (error, data, response) => {
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

[**StareEchipamentPlaja**](StareEchipamentPlaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## updateStareEchipamentPlajaUsingPUT

> StareEchipamentPlaja updateStareEchipamentPlajaUsingPUT(id, updatedStare)

updateStareEchipamentPlaja

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.StareEchipamentPlajaControllerApi();
let id = 56; // Number | id
let updatedStare = new ApiDocumentation.StareEchipamentPlaja(); // StareEchipamentPlaja | updatedStare
apiInstance.updateStareEchipamentPlajaUsingPUT(id, updatedStare, (error, data, response) => {
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
 **updatedStare** | [**StareEchipamentPlaja**](StareEchipamentPlaja.md)| updatedStare | 

### Return type

[**StareEchipamentPlaja**](StareEchipamentPlaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

