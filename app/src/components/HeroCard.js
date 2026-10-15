import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

export function HeroCard({ role }) {
  return (
    <View style={styles.heroCard}>
      <View style={styles.heroBadgeRow}>
        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={13} color={theme.colors.limeDark} />
          <Text style={styles.verifiedBadgeText}>
            {role === 'user' ? 'PCR 2011 Verified AI' : 'Active Field Jurisdiction'}
          </Text>
        </View>
        <View style={styles.batteryChip}>
          <Ionicons name="battery-charging" size={14} color={theme.colors.limeDark} />
          <Text style={styles.batteryText}>
            {role === 'user' ? 'Live OCR 99%' : 'Auto-Verify Active'}
          </Text>
        </View>
      </View>

      <Text style={styles.heroTitle}>
        {role === 'user' ? (
          <>
            Audit food.{'\n'}
            <Text style={styles.heroTitleGreen}>Detect violations.</Text>
          </>
        ) : (
          <>
            Enforce PCR.{'\n'}
            <Text style={styles.heroTitleGreen}>Issue notices.</Text>
          </>
        )}
      </Text>

      <Text style={styles.heroSubtext}>
        {role === 'user'
          ? 'Verify mandatory Rule 6 declarations, MRP tamperings, and font sizes before buying.'
          : 'Execute statutory label inspections and issue metrology discrepancy dockets.'}
      </Text>

      {/* Metrics Strip */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>
            {role === 'user' ? 'MY AUDITS' : 'FIELD SCANS'}
          </Text>
          <Text style={styles.metricValue}>
            {role === 'user' ? '18' : '48'}
          </Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>
            {role === 'user' ? 'PCR BREACHES' : 'NOTICES ISSUED'}
          </Text>
          <Text style={[styles.metricValue, { color: theme.colors.red }]}>
            {role === 'user' ? '5' : '16'}
          </Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>
            {role === 'user' ? 'ACCURACY' : 'RESOLVED'}
          </Text>
          <Text style={[styles.metricValue, { color: theme.colors.limeDark }]}>
            {role === 'user' ? '98.4%' : '32'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.hero,
    padding: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 3,
    marginBottom: 18,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.limeLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.pill,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.limeDark,
    letterSpacing: 0.3,
  },
  batteryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.divider,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: theme.radius.pill,
  },
  batteryText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.navySub,
  },
  heroTitle: {
    fontSize: 27,
    fontWeight: '900',
    color: theme.colors.navy,
    lineHeight: 33,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroTitleGreen: {
    color: theme.colors.lime,
  },
  heroSubtext: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 18,
    marginBottom: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAF5',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#EDF2E8',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.muted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.navy,
  },
});
