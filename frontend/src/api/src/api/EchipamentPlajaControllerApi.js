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
import EchipamentPlaja from '../model/EchipamentPlaja';
import EchipamentPlajaDTO from '../model/EchipamentPlajaDTO';
import PretDTO from '../model/PretDTO';

/**
* EchipamentPlajaController service.
* @module api/EchipamentPlajaControllerApi
* @version 1.0
*/
export default class EchipamentPlajaControllerApi {

    /**
    * Constructs a new EchipamentPlajaControllerApi. 
    * @alias module:api/EchipamentPlajaControllerApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }


    /**
     * Callback function to receive the result of the createEchipamentPlajaUsingPOST operation.
     * @callback module:api/EchipamentPlajaControllerApi~createEchipamentPlajaUsingPOSTCallback
     * @param {String} error Error message, if any.
     * @param {module:model/EchipamentPlajaDTO} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * createEchipamentPlaja
     * @param {module:model/EchipamentPlajaDTO} echipamentPlaja echipamentPlaja
     * @param {module:api/EchipamentPlajaControllerApi~createEchipamentPlajaUsingPOSTCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/EchipamentPlajaDTO}
     */
    createEchipamentPlajaUsingPOST(echipamentPlaja, callback) {
      let postBody = echipamentPlaja;
      // verify the required parameter 'echipamentPlaja' is set
      if (echipamentPlaja === undefined || echipamentPlaja === null) {
        throw new Error("Missing the required parameter 'echipamentPlaja' when calling createEchipamentPlajaUsingPOST");
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
      let returnType = EchipamentPlajaDTO;
      return this.apiClient.callApi(
        '/echipamente-plaja', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteEchipamentPlajaByPlajaIdUsingDELETE operation.
     * @callback module:api/EchipamentPlajaControllerApi~deleteEchipamentPlajaByPlajaIdUsingDELETECallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * deleteEchipamentPlajaByPlajaId
     * @param {Number} plajaId plajaId
     * @param {module:api/EchipamentPlajaControllerApi~deleteEchipamentPlajaByPlajaIdUsingDELETECallback} callback The callback function, accepting three arguments: error, data, response
     */
    deleteEchipamentPlajaByPlajaIdUsingDELETE(plajaId, callback) {
      let postBody = null;
      // verify the required parameter 'plajaId' is set
      if (plajaId === undefined || plajaId === null) {
        throw new Error("Missing the required parameter 'plajaId' when calling deleteEchipamentPlajaByPlajaIdUsingDELETE");
      }

      let pathParams = {
        'plajaId': plajaId
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
        '/echipamente-plaja/by-plaja/{plajaId}', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteEchipamentPlajaUsingDELETE operation.
     * @callback module:api/EchipamentPlajaControllerApi~deleteEchipamentPlajaUsingDELETECallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * deleteEchipamentPlaja
     * @param {Number} id id
     * @param {module:api/EchipamentPlajaControllerApi~deleteEchipamentPlajaUsingDELETECallback} callback The callback function, accepting three arguments: error, data, response
     */
    deleteEchipamentPlajaUsingDELETE(id, callback) {
      let postBody = null;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling deleteEchipamentPlajaUsingDELETE");
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
        '/echipamente-plaja/{id}', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the getAllEchipamentePlajaUsingGET operation.
     * @callback module:api/EchipamentPlajaControllerApi~getAllEchipamentePlajaUsingGETCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/EchipamentPlajaDTO>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * getAllEchipamentePlaja
     * @param {module:api/EchipamentPlajaControllerApi~getAllEchipamentePlajaUsingGETCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/EchipamentPlajaDTO>}
     */
    getAllEchipamentePlajaUsingGET(callback) {
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
      let returnType = [EchipamentPlajaDTO];
      return this.apiClient.callApi(
        '/echipamente-plaja', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the getEchipamentPlajaByIdUsingGET operation.
     * @callback module:api/EchipamentPlajaControllerApi~getEchipamentPlajaByIdUsingGETCallback
     * @param {String} error Error message, if any.
     * @param {module:model/EchipamentPlajaDTO} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * getEchipamentPlajaById
     * @param {Number} id id
     * @param {module:api/EchipamentPlajaControllerApi~getEchipamentPlajaByIdUsingGETCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/EchipamentPlajaDTO}
     */
    getEchipamentPlajaByIdUsingGET(id, callback) {
      let postBody = null;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getEchipamentPlajaByIdUsingGET");
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
      let returnType = EchipamentPlajaDTO;
      return this.apiClient.callApi(
        '/echipamente-plaja/{id}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the getEchipamenteByPlajaIdUsingGET operation.
     * @callback module:api/EchipamentPlajaControllerApi~getEchipamenteByPlajaIdUsingGETCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/EchipamentPlajaDTO>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * getEchipamenteByPlajaId
     * @param {Number} plajaId plajaId
     * @param {module:api/EchipamentPlajaControllerApi~getEchipamenteByPlajaIdUsingGETCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/EchipamentPlajaDTO>}
     */
    getEchipamenteByPlajaIdUsingGET(plajaId, callback) {
      let postBody = null;
      // verify the required parameter 'plajaId' is set
      if (plajaId === undefined || plajaId === null) {
        throw new Error("Missing the required parameter 'plajaId' when calling getEchipamenteByPlajaIdUsingGET");
      }

      let pathParams = {
        'plajaId': plajaId
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
      let returnType = [EchipamentPlajaDTO];
      return this.apiClient.callApi(
        '/echipamente-plaja/by-plaja/{plajaId}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the getPreturiForEchipamentUsingGET operation.
     * @callback module:api/EchipamentPlajaControllerApi~getPreturiForEchipamentUsingGETCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/PretDTO>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * getPreturiForEchipament
     * @param {Number} id id
     * @param {module:api/EchipamentPlajaControllerApi~getPreturiForEchipamentUsingGETCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/PretDTO>}
     */
    getPreturiForEchipamentUsingGET(id, callback) {
      let postBody = null;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getPreturiForEchipamentUsingGET");
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
      let returnType = [PretDTO];
      return this.apiClient.callApi(
        '/echipamente-plaja/{id}/preturi', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the patchEchipamentPlajaUsingPATCH operation.
     * @callback module:api/EchipamentPlajaControllerApi~patchEchipamentPlajaUsingPATCHCallback
     * @param {String} error Error message, if any.
     * @param {module:model/EchipamentPlajaDTO} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * patchEchipamentPlaja
     * @param {Number} id id
     * @param {module:model/EchipamentPlajaDTO} patchDTO patchDTO
     * @param {module:api/EchipamentPlajaControllerApi~patchEchipamentPlajaUsingPATCHCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/EchipamentPlajaDTO}
     */
    patchEchipamentPlajaUsingPATCH(id, patchDTO, callback) {
      let postBody = patchDTO;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling patchEchipamentPlajaUsingPATCH");
      }
      // verify the required parameter 'patchDTO' is set
      if (patchDTO === undefined || patchDTO === null) {
        throw new Error("Missing the required parameter 'patchDTO' when calling patchEchipamentPlajaUsingPATCH");
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
      let returnType = EchipamentPlajaDTO;
      return this.apiClient.callApi(
        '/echipamente-plaja/{id}', 'PATCH',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the updateEchipamentPlajaUsingPUT operation.
     * @callback module:api/EchipamentPlajaControllerApi~updateEchipamentPlajaUsingPUTCallback
     * @param {String} error Error message, if any.
     * @param {module:model/EchipamentPlaja} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * updateEchipamentPlaja
     * @param {Number} id id
     * @param {module:model/EchipamentPlaja} updatedEchipamentPlaja updatedEchipamentPlaja
     * @param {module:api/EchipamentPlajaControllerApi~updateEchipamentPlajaUsingPUTCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/EchipamentPlaja}
     */
    updateEchipamentPlajaUsingPUT(id, updatedEchipamentPlaja, callback) {
      let postBody = updatedEchipamentPlaja;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling updateEchipamentPlajaUsingPUT");
      }
      // verify the required parameter 'updatedEchipamentPlaja' is set
      if (updatedEchipamentPlaja === undefined || updatedEchipamentPlaja === null) {
        throw new Error("Missing the required parameter 'updatedEchipamentPlaja' when calling updateEchipamentPlajaUsingPUT");
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
      let returnType = EchipamentPlaja;
      return this.apiClient.callApi(
        '/echipamente-plaja/{id}', 'PUT',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }


}
