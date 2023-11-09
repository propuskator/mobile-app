export default {
    name                 : [ 'required', 'trim', 'string' ],
    logoType             : [ 'string' ],
    logoColor            : [ 'string' ],
    accessTokenReaderIds : [ 'required', { 'list_of': 'string' } ]
};
