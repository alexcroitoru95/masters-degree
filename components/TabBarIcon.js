import React from 'react';
import { Feather } from '@expo/vector-icons';

import { Colors } from '../constants';

export function TabBarIcon(props) {
    return (
        <Feather
            name={props.name}
            size={26}
            style={{ marginBottom: -3 }}
            color={
                props.focused ? Colors.tabIconSelected : Colors.tabIconDefault
            }
        />
    );
}
