import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const defaultAvatar = require('../../assets/profilepic.png');

export function ProfileScreen({ role, user, onLogout }) {
  const displayName = user?.name || (role === 'user' ? 'Tejas Patil' : 'Insp. Rajesh Patil');
  const displayEmail = user?.email || (role === 'user' ? 'citizen@safefood.gov.in' : 'admin.dhule@safefood.gov.in');
  const isOfficer = role === 'officer' || user?.role === 'officer';

  return (
    <View style={styles.container}>
      {/* 1. Profile Hero Card */}
      <View style={styles.profileHeroCard}>
        <View style={styles.avatarWrap}>
          <Image
            source={defaultAvatar}
            style={styles.avatarImg}
            resizeMode="cover"
          />
          <View style={styles.verifiedBadgeCircle}>
            <MaterialCommunityIcons name="check-decagram" size={20} color={theme.colors.lime} />
          </View>
        </View>

        <Text style={styles.userName}>{displayName}</Text>
        <Text style={styles.userEmail}>{displayEmail}</Text>

        <View style={styles.roleTag}>
          <MaterialCommunityIcons
            name={isOfficer ? 'shield-account' : 'account-check'}
            size={14}
            color={theme.colors.limeDark}
          />
          <Text style={styles.roleTagText}>
            {isOfficer ? 'Authorized Metrology Officer' : 'Verified Citizen Consumer'}
          </Text>
        </View>

        {/* Quick Stat Pill Tiles */}
        <View style={styles.statsRow}>
          <View style={styles.statTile}>
            <Text style={styles.statTileNum}>{isOfficer ? '48' : '18'}</Text>
            <Text style={styles.statTileLabel}>{isOfficer ? 'FIELD CASES' : 'TOTAL AUDITS'}</Text>
          </View>
          <View style={styles.statTileDivider} />
          <View style={styles.statTile}>
            <Text style={[styles.statTileNum, { color: theme.colors.red }]}>
              {isOfficer ? '16' : '5'}
            </Text>
            <Text style={styles.statTileLabel}>{isOfficer ? 'BREACH DOCKETS' : 'VIOLATIONS'}</Text>
          </View>
          <View style={styles.statTileDivider} />
          <View style={styles.statTile}>
            <Text style={[styles.statTileNum, { color: theme.colors.limeDark }]}>98.4%</Text>
            <Text style={styles.statTileLabel}>CONFIDENCE</Text>
          </View>
        </View>
      </View>

      {/* 2. System & Jurisdictional Details */}
      <View style={styles.menuCard}>
        <Text style={styles.cardHeaderTitle}>JURISDICTION & SYSTEM</Text>

        <View style={styles.menuRow}>
          <View style={styles.menuRowLeft}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.limeLight }]}>
              <Ionicons name="location-sharp" size={17} color={theme.colors.limeDark} />
            </View>
            <Text style={styles.menuRowLabel}>Assigned District</Text>
          </View>
          <Text style={styles.menuRowValue}>{user?.district || 'DHULE, MH'}</Text>
        </View>

        <View style={styles.menuDivider} />

        <View style={styles.menuRow}>
          <View style={styles.menuRowLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="cloud-done" size={17} color="#2563EB" />
            </View>
            <Text style={styles.menuRowLabel}>Live Sync Node</Text>
          </View>
          <Text style={styles.menuRowValue}>safefood.onrender.com</Text>
        </View>

        <View style={styles.menuDivider} />

        <View style={styles.menuRow}>
          <View style={styles.menuRowLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="shield-checkmark" size={17} color="#D97706" />
            </View>
            <Text style={styles.menuRowLabel}>Statutory Standard</Text>
          </View>
          <Text style={styles.menuRowValue}>PCR 2011 / FSSAI</Text>
        </View>
      </View>

      {/* 3. Sign Out Button */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={onLogout}
        activeOpacity={0.85}
      >
        <Feather name="log-out" size={17} color={theme.colors.red} />
        <Text style={styles.logoutBtnText}>Sign Out of SafeFood</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  profileHeroCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.hero,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 3,
    marginBottom: 16,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarImg: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#F1F5F9',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  verifiedBadgeCircle: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.navy,
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 2,
    marginBottom: 10,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.limePill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.limeBorder,
    marginBottom: 20,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.limeDark,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#FAFCF7',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EDF4E6',
  },
  statTile: {
    flex: 1,
    alignItems: 'center',
  },
  statTileDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#E2E8F0',
  },
  statTileNum: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.navy,
  },
  statTileLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.muted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
  },
  cardHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.muted,
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuRowLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.navy,
  },
  menuRowValue: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.muted,
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: 4,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FDE8E8',
    borderWidth: 1,
    borderColor: '#FBD5D5',
    borderRadius: 16,
    paddingVertical: 14,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.red,
  },
});
