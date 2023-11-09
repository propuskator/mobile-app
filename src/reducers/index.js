import { combineReducers } from 'redux';

import session         from './session';
import connection      from './connection';
import snackbar        from './snackbar';
import accessPoints    from './accessPoints';
import subjectTokens   from './subjectTokens';
import users           from './users';
import theme           from './theme';
import homie           from './homie/homie';
import homieConnection from './homie/connection';
import readerGroups    from './readerGroups';
import linking         from './linking';


export default combineReducers({
    session,
    users,
    connection,
    snackbar,
    accessPoints,
    theme,
    homie,
    homieConnection,
    subjectTokens,
    readerGroups,
    linking
});
