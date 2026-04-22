import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { AuthStackParamList } from "../navigation/AppNavigator";
import { COLOR, FAMILY } from "../theme";

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Signup">;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LEVELS = [
  { label: "Weak",   color: "#FF5C6A" },
  { label: "Fair",   color: "#FF9500" },
  { label: "Strong", color: "#2DD4BF" },
] as const;

function getStrength(pw: string): number {
  if (!pw) return 0;
  let types = 0;
  if (/[a-z]/.test(pw)) types++;
  if (/[A-Z]/.test(pw)) types++;
  if (/[0-9]/.test(pw)) types++;
  if (/[^A-Za-z0-9]/.test(pw)) types++;
  if (pw.length >= 8 && types >= 3) return 3; // upper + lower + number/symbol
  if (pw.length >= 6 && types >= 2) return 2; // any two types
  return 1;                                    // single type or too short
}

function StrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const score = getStrength(password);
  const level = LEVELS[Math.max(0, score - 1)];
  return (
    <View style={sm.wrap}>
      <View style={sm.bars}>
        {LEVELS.map((l, i) => (
          <View
            key={l.label}
            style={[
              sm.bar,
              { backgroundColor: i < score ? level.color : COLOR.border },
            ]}
          />
        ))}
      </View>
      <Text style={[sm.label, { color: level.color }]}>{level.label}</Text>
    </View>
  );
}

const sm = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  bars: { flex: 1, flexDirection: "row", gap: 4 },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  label: {
    fontSize: 12,
    fontFamily: FAMILY.semibold,
    minWidth: 40,
    textAlign: "right",
  },
});

export default function SignupScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!EMAIL_REGEX.test(email)) e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters.";
    return e;
  };

  const handleSignup = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password);
    } catch (err: any) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{ paddingTop: insets.top, flex: 1, backgroundColor: COLOR.bg }}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={[styles.logoRow]}>
            <Ionicons name="shield-outline" size={28} color={COLOR.primary} />
            <Text style={styles.logoText}>
              auth<Text style={styles.logoDot}>.</Text>app
            </Text>
          </View>

          {/* Heading */}
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Join in seconds — embark your journey
          </Text>

          {/* General error */}
          {errors.general && (
            <View style={styles.generalError}>
              <Ionicons
                name="alert-circle-outline"
                size={15}
                color={COLOR.danger}
              />
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          )}

          {/* Inputs */}
          <View style={styles.form}>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Full Name"
              placeholderTextColor={COLOR.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              placeholderTextColor={COLOR.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <View
              style={[
                styles.passwordWrap,
                errors.password && styles.inputError,
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor={COLOR.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLOR.textMuted}
                />
              </TouchableOpacity>
            </View>
            <StrengthMeter password={password} />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Create Account */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={COLOR.textPrimary} />
            ) : (
              <Text style={styles.primaryBtnText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* OR divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Secondary */}
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryBtnText}>
              Already have an account? Sign in
            </Text>
          </TouchableOpacity>

          {/* Bottom link */}
          <TouchableOpacity
            style={styles.bottomLink}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.bottomLinkText}>
              Have an account?{"  "}
              <Text style={styles.bottomLinkAccent}>Log in →</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLOR.bg },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 20,
    fontFamily: FAMILY.bold,
    color: COLOR.textPrimary,
    letterSpacing: -0.3,
  },
  logoDot: { color: COLOR.primary },

  title: {
    fontSize: 34,
    fontFamily: FAMILY.bold,
    color: COLOR.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: FAMILY.regular,
    color: COLOR.textSecondary,
    marginBottom: 32,
  },

  generalError: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF0F1",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  generalErrorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FAMILY.regular,
    color: COLOR.danger,
  },

  form: { gap: 12 },

  input: {
    backgroundColor: COLOR.inputBg,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 15,
    fontFamily: FAMILY.regular,
    color: COLOR.textPrimary,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputError: { borderColor: COLOR.danger },

  passwordWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOR.inputBg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 15,
    fontFamily: FAMILY.regular,
    color: COLOR.textPrimary,
  },
  eyeBtn: { paddingHorizontal: 16 },

  errorText: {
    fontSize: 12,
    fontFamily: FAMILY.regular,
    color: COLOR.danger,
    marginTop: -4,
    marginLeft: 4,
  },

  primaryBtn: {
    backgroundColor: COLOR.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: FAMILY.bold,
    color: COLOR.textPrimary,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLOR.border },
  dividerText: {
    fontSize: 11,
    fontFamily: FAMILY.semibold,
    color: COLOR.textMuted,
    letterSpacing: 1.5,
  },

  secondaryBtn: {
    backgroundColor: COLOR.secondaryBtn,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryBtnText: {
    fontSize: 15,
    fontFamily: FAMILY.semibold,
    color: COLOR.secondaryBtnText,
  },

  bottomLink: { alignItems: "center", marginTop: 28 },
  bottomLinkText: {
    fontSize: 13,
    fontFamily: FAMILY.regular,
    color: COLOR.textMuted,
  },
  bottomLinkAccent: { fontFamily: FAMILY.semibold, color: COLOR.primary },
});
