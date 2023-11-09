export const ACTIONS_LIST = [ {
    label : 'On',
    id    : 'on'
}, {
    label : 'Off',
    id    : 'off'
}, {
    label : 'Toggle',
    id    : 'toggle'
} ];

const ACTIONS_BY_KEY = { };

Object.values(ACTIONS_LIST)?.forEach(action => {
    ACTIONS_BY_KEY[action?.id] = action?.label;
});

export {
    ACTIONS_BY_KEY
};
