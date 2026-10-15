import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

export function Header({ role, onToggleRole }) {
  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{role === 'user' ? 'CP' : 'RP'}</Text>
        </View>
        <View>
          <Text style={styles.greetingSub}>
            {role === 'user' ? 'Good morning, Citizen' : 'Enforcement Division'}
          </Text>
          <Text style={styles.greetingName}>
            {role === 'user' ? 'Tejas Patil' : 'Insp. Rajesh Patil'}
          </Text>
        </View>
      </View>

      <View style={styles.headerRight}>
        {/* Persona Switch Pill */}
        <TouchableOpacity
          style={styles.roleSwitchBtn}
          onPress={onToggleRole}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={role === 'user' ? 'shield-account' : 'account'}
            size={14}
            color={theme.colors.limeDark}
          />
          <Text style={styles.roleSwitchText}>
            {role === 'user' ? 'Officer Mode' : 'Citizen Mode'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconCircleBtn} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={19} color={theme.colors.navy} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const STATUSBAR_HEIGHT =
  Platform.OS === 'android'
    ? (StatusBar.currentHeight || 28) + 26
    : Platform.OS === 'ios'
    ? 30
    : 24;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: STATUSBAR_HEIGHT,
    paddingBottom: 14,
    backgroundColor: theme.colors.bg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarText: {
    fontWeight: '800',
    fontSize: 15,
    color: theme.colors.navy,
  },
  greetingSub: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greetingName: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.navy,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: theme.colors.limePill,
    borderWidth: 1,
    borderColor: theme.colors.limeBorder,
  },
  roleSwitchText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.limeDark,
  },
  iconCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
