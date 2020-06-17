import axios from 'axios';
import url from 'url';
import _merge from 'lodash/merge';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _forEach from 'lodash/forEach';

const CancelToken = axios.CancelToken;

const baseUrl = 'http://localhost:8080';

class ApiClient {

  constructor(options = {}) {
    this.source = CancelToken.source();
    const defaultHeaders = {
      'Cache-Control': 'no-cache,no-store',
      Pragma: 'no-cache',
      Expires: '0'
    };
    const apiClient = axios.create({
      baseURL: url.format(options.baseURL|| baseUrl),
      timeout: options.timeout || 30000,
      headers: _merge({}, defaultHeaders, options.headers),
    });

    const requestInterceptors = _get(options, 'interceptors.request');
    if (!_isEmpty(requestInterceptors)) {
      _forEach(requestInterceptors, ({ onSuccess, onFailure }) => {
        apiClient.request.use(onSuccess, onFailure);
      });
    }

    const responseInterceptors = _get(options, 'interceptors.response');
    if (!_isEmpty(responseInterceptors)) {
      _forEach(responseInterceptors, ({ onSuccess, onFailure }) => {
        apiClient.response.use(onSuccess, onFailure);
      });
    }

    this.apiClient = apiClient;
  }

  _executeRequest(method, pathname, data, options = {}) {
    const body = method === 'get' || !data ? {} : { data };
    const reqObj = {
      method,
      url: pathname,
      timeout: options.timeout || 30000,
      headers: options.headers,
      params: options.query,
      cancelToken: this.source.token,
      ...body
    };
    return this.apiClient.request(reqObj);
  }

  get(pathname, options) {
    return this._executeRequest('get', pathname, null, options);
  }

  post(pathname, data, options) {
    return this._executeRequest('post', pathname, data, options);
  }

  put(pathname, data, options) {
    return this._executeRequest('put', pathname, data, options);
  }

  delete(pathname, data, options) {
    return this._executeRequest('delete', pathname, data, options);
  }

  cancelAll() {
    this.source.cancel();
    this.source = CancelToken.source();
  }

  all = promises => axios.all(promises)

  injectInterceptor(type = 'REQUEST', { onSuccess, onFailure } = {}) {
    switch (type) {
      case 'REQUEST':
        return this.apiClient.interceptors.request.use(onSuccess, onFailure);
      case 'RESPONSE':
        return this.apiClient.interceptors.response.use(onSuccess, onFailure);
      default:
        throw new Error('Invalid type');
    }
  }

  ejectInterceptor(type = 'REQUEST', interceptor) {
    switch (type) {
      case 'REQUEST':
        this.apiClient.interceptors.request.eject(interceptor);
        break;
      case 'RESPONSE':
        this.apiClient.interceptors.response.eject(interceptor);
        break;
      default:
        throw new Error('Invalid type');
    }
  }

}

export function configureClient(options = {}) {
  return new ApiClient(options);
}

function configureDefaultClient(options = {}) {
  const defaultClient = configureClient(options); // add default options if needed
  return defaultClient;
}

export default configureDefaultClient();
