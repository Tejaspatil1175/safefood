import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { HeroCard } from '../components/HeroCard';
import { ScanFeedItem, CaseFeedItem } from '../components/FeedCards';
import { ScanDetailModal } from '../components/ScanDetailModal';
import { fetchLiveScans, fetchLiveComplaints, fetchOfficerStats } from '../data/api';
import { userMockScans, officerMockCases } from '../data/mockData';

export function HomeScreen({ role, user, token, onNavigateTab }) {
  const [liveScans, setLiveScans] = useState([]);
  const [liveComplaints, setLiveComplaints] = useState([]);
  const [officerStats, setOfficerStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedScan, setSelectedScan] = useState(null);

  const isOfficer = role === 'officer' || user?.role === 'officer';

  // Fetch live scans, complaints and stats from Render backend
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);

        const promises = [
          fetchLiveScans(token, role).catch(() => []),
          fetchLiveComplaints(token).catch(() => []),
        ];

        if (isOfficer) {
          promises.push(fetchOfficerStats(token).catch(() => null));
        }

        const [scans, complaints, stats] = await Promise.all(promises);

        if (!isMounted) return;

        // 1. Format Scans
        if (Array.isArray(scans) && scans.length > 0) {
          const formattedScans = scans.map((s, idx) => ({
            id: s._id ? `#AUD-${s._id.slice(-4).toUpperCase()}` : `#AUD-${1000 + idx}`,
            name: s.productInfo?.name || s.product?.name || s.fields?.productName?.value || 'Packaged Commodity',
            brand: s.productInfo?.brand || s.product?.brand || 'Verified FMCG',
            category: s.productInfo?.category || (s.barcode ? `Barcode: ${s.barcode}` : 'Packaged Goods'),
            verdict: s.verdict === 'PASS' ? 'PASS' : 'FAIL',
            score: s.score ? `${Math.round(s.score)}%` : '85%',
            time: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Recent',
            raw: s,
          }));
          setLiveScans(formattedScans);
        }

        // 2. Format Complaints / Cases
        if (Array.isArray(complaints) && complaints.length > 0) {
          const formattedCases = complaints.map((c, idx) => {
            const scan = c.scan || {};
            const productName =
              scan.product?.name ||
              scan.geminiAudit?.detectedProduct?.productName ||
              scan.fields?.productName?.rawText ||
              'Packaged Commodity';

            const ruleDesc =
              (c.violations && c.violations[0]?.ruleId)
                ? `${c.violations[0].ruleId}: ${c.violations[0].message || ''}`
                : (c.userNote || 'Legal Metrology compliance notice');

            return {
              id: c.docketNumber || (c._id ? `GRV-${c._id.slice(-4).toUpperCase()}` : `GRV-${2000 + idx}`),
              ref: c._id ? `#${c._id.slice(-6).toUpperCase()}` : `#REF-${1000 + idx}`,
              product: productName,
              retailer: c.address ? `${c.address} (${c.district || user?.district || 'DHULE'})` : `District Legal Metrology (${c.district || user?.district || 'DHULE'})`,
              status: c.status === 'ACTION_TAKEN' ? 'Action Taken' : c.status === 'IN_REVIEW' ? 'In Review' : c.status || 'Under Investigation',
              rule: ruleDesc,
              time: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recent',
              rawComplaint: c,
              scanItem: {
                id: c.docketNumber || `#DOK-${c._id?.slice(-4).toUpperCase()}`,
                name: productName,
                brand: scan.product?.brand || scan.geminiAudit?.detectedProduct?.brand || 'FMCG Packaged Good',
                category: `District: ${c.district || user?.district || 'DHULE'}`,
                verdict: 'FAIL',
                score: '35%',
                time: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recent',
                raw: {
                  ...scan,
                  checklist: c.violations?.map((v) => ({
                    label: v.field || v.ruleId,
                    status: 'fail',
                    detail: v.message,
                    rule: v.ruleId,
                  })) || [],
                  issues: c.violations?.map((v) => ({
                    title: v.field || v.ruleId,
                    severity: 'high',
                    description: v.message,
                    rule: v.ruleId,
                  })) || [],
                },
              },
            };
          });
          setLiveComplaints(formattedCases);
        }

        // 3. Stats
        if (stats) {
          setOfficerStats(stats);
        }
      } catch (err) {
        console.warn('Home data fetch notice:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token, role, isOfficer]);

  const displayScans = liveScans.length > 0 ? liveScans : userMockScans;
  const displayCases = liveComplaints.length > 0 ? liveComplaints : officerMockCases;

  return (
    <View style={styles.container}>
      {/* 1. Sticky Hero Card */}
      <View style={styles.stickyHeader}>
        <HeroCard role={role} />
      </View>

      {/* 2. Scrollable Body Content */}
      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollBodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Officer District Jurisdiction Badge */}
        {isOfficer && (
          <View style={styles.officerBadgeBanner}>
            <View style={styles.officerBadgeLeft}>
              <View style={styles.officerIconBox}>
                <MaterialCommunityIcons name="shield-account" size={24} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.officerJurisdictionTitle}>
                  {user?.district ? `${user.district} Legal Metrology Enforcement` : 'District Enforcement Division'}
                </Text>
                <Text style={styles.officerBadgeSub}>
                  Badge: {user?.badgeNumber || 'OFF-DHL-101'} · Inspector {user?.name || 'Patil'}
                </Text>
              </View>
            </View>
            <View style={styles.dutyBadge}>
              <View style={styles.dutyDot} />
              <Text style={styles.dutyText}>ON DUTY</Text>
            </View>
          </View>
        )}

        {/* Officer 3-Column Metrics Dashboard Strip */}
        {isOfficer && (
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>TOTAL AUDITED</Text>
              <Text style={styles.statNumber}>{officerStats?.totalScans ?? displayScans.length}</Text>
              <Text style={styles.statSub}>In {user?.district || 'District'}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: theme.colors.red }]}>FLAGGED</Text>
              <Text style={[styles.statNumber, { color: theme.colors.red }]}>
                {officerStats?.productsWithIssues ?? displayCases.length}
              </Text>
              <Text style={styles.statSub}>PCR Breaches</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: theme.colors.limeDark }]}>RESOLVED</Text>
              <Text style={[styles.statNumber, { color: theme.colors.limeDark }]}>
                {officerStats?.compliantProducts ?? '32'}
              </Text>
              <Text style={styles.statSub}>Compliant Goods</Text>
            </View>
          </View>
        )}

        {/* Quick Action Electric Scan Banner */}
        <TouchableOpacity
          style={[styles.quickScanCard, isOfficer && styles.quickScanCardOfficer]}
          onPress={() => onNavigateTab('scan')}
          activeOpacity={0.88}
        >
          <View style={styles.quickScanLeft}>
            <View style={styles.quickScanIconSq}>
              <MaterialCommunityIcons
                name={isOfficer ? 'camera-metering-center' : 'qrcode-scan'}
                size={24}
                color="#FFFFFF"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.quickScanTitle}>
                {isOfficer ? 'Launch Field Enforcement Camera' : 'Point camera to audit'}
              </Text>
              <Text style={styles.quickScanSub}>
                {isOfficer
                  ? 'Verify PCR 2011 Rule 6 declarations & issue dockets'
                  : 'Instant OCR check of mandatory label declarations'}
              </Text>
            </View>
          </View>
          <View style={styles.arrowCircle}>
            <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {isOfficer ? 'Assigned Investigation Dockets' : 'Recent Audited Items'}
          </Text>
          <TouchableOpacity onPress={() => onNavigateTab(isOfficer ? 'cases' : 'history')}>
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
        {!isOfficer
          ? displayScans.map((item) => (
              <ScanFeedItem
                key={item.id}
                item={item}
                onSelectItem={(selected) => setSelectedScan(selected)}
              />
            ))
          : displayCases.map((item) => (
              <CaseFeedItem
                key={item.id}
                item={item}
                onSelectItem={(selected) => {
                  if (selected.scanItem) {
                    setSelectedScan(selected.scanItem);
                  }
                }}
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
    paddingBottom: 10,
    backgroundColor: theme.colors.bg,
  },
  scrollBody: {
    flex: 1,
  },
  scrollBodyContent: {
    paddingBottom: 24,
  },
  officerBadgeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 14,
    shadowColor: theme.colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  officerBadgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  officerIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#0C2014',
    alignItems: 'center',
    justifyContent: 'center',
  },
  officerJurisdictionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.navy,
  },
  officerBadgeSub: {
    fontSize: 11,
    color: theme.colors.muted,
    marginTop: 2,
  },
  dutyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.limeLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  dutyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.lime,
  },
  dutyText: {
    fontSize: 9,
    fontWeight: '900',
    color: theme.colors.limeDark,
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.muted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.navy,
  },
  statSub: {
    fontSize: 9,
    color: theme.colors.muted,
    marginTop: 2,
  },
  quickScanCard: {
    backgroundColor: theme.colors.lime,
    borderRadius: theme.radius.card,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: theme.colors.lime,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 4,
  },
  quickScanCardOfficer: {
    backgroundColor: '#0C2014',
    shadowColor: '#0C2014',
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
    lineHeight: 14,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
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
