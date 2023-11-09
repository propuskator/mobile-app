export default {
    oldPassword     : [ 'required', 'trim', 'string' ],
    newPassword     : [ 'required', 'trim', 'string' ],
    passwordConfirm : [ 'required', 'trim', 'string', { 'equal_to_field': 'newPassword' } ]
};
