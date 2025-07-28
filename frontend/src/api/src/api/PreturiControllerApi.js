/**
 * PreturiControllerApi
 * API pentru gestionarea prețurilor echipamentelor de plajă
 */

export default class PreturiControllerApi {
  /**
   * @param {ApiClient} apiClient
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  /**
   * GET /api/preturi - Obține toate prețurile
   * @param {Function} callback - callback function
   * @return {Promise} promisiune
   */
  getAllPreturi(callback) {
    const postBody = null;

    // verify the required parameter 'callback' is set
    if (callback === undefined || callback === null) {
      return new Promise((resolve, reject) => {
        this.getAllPreturiWithHttpInfo()
          .then(response => resolve(response.data))
          .catch(reject);
      });
    }

    const pathParams = {};
    const queryParams = {};
    const headerParams = {};
    const formParams = {};

    const authNames = ['bearerAuth'];
    const contentTypes = [];
    const accepts = ['application/json'];
    const returnType = 'Object';

    return this.apiClient.callApi(
      '/api/preturi/with-full-details', 'GET',
      pathParams, queryParams, headerParams, formParams, postBody,
      authNames, contentTypes, accepts, returnType, callback
    );
  }

  /**
   * GET /api/preturi - Obține toate prețurile (cu info HTTP)
   * @return {Promise} promisiune cu informații HTTP complete
   */
  getAllPreturiWithHttpInfo() {
    const postBody = null;
    const pathParams = {};
    const queryParams = {};
    const headerParams = {};
    const formParams = {};

    const authNames = ['bearerAuth'];
    const contentTypes = [];
    const accepts = ['application/json'];
    const returnType = 'Object';

    return this.apiClient.callApi(
      '/api/preturi', 'GET',
      pathParams, queryParams, headerParams, formParams, postBody,
      authNames, contentTypes, accepts, returnType
    );
  }

  /**
   * GET /api/preturi/{id} - Obține un preț după ID
   * @param {Number} id - ID-ul prețului
   * @param {Function} callback - callback function
   * @return {Promise} promisiune
   */
  getPretById(id, callback) {
    const postBody = null;

    // verify the required parameter 'id' is set
    if (id === undefined || id === null) {
      throw new Error("Missing the required parameter 'id' when calling getPretById");
    }

    if (callback === undefined || callback === null) {
      return new Promise((resolve, reject) => {
        this.getPretByIdWithHttpInfo(id)
          .then(response => resolve(response.data))
          .catch(reject);
      });
    }

    const pathParams = {
      'id': id
    };
    const queryParams = {};
    const headerParams = {};
    const formParams = {};

    const authNames = ['bearerAuth'];
    const contentTypes = [];
    const accepts = ['application/json'];
    const returnType = 'Object';

    return this.apiClient.callApi(
      '/api/preturi/{id}', 'GET',
      pathParams, queryParams, headerParams, formParams, postBody,
      authNames, contentTypes, accepts, returnType, callback
    );
  }

  /**
   * POST /api/preturi - Creează un preț nou
   * @param {Object} pret - Datele prețului de creat
   * @param {Function} callback - callback function
   * @return {Promise} promisiune
   */
  createPret(pret, callback) {
    // verify the required parameter 'pret' is set
    if (pret === undefined || pret === null) {
      throw new Error("Missing the required parameter 'pret' when calling createPret");
    }

    if (callback === undefined || callback === null) {
      return new Promise((resolve, reject) => {
        this.createPretWithHttpInfo(pret)
          .then(response => resolve(response.data))
          .catch(reject);
      });
    }

    const postBody = pret;
    const pathParams = {};
    const queryParams = {};
    const headerParams = {};
    const formParams = {};

    const authNames = ['bearerAuth'];
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];
    const returnType = 'Object';

