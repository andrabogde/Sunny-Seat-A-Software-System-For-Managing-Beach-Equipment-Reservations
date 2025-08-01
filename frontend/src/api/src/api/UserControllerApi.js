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
import ChangePasswordDto from '../model/ChangePasswordDto';
import TwoFactorDto from '../model/TwoFactorDto';
import TwoFactorSetupDto from '../model/TwoFactorSetupDto';
import TwoFactorVerificationRequestDto from '../model/TwoFactorVerificationRequestDto';
import UserDto from '../model/UserDto';

/**
* UserController service.
* @module api/UserControllerApi
* @version 1.0
*/
export default class UserControllerApi {

    /**
    * Constructs a new UserControllerApi. 
    * @alias module:api/UserControllerApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }


    /**
     * Callback function to receive the result of the cancelAccountUsingPOST operation.
     * @callback module:api/UserControllerApi~cancelAccountUsingPOSTCallback
     * @param {String} error Error message, if any.
     * @param {Object} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * cancelAccount
     * @param {Object} opts Optional parameters
     * @param {Boolean} [accountNonExpired] 
     * @param {Boolean} [accountNonLocked] 
     * @param {Object.<String, Object>} [attributes] 
     * @param {String} [authorities0Authority] 
     * @param {Boolean} [credentialsNonExpired] 
     * @param {String} [email] 
     * @param {Boolean} [enabled] 
     * @param {Number} [id] 
     * @param {String} [name] 
     * @param {String} [password] 
     * @param {String} [username] 
     * @param {module:api/UserControllerApi~cancelAccountUsingPOSTCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object}
     */
    cancelAccountUsingPOST(opts, callback) {
      opts = opts || {};
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
        'accountNonExpired': opts['accountNonExpired'],
        'accountNonLocked': opts['accountNonLocked'],
        'attributes': opts['attributes'],
        'authorities[0].authority': opts['authorities0Authority'],
        'credentialsNonExpired': opts['credentialsNonExpired'],
        'email': opts['email'],
        'enabled': opts['enabled'],
        'id': opts['id'],
        'name': opts['name'],
        'password': opts['password'],
        'username': opts['username']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['*/*'];
      let returnType = Object;
      return this.apiClient.callApi(
        '/cancel-account', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the changePasswordUsingPOST operation.
     * @callback module:api/UserControllerApi~changePasswordUsingPOSTCallback
     * @param {String} error Error message, if any.
     * @param {Object} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * changePassword
     * @param {module:model/ChangePasswordDto} changePasswordDto changePasswordDto
     * @param {Object} opts Optional parameters
     * @param {Boolean} [accountNonExpired] 
     * @param {Boolean} [accountNonLocked] 
     * @param {Object.<String, Object>} [attributes] 
     * @param {String} [authorities0Authority] 
     * @param {Boolean} [credentialsNonExpired] 
     * @param {String} [email] 
     * @param {Boolean} [enabled] 
     * @param {Number} [id] 
     * @param {String} [name] 
     * @param {String} [password] 
     * @param {String} [username] 
     * @param {module:api/UserControllerApi~changePasswordUsingPOSTCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object}
     */
    changePasswordUsingPOST(changePasswordDto, opts, callback) {
      opts = opts || {};
      let postBody = changePasswordDto;
      // verify the required parameter 'changePasswordDto' is set
      if (changePasswordDto === undefined || changePasswordDto === null) {
        throw new Error("Missing the required parameter 'changePasswordDto' when calling changePasswordUsingPOST");
      }

      let pathParams = {
      };
      let queryParams = {
        'accountNonExpired': opts['accountNonExpired'],
        'accountNonLocked': opts['accountNonLocked'],
        'attributes': opts['attributes'],
        'authorities[0].authority': opts['authorities0Authority'],
        'credentialsNonExpired': opts['credentialsNonExpired'],
        'email': opts['email'],
        'enabled': opts['enabled'],
        'id': opts['id'],
        'name': opts['name'],
        'password': opts['password'],
        'username': opts['username']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = ['application/json'];
      let accepts = ['*/*'];
      let returnType = Object;
      return this.apiClient.callApi(
        '/change-password', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the disableTwoFactorUsingPUT operation.
     * @callback module:api/UserControllerApi~disableTwoFactorUsingPUTCallback
     * @param {String} error Error message, if any.
     * @param {Object} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * disableTwoFactor
     * @param {Object} opts Optional parameters
     * @param {Boolean} [accountNonExpired] 
     * @param {Boolean} [accountNonLocked] 
     * @param {Object.<String, Object>} [attributes] 
     * @param {String} [authorities0Authority] 
     * @param {Boolean} [credentialsNonExpired] 
     * @param {String} [email] 
     * @param {Boolean} [enabled] 
     * @param {Number} [id] 
     * @param {String} [name] 
     * @param {String} [password] 
     * @param {String} [username] 
     * @param {module:api/UserControllerApi~disableTwoFactorUsingPUTCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object}
     */
    disableTwoFactorUsingPUT(opts, callback) {
      opts = opts || {};
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
        'accountNonExpired': opts['accountNonExpired'],
        'accountNonLocked': opts['accountNonLocked'],
        'attributes': opts['attributes'],
        'authorities[0].authority': opts['authorities0Authority'],
        'credentialsNonExpired': opts['credentialsNonExpired'],
        'email': opts['email'],
        'enabled': opts['enabled'],
        'id': opts['id'],
        'name': opts['name'],
        'password': opts['password'],
        'username': opts['username']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['*/*'];
      let returnType = Object;
      return this.apiClient.callApi(
        '/disable-two-factor', 'PUT',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the getCurrentUserUsingGET operation.
     * @callback module:api/UserControllerApi~getCurrentUserUsingGETCallback
     * @param {String} error Error message, if any.
     * @param {module:model/UserDto} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * getCurrentUser
     * @param {Object} opts Optional parameters
     * @param {Boolean} [accountNonExpired] 
     * @param {Boolean} [accountNonLocked] 
     * @param {Object.<String, Object>} [attributes] 
     * @param {String} [authorities0Authority] 
     * @param {Boolean} [credentialsNonExpired] 
     * @param {String} [email] 
     * @param {Boolean} [enabled] 
     * @param {Number} [id] 
     * @param {String} [name] 
     * @param {String} [password] 
     * @param {String} [username] 
     * @param {module:api/UserControllerApi~getCurrentUserUsingGETCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/UserDto}
     */
    getCurrentUserUsingGET(opts, callback) {
      opts = opts || {};
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
        'accountNonExpired': opts['accountNonExpired'],
        'accountNonLocked': opts['accountNonLocked'],
        'attributes': opts['attributes'],
        'authorities[0].authority': opts['authorities0Authority'],
        'credentialsNonExpired': opts['credentialsNonExpired'],
        'email': opts['email'],
        'enabled': opts['enabled'],
        'id': opts['id'],
        'name': opts['name'],
        'password': opts['password'],
        'username': opts['username']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['*/*'];
      let returnType = UserDto;
      return this.apiClient.callApi(
        '/user/me', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the getPlaceDetailsUsingGET operation.
     * @callback module:api/UserControllerApi~getPlaceDetailsUsingGETCallback
     * @param {String} error Error message, if any.
     * @param {Object} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * getPlaceDetails
     * @param {module:api/UserControllerApi~getPlaceDetailsUsingGETCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object}
     */
    getPlaceDetailsUsingGET(callback) {
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
      let returnType = Object;
      return this.apiClient.callApi(
        '/test', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the getTwoFactorSetupUsingPOST operation.
     * @callback module:api/UserControllerApi~getTwoFactorSetupUsingPOSTCallback
     * @param {String} error Error message, if any.
     * @param {module:model/TwoFactorSetupDto} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * getTwoFactorSetup
     * @param {Object} opts Optional parameters
     * @param {Boolean} [accountNonExpired] 
     * @param {Boolean} [accountNonLocked] 
     * @param {Object.<String, Object>} [attributes] 
     * @param {String} [authorities0Authority] 
     * @param {Boolean} [credentialsNonExpired] 
     * @param {String} [email] 
     * @param {Boolean} [enabled] 
     * @param {Number} [id] 
     * @param {String} [name] 
     * @param {String} [password] 
     * @param {String} [username] 
     * @param {module:api/UserControllerApi~getTwoFactorSetupUsingPOSTCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/TwoFactorSetupDto}
     */
    getTwoFactorSetupUsingPOST(opts, callback) {
      opts = opts || {};
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
        'accountNonExpired': opts['accountNonExpired'],
        'accountNonLocked': opts['accountNonLocked'],
        'attributes': opts['attributes'],
        'authorities[0].authority': opts['authorities0Authority'],
        'credentialsNonExpired': opts['credentialsNonExpired'],
        'email': opts['email'],
        'enabled': opts['enabled'],
        'id': opts['id'],
        'name': opts['name'],
        'password': opts['password'],
        'username': opts['username']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['*/*'];
      let returnType = TwoFactorSetupDto;
      return this.apiClient.callApi(
        '/two-factor-setup', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the logoutUsingPOST operation.
     * @callback module:api/UserControllerApi~logoutUsingPOSTCallback
     * @param {String} error Error message, if any.
     * @param {Object} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * logout
     * @param {Object} opts Optional parameters
     * @param {Boolean} [accountNonExpired] 
     * @param {Boolean} [accountNonLocked] 
     * @param {Object.<String, Object>} [attributes] 
     * @param {String} [authorities0Authority] 
     * @param {Boolean} [credentialsNonExpired] 
     * @param {String} [email] 
     * @param {Boolean} [enabled] 
     * @param {Number} [id] 
     * @param {String} [name] 
     * @param {String} [password] 
     * @param {String} [username] 
     * @param {module:api/UserControllerApi~logoutUsingPOSTCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object}
     */
    logoutUsingPOST(opts, callback) {
      opts = opts || {};
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
        'accountNonExpired': opts['accountNonExpired'],
        'accountNonLocked': opts['accountNonLocked'],
        'attributes': opts['attributes'],
        'authorities[0].authority': opts['authorities0Authority'],
        'credentialsNonExpired': opts['credentialsNonExpired'],
        'email': opts['email'],
        'enabled': opts['enabled'],
        'id': opts['id'],
        'name': opts['name'],
        'password': opts['password'],
        'username': opts['username']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['*/*'];
      let returnType = Object;
      return this.apiClient.callApi(
        '/logout', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the updateProfileUsingPUT operation.
     * @callback module:api/UserControllerApi~updateProfileUsingPUTCallback
     * @param {String} error Error message, if any.
     * @param {Object} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * updateProfile
     * @param {module:model/UserDto} userDto userDto
     * @param {Object} opts Optional parameters
     * @param {Boolean} [accountNonExpired] 
     * @param {Boolean} [accountNonLocked] 
     * @param {Object.<String, Object>} [attributes] 
     * @param {String} [authorities0Authority] 
     * @param {Boolean} [credentialsNonExpired] 
     * @param {String} [email] 
     * @param {Boolean} [enabled] 
     * @param {Number} [id] 
     * @param {String} [name] 
     * @param {String} [password] 
     * @param {String} [username] 
     * @param {module:api/UserControllerApi~updateProfileUsingPUTCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object}
     */
    updateProfileUsingPUT(userDto, opts, callback) {
      opts = opts || {};
      let postBody = userDto;
      // verify the required parameter 'userDto' is set
      if (userDto === undefined || userDto === null) {
        throw new Error("Missing the required parameter 'userDto' when calling updateProfileUsingPUT");
      }

      let pathParams = {
      };
      let queryParams = {
        'accountNonExpired': opts['accountNonExpired'],
        'accountNonLocked': opts['accountNonLocked'],
        'attributes': opts['attributes'],
        'authorities[0].authority': opts['authorities0Authority'],
        'credentialsNonExpired': opts['credentialsNonExpired'],
        'email': opts['email'],
        'enabled': opts['enabled'],
        'id': opts['id'],
        'name': opts['name'],
        'password': opts['password'],
        'username': opts['username']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = ['application/json'];
      let accepts = ['*/*'];
      let returnType = Object;
      return this.apiClient.callApi(
        '/update-profile', 'PUT',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the verifyTwoFactorUsingPOST operation.
     * @callback module:api/UserControllerApi~verifyTwoFactorUsingPOSTCallback
     * @param {String} error Error message, if any.
     * @param {module:model/TwoFactorDto} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * verifyTwoFactor
     * @param {module:model/TwoFactorVerificationRequestDto} twoFactorVerificationRequestDto twoFactorVerificationRequestDto
     * @param {Object} opts Optional parameters
     * @param {Boolean} [accountNonExpired] 
     * @param {Boolean} [accountNonLocked] 
     * @param {Object.<String, Object>} [attributes] 
     * @param {String} [authorities0Authority] 
     * @param {Boolean} [credentialsNonExpired] 
     * @param {String} [email] 
     * @param {Boolean} [enabled] 
     * @param {Number} [id] 
     * @param {String} [name] 
     * @param {String} [password] 
     * @param {String} [username] 
     * @param {module:api/UserControllerApi~verifyTwoFactorUsingPOSTCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/TwoFactorDto}
     */
    verifyTwoFactorUsingPOST(twoFactorVerificationRequestDto, opts, callback) {
      opts = opts || {};
      let postBody = twoFactorVerificationRequestDto;
      // verify the required parameter 'twoFactorVerificationRequestDto' is set
      if (twoFactorVerificationRequestDto === undefined || twoFactorVerificationRequestDto === null) {
        throw new Error("Missing the required parameter 'twoFactorVerificationRequestDto' when calling verifyTwoFactorUsingPOST");
      }

      let pathParams = {
      };
      let queryParams = {
        'accountNonExpired': opts['accountNonExpired'],
        'accountNonLocked': opts['accountNonLocked'],
        'attributes': opts['attributes'],
        'authorities[0].authority': opts['authorities0Authority'],
        'credentialsNonExpired': opts['credentialsNonExpired'],
        'email': opts['email'],
        'enabled': opts['enabled'],
        'id': opts['id'],
        'name': opts['name'],
        'password': opts['password'],
        'username': opts['username']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = ['application/json'];
      let accepts = ['*/*'];
      let returnType = TwoFactorDto;
      return this.apiClient.callApi(
        '/verify-two-factor', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }


}
