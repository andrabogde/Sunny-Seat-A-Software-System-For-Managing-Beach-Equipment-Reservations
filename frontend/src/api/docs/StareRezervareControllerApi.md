# ApiDocumentation.StareRezervareControllerApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getAllStariRezervariUsingGET**](StareRezervareControllerApi.md#getAllStariRezervariUsingGET) | **GET** /stari-rezervari | getAllStariRezervari



## getAllStariRezervariUsingGET

> [StareRezervare] getAllStariRezervariUsingGET()

getAllStariRezervari

### Example

```javascript
import ApiDocumentation from 'api_documentation';

let apiInstance = new ApiDocumentation.StareRezervareControllerApi();
apiInstance.getAllStariRezervariUsingGET((error, data, response) => {
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

[**[StareRezervare]**](StareRezervare.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

