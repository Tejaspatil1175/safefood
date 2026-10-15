import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

export function ScanScreen({ role, onCompleteScan }) {
  return (
    <View style={styles.scanViewCard}>
      <View style={styles.scanViewHeader}>
        <Text style={styles.scanViewTitle}>
          {role === 'user' ? 'Citizen OCR Camera' : 'Officer Enforcement Scanner'}
        </Text>
        <Text style={styles.scanViewSub}>
          Position the commodity packaging panel inside the guide markers
        </Text>
      </View>

      {/* Camera Simulated Viewport */}
      <View style={styles.cameraFrame}>
        <View style={styles.scannerCornerTL} />
        <View style={styles.scannerCornerTR} />
        <View style={styles.scannerCornerBL} />
        <View style={styles.scannerCornerBR} />
        <MaterialCommunityIcons name="barcode-scan" size={68} color="#70B814" />
        <Text style={styles.scanningPrompt}>AI detecting Legal Metrology declarations...</Text>
      </View>

      <TouchableOpacity
        style={styles.heroButton}
        onPress={() => {
          alert('Scan captured! Package analyzed under PCR 2011 Rule 6.');
          onCompleteScan();
        }}
        activeOpacity={0.88}
      >
        <Text style={styles.heroButtonText}>Capture & Analyze Label</Text>
        <View style={styles.heroBtnArrow}>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  scanViewCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.hero,
    padding: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scanViewHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scanViewTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.navy,
  },
  scanViewSub: {
    fontSize: 12,
    color: theme.colors.muted,
    textAlign: 'center',
    marginTop: 4,
  },
  cameraFrame: {
    height: 260,
    backgroundColor: '#0F172A',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  scannerCornerTL: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 28,
    height: 28,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#70B814',
  },
  scannerCornerTR: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 28,
    height: 28,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#70B814',
  },
  scannerCornerBL: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 28,
    height: 28,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#70B814',
  },
  scannerCornerBR: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 28,
    height: 28,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#70B814',
  },
  scanningPrompt: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 14,
  },
  heroButton: {
    backgroundColor: theme.colors.lime,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroBtnArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
