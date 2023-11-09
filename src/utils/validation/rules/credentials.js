export default {
    email           : [ 'required', 'trim', 'email' ],
    password        : [ 'required', 'trim', 'string' ],
    passwordConfirm : [ 'required', 'trim', 'string', { 'equal_to_field': 'password' } ]
};
