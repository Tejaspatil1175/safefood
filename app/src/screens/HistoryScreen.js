import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '../theme/theme';
import { ScanFeedItem } from '../components/FeedCards';
import { userMockScans } from '../data/mockData';

export function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.pageHeading}>Audit History Archive</Text>
      <Text style={styles.pageSub}>
        All packaged commodities verified by your device
      </Text>

      {userMockScans.map((item) => (
        <ScanFeedItem key={item.id} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  pageHeading: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.navy,
    marginBottom: 4,
  },
  pageSub: {
    fontSize: 12,
    color: theme.colors.muted,
    marginBottom: 16,
  },
});
