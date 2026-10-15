import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '../theme/theme';

export function ProfileScreen({ role }) {
  return (
    <View style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{role === 'user' ? 'CP' : 'RP'}</Text>
        </View>
        <Text style={styles.profileName}>
          {role === 'user' ? 'Tejas Patil' : 'Insp. Rajesh Patil'}
        </Text>
        <Text style={styles.profileRole}>
          {role === 'user'
            ? 'Citizen Verified Consumer · Dhule'
            : 'Authorized Enforcement Officer · OFF-DHL-101'}
        </Text>
      </View>

      <View style={styles.profileOptions}>
        <View style={styles.profileRow}>
          <Text style={styles.profileRowLabel}>Jurisdiction</Text>
          <Text style={styles.profileRowValue}>DHULE, MAHARASHTRA</Text>
        </View>
        <View style={styles.profileRow}>
          <Text style={styles.profileRowLabel}>Backend Node</Text>
          <Text style={styles.profileRowValue}>Live MongoDB Cloud</Text>
        </View>
        <View style={styles.profileRow}>
          <Text style={styles.profileRowLabel}>Auto-Verification</Text>
          <Text style={[styles.profileRowValue, { color: theme.colors.limeDark }]}>Enabled</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.hero,
    padding: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.navy,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.navy,
  },
  profileRole: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 4,
    textAlign: 'center',
  },
  profileOptions: {
    borderTopWidth: 1,
    borderColor: theme.colors.divider,
    paddingTop: 16,
    gap: 12,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileRowLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.muted,
  },
  profileRowValue: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.navy,
  },
});
