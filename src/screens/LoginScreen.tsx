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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { AuthStackParamList } from "../navigation/AppNavigator";
import { COLOR, FAMILY } from "../theme";

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Login">;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required.";
    else if (!EMAIL_REGEX.test(email)) e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    return e;
  };

  const handleLogin = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await login(email.trim(), password);
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
          <View style={styles.logoRow}>
            <Ionicons name="shield-outline" size={28} color={COLOR.primary} />
            <Text style={styles.logoText}>
              auth<Text style={styles.logoDot}>.</Text>app
            </Text>
          </View>

          {/* Heading */}
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue to your account
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
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Sign In */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={COLOR.textPrimary} />
            ) : (
              <Text style={styles.primaryBtnText}>Sign In</Text>
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
            onPress={() => navigation.navigate("Signup")}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryBtnText}>Create an account</Text>
          </TouchableOpacity>

          {/* Bottom link */}
          <TouchableOpacity
            style={styles.bottomLink}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.bottomLinkText}>
              No account?{"  "}
              <Text style={styles.bottomLinkAccent}>Sign up →</Text>
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
