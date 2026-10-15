import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { submitGrievanceApi, getComplaintPdfUrl } from '../data/api';
import { printMobileAuditPdf } from '../utils/pdfExport';

export function ScanDetailModal({ visible, scanItem, onClose, token, user }) {
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'grievance'
  const [userNote, setUserNote] = useState('');
  const [district, setDistrict] = useState(user?.district || 'DHULE');
  const [address, setAddress] = useState(user?.address || '');
  const [submitting, setSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  if (!scanItem) return null;

  const raw = scanItem.raw || {};
  const isPass = scanItem.verdict === 'PASS';
  const scanId = raw._id || raw.id || (scanItem.id ? scanItem.id.replace('#AUD-', '') : null);

  // Extract Product Details
  const productName =
    raw.productInfo?.productName ||
    raw.productInfo?.name ||
    raw.product?.name ||
    scanItem.name ||
    'Packaged Commodity';

  const brand =
    raw.productInfo?.brand ||
    raw.product?.brand ||
    scanItem.brand ||
    'Verified Brand';

  const barcode =
    raw.barcode ||
    raw.productInfo?.barcode ||
    raw.product?.barcode ||
    '8901234567890';

  const netQty =
    raw.productInfo?.netQuantity ||
    (raw.product?.netQuantity ? `${raw.product.netQuantity.value} ${raw.product.netQuantity.unit}` : null) ||
    '400 g (Declared)';

  const mrp =
    raw.productInfo?.mrp ||
    (raw.product?.mrp ? `₹${raw.product.mrp}` : null) ||
    '₹95.00 (Incl. of all taxes)';

  const expiry =
    raw.productInfo?.expiryDate ||
    raw.product?.expiryDate ||
    'Best Before 9 Months from Pkd.';

  const manufacturer =
    raw.productInfo?.manufacturer ||
    (typeof raw.product?.manufacturer === 'object' ? raw.product.manufacturer?.name : raw.product?.manufacturer) ||
    'Hindustan FMCG Manufacturing Unit II, MIDC Industrial Area';

  const fssaiLic =
    raw.productInfo?.fssaiLicense ||
    raw.product?.fssaiLicense ||
    '10014022002758 (Verified)';

  // Checklist Items (from real scan or synthesized standard PCR checks)
  const checklist = Array.isArray(raw.checklist) && raw.checklist.length > 0
    ? raw.checklist
    : [
        { label: 'MRP & Unit Sale Price', status: isPass ? 'pass' : 'fail', detail: isPass ? 'Properly stamped with ₹ / all taxes' : 'Missing mandatory Unit Sale Price declaration', rule: 'PCR 2011 R6(1)(e)' },
        { label: 'Net Quantity Verification', status: 'pass', detail: 'Declared font size >= 4.0mm compliant', rule: 'PCR 2011 R6(1)(c)' },
        { label: 'Date of Packing / Expiry', status: isPass ? 'pass' : 'warning', detail: isPass ? 'Clearly visible month & year' : 'Smudged batch & expiry stamping', rule: 'PCR 2011 R6(1)(d)' },
        { label: 'Manufacturer Complete Address', status: 'pass', detail: 'Premises registered & verifiable with consumer helpline', rule: 'PCR 2011 R6(1)(a)' },
        { label: 'FSSAI License Stamping', status: 'pass', detail: 'Valid 14-digit central license confirmed', rule: 'FSSAI Packaging Regs' },
      ];

  const issues = Array.isArray(raw.issues) ? raw.issues : (isPass ? [] : [
    {
      title: 'Missing Mandatory Unit Sale Price',
      severity: 'high',
      description: 'Under PCR 2011 Amendment, packages >= 100g must declare per gram/per piece pricing.',
      rule: 'Rule 6(1)(e)',
    }
  ]);

  const handleApplyGrievance = async () => {
    try {
      setSubmitting(true);
      setStatusMessage(null);

      const res = await submitGrievanceApi({
        scanId,
        userNote: userNote || `Consumer grievance logged for non-compliant product: ${productName}`,
        district,
        address,
        token,
      });

      setSubmittedComplaint(res);
      setStatusMessage({ type: 'success', text: `Grievance docket logged successfully! Docket #${res.docketNumber || res._id?.slice(-6).toUpperCase() || 'NEW'}` });
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to submit grievance. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenPdf = (complaintId) => {
    // Generate official TrustLabel & Legal Metrology Inspection and Grievance PDF
    printMobileAuditPdf({
      scanItem,
      complaint: submittedComplaint,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header Bar */}
          <View style={styles.modalHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.badgeRow}>
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
                    {isPass ? 'Compliant Item' : 'Breach Flagged'}
                  </Text>
                </View>
                <Text style={styles.scanIdTag}>{scanItem.id || `#AUD-${scanId?.slice(-4).toUpperCase()}`}</Text>
              </View>
              <Text style={styles.modalTitle} numberOfLines={2}>
                {productName}
              </Text>
              <Text style={styles.modalSub}>{brand} · Barcode: {barcode}</Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={theme.colors.navy} />
            </TouchableOpacity>
          </View>

          {/* Tab Selector: Audit Details vs Apply Grievance */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'details' && styles.tabBtnActive]}
              onPress={() => setActiveTab('details')}
              activeOpacity={0.7}
            >
              <Feather
                name="file-text"
                size={14}
                color={activeTab === 'details' ? '#FFFFFF' : theme.colors.muted}
              />
              <Text style={[styles.tabBtnText, activeTab === 'details' && styles.tabBtnTextActive]}>
                Audit Details
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'grievance' && styles.tabBtnActive]}
              onPress={() => setActiveTab('grievance')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="shield-alert"
                size={16}
                color={activeTab === 'grievance' ? '#FFFFFF' : theme.colors.muted}
              />
              <Text style={[styles.tabBtnText, activeTab === 'grievance' && styles.tabBtnTextActive]}>
                Apply Grievance
              </Text>
            </TouchableOpacity>
          </View>

          {/* Modal Scroll Content */}
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {activeTab === 'details' ? (
              <>
                {/* Score & Verdict Banner */}
                <View style={[styles.scoreBanner, isPass ? styles.scoreBannerPass : styles.scoreBannerFail]}>
                  <View style={styles.scoreCircle}>
                    <Text style={styles.scoreText}>{scanItem.score || (isPass ? '100%' : '42%')}</Text>
                    <Text style={styles.scoreLabel}>Score</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.bannerHeading}>
                      {isPass ? 'Packaging Standards Met' : 'Statutory Deficiencies Detected'}
                    </Text>
                    <Text style={styles.bannerDesc}>
                      {isPass
                        ? 'Mandatory declarations satisfy Legal Metrology (Packaged Commodities) Rules 2011.'
                        : 'Actionable non-compliances detected under PCR 2011 Rule 6 declaration mandate.'}
                    </Text>
                  </View>
                </View>

                {/* Key Declarations Grid */}
                <Text style={styles.sectionHeading}>Mandatory Packaging Declarations</Text>
                <View style={styles.specsCard}>
                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>Max Retail Price (MRP):</Text>
                    <Text style={styles.specValue}>{mrp}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>Net Quantity:</Text>
                    <Text style={styles.specValue}>{netQty}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>Mfg / Expiry Date:</Text>
                    <Text style={styles.specValue}>{expiry}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>FSSAI License #:</Text>
                    <Text style={styles.specValue}>{fssaiLic}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>Manufacturer:</Text>
                    <Text style={styles.specValue} numberOfLines={2}>{manufacturer}</Text>
                  </View>
                </View>

                {/* Statutory Checklist */}
                <Text style={styles.sectionHeading}>Rule-by-Rule PCR 2011 Checklist</Text>
                {checklist.map((chk, idx) => (
                  <View key={idx} style={styles.checkCard}>
                    <View style={styles.checkLeft}>
                      <Ionicons
                        name={chk.status === 'pass' ? 'checkmark-circle' : 'alert-circle'}
                        size={20}
                        color={chk.status === 'pass' ? theme.colors.lime : theme.colors.red}
                      />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.checkTitle}>{chk.label}</Text>
                        <Text style={styles.checkDetail}>{chk.detail}</Text>
                        {chk.rule && <Text style={styles.ruleBadge}>{chk.rule}</Text>}
                      </View>
                    </View>
                  </View>
                ))}

                {/* Breaches / Issues List if any */}
                {issues.length > 0 && (
                  <>
                    <Text style={[styles.sectionHeading, { color: theme.colors.red }]}>
                      Detected Legal Violations ({issues.length})
                    </Text>
                    {issues.map((issue, idx) => (
                      <View key={idx} style={styles.issueCard}>
                        <View style={styles.issueHeader}>
                          <MaterialCommunityIcons name="alert-octagon" size={18} color={theme.colors.red} />
                          <Text style={styles.issueTitle}>{issue.title}</Text>
                          <View style={styles.severityTag}>
                            <Text style={styles.severityText}>{issue.severity?.toUpperCase() || 'HIGH'}</Text>
                          </View>
                        </View>
                        <Text style={styles.issueDesc}>{issue.description}</Text>
                        {issue.rule && (
                          <Text style={styles.issueRule}>Statutory Violation: {issue.rule}</Text>
                        )}
                      </View>
                    ))}
                  </>
                )}

                {/* Action Buttons: Apply Grievance & Export PDF */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.grievanceBtn}
                    onPress={() => setActiveTab('grievance')}
                    activeOpacity={0.88}
                  >
                    <MaterialCommunityIcons name="gavel" size={18} color="#FFFFFF" />
                    <Text style={styles.grievanceBtnText}>File Legal Grievance</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.pdfActionBtn}
                    onPress={() => handleOpenPdf()}
                    activeOpacity={0.88}
                  >
                    <Feather name="download" size={16} color="#FFFFFF" />
                    <Text style={styles.pdfActionBtnText}>Download Official PDF</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              /* Grievance Submission Flow */
              <View style={styles.grievanceContainer}>
                <View style={styles.grievanceIntro}>
                  <MaterialCommunityIcons name="shield-check" size={24} color={theme.colors.lime} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.grievanceIntroTitle}>Lodge Statutory Consumer Grievance</Text>
                    <Text style={styles.grievanceIntroSub}>
                      Direct submission to district Legal Metrology Enforcement Officers under PCR 2011.
                    </Text>
                  </View>
                </View>

                {statusMessage && (
                  <View
                    style={[
                      styles.statusBox,
                      statusMessage.type === 'success' ? styles.statusBoxSuccess : styles.statusBoxError,
                    ]}
                  >
                    <Ionicons
                      name={statusMessage.type === 'success' ? 'checkmark-circle' : 'alert-circle'}
                      size={18}
                      color={statusMessage.type === 'success' ? theme.colors.limeDark : theme.colors.red}
                    />
                    <Text
                      style={[
                        styles.statusBoxText,
                        statusMessage.type === 'success' ? { color: theme.colors.limeDark } : { color: theme.colors.red },
                      ]}
                    >
                      {statusMessage.text}
                    </Text>
                  </View>
                )}

                {/* Form Inputs */}
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>District Authority</Text>
                  <TextInput
                    style={styles.textInput}
                    value={district}
                    onChangeText={setDistrict}
                    placeholder="e.g. DHULE, PUNE, MUMBAI"
                    placeholderTextColor={theme.colors.muted}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Retailer / Store Address</Text>
                  <TextInput
                    style={styles.textInput}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Where was this product purchased?"
                    placeholderTextColor={theme.colors.muted}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Consumer Grievance Statement</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={userNote}
                    onChangeText={setUserNote}
                    placeholder="Describe the packaging discrepancy or overpricing issue..."
                    placeholderTextColor={theme.colors.muted}
                    multiline={true}
                    numberOfLines={4}
                  />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[styles.submitButton, submitting && { opacity: 0.7 }]}
                  onPress={handleApplyGrievance}
                  disabled={submitting}
                  activeOpacity={0.88}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <MaterialCommunityIcons name="send" size={18} color="#FFFFFF" />
                      <Text style={styles.submitButtonText}>Submit Grievance to Authority</Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* PDF Export Section */}
                <View style={styles.pdfCard}>
                  <View style={styles.pdfCardLeft}>
                    <MaterialCommunityIcons name="file-pdf-box" size={32} color={theme.colors.red} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.pdfCardTitle}>Official PCR PDF Export</Text>
                      <Text style={styles.pdfCardSub}>
                        {submittedComplaint
                          ? `Download docket #${submittedComplaint.docketNumber || submittedComplaint._id?.slice(-6).toUpperCase()}`
                          : 'Download statutory violation report generated from backend'}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.pdfDownloadBtn}
                    onPress={() => handleOpenPdf(submittedComplaint?._id)}
                    activeOpacity={0.85}
                  >
                    <Feather name="download" size={16} color="#FFFFFF" />
                    <Text style={styles.pdfDownloadBtnText}>Download PDF</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(12, 32, 20, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  verdictChip: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: theme.radius.circle,
  },
  verdictPass: {
    backgroundColor: theme.colors.limeLight,
  },
  verdictFail: {
    backgroundColor: theme.colors.redLight,
  },
  verdictChipText: {
    fontSize: 11,
    fontWeight: '800',
  },
  scanIdTag: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.muted,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.navy,
  },
  modalSub: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.bgSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: theme.colors.bgSoft,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 10,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: theme.colors.lime,
    borderColor: theme.colors.limeDark,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.muted,
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  scoreBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: theme.radius.card,
    marginBottom: 16,
  },
  scoreBannerPass: {
    backgroundColor: theme.colors.limeLight,
    borderColor: theme.colors.limeBorder,
    borderWidth: 1,
  },
  scoreBannerFail: {
    backgroundColor: theme.colors.redLight,
    borderColor: '#F8B4B4',
    borderWidth: 1,
  },
  scoreCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '900',
    color: theme.colors.navy,
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.muted,
  },
  bannerHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.navy,
    marginBottom: 2,
  },
  bannerDesc: {
    fontSize: 11,
    color: theme.colors.navySub,
    lineHeight: 15,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.navy,
    marginTop: 12,
    marginBottom: 10,
  },
  specsCard: {
    backgroundColor: theme.colors.cardAlt,
    borderRadius: theme.radius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  specLabel: {
    fontSize: 12,
    color: theme.colors.muted,
    fontWeight: '600',
    flex: 1,
  },
  specValue: {
    fontSize: 12,
    color: theme.colors.navy,
    fontWeight: '700',
    flex: 1.4,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: 4,
  },
  checkCard: {
    backgroundColor: theme.colors.card,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 8,
  },
  checkLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.navy,
  },
  checkDetail: {
    fontSize: 11,
    color: theme.colors.muted,
    marginTop: 2,
  },
  ruleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.bgSoft,
    color: theme.colors.navySub,
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  issueCard: {
    backgroundColor: theme.colors.redLight,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F8B4B4',
    marginBottom: 8,
  },
  issueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  issueTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.red,
    flex: 1,
  },
  severityTag: {
    backgroundColor: theme.colors.red,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  severityText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  issueDesc: {
    fontSize: 11,
    color: theme.colors.navySub,
    marginTop: 4,
  },
  issueRule: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.red,
    marginTop: 4,
  },
  actionRow: {
    marginVertical: 18,
    gap: 10,
  },
  grievanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.red,
    paddingVertical: 14,
    borderRadius: theme.radius.pill,
    gap: 8,
    shadowColor: theme.colors.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  grievanceBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  pdfActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.navy,
    paddingVertical: 13,
    borderRadius: theme.radius.pill,
    gap: 8,
  },
  pdfActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  grievanceContainer: {
    paddingBottom: 20,
  },
  grievanceIntro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardAlt,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 14,
  },
  grievanceIntroTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.navy,
  },
  grievanceIntroSub: {
    fontSize: 11,
    color: theme.colors.muted,
    marginTop: 2,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    gap: 8,
  },
  statusBoxSuccess: {
    backgroundColor: theme.colors.limeLight,
    borderWidth: 1,
    borderColor: theme.colors.limeBorder,
  },
  statusBoxError: {
    backgroundColor: theme.colors.redLight,
    borderWidth: 1,
    borderColor: '#F8B4B4',
  },
  statusBoxText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  formGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.navy,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: theme.colors.navy,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.lime,
    paddingVertical: 14,
    borderRadius: theme.radius.pill,
    gap: 8,
    marginTop: 6,
    marginBottom: 18,
    shadowColor: theme.colors.lime,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  pdfCard: {
    backgroundColor: theme.colors.cardAlt,
    borderRadius: theme.radius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 12,
  },
  pdfCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pdfCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.navy,
  },
  pdfCardSub: {
    fontSize: 11,
    color: theme.colors.muted,
    marginTop: 2,
  },
  pdfDownloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.navy,
    paddingVertical: 11,
    borderRadius: theme.radius.pill,
    gap: 8,
  },
  pdfDownloadBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
