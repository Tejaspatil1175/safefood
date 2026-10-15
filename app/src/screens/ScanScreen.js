import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { uploadLiveScan } from '../data/api';
import { ScanDetailModal } from '../components/ScanDetailModal';

export function ScanScreen({ role, user, token, onCompleteScan }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [modalScan, setModalScan] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const scanSteps = [
    'Transmitting packaging image to AI Vision...',
    'Performing Legal Metrology OCR extraction...',
    'Checking PCR 2011 Rule 6 declaration font sizes...',
    'Generating TrustLabel™ Statutory Audit Report...',
  ];

  // 1. Open Real Device Camera directly
  const handleLaunchCamera = async () => {
    try {
      setErrorMsg(null);

      // On native mobile (Expo Go on Android/iOS)
      if (Platform.OS !== 'web') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setErrorMsg('Camera permission is required to photograph food packaging labels.');
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.9,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          setSelectedImage({ uri: asset.uri });
          uploadFileFromUri(asset.uri, asset.mimeType || 'image/jpeg');
        }
        return;
      }

      // On Web: Open mobile device camera directly via HTML5 environment capture
      if (typeof document !== 'undefined') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment'; // Force phone to launch camera directly
        input.onchange = (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const preview = URL.createObjectURL(file);
            setSelectedImage({ uri: preview, file });
            runLiveScan(file);
          }
        };
        input.click();
      }
    } catch (err) {
      console.warn('Camera launch notice:', err);
      setErrorMsg('Unable to open camera: ' + (err.message || 'Please check app permissions'));
    }
  };

  // 2. Open Device Photo Gallery
  const handleLaunchGallery = async () => {
    try {
      setErrorMsg(null);

      if (Platform.OS !== 'web') {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          setErrorMsg('Media library permission is required to choose photos.');
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.9,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          setSelectedImage({ uri: asset.uri });
          uploadFileFromUri(asset.uri, asset.mimeType || 'image/jpeg');
        }
        return;
      }

      // Web file picker
      if (typeof document !== 'undefined') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const preview = URL.createObjectURL(file);
            setSelectedImage({ uri: preview, file });
            runLiveScan(file);
          }
        };
        input.click();
      }
    } catch (err) {
      console.warn('Gallery launch notice:', err);
      setErrorMsg('Unable to pick photo: ' + err.message);
    }
  };

  // Upload photo captured on native phone
  const uploadFileFromUri = async (uri, mimeType) => {
    try {
      setAnalyzing(true);
      setErrorMsg(null);
      setScanResult(null);

      setScanStep(0);
      const interval = setInterval(() => {
        setScanStep((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev));
      }, 700);

      const filename = uri.split('/').pop() || `camera-capture-${Date.now()}.jpg`;
      const formData = new FormData();
      formData.append('images', {
        uri,
        name: filename,
        type: mimeType || 'image/jpeg',
      });
      formData.append('label', {
        uri,
        name: filename,
        type: mimeType || 'image/jpeg',
      });

      const res = await uploadLiveScan(formData, token);
      clearInterval(interval);

      setScanResult(res);
      formatAndOpenModal(res);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to analyze packaging. Please verify network.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Upload file from Web
  const runLiveScan = async (file) => {
    try {
      setAnalyzing(true);
      setErrorMsg(null);
      setScanResult(null);

      setScanStep(0);
      const interval = setInterval(() => {
        setScanStep((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev));
      }, 700);

      const formData = new FormData();
      formData.append('images', file);
      formData.append('label', file);

      const res = await uploadLiveScan(formData, token);
      clearInterval(interval);

      setScanResult(res);
      formatAndOpenModal(res);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to analyze packaging. Please verify network.');
    } finally {
      setAnalyzing(false);
    }
  };

  const formatAndOpenModal = (res) => {
    const isPass = res.verdict === 'PASS' || res.isCompliant === true;
    const item = {
      id: res.id || (res._id ? `#AUD-${res._id.slice(-4).toUpperCase()}` : '#AUD-NEW'),
      name: res.productInfo?.productName || res.productInfo?.name || res.product?.name || 'Packaged Commodity',
      brand: res.productInfo?.brand || res.product?.brand || 'FMCG Verified',
      category: res.productInfo?.barcode ? `Barcode: ${res.productInfo.barcode}` : 'Packaged Goods',
      verdict: isPass ? 'PASS' : 'FAIL',
      score: res.score ? `${Math.round(res.score)}%` : isPass ? '100%' : '38%',
      time: 'Just now',
      raw: res,
    };
    setModalScan(item);
  };

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <Text style={styles.pageHeading}>
          {role === 'user' ? 'Statutory OCR Camera' : 'Officer Enforcement Scanner'}
        </Text>
        <Text style={styles.pageSub}>
          Take photo of food packaging label using phone camera
        </Text>
      </View>

      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollBodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Camera / Viewport Card */}
        <View style={styles.scanViewCard}>
          <View style={styles.cameraFrame}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
            ) : (
              <>
                <View style={styles.scannerCornerTL} />
                <View style={styles.scannerCornerTR} />
                <View style={styles.scannerCornerBL} />
                <View style={styles.scannerCornerBR} />
                <MaterialCommunityIcons name="camera-iris" size={72} color={theme.colors.lime} />
                <Text style={styles.scanningPrompt}>Ready to Capture</Text>
                <Text style={styles.scanningSubPrompt}>Click green button below to open camera</Text>
              </>
            )}

            {analyzing && (
              <View style={styles.scanningOverlay}>
                <ActivityIndicator size="large" color={theme.colors.lime} />
                <Text style={styles.analyzingText}>{scanSteps[scanStep]}</Text>
              </View>
            )}
          </View>

          {errorMsg && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={theme.colors.red} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {/* Action Trigger Buttons */}
          <View style={styles.btnRow}>
            {/* Primary Action: Launch Real Camera */}
            <TouchableOpacity
              style={[styles.heroButton, analyzing && { opacity: 0.7 }]}
              onPress={handleLaunchCamera}
              disabled={analyzing}
              activeOpacity={0.88}
            >
              <View style={styles.heroBtnContent}>
                <Feather name="camera" size={22} color="#FFFFFF" />
                <Text style={styles.heroButtonText}>
                  {selectedImage ? 'Take Another Photo' : 'Open Camera & Take Photo'}
                </Text>
              </View>
              <View style={styles.heroBtnArrow}>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            {/* Secondary Action: Pick from Gallery */}
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={handleLaunchGallery}
              disabled={analyzing}
              activeOpacity={0.85}
            >
              <Feather name="image" size={16} color={theme.colors.navy} />
              <Text style={styles.galleryButtonText}>Choose from Gallery / Photos</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scan Result Highlights if completed */}
        {scanResult && (
          <View style={styles.resultSummaryCard}>
            <View style={styles.resultSummaryHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.resultTitle}>
                  {scanResult.productInfo?.productName || scanResult.product?.name || 'Inspected Product'}
                </Text>
                <Text style={styles.resultSub}>
                  {scanResult.productInfo?.brand || 'Brand Verified'} · Score: {scanResult.score || '38'}%
                </Text>
              </View>
              <View
                style={[
                  styles.resultBadge,
                  (scanResult.verdict === 'PASS' || scanResult.isCompliant)
                    ? styles.resultBadgePass
                    : styles.resultBadgeFail,
                ]}
              >
                <Text
                  style={[
                    styles.resultBadgeText,
                    (scanResult.verdict === 'PASS' || scanResult.isCompliant)
                      ? { color: theme.colors.limeDark }
                      : { color: theme.colors.red },
                  ]}
                >
                  {(scanResult.verdict === 'PASS' || scanResult.isCompliant) ? 'Compliant' : 'Breach Detected'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.openDetailsBtn}
              onPress={() => formatAndOpenModal(scanResult)}
              activeOpacity={0.88}
            >
              <MaterialCommunityIcons name="file-document-outline" size={18} color="#FFFFFF" />
              <Text style={styles.openDetailsBtnText}>View Details, Grievance & PDF</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Comprehensive Product Audit, Grievance Lodging, and PDF Download Modal */}
      <ScanDetailModal
        visible={Boolean(modalScan)}
        scanItem={modalScan}
        onClose={() => setModalScan(null)}
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
  scanViewCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.hero,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
  },
  cameraFrame: {
    height: 300,
    backgroundColor: '#0F2417',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'contain',
  },
  scannerCornerTL: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 32,
    height: 32,
    borderTopWidth: 3.5,
    borderLeftWidth: 3.5,
    borderColor: theme.colors.lime,
  },
  scannerCornerTR: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderTopWidth: 3.5,
    borderRightWidth: 3.5,
    borderColor: theme.colors.lime,
  },
  scannerCornerBL: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 32,
    height: 32,
    borderBottomWidth: 3.5,
    borderLeftWidth: 3.5,
    borderColor: theme.colors.lime,
  },
  scannerCornerBR: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 32,
    height: 32,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    borderColor: theme.colors.lime,
  },
  scanningPrompt: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 14,
  },
  scanningSubPrompt: {
    fontSize: 11,
    color: '#8CAE96',
    marginTop: 4,
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 32, 20, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  analyzingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.redLight,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F8B4B4',
    marginBottom: 14,
    gap: 8,
  },
  errorText: {
    color: theme.colors.red,
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  btnRow: {
    gap: 10,
  },
  heroButton: {
    backgroundColor: theme.colors.lime,
    borderRadius: theme.radius.pill,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: theme.colors.lime,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 3,
  },
  heroBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroBtnArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bgSoft,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    paddingVertical: 12,
    gap: 8,
  },
  galleryButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.navy,
  },
  resultSummaryCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
  },
  resultSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.navy,
  },
  resultSub: {
    fontSize: 11,
    color: theme.colors.muted,
    marginTop: 2,
  },
  resultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.circle,
  },
  resultBadgePass: {
    backgroundColor: theme.colors.limeLight,
  },
  resultBadgeFail: {
    backgroundColor: theme.colors.redLight,
  },
  resultBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  openDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.navy,
    paddingVertical: 12,
    borderRadius: theme.radius.pill,
    gap: 8,
  },
  openDetailsBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
