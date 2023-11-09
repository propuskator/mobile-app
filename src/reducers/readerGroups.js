import produce from 'immer';
import {
    GET_READER_GROUPS_SUCCESS,
    GET_READER_GROUPS_ERROR,
    STOP_READER_GROUPS_PROCESSING,
    START_READER_GROUPS_PROCESSING,
    GET_READER_GROUPS_LOGOS_START,
    GET_READER_GROUPS_LOGOS_SUCCESS,
    GET_READER_GROUPS_LOGOS_ERROR,
    DELETE_GROUP_START,
    DELETE_GROUP_END,
    DELETE_GROUP_SUCCESS,
    CREATE_READER_GROUP_SUCCESS,
    UPDATE_READER_GROUP_SUCCESS
}                                   from '../actions/readerGroups';
import { LOGOUT }                   from '../actions/session';


const initialState = {
    isFetching      : true,
    isUpdating      : false,
    list            : [],
    logosById       : {},
    isLogosFetching : true,
    deletingGroups  : []
};

export default produce((draft, action) => {
    const { type, payload } = action;

    switch (type) {
        case START_READER_GROUPS_PROCESSING: {
            if (draft.list.length) {
                draft.isUpdating  = true;
            } else {
                draft.isFetching = true;
            }
            break;
        }
        case CREATE_READER_GROUP_SUCCESS: {
            draft.list = [ payload.entity, ...draft.list ];
            break;
        }
        case UPDATE_READER_GROUP_SUCCESS: {
            draft.list = payload.entity?.map(item => {
                return item?.id === payload.entity?.id ? payload.entity : item;
            });
            break;
        }
        case STOP_READER_GROUPS_PROCESSING: {
            draft.isFetching = false;
            draft.isUpdating = false;
            break;
        }
        case GET_READER_GROUPS_SUCCESS: {
            const { list } = payload;

            draft.list = list;
            break;
        }

        case GET_READER_GROUPS_ERROR: {
            draft.isFetching = false;
            break;
        }

        case GET_READER_GROUPS_LOGOS_START: {
            draft.isLogosFetching = true;
            break;
        }

        case GET_READER_GROUPS_LOGOS_SUCCESS: {
            draft.isLogosFetching = false;
            draft.logosById = payload?.logos;
            break;
        }

        case GET_READER_GROUPS_LOGOS_ERROR: {
            draft.isLogosFetching = false;
            break;
        }

        case DELETE_GROUP_START: {
            draft.deletingGroups = [ ...(draft.deletingGroups || []), payload?.groupId ];
            break;
        }

        case DELETE_GROUP_END: {
            draft.deletingGroups = draft.deletingGroups?.filter(groupId => groupId !== payload?.groupId);
            break;
        }

        case DELETE_GROUP_SUCCESS: {
            draft.list = draft.list?.filter(group => group?.id !== payload?.groupId);
            break;
        }

        case LOGOUT: {
            return initialState;
        }
        default:
            break;
    }
}, initialState);
