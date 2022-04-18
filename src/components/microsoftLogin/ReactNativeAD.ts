/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/camelcase */
import AsyncStorage from '@react-native-community/async-storage';
import Timer from 'react-timer-mixin';
import type {
  ADConfig,
  ADCredentials,
  GrantTokenResp,
  ReactNativeADCredential,
} from './types';

const defaultTokenUrl = 'https://login.microsoftonline.com/common/oauth2/token';

const _contexts = {};

export const CONST = {
  GRANT_TYPE: {
    AUTHORIZATION_CODE: 'authorization_code',
    REFRESH_TOKEN: 'refresh_token',
  },
};

export default class ReactNativeAD {
  config: ADConfig;

  credentials: ADCredentials;

  static getContext(client_id: string): ReactNativeAD {
    return _contexts[client_id];
  }

  static removeContext(client_id: string) {
    delete _contexts[client_id];
  }

  static ResourceOwnerPasswordCredential(data) {
    const url = `https://login.windows.net/${data.tenant_id}/oauth2/token`;
    const {resource, client_id, username, password} = data;
    const urlencode = [
      `resource=${encodeURIComponent(resource)}`,
      'grant_type=password',
      `client_id=${client_id}`,
      `username=${username}`,
      `password=${password}`,
    ].join('$');

    fetch(url, {method: 'POST', body: urlencode});
  }

  constructor(config: ADConfig) {
    if (config === null || config === undefined) {
      throw new Error('Invalid ADConfig object');
    }
    if (typeof config.client_id !== 'string') {
      throw new Error('client_id is not provided.');
    }
    if (config.tenant != null) {
      config.token_uri = defaultTokenUrl.replace('common', config.tenant);
    }
    this.config = config;
    this.credentials = {};
    _contexts[config.client_id] = this;
  }

  getConfig(): ADConfig {
    return this.config;
  }

  getCredentials(): ADCredentials | null {
    return this.credentials;
  }

  /**
   * Save login credentials to async storage, with key = <client id>.<resource id>.
   * For example, client_id = eabc-123 resource=http://graph.microsoft.com will
   * be stored in an entry with key `eabc-123.http://graph.microsoft.com`.
   * @param  {ADCredentials} data  Credentials key-value pair,
   *         this object uses resourece as its key and `ReactNativeADCredential`
   *         as its value.
   * @return {Promise} .
   */
  saveCredentials(data: ADCredentials): Promise<any> {
    return new Promise((resolve, reject) => {
      const pairs = [];
      for (const resource in data) {
        if (resource && data[resource]) {
          pairs.push([
            `${this.config.client_id}.${resource}`,
            JSON.stringify(data[resource]),
          ]);
        } else {
          console.warn(
            `counld not save credential for ${resource}=${data[resource]} for its key/value is null/undefeind.`,
          );
        }
      }
      Object.assign(this.credentials, data);
    });
  }

  /**
   * Get access token by given resource id, if no corresponding token exists,
   * returns null.
   * @param  {string} resource The resource ID.
   * @return {?string} Access token of the resource.
   */
  getAccessToken(resource: string): string | null {
    let result: ReactNativeADCredential | null = null;
    result = this.credentials ? this.credentials[resource] : null;

    if (result !== null) {
      return result.access_token;
    }
    return null;
  }

  /**
   * Assure that access_token of a resource is valid, this when access token
   * is expired, this method refresh access token automatically and returns
   * renewed access token in promise.
   * @param  {string} resource  Resource Id.
   * @return {Promise<string>} A promise with access_token string.
   */
  assureToken(resource: string): Promise<string> {
    const context = this;
    // Check credential of the resource
    return this.checkCredential(resource).then(
      (cred: ReactNativeADCredential | null) => {
        if (!cred) return context.refreshToken(resource);
        // Credaentials found, check if token expired.
        const expires_on = cred.expires_on * 1000;
        // Token not expired, resolve token
        if (Date.now() - expires_on <= -60000)
          return Promise.resolve(cred.access_token);
        // Token expired, call refresh token
        return context.refreshToken(resource);
      },
    );
  }

