import { Platform, Alert } from 'react-native';

/**
 * Alert cross-platform: usa window.alert en web y Alert.alert en nativo.
 */
export function showAlert(title, message, buttons) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    if (buttons?.[0]?.onPress) buttons[0].onPress();
  } else {
    Alert.alert(title, message, buttons);
  }
}
