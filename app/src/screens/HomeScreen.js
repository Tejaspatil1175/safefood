import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { HeroCard } from '../components/HeroCard';
import { ScanFeedItem, CaseFeedItem } from '../components/FeedCards';
import { ScanDetailModal } from '../components/ScanDetailModal';
import { fetchLiveScans } from '../data/api';
import { userMockScans, officerMockCases } from '../data/mockData';

export function HomeScreen({ role, user, token, onNavigateTab }) {
  const [liveScans, setLiveScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedScan, setSelectedScan] = useState(null);

  // Fetch real scans from MongoDB cloud
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const scans = await fetchLiveScans(token, role);
        if (isMounted && Array.isArray(scans) && scans.length > 0) {
          // Normalize server schema to app feed format
          const formatted = scans.map((s, idx) => ({
            id: s._id ? `#AUD-${s._id.slice(-4).toUpperCase()}` : `#AUD-${1000 + idx}`,
            name: s.productInfo?.name || s.product?.name || s.fields?.productName?.value || 'Packaged Commodity',
            brand: s.productInfo?.brand || s.product?.brand || 'Verified FMCG',
            category: s.productInfo?.category || (s.barcode ? `Barcode: ${s.barcode}` : 'Packaged Goods'),
            verdict: s.verdict === 'PASS' ? 'PASS' : 'FAIL',
            score: s.score ? `${Math.round(s.score)}%` : '85%',
            time: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Recent',
            raw: s,
          }));
          setLiveScans(formatted);
        }
      } catch (err) {
        console.warn('Live scan fetch notice:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token, role]);

  const displayScans = liveScans.length > 0 ? liveScans : userMockScans;

  return (
    <View style={styles.container}>
      {/* 1. Sticky Hero Card (stays fixed at top) */}
      <View style={styles.stickyHeader}>
        <HeroCard role={role} />
      </View>

      {/* 2. Scrollable Body Content */}
      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollBodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Action Electric Lime Scan Banner */}
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

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {role === 'user' ? 'Recent audited items' : 'Assigned investigation dockets'}
          </Text>
          <TouchableOpacity onPress={() => onNavigateTab(role === 'user' ? 'history' : 'cases')}>
            <Text style={styles.sectionViewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        {/* Live Indicator Bar */}
        {loading && (
          <View style={{ paddingVertical: 12, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={theme.colors.lime} />
          </View>
        )}

        {/* Feed List */}
        {role === 'user'
          ? displayScans.map((item) => (
              <ScanFeedItem
                key={item.id}
                item={item}
                onSelectItem={(selected) => setSelectedScan(selected)}
              />
            ))
          : officerMockCases.map((item) => <CaseFeedItem key={item.id} item={item} />)}
      </ScrollView>

      {/* Product Detail, Grievance Application, and PDF Modal */}
      <ScanDetailModal
        visible={Boolean(selectedScan)}
        scanItem={selectedScan}
        onClose={() => setSelectedScan(null)}
        token={token}
        user={user}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickyHeader: {
    paddingBottom: 10,
    backgroundColor: theme.colors.bg,
  },
  scrollBody: {
    flex: 1,
  },
  scrollBodyContent: {
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
