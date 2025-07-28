# ApiDocumentation.User

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**authProvider** | **String** |  | [optional] 
**email** | **String** |  | [optional] 
**emailVerified** | **Boolean** |  | [optional] 
**id** | **Number** |  | [optional] 
**jwtTokens** | [**[JwtToken]**](JwtToken.md) |  | [optional] 
**name** | **String** |  | [optional] 
**password** | **String** |  | [optional] 
**profileImage** | [**FileDb**](FileDb.md) |  | [optional] 
**providerId** | **String** |  | [optional] 
**requestedNewEmail** | **String** |  | [optional] 
**role** | **String** |  | [optional] 
**twoFactorEnabled** | **Boolean** |  | [optional] 
**twoFactorRecoveryCodes** | [**[TwoFactorRecoveryCode]**](TwoFactorRecoveryCode.md) |  | [optional] 
**twoFactorSecret** | **String** |  | [optional] 



## Enum: AuthProviderEnum


* `facebook` (value: `"facebook"`)

* `github` (value: `"github"`)

* `google` (value: `"google"`)

* `local` (value: `"local"`)





## Enum: RoleEnum


* `ADMIN` (value: `"ADMIN"`)

* `USER` (value: `"USER"`)