  /**
   * Refresh token of the resource, when credentials is empty or resource does
   * not have refresh token, it will try to grant access token for resource.
   * @param  {string} resource Resource id.
   * @return {Promise<string>} When success, promise resolves new `access_token`
   */
  refreshToken(resourceId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.checkCredential(resourceId).then(
        (cred: ReactNativeADCredential | null) => {
          const config = {
            refresh_token: cred ? cred.refresh_token : null,
            client_id: this.config.client_id,
            client_secret: this.config.client_secret,
            resource: resourceId,
          };
          let grantType = CONST.GRANT_TYPE.REFRESH_TOKEN;
          if (!cred) grantType = CONST.GRANT_TYPE.AUTHORIZATION_CODE;
          this.grantAccessToken(grantType, config)
            .then((resp: GrantTokenResp) => {
              resolve(resp.response.access_token);
            })
            .catch((err) => {
              reject(err);
            });
        },
      );
    });
  }

  /**
   * Check credentials of the resource exist or not.
   * @param  {string} resourceId The resource ID.
   * @return {Promise<ReactNativeADCredential | null>} When credential does not exist, resolve
   *                           `null`, otherwise resolve `ReactNativeADCredential`
   */
  checkCredential(resourceId: string): Promise<ReactNativeADCredential | null> {
    const context = this;
    return new Promise((resolve, reject) => {
      const resourceKey = _getResourceKey(context.config, resourceId);
      const cachedCred = context.credentials[resourceId];
      resolve(cachedCred);
    });
  }

  /**
   * Get access_token by `given grant_type` and params, when this process
   * success, it stores credentials in format of `ReactNativeADCredential`,
   * in both ReactNativeAD.credentials and AsyncStorage.
   * @param  {string {enum: authorization_code, refresh_token, password}} grantType
   * Responsed from ReactNativeAD#handleADToken.
   * @param  {object} params Urlencoded form data in hashmap format
   * @return {Promise<GrantTokenResp>}  .
   */
  grantAccessToken(grantType: string, params: any): Promise<GrantTokenResp> {
    // If resource is null or undefined, use `common` by default
    params.resource = params.resource || 'common';
    if (grantType === 'password') params.client_id = this.config.client_id;
    return new Promise((resolve, reject) => {
      try {
        const tm = Timer.setTimeout(() => {
          reject('time out');
        }, 15000);

        const body = `grant_type=${grantType}${_serialize(params)}`;
        fetch(this.config.token_uri ? this.config.token_uri : defaultTokenUrl, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        })
          .then((response) => {
            Timer.clearTimeout(tm);
            return response.text();
          })
          .then((res) => {
            const cred: GrantTokenResp = {
              resource: params.resource,
              response: JSON.parse(res.replace('access_token=', '')),
            };
            // save to memory context
            this.credentials[params.resource] = cred.response;
            // save to persistent context
            const cacheKey = _getResourceKey(this.config, params.resource);
            if (cred.response.access_token) {
              AsyncStorage.setItem(cacheKey, JSON.stringify(cred.response));
              // truncate prefix
              resolve(cred);
            } else {
              reject(cred);
            }
          })
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }
}

/**
 * Helper function to combine cache resource hash key.
 * @param  {ADConfig} config   Configuration of ReactNativeAD Object.
 * @param  {string} resourceId The resource id.
 * @return {string} Result of hash key.
 */
function _getResourceKey(config: ADConfig, resourceId: string): string {
  return `${config.client_id}.${resourceId}`;
}

/**
 * Helper function to serialize object into urlencoded form data string, properties
 * which value is either `null` or `undefined` will be ignored.
 * @param  {Object} params Object which contains props.
 * @return {string} Result form data string.
 */
function _serialize(params: Record<string, any>): string {
  let paramStr = '';
  for (const prop in params) {
    if (
      params[prop] !== null &&
      params[prop] !== void 0 &&
      prop !== 'grant_type'
    ) {
      paramStr += `&${prop}=${encodeURIComponent(params[prop])}`;
    }
  }
  return paramStr;
}
