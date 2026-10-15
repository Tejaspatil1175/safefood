import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const sliderImages = [
  require('../../assets/1.png'),
  require('../../assets/2.png'),
  require('../../assets/3.png'),
  require('../../assets/4.png'),
];

export function HeroCard({ role }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Automatically slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.heroCard}>
      {/* 3s Auto-sliding Background Image covering full card */}
      <Image
        source={sliderImages[currentIdx]}
        style={styles.fullBgImage}
        resizeMode="cover"
      />
      {/* Light Black Shade Overlay to ensure high readability */}
      <View style={styles.lightBlackShade} />

      <View style={styles.heroContent}>
        <View style={styles.heroBadgeRow}>
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={13} color="#FFFFFF" />
            <Text style={styles.verifiedBadgeText}>
              {role === 'user' ? 'PCR 2011 Verified AI' : 'Active Field Jurisdiction'}
            </Text>
          </View>
          <View style={styles.batteryChip}>
            <Ionicons name="battery-charging" size={14} color="#FFFFFF" />
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
            ? 'Verify mandatory Rule 6 declarations, MRP tamperings & font sizes before buying.'
            : 'Execute statutory label inspections and issue metrology discrepancy dockets.'}
        </Text>

        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {sliderImages.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIdx ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>

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
    borderRadius: theme.radius.hero,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
    marginBottom: 18,
    position: 'relative',
    backgroundColor: '#1E293B',
  },
  fullBgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  lightBlackShade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 20, 15, 0.62)', // Smooth light black/emerald tint
  },
  heroContent: {
    padding: 22,
    paddingBottom: 14,
    zIndex: 2,
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
    backgroundColor: 'rgba(0, 177, 79, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.pill,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  batteryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: theme.radius.pill,
  },
  batteryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 32,
    marginBottom: 6,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  heroTitleGreen: {
    color: '#6EE7B7', // Soft electric emerald glow on dark shade
  },
  heroSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.88)',
    lineHeight: 18,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 16,
    backgroundColor: '#10B981',
  },
  dotInactive: {
    width: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
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
