import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { loginApi, registerApi } from '../data/api';

export function AuthScreen({ onAuthSuccess, onCancel }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('user'); // 'user' | 'officer'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('DHULE');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    if (mode === 'register' && !name) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    try {
      setLoading(true);
      if (mode === 'login') {
        const res = await loginApi(email, password);
        const user = res.user || { name: email.split('@')[0], email, role };
        onAuthSuccess({
          user,
          token: res.accessToken,
          role: user.role === 'officer' ? 'officer' : 'user',
        });
      } else {
        const res = await registerApi({
          name,
          email,
          password,
          role: role === 'officer' ? 'officer' : 'citizen',
          district,
        });
        const user = res.user || { name, email, role };
        onAuthSuccess({
          user,
          token: res.accessToken,
          role: user.role === 'officer' ? 'officer' : 'user',
        });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Title */}
        <View style={styles.brandSection}>
          <Text style={styles.brandTitle}>
            Trust<Text style={{ color: theme.colors.lime }}>Label</Text>
          </Text>
          <Text style={styles.brandSub}>
            {mode === 'login' ? 'Sign in to access your audit portal' : 'Create an account to start auditing'}
          </Text>
        </View>

        {/* Mode Selector Tabs (Login / Register) */}
        <View style={styles.tabSwitchContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, mode === 'login' && styles.tabBtnActive]}
            onPress={() => {
              setMode('login');
              setErrorMessage('');
            }}
          >
            <Text style={[styles.tabBtnText, mode === 'login' && styles.tabBtnTextActive]}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, mode === 'register' && styles.tabBtnActive]}
            onPress={() => {
              setMode('register');
              setErrorMessage('');
            }}
          >
            <Text style={[styles.tabBtnText, mode === 'register' && styles.tabBtnTextActive]}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card Form */}
        <View style={styles.card}>
          {/* Persona Selection */}
          <Text style={styles.fieldLabel}>ACCOUNT TYPE</Text>
          <View style={styles.rolePicker}>
            <TouchableOpacity
              style={[styles.roleOption, role === 'user' && styles.roleOptionActive]}
              onPress={() => setRole('user')}
            >
              <MaterialCommunityIcons
                name="account"
                size={16}
                color={role === 'user' ? theme.colors.limeDark : theme.colors.muted}
              />
              <Text
                style={[
                  styles.roleOptionText,
                  role === 'user' && styles.roleOptionTextActive,
                ]}
              >
                Citizen
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleOption, role === 'officer' && styles.roleOptionActive]}
              onPress={() => setRole('officer')}
            >
              <MaterialCommunityIcons
                name="shield-account"
                size={16}
                color={role === 'officer' ? theme.colors.limeDark : theme.colors.muted}
              />
              <Text
                style={[
                  styles.roleOptionText,
                  role === 'officer' && styles.roleOptionTextActive,
                ]}
              >
                Officer
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color={theme.colors.red} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Name Field (Register only) */}
          {mode === 'register' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>FULL NAME</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={18} color={theme.colors.muted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Tejas Patil"
                  placeholderTextColor="#94A3B8"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          {/* Email Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={theme.colors.muted} />
              <TextInput
                style={styles.textInput}
                placeholder="you@safefood.gov.in"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* District Field (Register only) */}
          {mode === 'register' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>DISTRICT JURISDICTION</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="location-outline" size={18} color={theme.colors.muted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="DHULE, NASHIK, PUNE..."
                  placeholderTextColor="#94A3B8"
                  value={district}
                  onChangeText={setDistrict}
                  autoCapitalize="characters"
                />
              </View>
            </View>
          )}

          {/* Password Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={theme.colors.muted} />
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={theme.colors.muted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>
                  {mode === 'login' ? 'Sign In to Account' : 'Create Free Account'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Skip / Continue As Guest */}
        {onCancel && (
          <TouchableOpacity style={styles.guestBtn} onPress={onCancel}>
            <Text style={styles.guestBtnText}>Continue in Offline Demo Mode →</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const STATUSBAR_GAP =
  Platform.OS === 'android'
    ? (StatusBar.currentHeight || 28) + 70
    : Platform.OS === 'ios'
    ? 80
    : 64;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: STATUSBAR_GAP,
    paddingBottom: 40,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: theme.colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: theme.colors.lime,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: theme.colors.navy,
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 4,
    textAlign: 'center',
  },
  tabSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.muted,
  },
  tabBtnTextActive: {
    color: theme.colors.navy,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.muted,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  rolePicker: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: '#FAFCF7',
  },
  roleOptionActive: {
    borderColor: theme.colors.lime,
    backgroundColor: theme.colors.limePill,
  },
  roleOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.muted,
  },
  roleOptionTextActive: {
    color: theme.colors.limeDark,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.redLight,
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.red,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.muted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: '#FAFCF7',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.navy,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.lime,
    height: 50,
    borderRadius: 16,
    marginTop: 8,
    shadowColor: theme.colors.lime,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  demoBox: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  demoTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.muted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  demoText: {
    fontSize: 11,
    color: theme.colors.limeDark,
    backgroundColor: theme.colors.limeLight,
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  guestBtn: {
    marginTop: 20,
    alignItems: 'center',
    padding: 12,
  },
  guestBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.muted,
  },
});
