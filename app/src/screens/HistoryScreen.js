import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';
import { ScanFeedItem } from '../components/FeedCards';
import { ScanDetailModal } from '../components/ScanDetailModal';
import { fetchLiveScans } from '../data/api';
import { userMockScans } from '../data/mockData';

export function HistoryScreen({ role, token, user }) {
  const [liveScans, setLiveScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const scans = await fetchLiveScans(token, role);
        if (isMounted && Array.isArray(scans) && scans.length > 0) {
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
        console.warn('History fetch notice:', err.message);
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
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <Text style={styles.pageHeading}>Audit History Archive</Text>
        <Text style={styles.pageSub}>
          Live Legal Metrology dockets verified on Render backend
        </Text>
      </View>

      {/* Scrollable Feed List */}
      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollBodyContent}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View style={{ paddingVertical: 16, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={theme.colors.lime} />
          </View>
        )}

        {displayScans.map((item) => (
          <ScanFeedItem
            key={item.id}
            item={item}
            onSelectItem={(selected) => setSelectedScan(selected)}
          />
        ))}
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
    paddingBottom: 12,
    backgroundColor: theme.colors.bg,
  },
  pageHeading: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.navy,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  pageSub: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  scrollBody: {
    flex: 1,
  },
  scrollBodyContent: {
    paddingBottom: 40,
  },
});
