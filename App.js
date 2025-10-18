import * as React from 'react';
import { Button, Text, View } from 'react-native';
import * as AuthSession from 'expo-auth-session';

const FB_APP_ID = '686292274061567';

export default function FacebookLoginTest() {
  const [token, setToken] = React.useState(null);

  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true, // use Expo's redirect proxy
  });

  const authUrl =
    `https://www.facebook.com/v19.0/dialog/oauth?` +
    `client_id=${FB_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=token` +
    `&scope=public_profile,email`;

  async function login() {
    const result = await AuthSession.startAsync({ authUrl });
    if (result.type === 'success' && result.params.access_token) {
      setToken(result.params.access_token);
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Button title="Login with Facebook" onPress={login} />
      {token && <Text>Access Token: {token}</Text>}
    </View>
  );
}