    return this.apiClient.callApi(
      '/api/preturi', 'POST',
      pathParams, queryParams, headerParams, formParams, postBody,
      authNames, contentTypes, accepts, returnType, callback
    );
  }

  /**
   * POST /api/preturi - Creează un preț nou (cu info HTTP)
   * @param {Object} pret - Datele prețului de creat
   * @return {Promise} promisiune cu informații HTTP complete
   */
  createPretWithHttpInfo(pret) {
    // verify the required parameter 'pret' is set
    if (pret === undefined || pret === null) {
      throw new Error("Missing the required parameter 'pret' when calling createPret");
    }

    const postBody = pret;
    const pathParams = {};
    const queryParams = {};
    const headerParams = {};
    const formParams = {};

    const authNames = ['bearerAuth'];
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];
    const returnType = 'Object';

    return this.apiClient.callApi(
      '/api/preturi', 'POST',
      pathParams, queryParams, headerParams, formParams, postBody,
      authNames, contentTypes, accepts, returnType
    );
  }

  /**
   * PUT /api/preturi/{id} - Actualizează un preț existent
   * @param {Number} id - ID-ul prețului
   * @param {Object} pret - Datele actualizate ale prețului
   * @param {Function} callback - callback function
   * @return {Promise} promisiune
   */
  updatePret(id, pret, callback) {
    // verify the required parameters are set
    if (id === undefined || id === null) {
      throw new Error("Missing the required parameter 'id' when calling updatePret");
    }
    if (pret === undefined || pret === null) {
      throw new Error("Missing the required parameter 'pret' when calling updatePret");
    }

    if (callback === undefined || callback === null) {
      return new Promise((resolve, reject) => {
        this.updatePretWithHttpInfo(id, pret)
          .then(response => resolve(response.data))
          .catch(reject);
      });
    }

    const postBody = pret;
    const pathParams = {
      'id': id
    };
    const queryParams = {};
    const headerParams = {};
    const formParams = {};

    const authNames = ['bearerAuth'];
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];
    const returnType = 'Object';

    return this.apiClient.callApi(
      '/api/preturi/{id}', 'PUT',
      pathParams, queryParams, headerParams, formParams, postBody,
      authNames, contentTypes, accepts, returnType, callback
    );
  }

  /**
   * DELETE /api/preturi/{id} - Șterge un preț
   * @param {Number} id - ID-ul prețului de șters
   * @param {Function} callback - callback function
   * @return {Promise} promisiune
   */
  deletePret(id, callback) {
    const postBody = null;

    // verify the required parameter 'id' is set
    if (id === undefined || id === null) {
      throw new Error("Missing the required parameter 'id' when calling deletePret");
    }

    if (callback === undefined || callback === null) {
      return new Promise((resolve, reject) => {
        this.deletePretWithHttpInfo(id)
          .then(response => resolve(response.data))
          .catch(reject);
      });
    }

    const pathParams = {
      'id': id
    };
    const queryParams = {};
    const headerParams = {};
    const formParams = {};

    const authNames = ['bearerAuth'];
    const contentTypes = [];
    const accepts = ['application/json'];
    const returnType = null;

    return this.apiClient.callApi(
      '/api/preturi/{id}', 'DELETE',
      pathParams, queryParams, headerParams, formParams, postBody,
      authNames, contentTypes, accepts, returnType, callback
    );
  }

  /**
   * GET /api/preturi/echipament/{echipamentPlajaId}/curent - Prețul curent pentru un echipament
   * @param {Number} echipamentPlajaId - ID-ul echipamentului de plajă
   * @param {Function} callback - callback function
   * @return {Promise} promisiune
   */
  getPretCurent(echipamentPlajaId, callback) {
    const postBody = null;

    // verify the required parameter 'echipamentPlajaId' is set
    if (echipamentPlajaId === undefined || echipamentPlajaId === null) {
      throw new Error("Missing the required parameter 'echipamentPlajaId' when calling getPretCurent");
    }

    if (callback === undefined || callback === null) {
      return new Promise((resolve, reject) => {
        this.getPretCurentWithHttpInfo(echipamentPlajaId)
          .then(response => resolve(response.data))
          .catch(reject);
      });
    }

    const pathParams = {
      'echipamentPlajaId': echipamentPlajaId
    };
    const queryParams = {};
    const headerParams = {};
    const formParams = {};

    const authNames = ['bearerAuth'];
    const contentTypes = [];
    const accepts = ['application/json'];
    const returnType = 'Object';

    return this.apiClient.callApi(
      '/api/preturi/echipament/{echipamentPlajaId}/curent', 'GET',
      pathParams, queryParams, headerParams, formParams, postBody,
      authNames, contentTypes, accepts, returnType, callback
    );
  }

  /**
   * GET /api/preturi/echipament/{echipamentPlajaId}/istoric - Istoricul prețurilor pentru un echipament
   * @param {Number} echipamentPlajaId - ID-ul echipamentului de plajă
   * @param {Function} callback - callback function
   * @return {Promise} promisiune
   */
  getPreturiWithDetails(callback) {
const postBody = null;

const pathParams = {};
const queryParams = {};
const headerParams = {};
const formParams = {};

const authNames = ['bearerAuth']; // dacă folosești token JWT, adaugă aici "bearerAuth"
const contentTypes = [];
const accepts = ['application/json'];
const returnType = null;

return this.apiClient.callApi(
  '/api/preturi/with-details', 'GET', // asigură-te că e exact ruta din Spring
  pathParams,
  queryParams,
  headerParams,
  formParams,
  postBody,
  authNames,
  contentTypes,
  accepts,
  returnType,
  null,
  callback
);
}

  getIstoricPreturi(echipamentPlajaId, callback) {
    const postBody = null;

    // verify the required parameter 'echipamentPlajaId' is set
    if (echipamentPlajaId === undefined || echipamentPlajaId === null) {
      throw new Error("Missing the required parameter 'echipamentPlajaId' when calling getIstoricPreturi");
    }

    if (callback === undefined || callback === null) {
      return new Promise((resolve, reject) => {
        this.getIstoricPreturiWithHttpInfo(echipamentPlajaId)
          .then(response => resolve(response.data))
          .catch(reject);
      });
    }

    const pathParams = {
      'echipamentPlajaId': echipamentPlajaId
    };
    const queryParams = {};
    const headerParams = {};
    const formParams = {};

    const authNames = ['bearerAuth'];
    const contentTypes = [];
    const accepts = ['application/json'];
    const returnType = Object;

    return this.apiClient.callApi(
      '/api/preturi/echipament/{echipamentPlajaId}/istoric', 'GET',
      pathParams, queryParams, headerParams, formParams, postBody,
      authNames, contentTypes, accepts, returnType, callback
    );
  }

  /**
   * GET /api/preturi/echipament/{echipamentPlajaId}/exists - Verifică dacă există prețuri pentru un echipament
   * @param {Number} echipamentPlajaId - ID-ul echipamentului de plajă
   * @param {Function} callback - callback function
   * @return {Promise} promisiune
   */
  hasPrices(echipamentPlajaId, callback) {
    const postBody = null;

    // verify the required parameter 'echipamentPlajaId' is set
    if (echipamentPlajaId === undefined || echipamentPlajaId === null) {
      throw new Error("Missing the required parameter 'echipamentPlajaId' when calling hasPrices");
    }

    if (callback === undefined || callback === null) {
      return new Promise((resolve, reject) => {
        this.hasPricesWithHttpInfo(echipamentPlajaId)
          .then(response => resolve(response.data))
          .catch(reject);
      });
    }

    const pathParams = {
      'echipamentPlajaId': echipamentPlajaId
    };
    const queryParams = {};
    const headerParams = {};
    const formParams = {};

    const authNames = ['bearerAuth'];
    const contentTypes = [];
    const accepts = ['application/json'];
    const returnType = 'Boolean';

    return this.apiClient.callApi(
      '/api/preturi/echipament/{echipamentPlajaId}/exists', 'GET',
      pathParams, queryParams, headerParams, formParams, postBody,
      authNames, contentTypes, accepts, returnType, callback
    );
  }
}