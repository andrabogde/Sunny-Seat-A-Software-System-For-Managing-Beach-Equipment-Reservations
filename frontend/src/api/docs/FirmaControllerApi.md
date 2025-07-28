# ApiDocumentation.FirmaControllerApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createFirmaUsingPOST**](FirmaControllerApi.md#createFirmaUsingPOST) | **POST** /firme | createFirma
[**deleteFirmaUsingDELETE**](FirmaControllerApi.md#deleteFirmaUsingDELETE) | **DELETE** /firme/{id} | deleteFirma
[**getAllFirmeUsingGET**](FirmaControllerApi.md#getAllFirmeUsingGET) | **GET** /firme | getAllFirme
[**getFirmaByIdUsingGET**](FirmaControllerApi.md#getFirmaByIdUsingGET) | **GET** /firme/{id} | getFirmaById
[**patchFirmaUsingPATCH**](FirmaControllerApi.md#patchFirmaUsingPATCH) | **PATCH** /firme/{id} | patchFirma
[**updateFirmaUsingPUT**](FirmaControllerApi.md#updateFirmaUsingPUT) | **PUT** /firme/{id} | updateFirma



## createFirmaUsingPOST

> Firma createFirmaUsingPOST(firma)

createFirma

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.FirmaControllerApi();
let firma = new ApiDocumentation.Firma(); // Firma | firma
apiInstance.createFirmaUsingPOST(firma, (error, data, response) => {
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
 **firma** | [**Firma**](Firma.md)| firma | 

### Return type

[**Firma**](Firma.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## deleteFirmaUsingDELETE

> deleteFirmaUsingDELETE(id)

deleteFirma

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.FirmaControllerApi();
let id = 56; // Number | id
apiInstance.deleteFirmaUsingDELETE(id, (error, data, response) => {
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


## getAllFirmeUsingGET

> [Firma] getAllFirmeUsingGET()

getAllFirme

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.FirmaControllerApi();
apiInstance.getAllFirmeUsingGET((error, data, response) => {
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

[**[Firma]**](Firma.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getFirmaByIdUsingGET

> Firma getFirmaByIdUsingGET(id)

getFirmaById

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.FirmaControllerApi();
let id = 56; // Number | id
apiInstance.getFirmaByIdUsingGET(id, (error, data, response) => {
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

[**Firma**](Firma.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## patchFirmaUsingPATCH

> Firma patchFirmaUsingPATCH(id, patchDTO)

patchFirma

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.FirmaControllerApi();
let id = 56; // Number | id
let patchDTO = new ApiDocumentation.FirmaDTO(); // FirmaDTO | patchDTO
apiInstance.patchFirmaUsingPATCH(id, patchDTO, (error, data, response) => {
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
 **patchDTO** | [**FirmaDTO**](FirmaDTO.md)| patchDTO | 

### Return type

[**Firma**](Firma.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateFirmaUsingPUT

> Firma updateFirmaUsingPUT(id, updatedFirma)

updateFirma

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.FirmaControllerApi();
let id = 56; // Number | id
let updatedFirma = new ApiDocumentation.Firma(); // Firma | updatedFirma
apiInstance.updateFirmaUsingPUT(id, updatedFirma, (error, data, response) => {
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
 **updatedFirma** | [**Firma**](Firma.md)| updatedFirma | 

### Return type

[**Firma**](Firma.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

