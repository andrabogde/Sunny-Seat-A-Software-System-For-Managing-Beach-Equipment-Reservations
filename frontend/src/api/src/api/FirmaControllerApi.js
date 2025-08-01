/**
 * Api Documentation
 * Api Documentation
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */


import ApiClient from "../ApiClient";
import Firma from '../model/Firma';
import FirmaDTO from '../model/FirmaDTO';

/**
* FirmaController service.
* @module api/FirmaControllerApi
* @version 1.0
*/
export default class FirmaControllerApi {

    /**
    * Constructs a new FirmaControllerApi. 
    * @alias module:api/FirmaControllerApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }


    /**
     * Callback function to receive the result of the createFirmaUsingPOST operation.
     * @callback module:api/FirmaControllerApi~createFirmaUsingPOSTCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Firma} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * createFirma
     * @param {module:model/Firma} firma firma
     * @param {module:api/FirmaControllerApi~createFirmaUsingPOSTCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Firma}
     */
    createFirmaUsingPOST(firma, callback) {
      let postBody = firma;
      // verify the required parameter 'firma' is set
      if (firma === undefined || firma === null) {
        throw new Error("Missing the required parameter 'firma' when calling createFirmaUsingPOST");
      }

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = ['application/json'];
      let accepts = ['*/*'];
      let returnType = Firma;
      return this.apiClient.callApi(
        '/firme', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteFirmaUsingDELETE operation.
     * @callback module:api/FirmaControllerApi~deleteFirmaUsingDELETECallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * deleteFirma
     * @param {Number} id id
     * @param {module:api/FirmaControllerApi~deleteFirmaUsingDELETECallback} callback The callback function, accepting three arguments: error, data, response
     */
    deleteFirmaUsingDELETE(id, callback) {
      let postBody = null;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling deleteFirmaUsingDELETE");
      }

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = [];
      let returnType = null;
      return this.apiClient.callApi(
        '/firme/{id}', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the getAllFirmeUsingGET operation.
     * @callback module:api/FirmaControllerApi~getAllFirmeUsingGETCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Firma>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * getAllFirme
     * @param {module:api/FirmaControllerApi~getAllFirmeUsingGETCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Firma>}
     */
    getAllFirmeUsingGET(callback) {
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['*/*'];
      let returnType = [Firma];
      return this.apiClient.callApi(
        '/firme', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the getFirmaByIdUsingGET operation.
     * @callback module:api/FirmaControllerApi~getFirmaByIdUsingGETCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Firma} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * getFirmaById
     * @param {Number} id id
     * @param {module:api/FirmaControllerApi~getFirmaByIdUsingGETCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Firma}
     */
    getFirmaByIdUsingGET(id, callback) {
      let postBody = null;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getFirmaByIdUsingGET");
      }

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['*/*'];
      let returnType = Firma;
      return this.apiClient.callApi(
        '/firme/{id}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the patchFirmaUsingPATCH operation.
     * @callback module:api/FirmaControllerApi~patchFirmaUsingPATCHCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Firma} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * patchFirma
     * @param {Number} id id
     * @param {module:model/FirmaDTO} patchDTO patchDTO
     * @param {module:api/FirmaControllerApi~patchFirmaUsingPATCHCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Firma}
     */
    patchFirmaUsingPATCH(id, patchDTO, callback) {
      let postBody = patchDTO;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling patchFirmaUsingPATCH");
      }
      // verify the required parameter 'patchDTO' is set
      if (patchDTO === undefined || patchDTO === null) {
        throw new Error("Missing the required parameter 'patchDTO' when calling patchFirmaUsingPATCH");
      }

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = ['application/json'];
      let accepts = ['*/*'];
      let returnType = Firma;
      return this.apiClient.callApi(
        '/firme/{id}', 'PATCH',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the updateFirmaUsingPUT operation.
     * @callback module:api/FirmaControllerApi~updateFirmaUsingPUTCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Firma} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * updateFirma
     * @param {Number} id id
     * @param {module:model/Firma} updatedFirma updatedFirma
     * @param {module:api/FirmaControllerApi~updateFirmaUsingPUTCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Firma}
     */
    updateFirmaUsingPUT(id, updatedFirma, callback) {
      let postBody = updatedFirma;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling updateFirmaUsingPUT");
      }
      // verify the required parameter 'updatedFirma' is set
      if (updatedFirma === undefined || updatedFirma === null) {
        throw new Error("Missing the required parameter 'updatedFirma' when calling updateFirmaUsingPUT");
      }

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = ['application/json'];
      let accepts = ['*/*'];
      let returnType = Firma;
      return this.apiClient.callApi(
        '/firme/{id}', 'PUT',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }


}
