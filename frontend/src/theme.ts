import { Button, Checkbox, createTheme } from '@mantine/core';

export default createTheme({
    colors: {
        'orange': [ "#fff5eb", "#fce9d5", "#fbd0a3", "#fbb66e", "#fba042", "#fb9229", "#fb8a1e", "#e07714", "#c7690c", "#b85f00" ],
    },
    primaryColor: 'orange',
    cursorType: 'pointer',
    components: {
        Checkbox: Checkbox.extend({
            defaultProps: {
                variant: 'outline',
                color: 'gray'
            },
        }),
        Button: Button.extend({
            defaultProps: {
                variant: 'filled',
            }
        }),
    },
});