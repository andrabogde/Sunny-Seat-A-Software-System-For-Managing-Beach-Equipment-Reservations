# ApiDocumentation.RezervareControllerApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**anulaRezervareUsingPUT**](RezervareControllerApi.md#anulaRezervareUsingPUT) | **PUT** /api/rezervari/{id}/anuleaza | anulaRezervare
[**createRezervareUsingPOST**](RezervareControllerApi.md#createRezervareUsingPOST) | **POST** /rezervari | createRezervare
[**deleteRezervareUsingDELETE**](RezervareControllerApi.md#deleteRezervareUsingDELETE) | **DELETE** /rezervari/{id} | deleteRezervare
[**getAllRezervariUsingGET**](RezervareControllerApi.md#getAllRezervariUsingGET) | **GET** /rezervari | getAllRezervari
[**getReservedPositionsUsingGET**](RezervareControllerApi.md#getReservedPositionsUsingGET) | **GET** /api/rezervari/pozitii-rezervate | getReservedPositions
[**getRezervareByIdUsingGET**](RezervareControllerApi.md#getRezervareByIdUsingGET) | **GET** /rezervari/{id} | getRezervareById
[**updateRezervareUsingPUT**](RezervareControllerApi.md#updateRezervareUsingPUT) | **PUT** /rezervari/{id} | updateRezervare



## anulaRezervareUsingPUT

> Object anulaRezervareUsingPUT(id, opts)

anulaRezervare

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.RezervareControllerApi();
let id = 56; // Number | id
let opts = {
  'name': "name_example" // String | 
};
apiInstance.anulaRezervareUsingPUT(id, opts, (error, data, response) => {
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
 **name** | **String**|  | [optional] 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## createRezervareUsingPOST

> Rezervare createRezervareUsingPOST(rezervare)

createRezervare

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.RezervareControllerApi();
let rezervare = new ApiDocumentation.Rezervare(); // Rezervare | rezervare
apiInstance.createRezervareUsingPOST(rezervare, (error, data, response) => {
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
 **rezervare** | [**Rezervare**](Rezervare.md)| rezervare | 

### Return type

[**Rezervare**](Rezervare.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## deleteRezervareUsingDELETE

> deleteRezervareUsingDELETE(id)

deleteRezervare

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.RezervareControllerApi();
let id = 56; // Number | id
apiInstance.deleteRezervareUsingDELETE(id, (error, data, response) => {
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


## getAllRezervariUsingGET

> [Rezervare] getAllRezervariUsingGET()

getAllRezervari

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.RezervareControllerApi();
apiInstance.getAllRezervariUsingGET((error, data, response) => {
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

[**[Rezervare]**](Rezervare.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getReservedPositionsUsingGET

> [String] getReservedPositionsUsingGET(dataInceput, dataSfarsit, plajaId)

getReservedPositions

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.RezervareControllerApi();
let dataInceput = new Date("2013-10-20"); // Date | dataInceput
let dataSfarsit = new Date("2013-10-20"); // Date | dataSfarsit
let plajaId = 789; // Number | plajaId
apiInstance.getReservedPositionsUsingGET(dataInceput, dataSfarsit, plajaId, (error, data, response) => {
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
 **dataInceput** | **Date**| dataInceput | 
 **dataSfarsit** | **Date**| dataSfarsit | 
 **plajaId** | **Number**| plajaId | 

### Return type

**[String]**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getRezervareByIdUsingGET

> Rezervare getRezervareByIdUsingGET(id)

getRezervareById

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.RezervareControllerApi();
let id = 56; // Number | id
apiInstance.getRezervareByIdUsingGET(id, (error, data, response) => {
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

[**Rezervare**](Rezervare.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## updateRezervareUsingPUT

> Rezervare updateRezervareUsingPUT(id, updatedRezervare)

updateRezervare

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.RezervareControllerApi();
let id = 56; // Number | id
let updatedRezervare = new ApiDocumentation.Rezervare(); // Rezervare | updatedRezervare
apiInstance.updateRezervareUsingPUT(id, updatedRezervare, (error, data, response) => {
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
 **updatedRezervare** | [**Rezervare**](Rezervare.md)| updatedRezervare | 

### Return type

[**Rezervare**](Rezervare.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

