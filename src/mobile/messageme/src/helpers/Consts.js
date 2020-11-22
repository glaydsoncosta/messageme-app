module.exports = {
    // Colors
    colorPrimary: '#2E58FF',
    colorPrimaryDark: '#2E58FF',
    colorWhite: '#FFFFFF',

    // API Endpoints
    api: {
        baseUrl: 'https://messageme-api.herokuapp.com/api/v1/',
        endpoint: {
            messages: {
                get: {
                    messages: 'messages'
                },
                post: {
                    markAsRead: 'messages/{message_id}/read'
                },
                delete: {
                }
            }    
        }
    },

    // Http status codes
    HTTP_STATUS_BAD_REQUEST: 400,
    HTTP_STATUS_UNAUTHORIZED: 401,
    HTTP_STATUS_FORBIDDEN: 403,
    HTTP_STATUS_NOT_FOUND: 404,
    HTTP_STATUS_BAD_GATEWAY: 502,
    HTTP_STATUS_SERVICE_UNAVAILABLE: 503,
    HTTP_STATUS_GATEWAY_TIMEOUT: 504,
    HTTP_STATUS_OK: 200,
    
    // HTTP Methods
    httpGet: 'GET',
    httpPost: 'POST',
    httpDELETE: 'DELETE',
    httpPUT: 'PUT',
    httpPATCH: 'PATCH',
};