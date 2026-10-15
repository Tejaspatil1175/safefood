import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  View,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from './src/theme/theme';
import { BottomTabBar } from './src/components/BottomTabBar';
import { HomeScreen } from './src/screens/HomeScreen';
import { ScanScreen } from './src/screens/ScanScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { CasesScreen } from './src/screens/CasesScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { AuthScreen } from './src/screens/AuthScreen';

const AUTH_STORAGE_KEY = '@trustlabel_user_session';

export default function App() {
  const [role, setRole] = useState('user');
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Restore authenticated session from phone storage on launch
  useEffect(() => {
    (async () => {
      try {
        const savedData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed && parsed.user) {
            setUser(parsed.user);
            setRole(parsed.role || (parsed.user.role === 'officer' ? 'officer' : 'user'));
          }
        }
      } catch (err) {
        console.warn('Failed to restore session:', err);
      } finally {
        setLoadingSession(false);
      }
    })();
  }, []);

  const toggleRole = () => {
    setRole((prev) => (prev === 'user' ? 'officer' : 'user'));
  };

  // Called when user completes login / register via live Render API
  const handleAuthSuccess = async ({ user: authedUser, role: authedRole, token }) => {
    const finalRole = authedRole || (authedUser.role === 'officer' ? 'officer' : 'user');
    setUser(authedUser);
    setRole(finalRole);
    try {
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user: authedUser, role: finalRole, token })
      );
    } catch (err) {
      console.warn('Failed to save session:', err);
    }
  };

  // Called when user taps Logout in Profile
  const handleLogout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear session:', err);
    }
  };

  if (loadingSession) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.lime} />
      </SafeAreaView>
    );
  }

  // Proper Auth Gate: If no persistent session, show Login/Register directly
  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.bg} />
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.bg} />

      {/* 2. Main Screen Area */}
      {activeTab === 'home' ? (
        <View style={styles.homeTabWrapper}>
          <HomeScreen role={role} onNavigateTab={setActiveTab} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'scan' && (
            <ScanScreen role={role} onCompleteScan={() => setActiveTab('home')} />
          )}
          {activeTab === 'history' && <HistoryScreen />}
          {activeTab === 'cases' && <CasesScreen role={role} />}
          {activeTab === 'profile' && (
            <ProfileScreen
              role={role}
              user={user}
              onLogout={handleLogout}
            />
          )}
        </ScrollView>
      )}

      {/* 3. Floating Bottom Navigation Bar */}
      <BottomTabBar
        role={role}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenScan={() => setActiveTab('scan')}
      />
    </SafeAreaView>
  );
}

const STATUSBAR_TOP =
  Platform.OS === 'android'
    ? (StatusBar.currentHeight || 28) + 12
    : Platform.OS === 'ios'
    ? 20
    : 16;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: STATUSBAR_TOP,
    paddingBottom: 110, // Space for the floating bottom bar
  },
  homeTabWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: STATUSBAR_TOP,
    paddingBottom: 95, // Space for the floating bottom bar
  },
});
