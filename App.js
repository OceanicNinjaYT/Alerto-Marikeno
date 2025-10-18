import React, { useState } from 'react';
import { Button, Text, View, StyleSheet, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';

const FB_APP_ID = '686292274061567';

export default function FacebookLoginTest() {
  const [token, setToken] = useState(null);

  // Generate redirect URI (use Expo proxy so it works in Expo Go)
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
    scheme: 'https'
  });


  // Construct the Facebook OAuth URL
  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=token&scope=public_profile,email`;

  // Print these for debugging — check your Expo logs!
  console.log('Redirect URI:', redirectUri);
  console.log('Auth URL:', authUrl);

  async function login() {
    try {
      const result = await AuthSession.startAsync({ authUrl });
      console.log('Auth result:', result);

      if (result.type === 'success' && result.params.access_token) {
        setToken(result.params.access_token);
        Alert.alert('Login Success', 'Access token received!');
      } else {
        Alert.alert('Login cancelled or failed.');
      }
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert('Error', 'Something went wrong during login.');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <Button title="Login with Facebook" onPress={login} />
      </View>

      {token && (
        <Text style={styles.tokenText} numberOfLines={1}>
          Access Token: {token}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  buttonWrapper: {
    marginTop: 40,
  },
  tokenText: {
    marginTop: 20,
    color: 'gray',
  },
});
