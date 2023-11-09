export default {
    email           : [ 'required', 'trim', 'email' ],
    subjectName     : [ 'required', 'trim', 'string' ],
    workspace       : [ 'required', 'trim', 'string' ],
    password        : [ 'required', 'trim', 'string' ],
    phone           : [  'trim', 'string' ],
    passwordConfirm : [ 'required', 'trim', 'string', { 'equal_to_field': 'password' } ],
    privacyPolicy   : { 'one_of': [ true ] }
};
