const WHITE_MAIN  = '#FFFFFF';
const BLACK_MAIN  = '#1B312F';
const ORANGE_MAIN = '#EFA739';
const RED_MAIN    = '#FF4848';
const VIOLET      = '#647AFF';
const SALAD       = '#50CB93';

const GREEN_MAIN   = '#07C0B0';
const GREEN_LIGHT  = '#DAF6F3';
const GREEN_MEDIUM = '#80CBC4';
const GREEN_STRONG = '#40817D';
const GREEN_DARK   = '#409187';

const GREY_STRONG  = '#8D9796';
const GREY_MEDIUM  = '#B4BDBD';
const GREY_LIGHT   = '#EEEEEE';
const GREY_LIGHTER = '#F6F6F6';

const WHITE_MAIN__D  = '#2B2E3A';
const BLACK_MAIN__D  = '#EEEEEE';
const ORANGE_MAIN__D = '#EACD58';
const RED_MAIN__D    = '#F46E6E';
const SALAD__D       = '#8AD9B2';

const GREEN_MAIN__D   = '#80CBC4';
const GREEN_LIGHT__D  = '#172B2F';
const GREEN_STRONG__D = '#ABE4DD';

const GREY_STRONG__D  = '#91939F';
const GREY_MEDIUM__D  = '#696B76';
const GREY_LIGHT__D   = '#555862';
const GREY_LIGHTER__D = '#131419';

const BACKGROUND__L     = WHITE_MAIN;
const BACKGROUND__D     = WHITE_MAIN__D;
const SECONDARY_BG__L   = GREY_LIGHTER;
const SECONDARY_BG__D   = '#131419';

const SEARCH_BG__L      = 'rgba(142, 142, 147, 0.12)';
const SEARCH_BG__D      = 'rgba(238, 238, 238, 0.12)';

const ITEM_BG__L        = WHITE_MAIN;
const ITEM_BG__D        = WHITE_MAIN__D;

const PRIMARY_LABEL__L  = WHITE_MAIN;
const PRIMARY_LABEL__D  = WHITE_MAIN__D;

const BUTTON_BG__L      = GREEN_MAIN;
const BUTTON_BG__D      = GREEN_MEDIUM;

const STATUS_BAR__L = '#D7F2EF';
const STATUS_BAR__D = '#01766C';

const SANDBOX       = VIOLET;
const ERROR_LIGHT   = '#FF7070';

const GRADIENT_START_L = STATUS_BAR__L;
const GRADIENT_END_L   = BACKGROUND__L;

const GRADIENT_START_D = STATUS_BAR__D;
const GRADIENT_END_D   = BACKGROUND__D;

const INIT_STATUS_COLOR__L  = ORANGE_MAIN;
const INIT_STATUS_COLOR__D  = ORANGE_MAIN__D;

const LOST_STATUS_COLOR__L  = RED_MAIN;
const LOST_STATUS_COLOR__D  = RED_MAIN__D;

const READY_STATUS_COLOR__L = SALAD;
const READY_STATUS_COLOR__D = SALAD__D;

const NO_CONNECTION_BG__L = 'rgba(256, 256, 256, 0.88)';
const NO_CONNECTION_BG__D = 'rgba(0, 0, 0, 0.8)';

const GROUP_DEFAULT_BG__L = '#DFDFDF';
const GROUP_DEFAULT_BG__D = '#2F333D';

// const GREEN_MEDIUM__D = '#DAF6F3';
// const GREEN_DARK__D   = '#40817D';
// const GREEN_DARKER__D = '#1A3338';
// const TEXT_SECONDARY__D = 'rgba(256, 256, 256, 0.5)';
// const GREEN_DARKER = '#1A3338';

