# ApiDocumentation.PlajaControllerApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createPlajaUsingPOST**](PlajaControllerApi.md#createPlajaUsingPOST) | **POST** /plaje | createPlaja
[**deletePlajaUsingDELETE**](PlajaControllerApi.md#deletePlajaUsingDELETE) | **DELETE** /plaje/{id} | deletePlaja
[**getAllPlajeByUsingGET**](PlajaControllerApi.md#getAllPlajeByUsingGET) | **GET** /plaje/user | getAllPlajeBy
[**getAllPlajeUsingGET**](PlajaControllerApi.md#getAllPlajeUsingGET) | **GET** /plaje | getAllPlaje
[**getPlajaByIdUsingGET**](PlajaControllerApi.md#getPlajaByIdUsingGET) | **GET** /plaje/{id} | getPlajaById
[**getPlajeByActivUsingGET**](PlajaControllerApi.md#getPlajeByActivUsingGET) | **GET** /plaje/activ/{activ} | getPlajeByActiv
[**getPlajeByStatiuneIdUsingGET**](PlajaControllerApi.md#getPlajeByStatiuneIdUsingGET) | **GET** /plaje/statiune/{statiuneId} | getPlajeByStatiuneId
[**patchPlajaUsingPATCH**](PlajaControllerApi.md#patchPlajaUsingPATCH) | **PATCH** /plaje/{id} | patchPlaja
[**updatePlajaUsingPUT**](PlajaControllerApi.md#updatePlajaUsingPUT) | **PUT** /plaje/{id} | updatePlaja



## createPlajaUsingPOST

> Plaja createPlajaUsingPOST(plaja)

createPlaja

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.PlajaControllerApi();
let plaja = new ApiDocumentation.Plaja(); // Plaja | plaja
apiInstance.createPlajaUsingPOST(plaja, (error, data, response) => {
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
 **plaja** | [**Plaja**](Plaja.md)| plaja | 

### Return type

[**Plaja**](Plaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## deletePlajaUsingDELETE

> deletePlajaUsingDELETE(id)

deletePlaja

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.PlajaControllerApi();
let id = 56; // Number | id
apiInstance.deletePlajaUsingDELETE(id, (error, data, response) => {
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


## getAllPlajeByUsingGET

> [Plaja] getAllPlajeByUsingGET(opts)

getAllPlajeBy

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.PlajaControllerApi();
let opts = {
  'name': "name_example" // String | 
};
apiInstance.getAllPlajeByUsingGET(opts, (error, data, response) => {
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
 **name** | **String**|  | [optional] 

### Return type

[**[Plaja]**](Plaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getAllPlajeUsingGET

> [Plaja] getAllPlajeUsingGET()

getAllPlaje

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.PlajaControllerApi();
apiInstance.getAllPlajeUsingGET((error, data, response) => {
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

[**[Plaja]**](Plaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getPlajaByIdUsingGET

> Plaja getPlajaByIdUsingGET(id)

getPlajaById

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.PlajaControllerApi();
let id = 56; // Number | id
apiInstance.getPlajaByIdUsingGET(id, (error, data, response) => {
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

[**Plaja**](Plaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getPlajeByActivUsingGET

> [Plaja] getPlajeByActivUsingGET(activ)

getPlajeByActiv

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.PlajaControllerApi();
let activ = true; // Boolean | activ
apiInstance.getPlajeByActivUsingGET(activ, (error, data, response) => {
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
 **activ** | **Boolean**| activ | 

### Return type

[**[Plaja]**](Plaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getPlajeByStatiuneIdUsingGET

> [Plaja] getPlajeByStatiuneIdUsingGET(statiuneId)

getPlajeByStatiuneId

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.PlajaControllerApi();
let statiuneId = 56; // Number | statiuneId
apiInstance.getPlajeByStatiuneIdUsingGET(statiuneId, (error, data, response) => {
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
 **statiuneId** | **Number**| statiuneId | 

### Return type

[**[Plaja]**](Plaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## patchPlajaUsingPATCH

> Plaja patchPlajaUsingPATCH(id, patchDTO)

patchPlaja

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.PlajaControllerApi();
let id = 56; // Number | id
let patchDTO = new ApiDocumentation.PlajaDTO(); // PlajaDTO | patchDTO
apiInstance.patchPlajaUsingPATCH(id, patchDTO, (error, data, response) => {
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
 **patchDTO** | [**PlajaDTO**](PlajaDTO.md)| patchDTO | 

### Return type

[**Plaja**](Plaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updatePlajaUsingPUT

> Plaja updatePlajaUsingPUT(id, updatedPlaja)

updatePlaja

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.PlajaControllerApi();
let id = 56; // Number | id
let updatedPlaja = new ApiDocumentation.Plaja(); // Plaja | updatedPlaja
apiInstance.updatePlajaUsingPUT(id, updatedPlaja, (error, data, response) => {
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
 **updatedPlaja** | [**Plaja**](Plaja.md)| updatedPlaja | 

### Return type

[**Plaja**](Plaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

