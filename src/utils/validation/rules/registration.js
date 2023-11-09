export default {
    email           : [ 'required', 'trim', 'email' ],
    workspace       : [ 'required', 'trim', 'string' ],
    password        : [ 'required', 'trim', 'string' ],
    passwordConfirm : [ 'required', 'trim', 'string', { 'equal_to_field': 'password' } ],
    privacyPolicy   : { 'one_of': [ true ] }
};
