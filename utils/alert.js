import { Platform, Alert } from 'react-native';

/**
 * Alert que funciona en web (window.alert) y nativo (Alert.alert)
 */
export function showAlert(title, message, buttons) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    if (buttons?.[0]?.onPress) {
      buttons[0].onPress();
    }
  } else {
    Alert.alert(title, message, buttons);
  }
}