const COLORS = {
    dark : {
        PRIMARY                  : GREEN_MAIN__D,
        PRIMARY_LABEL            : PRIMARY_LABEL__D,
        SECONDARY_LABEL          : GREEN_STRONG__D,
        TEXT_PRIMARY             : BLACK_MAIN__D,
        TEXT_SECONDARY           : GREY_STRONG__D,
        BACKGROUND               : BACKGROUND__D,
        BUTTON_BG                : BUTTON_BG__D,
        ENABLED_PUSH_BUTTON      : BUTTON_BG__D,
        DISABLED_PUSH_BUTTON     : '#4F2D35',
        BUTTON_BG_SECONDARY      : GREEN_LIGHT__D,
        BUTTON_BG_DISABLED       : GREY_LIGHT__D,
        BUTTON_LABEL_DISABLED    : GREY_STRONG__D,
        SECONDARY_BACKGROUND     : SECONDARY_BG__D,
        FOCUSED_INPUT_COLOR      : GREEN_STRONG__D,
        SEARCH_BG                : SEARCH_BG__D,
        SEARCH_BAR               : GREEN_STRONG__D,
        DEFAULT_ICON_COLOR       : BLACK_MAIN__D,
        DEFAULT_LIGHT_ICON_COLOR : GREEN_STRONG__D,
        STATUS_BAR               : STATUS_BAR__D,
        GRADIENT_START           : GRADIENT_START_D,
        GRADIENT_END             : GRADIENT_END_D,
        GREEN_ICON_COLOR         : GREEN_MAIN,
        ITEM_BG                  : ITEM_BG__D,
        INIT_STATUS_COLOR        : INIT_STATUS_COLOR__D,
        LOST_STATUS_COLOR        : LOST_STATUS_COLOR__D,
        READY_STATUS_COLOR       : READY_STATUS_COLOR__D,
        ERROR                    : RED_MAIN,
        BACKGROUND_SECONDARY     : GREY_LIGHTER__D,
        ICON_GREY                : GREY_MEDIUM,
        SWITCH_BACKGROUND        : GREY_LIGHT__D,
        SWITCH_BUTTON            : WHITE_MAIN,
        SWITCH_ACTIVE_COLOR      : SALAD__D,
        SWITCH_INACTIVE_COLOR    : BLACK_MAIN,
        SHADOW                   : GREY_LIGHTER__D,
        BOTTOM_TAB_ACTIVE        : GREEN_MAIN__D,
        INPUT_COLOR              : GREY_MEDIUM__D,
        DIVEDER_COLOR            : GREY_MEDIUM__D,
        MODAL_OVERLAY            : 'rgba(0,0,0,0.7)',
        GREY_LIGHT               : GREY_LIGHT__D,
        GREY_LIGHTER             : GREY_LIGHTER__D,
        GREEN_STRONG             : GREEN_STRONG__D,
        GREY_STRONG              : GREY_STRONG__D,
        ORANGE_MAIN              : ORANGE_MAIN__D,
        NO_CONNECTION_BG         : NO_CONNECTION_BG__D,
        INVALID_SIGNAL           : '#E6E6E6',
        BLACK_MAIN               : BLACK_MAIN__D,
        GREEN_DARK,
        GROUP_DEFAULT_BG         : GROUP_DEFAULT_BG__D,
        SALAD                    : SALAD__D,
        ENABLED_SUBJECT_TOKEN    : '#47615E',
        DISABLED_SUBJECT_TOKEN   : GREY_LIGHTER__D,
        ENABLED_SUBJECT_ICON     : '#8BD9B2',
        DISABLED_SUBJECT_ICON    : GREY_MEDIUM__D
    },
    light : {
        PRIMARY                  : GREEN_MAIN,
        PRIMARY_LABEL            : PRIMARY_LABEL__L,
        SECONDARY_LABEL          : GREEN_STRONG,
        TEXT_PRIMARY             : BLACK_MAIN,
        TEXT_SECONDARY           : GREY_STRONG,
        BACKGROUND               : BACKGROUND__L,
        BUTTON_BG                : BUTTON_BG__L,
        ENABLED_PUSH_BUTTON      : BUTTON_BG__L,
        DISABLED_PUSH_BUTTON     : '#FEE4E3',
        BUTTON_BG_SECONDARY      : GREEN_LIGHT,
        BUTTON_BG_DISABLED       : GREY_LIGHT,
        BUTTON_LABEL_DISABLED    : GREY_MEDIUM,
        SECONDARY_BACKGROUND     : SECONDARY_BG__L,
        FOCUSED_INPUT_COLOR      : GREEN_STRONG,      // old -> GREY_STRONG,
        SEARCH_BG                : SEARCH_BG__L,    // maybe revert with light mode?
        SEARCH_BAR               : GREY_STRONG,
        DEFAULT_ICON_COLOR       : BLACK_MAIN,
        DEFAULT_LIGHT_ICON_COLOR : GREY_STRONG,
        STATUS_BAR               : STATUS_BAR__L,
        GRADIENT_START           : GRADIENT_START_L,
        GRADIENT_END             : GRADIENT_END_L,
        GREEN_ICON_COLOR         : GREEN_STRONG,
        ITEM_BG                  : ITEM_BG__L,
        INIT_STATUS_COLOR        : INIT_STATUS_COLOR__L,
        LOST_STATUS_COLOR        : LOST_STATUS_COLOR__L,
        READY_STATUS_COLOR       : READY_STATUS_COLOR__L,
        ERROR                    : RED_MAIN,
        BACKGROUND_SECONDARY     : '#F7F7F7',
        ICON_GREY                : GREY_MEDIUM,
        SWITCH_BACKGROUND        : GREY_LIGHT,
        SWITCH_BUTTON            : WHITE_MAIN,
        SWITCH_ACTIVE_COLOR      : SALAD,
        SWITCH_INACTIVE_COLOR    : BLACK_MAIN,
        SHADOW                   : GREY_MEDIUM,
        BOTTOM_TAB_ACTIVE        : GREEN_MAIN,
        INPUT_COLOR              : GREY_MEDIUM,
        DIVEDER_COLOR            : '#E1E1E1',
        MODAL_OVERLAY            : 'rgba(0,0,0,0.2)',
        NO_CONNECTION_BG         : NO_CONNECTION_BG__L,
        INVALID_SIGNAL           : '#E6E6E6',
        GREY_LIGHT,
        GREY_LIGHTER,
        GREEN_STRONG,
        GREY_STRONG,
        ORANGE_MAIN,
        BLACK_MAIN,
        GREEN_DARK,
        GROUP_DEFAULT_BG         : GROUP_DEFAULT_BG__L,
        SALAD,
        ENABLED_SUBJECT_TOKEN    : '#E9F3EA',
        DISABLED_SUBJECT_TOKEN   : '#F5F5F5',
        ENABLED_SUBJECT_ICON     : '#6BB271',
        DISABLED_SUBJECT_ICON    : GREY_MEDIUM
    },

    GREEN_MAIN,
    GREEN_LIGHT,
    GREEN_STRONG,

    GREY_MEDIUM,
    GREY_STRONG,
    GREY_LIGHT,
    GREY_LIGHTER,

    WHITE_MAIN,
    BLACK_MAIN,
    RED_MAIN,
    SALAD,
    VIOLET,

    SANDBOX,

    ERROR_LIGHT
};

export default COLORS;
