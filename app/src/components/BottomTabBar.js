import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';

export function BottomTabBar({ activeTab, onSelectTab, onOpenScan, role }) {
  return (
    <View style={styles.tabbarWrapper}>
      <View style={styles.tabbar}>
        {/* Tab 1: Home */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onSelectTab('home')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={22}
            color={activeTab === 'home' ? theme.colors.limeDark : '#94A3B8'}
          />
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Tab 2: History */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onSelectTab('history')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="history"
            size={24}
            color={activeTab === 'history' ? theme.colors.limeDark : '#94A3B8'}
          />
          <Text style={[styles.tabLabel, activeTab === 'history' && styles.tabLabelActive]}>
            History
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Center Elevated Scan Button */}
        <TouchableOpacity
          style={styles.centerScanBtn}
          onPress={onOpenScan}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Tab 4: Reports / Cases */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onSelectTab('cases')}
          activeOpacity={0.7}
        >
          <Feather
            name="file-text"
            size={21}
            color={activeTab === 'cases' ? theme.colors.limeDark : '#94A3B8'}
          />
          <Text style={[styles.tabLabel, activeTab === 'cases' && styles.tabLabelActive]}>
            {role === 'user' ? 'Reports' : 'Cases'}
          </Text>
        </TouchableOpacity>

        {/* Tab 5: Profile */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onSelectTab('profile')}
          activeOpacity={0.7}
        >
          <Feather
            name="user"
            size={21}
            color={activeTab === 'profile' ? theme.colors.limeDark : '#94A3B8'}
          />
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabbarWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tabbar: {
    width: '100%',
    height: 68,
    backgroundColor: theme.colors.card,
    borderRadius: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E5E9E0',
    shadowColor: theme.colors.navy,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 54,
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  tabLabelActive: {
    color: theme.colors.limeDark,
  },
  centerScanBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: theme.colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -26,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: theme.colors.lime,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
});
