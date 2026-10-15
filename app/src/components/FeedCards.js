import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';

export function ScanFeedItem({ item, onSelectItem }) {
  const isPass = item.verdict === 'PASS';

  return (
    <TouchableOpacity
      style={styles.feedCard}
      onPress={() => onSelectItem && onSelectItem(item)}
      activeOpacity={0.82}
    >
      <View style={styles.feedCardTop}>
        <View style={styles.feedProductInfo}>
          <View
            style={[
              styles.productIconBox,
              isPass
                ? { backgroundColor: theme.colors.limeLight }
                : { backgroundColor: theme.colors.redLight },
            ]}
          >
            <MaterialCommunityIcons
              name={item.icon || 'food'}
              size={22}
              color={isPass ? theme.colors.limeDark : theme.colors.red}
            />
          </View>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.productSub}>
              {item.brand} · {item.category}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.verdictChip,
            isPass ? styles.verdictPass : styles.verdictFail,
          ]}
        >
          <Text
            style={[
              styles.verdictChipText,
              isPass ? { color: theme.colors.limeDark } : { color: theme.colors.red },
            ]}
          >
            {isPass ? 'Compliant' : 'Breach Flagged'}
          </Text>
        </View>
      </View>

      <View style={styles.feedDivider} />

      <View style={styles.feedCardBottom}>
        <Text style={styles.timeLabel}>
          <Feather name="clock" size={11} color={theme.colors.muted} /> {item.time}
        </Text>
        <Text style={styles.idLabel}>{item.id}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function CaseFeedItem({ item, onSelectItem }) {
  const isActionTaken = item.status === 'Action Taken' || item.status === 'ACTION_TAKEN';
  const isResolved = item.status === 'RESOLVED' || item.status === 'Resolved';

  return (
    <TouchableOpacity
      style={styles.feedCard}
      onPress={() => onSelectItem && onSelectItem(item)}
      activeOpacity={0.82}
    >
      <View style={styles.feedCardTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.caseBadge}>
            {item.id} · Ref: {item.ref}
          </Text>
          <Text style={styles.productName}>{item.product}</Text>
          <Text style={styles.productSub}>Retailer: {item.retailer}</Text>
        </View>
        <View
          style={[
            styles.verdictChip,
            isActionTaken
              ? { backgroundColor: theme.colors.limeLight }
              : isResolved
              ? { backgroundColor: theme.colors.limeLight }
              : styles.verdictPending,
          ]}
        >
          <Text
            style={[
              styles.verdictChipText,
              isActionTaken || isResolved
                ? { color: theme.colors.limeDark }
                : { color: theme.colors.amber },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.feedDivider} />

      <View style={styles.feedCardBottom}>
        <Text style={styles.ruleNotice} numberOfLines={1}>{item.rule}</Text>
        <Text style={styles.timeLabel}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  feedCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.pill,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 12,
    shadowColor: theme.colors.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  feedCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feedProductInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  productIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.navy,
  },
  productSub: {
    fontSize: 11,
    color: theme.colors.muted,
    marginTop: 2,
  },
  verdictChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verdictPass: {
    backgroundColor: theme.colors.limeLight,
  },
  verdictFail: {
    backgroundColor: theme.colors.redLight,
  },
  verdictPending: {
    backgroundColor: theme.colors.amberLight,
  },
  verdictChipText: {
    fontSize: 11,
    fontWeight: '800',
  },
  feedDivider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: 12,
  },
  feedCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: 11,
    color: theme.colors.muted,
  },
  idLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  caseBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.amber,
    marginBottom: 2,
  },
  ruleNotice: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.red,
    flex: 1,
    paddingRight: 8,
  },
});
