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
import StareEchipamentPlaja from '../model/StareEchipamentPlaja';
import StareEchipamentPlajaDTO from '../model/StareEchipamentPlajaDTO';

/**
* StareEchipamentPlajaController service.
* @module api/StareEchipamentPlajaControllerApi
* @version 1.0
*/
export default class StareEchipamentPlajaControllerApi {

    /**
    * Constructs a new StareEchipamentPlajaControllerApi. 
    * @alias module:api/StareEchipamentPlajaControllerApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }


    /**
     * Callback function to receive the result of the actualizeazaPartialUsingPATCH operation.
     * @callback module:api/StareEchipamentPlajaControllerApi~actualizeazaPartialUsingPATCHCallback
     * @param {String} error Error message, if any.
     * @param {module:model/StareEchipamentPlaja} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * actualizeazaPartial
     * @param {Number} id id
     * @param {module:model/StareEchipamentPlajaDTO} dto dto
     * @param {module:api/StareEchipamentPlajaControllerApi~actualizeazaPartialUsingPATCHCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/StareEchipamentPlaja}
     */
    actualizeazaPartialUsingPATCH(id, dto, callback) {
      let postBody = dto;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling actualizeazaPartialUsingPATCH");
      }
      // verify the required parameter 'dto' is set
      if (dto === undefined || dto === null) {
        throw new Error("Missing the required parameter 'dto' when calling actualizeazaPartialUsingPATCH");
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
      let returnType = StareEchipamentPlaja;
      return this.apiClient.callApi(
        '/stari-echipamente-plaja/{id}', 'PATCH',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the createStareEchipamentPlajaUsingPOST operation.
     * @callback module:api/StareEchipamentPlajaControllerApi~createStareEchipamentPlajaUsingPOSTCallback
     * @param {String} error Error message, if any.
     * @param {module:model/StareEchipamentPlaja} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * createStareEchipamentPlaja
     * @param {module:model/StareEchipamentPlaja} stareEchipamentPlaja stareEchipamentPlaja
     * @param {module:api/StareEchipamentPlajaControllerApi~createStareEchipamentPlajaUsingPOSTCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/StareEchipamentPlaja}
     */
    createStareEchipamentPlajaUsingPOST(stareEchipamentPlaja, callback) {
      let postBody = stareEchipamentPlaja;
      // verify the required parameter 'stareEchipamentPlaja' is set
      if (stareEchipamentPlaja === undefined || stareEchipamentPlaja === null) {
        throw new Error("Missing the required parameter 'stareEchipamentPlaja' when calling createStareEchipamentPlajaUsingPOST");
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
      let returnType = StareEchipamentPlaja;
      return this.apiClient.callApi(
        '/stari-echipamente-plaja', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteStareEchipamentPlajaUsingDELETE operation.
     * @callback module:api/StareEchipamentPlajaControllerApi~deleteStareEchipamentPlajaUsingDELETECallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * deleteStareEchipamentPlaja
     * @param {Number} id id
     * @param {module:api/StareEchipamentPlajaControllerApi~deleteStareEchipamentPlajaUsingDELETECallback} callback The callback function, accepting three arguments: error, data, response
     */
    deleteStareEchipamentPlajaUsingDELETE(id, callback) {
      let postBody = null;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling deleteStareEchipamentPlajaUsingDELETE");
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
        '/stari-echipamente-plaja/{id}', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the getAllStariEchipamentePlajaUsingGET operation.
     * @callback module:api/StareEchipamentPlajaControllerApi~getAllStariEchipamentePlajaUsingGETCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/StareEchipamentPlaja>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * getAllStariEchipamentePlaja
     * @param {module:api/StareEchipamentPlajaControllerApi~getAllStariEchipamentePlajaUsingGETCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/StareEchipamentPlaja>}
     */
    getAllStariEchipamentePlajaUsingGET(callback) {
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
      let returnType = [StareEchipamentPlaja];
      return this.apiClient.callApi(
        '/stari-echipamente-plaja', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the getStareEchipamentPlajaByIdUsingGET operation.
     * @callback module:api/StareEchipamentPlajaControllerApi~getStareEchipamentPlajaByIdUsingGETCallback
     * @param {String} error Error message, if any.
     * @param {module:model/StareEchipamentPlaja} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * getStareEchipamentPlajaById
     * @param {Number} id id
     * @param {module:api/StareEchipamentPlajaControllerApi~getStareEchipamentPlajaByIdUsingGETCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/StareEchipamentPlaja}
     */
    getStareEchipamentPlajaByIdUsingGET(id, callback) {
      let postBody = null;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getStareEchipamentPlajaByIdUsingGET");
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
      let returnType = StareEchipamentPlaja;
      return this.apiClient.callApi(
        '/stari-echipamente-plaja/{id}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the updateStareEchipamentPlajaUsingPUT operation.
     * @callback module:api/StareEchipamentPlajaControllerApi~updateStareEchipamentPlajaUsingPUTCallback
     * @param {String} error Error message, if any.
     * @param {module:model/StareEchipamentPlaja} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * updateStareEchipamentPlaja
     * @param {Number} id id
     * @param {module:model/StareEchipamentPlaja} updatedStare updatedStare
     * @param {module:api/StareEchipamentPlajaControllerApi~updateStareEchipamentPlajaUsingPUTCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/StareEchipamentPlaja}
     */
    updateStareEchipamentPlajaUsingPUT(id, updatedStare, callback) {
      let postBody = updatedStare;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling updateStareEchipamentPlajaUsingPUT");
      }
      // verify the required parameter 'updatedStare' is set
      if (updatedStare === undefined || updatedStare === null) {
        throw new Error("Missing the required parameter 'updatedStare' when calling updateStareEchipamentPlajaUsingPUT");
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
      let returnType = StareEchipamentPlaja;
      return this.apiClient.callApi(
        '/stari-echipamente-plaja/{id}', 'PUT',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }


}
