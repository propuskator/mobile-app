#!/bin/sh
COLOR='\033[0;35m'
NC='\033[0m'

PLACE=$1
NAME=$2

cd $PLACE

if [ ! -d $NAME ]; then
    mkdir $NAME
else
    echo -e "${COLOR}There is a folder with name: $2 - at path: $1${NC}"
    echo
    exit 1
fi

cd $NAME

STYLES=""$NAME"Styles.js"

if [ ! -f $NAME.js ]; then
    touch $NAME.js
fi

if [ ! -f $STYLES ]; then
    touch $STYLES
fi

if [ ! -f index.js ]; then
    touch index.js
fi

cat > index.js <<EOF
import Component from './$NAME';

export default Component;

EOF

cat > $STYLES << EOF
import { StyleSheet } from 'react-native';

import colors from '../../../assets/constants/colors';

export default StyleSheet.create({
    layout : {
        flex : 1
    }
});

EOF

STYLES="'./"$STYLES"'"

cat > $NAME.js << EOF
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { View }             from 'react-native';

import styles from $STYLES;

export default class $NAME extends Component {
    static propTypes = {};

    static contextTypes = {
        i18n : PropTypes.object
    };

    static defaultProps = {};

    render() {
        return (
            <View style={styles.layout}>
            </View>
        );
    }
}

EOF
