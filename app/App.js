import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { theme } from './src/theme/theme';
import { Header } from './src/components/Header';
import { BottomTabBar } from './src/components/BottomTabBar';
import { HomeScreen } from './src/screens/HomeScreen';
import { ScanScreen } from './src/screens/ScanScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { CasesScreen } from './src/screens/CasesScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

export default function App() {
  const [role, setRole] = useState('user');
  const [activeTab, setActiveTab] = useState('home');

  const toggleRole = () => {
    setRole((prev) => (prev === 'user' ? 'officer' : 'user'));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.bg} />

      {/* 1. Header with Avatar & Persona Switcher */}
      <Header role={role} onToggleRole={toggleRole} />

      {/* 2. Main Screen Area */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'home' && (
          <HomeScreen role={role} onNavigateTab={setActiveTab} />
        )}
        {activeTab === 'scan' && (
          <ScanScreen role={role} onCompleteScan={() => setActiveTab('home')} />
        )}
        {activeTab === 'history' && <HistoryScreen />}
        {activeTab === 'cases' && <CasesScreen role={role} />}
        {activeTab === 'profile' && <ProfileScreen role={role} />}
      </ScrollView>

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
    paddingBottom: 110, // Space for the floating bottom bar
  },
});
