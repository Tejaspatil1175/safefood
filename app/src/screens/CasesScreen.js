import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';
import { CaseFeedItem } from '../components/FeedCards';
import { ScanDetailModal } from '../components/ScanDetailModal';
import { fetchLiveComplaints } from '../data/api';
import { officerMockCases } from '../data/mockData';

export function CasesScreen({ role, user, token }) {
  const [liveCases, setLiveCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCaseScan, setSelectedCaseScan] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const complaints = await fetchLiveComplaints(token);
        if (isMounted && Array.isArray(complaints) && complaints.length > 0) {
          const formatted = complaints.map((c, idx) => {
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
              retailer: c.address ? `${c.address} (${c.district || 'DHULE'})` : `District Legal Metrology (${c.district || 'DHULE'})`,
              status: c.status === 'ACTION_TAKEN' ? 'Action Taken' : c.status === 'IN_REVIEW' ? 'In Review' : c.status || 'Under Investigation',
              rule: ruleDesc,
              time: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recent',
              rawComplaint: c,
              // Map to scanItem shape so ScanDetailModal can display complete product details
              scanItem: {
                id: c.docketNumber || `#DOK-${c._id?.slice(-4).toUpperCase()}`,
                name: productName,
                brand: scan.product?.brand || scan.geminiAudit?.detectedProduct?.brand || 'FMCG Packaged Good',
                category: `District: ${c.district || 'DHULE'}`,
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
          setLiveCases(formatted);
        }
      } catch (err) {
        console.warn('Complaints fetch notice:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const displayCases = liveCases.length > 0 ? liveCases : officerMockCases;

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <Text style={styles.pageHeading}>
          {role === 'user' ? 'My Filed Grievances' : 'Assigned Case Register'}
        </Text>
        <Text style={styles.pageSub}>
          Live statutory grievances logged with Legal Metrology Authority
        </Text>
      </View>

      {/* Scrollable Cases List */}
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

        {displayCases.map((item) => (
          <CaseFeedItem
            key={item.id}
            item={item}
            onSelectItem={(selected) => {
              if (selected.scanItem) {
                setSelectedCaseScan(selected.scanItem);
              }
            }}
          />
        ))}
      </ScrollView>

      {/* Product Detail, Grievance Details, and Official PDF Modal */}
      <ScanDetailModal
        visible={Boolean(selectedCaseScan)}
        scanItem={selectedCaseScan}
        onClose={() => setSelectedCaseScan(null)}
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
