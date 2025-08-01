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

import ApiClient from '../ApiClient';

/**
 * The StareEchipamentPlaja model module.
 * @module model/StareEchipamentPlaja
 * @version 1.0
 */
class StareEchipamentPlaja {
    /**
     * Constructs a new <code>StareEchipamentPlaja</code>.
     * @alias module:model/StareEchipamentPlaja
     */
    constructor() { 
        
        StareEchipamentPlaja.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>StareEchipamentPlaja</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/StareEchipamentPlaja} obj Optional instance to populate.
     * @return {module:model/StareEchipamentPlaja} The populated <code>StareEchipamentPlaja</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new StareEchipamentPlaja();

            if (data.hasOwnProperty('dataOra')) {
                obj['dataOra'] = ApiClient.convertToType(data['dataOra'], 'Date');
            }
            if (data.hasOwnProperty('denumire')) {
                obj['denumire'] = ApiClient.convertToType(data['denumire'], 'String');
            }
            if (data.hasOwnProperty('id')) {
                obj['id'] = ApiClient.convertToType(data['id'], 'Number');
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>StareEchipamentPlaja</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>StareEchipamentPlaja</code>.
     */
    static validateJSON(data) {
        // ensure the json data is a string
        if (data['denumire'] && !(typeof data['denumire'] === 'string' || data['denumire'] instanceof String)) {
            throw new Error("Expected the field `denumire` to be a primitive type in the JSON string but got " + data['denumire']);
        }

        return true;
    }


}



/**
 * @member {Date} dataOra
 */
StareEchipamentPlaja.prototype['dataOra'] = undefined;

/**
 * @member {String} denumire
 */
StareEchipamentPlaja.prototype['denumire'] = undefined;

/**
 * @member {Number} id
 */
StareEchipamentPlaja.prototype['id'] = undefined;






export default StareEchipamentPlaja;

