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

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', process.cwd()+'/src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require(process.cwd()+'/src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.ApiDocumentation);
  }
}(this, function(expect, ApiDocumentation) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new ApiDocumentation.TwoFactorRecoveryCode();
  });

  var getProperty = function(object, getter, property) {
    // Use getter method if present; otherwise, get the property directly.
    if (typeof object[getter] === 'function')
      return object[getter]();
    else
      return object[property];
  }

  var setProperty = function(object, setter, property, value) {
    // Use setter method if present; otherwise, set the property directly.
    if (typeof object[setter] === 'function')
      object[setter](value);
    else
      object[property] = value;
  }

  describe('TwoFactorRecoveryCode', function() {
    it('should create an instance of TwoFactorRecoveryCode', function() {
      // uncomment below and update the code to test TwoFactorRecoveryCode
      //var instance = new ApiDocumentation.TwoFactorRecoveryCode();
      //expect(instance).to.be.a(ApiDocumentation.TwoFactorRecoveryCode);
    });

    it('should have the property id (base name: "id")', function() {
      // uncomment below and update the code to test the property id
      //var instance = new ApiDocumentation.TwoFactorRecoveryCode();
      //expect(instance).to.be();
    });

    it('should have the property recoveryCode (base name: "recoveryCode")', function() {
      // uncomment below and update the code to test the property recoveryCode
      //var instance = new ApiDocumentation.TwoFactorRecoveryCode();
      //expect(instance).to.be();
    });

    it('should have the property user (base name: "user")', function() {
      // uncomment below and update the code to test the property user
      //var instance = new ApiDocumentation.TwoFactorRecoveryCode();
      //expect(instance).to.be();
    });

    it('should have the property userId (base name: "userId")', function() {
      // uncomment below and update the code to test the property userId
      //var instance = new ApiDocumentation.TwoFactorRecoveryCode();
      //expect(instance).to.be();
    });

  });

}));
