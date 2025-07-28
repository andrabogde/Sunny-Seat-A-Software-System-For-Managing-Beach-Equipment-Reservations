# ApiDocumentation.TipEchipamentPlajaControllerApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createTipEchipamentPlajaUsingPOST**](TipEchipamentPlajaControllerApi.md#createTipEchipamentPlajaUsingPOST) | **POST** /tipuri-echipamente-plaja | createTipEchipamentPlaja
[**deleteTipEchipamentPlajaUsingDELETE**](TipEchipamentPlajaControllerApi.md#deleteTipEchipamentPlajaUsingDELETE) | **DELETE** /tipuri-echipamente-plaja/{id} | deleteTipEchipamentPlaja
[**getAllTipuriEchipamentePlajaUsingGET**](TipEchipamentPlajaControllerApi.md#getAllTipuriEchipamentePlajaUsingGET) | **GET** /tipuri-echipamente-plaja | getAllTipuriEchipamentePlaja
[**getTipEchipamentPlajaByIdUsingGET**](TipEchipamentPlajaControllerApi.md#getTipEchipamentPlajaByIdUsingGET) | **GET** /tipuri-echipamente-plaja/{id} | getTipEchipamentPlajaById
[**patchTipEchipamentPlajaUsingPATCH**](TipEchipamentPlajaControllerApi.md#patchTipEchipamentPlajaUsingPATCH) | **PATCH** /tipuri-echipamente-plaja/{id} | patchTipEchipamentPlaja
[**updateTipEchipamentPlajaUsingPUT**](TipEchipamentPlajaControllerApi.md#updateTipEchipamentPlajaUsingPUT) | **PUT** /tipuri-echipamente-plaja/{id} | updateTipEchipamentPlaja



## createTipEchipamentPlajaUsingPOST

> TipEchipamentPlaja createTipEchipamentPlajaUsingPOST(tipEchipamentPlaja)

createTipEchipamentPlaja

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.TipEchipamentPlajaControllerApi();
let tipEchipamentPlaja = new ApiDocumentation.TipEchipamentPlaja(); // TipEchipamentPlaja | tipEchipamentPlaja
apiInstance.createTipEchipamentPlajaUsingPOST(tipEchipamentPlaja, (error, data, response) => {
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
 **tipEchipamentPlaja** | [**TipEchipamentPlaja**](TipEchipamentPlaja.md)| tipEchipamentPlaja | 

### Return type

[**TipEchipamentPlaja**](TipEchipamentPlaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## deleteTipEchipamentPlajaUsingDELETE

> deleteTipEchipamentPlajaUsingDELETE(id)

deleteTipEchipamentPlaja

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.TipEchipamentPlajaControllerApi();
let id = 56; // Number | id
apiInstance.deleteTipEchipamentPlajaUsingDELETE(id, (error, data, response) => {
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


## getAllTipuriEchipamentePlajaUsingGET

> [TipEchipamentPlaja] getAllTipuriEchipamentePlajaUsingGET()

getAllTipuriEchipamentePlaja

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.TipEchipamentPlajaControllerApi();
apiInstance.getAllTipuriEchipamentePlajaUsingGET((error, data, response) => {
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

[**[TipEchipamentPlaja]**](TipEchipamentPlaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getTipEchipamentPlajaByIdUsingGET

> TipEchipamentPlaja getTipEchipamentPlajaByIdUsingGET(id)

getTipEchipamentPlajaById

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.TipEchipamentPlajaControllerApi();
let id = 56; // Number | id
apiInstance.getTipEchipamentPlajaByIdUsingGET(id, (error, data, response) => {
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

[**TipEchipamentPlaja**](TipEchipamentPlaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## patchTipEchipamentPlajaUsingPATCH

> TipEchipamentPlaja patchTipEchipamentPlajaUsingPATCH(id, patchDto)

patchTipEchipamentPlaja

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.TipEchipamentPlajaControllerApi();
let id = 56; // Number | id
let patchDto = new ApiDocumentation.TipEchipamentPlajaDTO(); // TipEchipamentPlajaDTO | patchDto
apiInstance.patchTipEchipamentPlajaUsingPATCH(id, patchDto, (error, data, response) => {
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
 **patchDto** | [**TipEchipamentPlajaDTO**](TipEchipamentPlajaDTO.md)| patchDto | 

### Return type

[**TipEchipamentPlaja**](TipEchipamentPlaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateTipEchipamentPlajaUsingPUT

> TipEchipamentPlaja updateTipEchipamentPlajaUsingPUT(id, updatedTip)

updateTipEchipamentPlaja

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.TipEchipamentPlajaControllerApi();
let id = 56; // Number | id
let updatedTip = new ApiDocumentation.TipEchipamentPlaja(); // TipEchipamentPlaja | updatedTip
apiInstance.updateTipEchipamentPlajaUsingPUT(id, updatedTip, (error, data, response) => {
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
 **updatedTip** | [**TipEchipamentPlaja**](TipEchipamentPlaja.md)| updatedTip | 

### Return type

[**TipEchipamentPlaja**](TipEchipamentPlaja.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

