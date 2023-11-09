import produce from 'immer';
import {
    GET_ACESS_POINTS_SUCCESS,
    GET_ACESS_POINTS_ERROR,
    CHANGE_ACESS_POINT_PROCESSING,
    STOP_ACESS_POINTS_PROCESSING,
    START_ACESS_POINTS_PROCESSING,
    UPDATE_LOCAL_ACCESS_POINTS

} from '../actions/accessPoints';
import { LOGOUT }                   from '../actions/session';

const initialState = {
    isFetching     : true,
    isUpdating     : false,
    list           : [],
    processingList : []
};

export default produce((draft, action) => {
    const { type, payload } = action;

    switch (type) {
        case START_ACESS_POINTS_PROCESSING: {
            if (draft.list.length) {
                draft.isUpdating  = true;
            } else {
                draft.isFetching = true;
            }
            break;
        }
        case STOP_ACESS_POINTS_PROCESSING: {
            draft.isFetching = false;
            draft.isUpdating = false;
            break;
        }

        case GET_ACESS_POINTS_SUCCESS: {
            const { list } = payload;

            draft.list = list;
            break;
        }

        case GET_ACESS_POINTS_ERROR: {
            draft.isFetching = false;
            draft.isUpdating = false;
            break;
        }

        case CHANGE_ACESS_POINT_PROCESSING: {
            const { id, status } = payload;

            if (status) draft.processingList.push(id);
            else draft.processingList = draft.processingList.filter(processingId => processingId !== id);

            break;
        }

        case UPDATE_LOCAL_ACCESS_POINTS: {
            const { points } = action.payload;

            draft.list = points;

            break;
        }
        case LOGOUT: {
            return initialState;
        }
        default:
            break;
    }
}, initialState);
