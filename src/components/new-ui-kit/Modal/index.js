

import { connect }                         from 'react-redux';
import { withActionSheet }                 from '../../hoc/connectActionSheet';
import { withKeyboardEvents }              from '../../hoc/withKeyboardEvents';
import { isUserLogedInSelector }           from '../../../selectors/session';
import Modal                               from './Modal';


export default withKeyboardEvents(
    connect(
        state => ({
            colorMode     : state.theme.mode,
            isUserLogedIn : isUserLogedInSelector(state)
        })
    )(withActionSheet(Modal))
);
