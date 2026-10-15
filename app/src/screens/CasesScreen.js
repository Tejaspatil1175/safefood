import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '../theme/theme';
import { CaseFeedItem } from '../components/FeedCards';
import { officerMockCases } from '../data/mockData';

export function CasesScreen({ role }) {
  return (
    <View style={styles.container}>
      <Text style={styles.pageHeading}>
        {role === 'user' ? 'My Filed Grievances' : 'Assigned Case Register'}
      </Text>
      <Text style={styles.pageSub}>
        Statutory actions filed under Legal Metrology Act, 2009
      </Text>

      {officerMockCases.map((item) => (
        <CaseFeedItem key={item.id} item={item} />
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
