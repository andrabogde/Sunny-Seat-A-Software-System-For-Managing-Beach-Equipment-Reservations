# ApiDocumentation.EchipamentPlajaControllerApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createEchipamentPlajaUsingPOST**](EchipamentPlajaControllerApi.md#createEchipamentPlajaUsingPOST) | **POST** /echipamente-plaja | createEchipamentPlaja
[**deleteEchipamentPlajaByPlajaIdUsingDELETE**](EchipamentPlajaControllerApi.md#deleteEchipamentPlajaByPlajaIdUsingDELETE) | **DELETE** /echipamente-plaja/by-plaja/{plajaId} | deleteEchipamentPlajaByPlajaId
[**deleteEchipamentPlajaUsingDELETE**](EchipamentPlajaControllerApi.md#deleteEchipamentPlajaUsingDELETE) | **DELETE** /echipamente-plaja/{id} | deleteEchipamentPlaja
[**getAllEchipamentePlajaUsingGET**](EchipamentPlajaControllerApi.md#getAllEchipamentePlajaUsingGET) | **GET** /echipamente-plaja | getAllEchipamentePlaja
[**getEchipamentPlajaByIdUsingGET**](EchipamentPlajaControllerApi.md#getEchipamentPlajaByIdUsingGET) | **GET** /echipamente-plaja/{id} | getEchipamentPlajaById
[**getEchipamenteByPlajaIdUsingGET**](EchipamentPlajaControllerApi.md#getEchipamenteByPlajaIdUsingGET) | **GET** /echipamente-plaja/by-plaja/{plajaId} | getEchipamenteByPlajaId
[**getPreturiForEchipamentUsingGET**](EchipamentPlajaControllerApi.md#getPreturiForEchipamentUsingGET) | **GET** /echipamente-plaja/{id}/preturi | getPreturiForEchipament
[**patchEchipamentPlajaUsingPATCH**](EchipamentPlajaControllerApi.md#patchEchipamentPlajaUsingPATCH) | **PATCH** /echipamente-plaja/{id} | patchEchipamentPlaja
[**updateEchipamentPlajaUsingPUT**](EchipamentPlajaControllerApi.md#updateEchipamentPlajaUsingPUT) | **PUT** /echipamente-plaja/{id} | updateEchipamentPlaja



## createEchipamentPlajaUsingPOST

> EchipamentPlajaDTO createEchipamentPlajaUsingPOST(echipamentPlaja)

createEchipamentPlaja

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.EchipamentPlajaControllerApi();
let echipamentPlaja = new ApiDocumentation.EchipamentPlajaDTO(); // EchipamentPlajaDTO | echipamentPlaja
apiInstance.createEchipamentPlajaUsingPOST(echipamentPlaja, (error, data, response) => {
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
 **echipamentPlaja** | [**EchipamentPlajaDTO**](EchipamentPlajaDTO.md)| echipamentPlaja | 

### Return type

[**EchipamentPlajaDTO**](EchipamentPlajaDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## deleteEchipamentPlajaByPlajaIdUsingDELETE

> deleteEchipamentPlajaByPlajaIdUsingDELETE(plajaId)

deleteEchipamentPlajaByPlajaId

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.EchipamentPlajaControllerApi();
let plajaId = 56; // Number | plajaId
apiInstance.deleteEchipamentPlajaByPlajaIdUsingDELETE(plajaId, (error, data, response) => {
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
 **plajaId** | **Number**| plajaId | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


## deleteEchipamentPlajaUsingDELETE

> deleteEchipamentPlajaUsingDELETE(id)

deleteEchipamentPlaja

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.EchipamentPlajaControllerApi();
let id = 56; // Number | id
apiInstance.deleteEchipamentPlajaUsingDELETE(id, (error, data, response) => {
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


## getAllEchipamentePlajaUsingGET

> [EchipamentPlajaDTO] getAllEchipamentePlajaUsingGET()

getAllEchipamentePlaja

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.EchipamentPlajaControllerApi();
apiInstance.getAllEchipamentePlajaUsingGET((error, data, response) => {
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

[**[EchipamentPlajaDTO]**](EchipamentPlajaDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getEchipamentPlajaByIdUsingGET

> EchipamentPlajaDTO getEchipamentPlajaByIdUsingGET(id)

getEchipamentPlajaById

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.EchipamentPlajaControllerApi();
let id = 56; // Number | id
apiInstance.getEchipamentPlajaByIdUsingGET(id, (error, data, response) => {
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

[**EchipamentPlajaDTO**](EchipamentPlajaDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getEchipamenteByPlajaIdUsingGET

> [EchipamentPlajaDTO] getEchipamenteByPlajaIdUsingGET(plajaId)

getEchipamenteByPlajaId

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.EchipamentPlajaControllerApi();
let plajaId = 56; // Number | plajaId
apiInstance.getEchipamenteByPlajaIdUsingGET(plajaId, (error, data, response) => {
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

[**[EchipamentPlajaDTO]**](EchipamentPlajaDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getPreturiForEchipamentUsingGET

> [PretDTO] getPreturiForEchipamentUsingGET(id)

getPreturiForEchipament

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.EchipamentPlajaControllerApi();
let id = 56; // Number | id
apiInstance.getPreturiForEchipamentUsingGET(id, (error, data, response) => {
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

[**[PretDTO]**](PretDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## patchEchipamentPlajaUsingPATCH

> EchipamentPlajaDTO patchEchipamentPlajaUsingPATCH(id, patchDTO)

patchEchipamentPlaja

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.EchipamentPlajaControllerApi();
let id = 56; // Number | id
let patchDTO = new ApiDocumentation.EchipamentPlajaDTO(); // EchipamentPlajaDTO | patchDTO
apiInstance.patchEchipamentPlajaUsingPATCH(id, patchDTO, (error, data, response) => {
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
 **patchDTO** | [**EchipamentPlajaDTO**](EchipamentPlajaDTO.md)| patchDTO | 

### Return type

[**EchipamentPlajaDTO**](EchipamentPlajaDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateEchipamentPlajaUsingPUT

> EchipamentPlaja updateEchipamentPlajaUsingPUT(id, updatedEchipamentPlaja)

updateEchipamentPlaja

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.EchipamentPlajaControllerApi();
let id = 56; // Number | id
let updatedEchipamentPlaja = new ApiDocumentation.EchipamentPlaja(); // EchipamentPlaja | updatedEchipamentPlaja
apiInstance.updateEchipamentPlajaUsingPUT(id, updatedEchipamentPlaja, (error, data, response) => {
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
 **updatedEchipamentPlaja** | [**EchipamentPlaja**](EchipamentPlaja.md)| updatedEchipamentPlaja | 

### Return type

[**EchipamentPlaja**](EchipamentPlaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

