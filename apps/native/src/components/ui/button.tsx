import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type ButtonProps = {
    title?: string;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(({ title, ...touchableProps }, ref) => {
    return (
        <TouchableOpacity
            ref={ref}
            {...touchableProps}
            style={[styles.button, touchableProps.style]}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
});

Button.displayName = 'Button';

const styles = StyleSheet.create(theme => ({
    button: {
        alignItems: 'center',
        backgroundColor: theme.colors.cornflowerBlue,
        borderRadius: 24,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            height: 2,
            width: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: theme.colors.background,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
}));
