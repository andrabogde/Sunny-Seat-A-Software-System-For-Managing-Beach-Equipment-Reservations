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
import Plaja from './Plaja';
import Pret from './Pret';
import StareEchipamentPlaja from './StareEchipamentPlaja';
import TipEchipamentPlaja from './TipEchipamentPlaja';

/**
 * The EchipamentPlaja model module.
 * @module model/EchipamentPlaja
 * @version 1.0
 */
class EchipamentPlaja {
    /**
     * Constructs a new <code>EchipamentPlaja</code>.
     * @alias module:model/EchipamentPlaja
     */
    constructor() { 
        
        EchipamentPlaja.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>EchipamentPlaja</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/EchipamentPlaja} obj Optional instance to populate.
     * @return {module:model/EchipamentPlaja} The populated <code>EchipamentPlaja</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new EchipamentPlaja();

            if (data.hasOwnProperty('activ')) {
                obj['activ'] = ApiClient.convertToType(data['activ'], 'Boolean');
            }
            if (data.hasOwnProperty('denumire')) {
                obj['denumire'] = ApiClient.convertToType(data['denumire'], 'String');
            }
            if (data.hasOwnProperty('id')) {
                obj['id'] = ApiClient.convertToType(data['id'], 'Number');
            }
            if (data.hasOwnProperty('plaja')) {
                obj['plaja'] = Plaja.constructFromObject(data['plaja']);
            }
            if (data.hasOwnProperty('pozitieColoana')) {
                obj['pozitieColoana'] = ApiClient.convertToType(data['pozitieColoana'], 'Number');
            }
            if (data.hasOwnProperty('pozitieLinie')) {
                obj['pozitieLinie'] = ApiClient.convertToType(data['pozitieLinie'], 'Number');
            }
            if (data.hasOwnProperty('pretCurent')) {
                obj['pretCurent'] = Pret.constructFromObject(data['pretCurent']);
            }
            if (data.hasOwnProperty('preturi')) {
                obj['preturi'] = ApiClient.convertToType(data['preturi'], [Pret]);
            }
            if (data.hasOwnProperty('stareEchipament')) {
                obj['stareEchipament'] = StareEchipamentPlaja.constructFromObject(data['stareEchipament']);
            }
            if (data.hasOwnProperty('tipEchipament')) {
                obj['tipEchipament'] = TipEchipamentPlaja.constructFromObject(data['tipEchipament']);
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>EchipamentPlaja</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>EchipamentPlaja</code>.
     */
    static validateJSON(data) {
        // ensure the json data is a string
        if (data['denumire'] && !(typeof data['denumire'] === 'string' || data['denumire'] instanceof String)) {
            throw new Error("Expected the field `denumire` to be a primitive type in the JSON string but got " + data['denumire']);
        }
        // validate the optional field `plaja`
        if (data['plaja']) { // data not null
          Plaja.validateJSON(data['plaja']);
        }
        // validate the optional field `pretCurent`
        if (data['pretCurent']) { // data not null
          Pret.validateJSON(data['pretCurent']);
        }
        if (data['preturi']) { // data not null
            // ensure the json data is an array
            if (!Array.isArray(data['preturi'])) {
                throw new Error("Expected the field `preturi` to be an array in the JSON data but got " + data['preturi']);
            }
            // validate the optional field `preturi` (array)
            for (const item of data['preturi']) {
                Pret.validateJSON(item);
            };
        }
        // validate the optional field `stareEchipament`
        if (data['stareEchipament']) { // data not null
          StareEchipamentPlaja.validateJSON(data['stareEchipament']);
        }
        // validate the optional field `tipEchipament`
        if (data['tipEchipament']) { // data not null
          TipEchipamentPlaja.validateJSON(data['tipEchipament']);
        }

        return true;
    }


}



/**
 * @member {Boolean} activ
 */
EchipamentPlaja.prototype['activ'] = undefined;

/**
 * @member {String} denumire
 */
EchipamentPlaja.prototype['denumire'] = undefined;

/**
 * @member {Number} id
 */
EchipamentPlaja.prototype['id'] = undefined;

/**
 * @member {module:model/Plaja} plaja
 */
EchipamentPlaja.prototype['plaja'] = undefined;

/**
 * @member {Number} pozitieColoana
 */
EchipamentPlaja.prototype['pozitieColoana'] = undefined;

/**
 * @member {Number} pozitieLinie
 */
EchipamentPlaja.prototype['pozitieLinie'] = undefined;

/**
 * @member {module:model/Pret} pretCurent
 */
EchipamentPlaja.prototype['pretCurent'] = undefined;

/**
 * @member {Array.<module:model/Pret>} preturi
 */
EchipamentPlaja.prototype['preturi'] = undefined;

/**
 * @member {module:model/StareEchipamentPlaja} stareEchipament
 */
EchipamentPlaja.prototype['stareEchipament'] = undefined;

/**
 * @member {module:model/TipEchipamentPlaja} tipEchipament
 */
EchipamentPlaja.prototype['tipEchipament'] = undefined;






export default EchipamentPlaja;

