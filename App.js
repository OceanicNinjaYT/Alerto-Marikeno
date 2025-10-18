import React, { useEffect, useState } from 'react';
import { Button, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as AuthSession from 'expo-auth-session';
import { ResponseType } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const FB_APP_ID = '1348490323591424';

export default function FacebookLoginTest() {
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState('Not logged in');
  const [loading, setLoading] = useState(false);

  // ✅ Force HTTPS Expo proxy redirect URI
  const redirectUri = 'https://auth.expo.io/@konvex/Alerto-Marikeno';
  console.log('🔗 Redirect URI (forced proxy):', redirectUri);

  // ✅ Construct Facebook OAuth URL for debugging
  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FB_APP_ID
    }&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=public_profile,email`;
  console.log('🌐 Constructed Auth URL:', authUrl);

  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: FB_APP_ID,
    responseType: ResponseType.Token,
    scopes: ['public_profile', 'email'],
    redirectUri,
  });

  // 👇 Log redirect events for debugging
  useEffect(() => {
    if (response) {
      console.log('🔁 Auth response event:', JSON.stringify(response, null, 2));
    } else {
      console.log('⏳ Waiting for redirect event...');
    }
  }, [response]);

  // 👇 Handle Facebook login response
  useEffect(() => {
    if (response?.type === 'success' && response?.params?.access_token) {
      const accessToken = response.params.access_token;
      setToken(accessToken);
      setLoading(false);
      setMessage('✅ Successfully logged in!');
      console.log('✅ Logged in successfully, token:', accessToken);

      // Fetch user info
      fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`)
        .then(res => res.json())
        .then(data => {
          console.log('👤 Facebook user data:', data);
          setMessage(`👋 Welcome, ${data.name}!`);
        })
        .catch(err => {
          console.error('⚠️ Failed to fetch user data:', err);
          setMessage('⚠️ Failed to load user info.');
        });
    } else if (response?.type === 'dismiss') {
      setLoading(false);
      setMessage('❌ Login cancelled.');
      console.log('❌ Login dismissed or closed by user/browser');
    } else if (response?.type === 'error') {
      setLoading(false);
      setMessage('⚠️ Login error.');
      console.log('⚠️ Login error:', response.error);
    }
  }, [response]);

  const handleLogin = async () => {
    setLoading(true);
    setMessage('⏳ Logging in...');
    console.log('🚀 Starting Facebook login...');
    console.log('📤 Sending OAuth request to:', authUrl);

    try {
      await promptAsync({
        useProxy: true,
        showInRecents: true,
        windowFeatures: 'toolbar=no,location=no',
      });
    } catch (err) {
      console.error('💥 Login failed to start:', err);
      setLoading(false);
      setMessage('⚠️ Login failed to start.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Login with Facebook" onPress={handleLogin} disabled={!request || loading} />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1877f2" />
          <Text style={styles.loadingText}>Redirecting to Facebook...</Text>
        </View>
      )}

      <Text style={styles.statusText}>{message}</Text>

      {token && (
        <Text style={styles.tokenText} numberOfLines={1}>
          Access Token: {token.slice(0, 20)}...
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statusText: { marginTop: 20, fontSize: 16 },
  loadingContainer: { marginTop: 20, alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#555' },
  tokenText: { marginTop: 10, fontSize: 12, color: 'gray' },
});
