export default {
    email    : { email: [ 'required', 'trim', 'email' ], workspace: [ 'required', 'trim' ] },
    code     : { code: [ 'required', 'trim', { 'min_length': 6, 'max_length': 6 } ] },
    password : {
        password        : [ 'required', 'trim', 'string', { 'min_length': 6 } ],
        passwordConfirm : [ 'required', 'trim', 'string', { 'equal_to_field': 'password', 'min_length': 6 } ]
    }
};
