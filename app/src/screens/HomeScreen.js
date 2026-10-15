import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { HeroCard } from '../components/HeroCard';
import { ScanFeedItem, CaseFeedItem } from '../components/FeedCards';
import { userMockScans, officerMockCases } from '../data/mockData';

export function HomeScreen({ role, onNavigateTab }) {
  return (
    <View style={styles.container}>
      {/* 1. Hero Card */}
      <HeroCard role={role} />

      {/* 2. Quick Action Electric Lime Scan Banner */}
      <TouchableOpacity
        style={styles.quickScanCard}
        onPress={() => onNavigateTab('scan')}
        activeOpacity={0.88}
      >
        <View style={styles.quickScanLeft}>
          <View style={styles.quickScanIconSq}>
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.quickScanTitle}>
              {role === 'user' ? 'Point camera to audit' : 'Launch field inspector'}
            </Text>
            <Text style={styles.quickScanSub}>
              Instant OCR check of mandatory label declarations
            </Text>
          </View>
        </View>
        <View style={styles.arrowCircle}>
          <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      {/* 3. Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {role === 'user' ? 'Recent audited items' : 'Assigned investigation dockets'}
        </Text>
        <TouchableOpacity onPress={() => onNavigateTab(role === 'user' ? 'history' : 'cases')}>
          <Text style={styles.sectionViewAll}>View all</Text>
        </TouchableOpacity>
      </View>

      {/* 4. Feed List */}
      {role === 'user'
        ? userMockScans.map((item) => <ScanFeedItem key={item.id} item={item} />)
        : officerMockCases.map((item) => <CaseFeedItem key={item.id} item={item} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  quickScanCard: {
    backgroundColor: theme.colors.lime,
    borderRadius: theme.radius.card,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: theme.colors.lime,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 4,
  },
  quickScanLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  quickScanIconSq: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickScanTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  quickScanSub: {
    fontSize: 11,
    color: '#F4FCE3',
    marginTop: 2,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.navy,
  },
  sectionViewAll: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.limeDark,
  },
});
