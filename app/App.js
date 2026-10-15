import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  FontAwesome5,
} from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function App() {
  // Toggle between Citizen (user) and Officer mode
  const [role, setRole] = useState<'user' | 'officer'>('user');
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'scan' | 'cases' | 'profile'>('home');
  const [isScanning, setIsScanning] = useState(false);

  // User Mock Data
  const userScans = [
    {
      id: '#AUD-8921',
      name: 'Good Day Butter Cookies',
      category: 'Packaged Biscuits',
      verdict: 'FAIL',
      score: '38%',
      violationsCount: 3,
      time: 'Today, 10:45 AM',
      icon: 'cookie',
      brand: 'Britannia',
    },
    {
      id: '#AUD-8914',
      name: 'Farm Fresh Toned Milk',
      category: 'Dairy Beverage',
      verdict: 'PASS',
      score: '96%',
      violationsCount: 0,
      time: 'Yesterday, 4:20 PM',
      icon: 'cup',
      brand: 'Amul',
    },
    {
      id: '#AUD-8890',
      name: 'Almond Oat Energy Bar',
      category: 'Nutritional Bar',
      verdict: 'FAIL',
      score: '42%',
      violationsCount: 2,
      time: 'Oct 14, 2026',
      icon: 'nutrition',
      brand: 'Nature Crunch',
    },
  ];

  // Officer Mock Cases
  const officerCases = [
    {
      id: 'INV-104',
      ref: 'GRV-2048',
      product: 'Good Day Biscuits 200g',
      retailer: 'City Mart, Dhule Market',
      status: 'Action Taken',
      rule: 'Rule 6(1)(a) Descriptor Absent',
      time: 'Today, 9:15 AM',
    },
    {
      id: 'INV-103',
      ref: 'GRV-2035',
      product: 'Edible Cooking Oil 1L',
      retailer: 'Apex Wholesale, Sector 4',
      status: 'Under Investigation',
      rule: 'Net Quantity Standard Missing',
      time: 'Yesterday, 5:30 PM',
    },
    {
      id: 'INV-101',
      ref: 'GRV-1998',
      product: 'Spiced Corn Puffs',
      retailer: 'Shree Ganesh Stores',
      status: 'Notice Issued',
      rule: 'FSSAI License Font Undersized',
      time: 'Oct 12, 2026',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6F0" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{role === 'user' ? 'CP' : 'RP'}</Text>
          </View>
          <View>
            <Text style={styles.greetingSub}>
              {role === 'user' ? 'Good morning, Citizen' : 'Enforcement Division'}
            </Text>
            <Text style={styles.greetingName}>
              {role === 'user' ? 'Tejas Patil' : 'Insp. Rajesh Patil'}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Switch Role Pill */}
          <TouchableOpacity
            style={styles.roleSwitchBtn}
            onPress={() => setRole(role === 'user' ? 'officer' : 'user')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={role === 'user' ? 'shield-account' : 'account'}
              size={14}
              color="#3B7A11"
            />
            <Text style={styles.roleSwitchText}>
              {role === 'user' ? 'Officer Mode' : 'Citizen Mode'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconCircleBtn} activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={19} color="#0F1E36" />
          </TouchableOpacity>
        </View>
      </View>

      {/* MAIN SCROLLABLE CONTENT */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'home' && (
          <>
            {/* HERO CARD (Color graded like screenshot: Cream + Emerald/Lime Accent) */}
            <View style={styles.heroCard}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="shield-checkmark" size={13} color="#4D880E" />
                  <Text style={styles.verifiedBadgeText}>
                    {role === 'user' ? 'PCR 2011 Verified AI' : 'Active Field Jurisdiction'}
                  </Text>
                </View>
                <View style={styles.batteryChip}>
                  <Ionicons name="battery-charging" size={14} color="#58960E" />
                  <Text style={styles.batteryText}>
                    {role === 'user' ? 'Live OCR 99%' : 'Auto-Verify Active'}
                  </Text>
                </View>
              </View>

              <Text style={styles.heroTitle}>
                {role === 'user' ? (
                  <>
                    Audit food.{'\n'}
                    <Text style={styles.heroTitleGreen}>Detect violations.</Text>
                  </>
                ) : (
                  <>
                    Enforce PCR.{'\n'}
                    <Text style={styles.heroTitleGreen}>Issue notices.</Text>
                  </>
                )}
              </Text>

              <Text style={styles.heroSubtext}>
                {role === 'user'
                  ? 'Verify mandatory Rule 6 declarations, MRP tamperings, and font sizes before buying.'
                  : 'Execute statutory label inspections and issue metrology discrepancy dockets.'}
              </Text>

              {/* Stat Indicators Row */}
              <View style={styles.metricsRow}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>
                    {role === 'user' ? 'MY AUDITS' : 'FIELD SCANS'}
                  </Text>
                  <Text style={styles.metricValue}>
                    {role === 'user' ? '18' : '48'}
                  </Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>
                    {role === 'user' ? 'PCR BREACHES' : 'NOTICES ISSUED'}
                  </Text>
                  <Text style={[styles.metricValue, { color: '#E11D48' }]}>
                    {role === 'user' ? '5' : '16'}
                  </Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>
                    {role === 'user' ? 'ACCURACY' : 'RESOLVED'}
                  </Text>
                  <Text style={[styles.metricValue, { color: '#58960E' }]}>
                    {role === 'user' ? '98.4%' : '32'}
                  </Text>
                </View>
              </View>
            </View>

            {/* SCAN TO UNLOCK / AUDIT BANNER (Styled like screenshot green bar) */}
            <TouchableOpacity
              style={styles.quickScanCard}
              onPress={() => {
                setActiveTab('scan');
                setIsScanning(true);
              }}
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

            {/* SECTION TITLE */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {role === 'user' ? 'Recent audited items' : 'Assigned investigation dockets'}
              </Text>
              <TouchableOpacity
                onPress={() => setActiveTab(role === 'user' ? 'history' : 'cases')}
              >
                <Text style={styles.sectionViewAll}>View all</Text>
              </TouchableOpacity>
            </View>

            {/* LIST CARDS */}
            {role === 'user'
              ? userScans.map((item) => (
                  <View key={item.id} style={styles.feedCard}>
                    <View style={styles.feedCardTop}>
                      <View style={styles.feedProductInfo}>
                        <View
                          style={[
                            styles.productIconBox,
                            item.verdict === 'PASS'
                              ? { backgroundColor: '#ECFCCB' }
                              : { backgroundColor: '#FEE2E2' },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={item.icon as any}
                            size={22}
                            color={item.verdict === 'PASS' ? '#4D880E' : '#DC2626'}
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
                          item.verdict === 'PASS'
                            ? styles.verdictPass
                            : styles.verdictFail,
                        ]}
                      >
                        <Text
                          style={[
                            styles.verdictChipText,
                            item.verdict === 'PASS'
                              ? { color: '#3B7A11' }
                              : { color: '#B91C1C' },
                          ]}
                        >
                          {item.verdict === 'PASS' ? 'Compliant' : 'Breach Flagged'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.feedDivider} />

                    <View style={styles.feedCardBottom}>
                      <Text style={styles.timeLabel}>
                        <Feather name="clock" size={11} color="#64748B" /> {item.time}
                      </Text>
                      <Text style={styles.idLabel}>{item.id}</Text>
                    </View>
                  </View>
                ))
              : officerCases.map((item) => (
                  <View key={item.id} style={styles.feedCard}>
                    <View style={styles.feedCardTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.caseBadge}>
                          {item.id} · Ref: {item.ref}
                        </Text>
                        <Text style={styles.productName}>{item.product}</Text>
                        <Text style={styles.productSub}>Retailer: {item.retailer}</Text>
                      </View>
                      <View style={[styles.verdictChip, styles.verdictPending]}>
                        <Text style={[styles.verdictChipText, { color: '#D97706' }]}>
                          {item.status}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.feedDivider} />

                    <View style={styles.feedCardBottom}>
                      <Text style={styles.ruleNotice}>{item.rule}</Text>
                      <Text style={styles.timeLabel}>{item.time}</Text>
                    </View>
                  </View>
                ))}
          </>
        )}

        {/* SCAN VIEW TAB */}
        {activeTab === 'scan' && (
          <View style={styles.scanViewCard}>
            <View style={styles.scanViewHeader}>
              <Text style={styles.scanViewTitle}>
                {role === 'user' ? 'Citizen OCR Camera' : 'Officer Enforcement Scanner'}
              </Text>
              <Text style={styles.scanViewSub}>
                Position the package packaging panel inside the guide markers
              </Text>
            </View>

            {/* Camera Simulation Frame */}
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
                setActiveTab('home');
              }}
              activeOpacity={0.88}
            >
              <Text style={styles.heroButtonText}>Capture & Analyze Label</Text>
              <View style={styles.heroBtnArrow}>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* HISTORY / AUDITS TAB */}
        {activeTab === 'history' && (
          <View>
            <Text style={styles.pageHeading}>Audit History Archive</Text>
            <Text style={styles.pageSub}>
              All packaged commodities verified by your device
            </Text>
            {userScans.map((item) => (
              <View key={item.id} style={styles.feedCard}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productSub}>{item.category} · {item.time}</Text>
              </View>
            ))}
          </View>
        )}

        {/* CASES / GRIEVANCES TAB */}
        {activeTab === 'cases' && (
          <View>
            <Text style={styles.pageHeading}>
              {role === 'user' ? 'My Filed Grievances' : 'Assigned Case Register'}
            </Text>
            <Text style={styles.pageSub}>
              Statutory actions filed under Legal Metrology Act, 2009
            </Text>
            {officerCases.map((item) => (
              <View key={item.id} style={styles.feedCard}>
                <Text style={styles.caseBadge}>{item.id} · {item.status}</Text>
                <Text style={styles.productName}>{item.product}</Text>
                <Text style={styles.productSub}>{item.retailer}</Text>
              </View>
            ))}
          </View>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={[styles.avatarCircle, { width: 64, height: 64, borderRadius: 32 }]}>
                <Text style={[styles.avatarText, { fontSize: 24 }]}>
                  {role === 'user' ? 'CP' : 'RP'}
                </Text>
              </View>
              <Text style={styles.profileName}>
                {role === 'user' ? 'Tejas Patil' : 'Insp. Rajesh Patil'}
              </Text>
              <Text style={styles.profileRole}>
                {role === 'user' ? 'Citizen Verified Consumer · Dhule' : 'Authorized Enforcement Officer · OFF-DHL-101'}
              </Text>
            </View>

            <View style={styles.profileOptions}>
              <View style={styles.profileRow}>
                <Text style={styles.profileRowLabel}>Jurisdiction</Text>
                <Text style={styles.profileRowValue}>DHULE, MAHARASHTRA</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileRowLabel}>Backend Node</Text>
                <Text style={styles.profileRowValue}>Live MongoDB Cloud</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileRowLabel}>Auto-Verification</Text>
                <Text style={[styles.profileRowValue, { color: '#58960E' }]}>Enabled</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* FLOATING BOTTOM TABBAR (Like Reference: Home, History, Scan center, Cases, Profile) */}
      <View style={styles.tabbarWrapper}>
        <View style={styles.tabbar}>
          {/* TAB 1: Home */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('home')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'home' ? 'home' : 'home-outline'}
              size={22}
              color={activeTab === 'home' ? '#58960E' : '#94A3B8'}
            />
            <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>
              Home
            </Text>
          </TouchableOpacity>

          {/* TAB 2: History */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('history')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={activeTab === 'history' ? 'history' : 'history'}
              size={24}
              color={activeTab === 'history' ? '#58960E' : '#94A3B8'}
            />
            <Text style={[styles.tabLabel, activeTab === 'history' && styles.tabLabelActive]}>
              History
            </Text>
          </TouchableOpacity>

          {/* TAB 3: CENTER ELEVATED SCAN BUTTON */}
          <TouchableOpacity
            style={styles.centerScanBtn}
            onPress={() => {
              setActiveTab('scan');
              setIsScanning(true);
            }}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={26} color="#FFFFFF" />
          </TouchableOpacity>

          {/* TAB 4: Cases / Grievances */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('cases')}
            activeOpacity={0.7}
          >
            <Feather
              name="file-text"
              size={21}
              color={activeTab === 'cases' ? '#58960E' : '#94A3B8'}
            />
            <Text style={[styles.tabLabel, activeTab === 'cases' && styles.tabLabelActive]}>
              {role === 'user' ? 'Reports' : 'Cases'}
            </Text>
          </TouchableOpacity>

          {/* TAB 5: Profile */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('profile')}
            activeOpacity={0.7}
          >
            <Feather
              name="user"
              size={21}
              color={activeTab === 'profile' ? '#58960E' : '#94A3B8'}
            />
            <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F0', // Warm off-white / light cream canvas from screenshot
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 36 : 12,
    paddingBottom: 14,
    backgroundColor: '#F4F6F0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F1E36',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarText: {
    fontWeight: '800',
    fontSize: 15,
    color: '#0F1E36',
  },
  greetingSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greetingName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F1E36',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#EBF7DA',
    borderWidth: 1,
    borderColor: '#D4EEB0',
  },
  roleSwitchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3B7A11',
  },
  iconCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E9E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120, // space for floating bottom bar
  },

  // HERO CARD
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E8EDE2',
    shadowColor: '#0F1E36',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 3,
    marginBottom: 18,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F9E8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4D880E',
    letterSpacing: 0.3,
  },
  batteryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  batteryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  heroTitle: {
    fontSize: 27,
    fontWeight: '900',
    color: '#0F1E36',
    lineHeight: 33,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroTitleGreen: {
    color: '#65A30D',
  },
  heroSubtext: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAF5',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#EDF2E8',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F1E36',
  },

  // QUICK SCAN CARD (Electric Green banner like reference)
  quickScanCard: {
    backgroundColor: '#65A30D',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: '#65A30D',
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

  // SECTION HEADER
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F1E36',
  },
  sectionViewAll: {
    fontSize: 12,
    fontWeight: '800',
    color: '#58960E',
  },

  // FEED CARD
  feedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EDE2',
    marginBottom: 12,
    shadowColor: '#0F1E36',
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
    color: '#0F1E36',
  },
  productSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  verdictChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verdictPass: {
    backgroundColor: '#ECFCCB',
  },
  verdictFail: {
    backgroundColor: '#FEE2E2',
  },
  verdictPending: {
    backgroundColor: '#FEF3C7',
  },
  verdictChipText: {
    fontSize: 11,
    fontWeight: '800',
  },
  feedDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  feedCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  idLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  caseBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
    marginBottom: 2,
  },
  ruleNotice: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B91C1C',
    flex: 1,
    paddingRight: 8,
  },

  // SCAN VIEW
  scanViewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E8EDE2',
  },
  scanViewHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scanViewTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F1E36',
  },
  scanViewSub: {
    fontSize: 12,
    color: '#64748B',
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
    backgroundColor: '#65A30D',
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

  // PROFILE
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E8EDE2',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F1E36',
    marginTop: 10,
  },
  profileRole: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  profileOptions: {
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 16,
    gap: 12,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileRowLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  profileRowValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F1E36',
  },
  pageHeading: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F1E36',
    marginBottom: 4,
  },
  pageSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
  },

  // FLOATING BOTTOM TABBAR (Reference Screenshot)
  tabbarWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tabbar: {
    width: '100%',
    height: 68,
    backgroundColor: '#FFFFFF',
    borderRadius: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E5E9E0',
    shadowColor: '#0F1E36',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 54,
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  tabLabelActive: {
    color: '#58960E',
  },
  centerScanBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#65A30D',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -26,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#65A30D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
});
