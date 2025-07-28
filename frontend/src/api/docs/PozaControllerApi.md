# ApiDocumentation.PozaControllerApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createPozaUsingPOST**](PozaControllerApi.md#createPozaUsingPOST) | **POST** /poze | createPoza
[**deletePozaUsingDELETE**](PozaControllerApi.md#deletePozaUsingDELETE) | **DELETE** /poze/{id} | deletePoza
[**getAllPozeUsingGET**](PozaControllerApi.md#getAllPozeUsingGET) | **GET** /poze | getAllPoze
[**getPozaByIdUsingGET**](PozaControllerApi.md#getPozaByIdUsingGET) | **GET** /poze/{id} | getPozaById
[**getPozeByPlajaIdUsingGET**](PozaControllerApi.md#getPozeByPlajaIdUsingGET) | **GET** /poze/plaja/{plajaId} | getPozeByPlajaId
[**updatePozaUsingPUT**](PozaControllerApi.md#updatePozaUsingPUT) | **PUT** /poze/{id} | updatePoza



## createPozaUsingPOST

> Poza createPozaUsingPOST(poza)

createPoza

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.PozaControllerApi();
let poza = new ApiDocumentation.Poza(); // Poza | poza
apiInstance.createPozaUsingPOST(poza, (error, data, response) => {
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
 **poza** | [**Poza**](Poza.md)| poza | 

### Return type

[**Poza**](Poza.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## deletePozaUsingDELETE

> deletePozaUsingDELETE(id)

deletePoza

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.PozaControllerApi();
let id = 56; // Number | id
apiInstance.deletePozaUsingDELETE(id, (error, data, response) => {
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


## getAllPozeUsingGET

> [Poza] getAllPozeUsingGET()

getAllPoze

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.PozaControllerApi();
apiInstance.getAllPozeUsingGET((error, data, response) => {
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

[**[Poza]**](Poza.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getPozaByIdUsingGET

> Poza getPozaByIdUsingGET(id)

getPozaById

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.PozaControllerApi();
let id = 56; // Number | id
apiInstance.getPozaByIdUsingGET(id, (error, data, response) => {
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

[**Poza**](Poza.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getPozeByPlajaIdUsingGET

> [Poza] getPozeByPlajaIdUsingGET(plajaId)

getPozeByPlajaId

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.PozaControllerApi();
let plajaId = 56; // Number | plajaId
apiInstance.getPozeByPlajaIdUsingGET(plajaId, (error, data, response) => {
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
 **plajaId** | **Number**| plajaId | 

### Return type

[**[Poza]**](Poza.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## updatePozaUsingPUT

> Poza updatePozaUsingPUT(id, updatedPoza)

updatePoza

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.PozaControllerApi();
let id = 56; // Number | id
let updatedPoza = new ApiDocumentation.Poza(); // Poza | updatedPoza
apiInstance.updatePozaUsingPUT(id, updatedPoza, (error, data, response) => {
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
 **updatedPoza** | [**Poza**](Poza.md)| updatedPoza | 

### Return type

[**Poza**](Poza.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

