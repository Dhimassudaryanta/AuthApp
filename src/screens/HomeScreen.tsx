import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { COLOR, FAMILY } from "../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MONO = Platform.OS === "ios" ? "Courier" : "monospace";

function formatDate(iso: string | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function ProfileRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.profileKey}>{label}</Text>
      {children ?? <Text style={styles.profileValue}>{value}</Text>}
    </View>
  );
}

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const insets = useSafeAreaInsets();

  const initials =
    user?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?";

  return (
    <View
      style={{ paddingTop: insets.top, flex: 1, backgroundColor: COLOR.bg }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.authBadge}>
              <View style={styles.authDot} />
              <Text style={styles.authLabel}>AUTHENTICATED</Text>
            </View>
            <Text style={styles.greeting}>Hey, {user?.name}</Text>
            <Text style={styles.greetingSub}>Welcome to your dashboard</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* USER_PROFILE card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>USER_PROFILE</Text>
          <ProfileRow label="name" value={user?.name} />
          <View style={styles.rowDivider} />
          <ProfileRow label="email" value={user?.email} />
          <View style={styles.rowDivider} />
          <ProfileRow label="joined" value={formatDate(user?.createdAt)} />
          <View style={styles.rowDivider} />
          <ProfileRow label="status">
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>active</Text>
            </View>
          </ProfileRow>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={[styles.card, styles.statCard]}>
            <Text style={styles.statLabel}>Sessions</Text>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statSub}>active now</Text>
          </View>
          <View style={[styles.card, styles.statCard]}>
            <Text style={styles.statLabel}>Security</Text>
            <Text style={[styles.statValue, { color: COLOR.primary }]}>
              100%
            </Text>
            <Text style={styles.statSub}>all checks pass</Text>
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={logout}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={20} color={COLOR.danger} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLOR.bg },
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 4,
  },
  headerLeft: { flex: 1 },

  authBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  authDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLOR.primary,
  },
  authLabel: {
    fontSize: 11,
    fontFamily: FAMILY.semibold,
    color: COLOR.primary,
    letterSpacing: 1.8,
  },

  greeting: {
    fontSize: 28,
    fontFamily: FAMILY.bold,
    color: COLOR.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  greetingSub: {
    fontSize: 14,
    fontFamily: FAMILY.regular,
    color: COLOR.textSecondary,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: COLOR.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
    borderWidth: 2,
    borderColor: COLOR.primary,
  },
  avatarText: {
    fontSize: 20,
    fontFamily: FAMILY.bold,
    color: COLOR.textPrimary,
  },

  divider: { height: 1, backgroundColor: COLOR.border, marginHorizontal: 4 },

  card: {
    backgroundColor: COLOR.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 10,
    fontFamily: MONO,
    color: COLOR.textMuted,
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  profileKey: {
    fontSize: 13,
    color: COLOR.textMuted,
    fontFamily: MONO,
    letterSpacing: 0.3,
  },
  profileValue: {
    fontSize: 14,
    fontFamily: FAMILY.medium,
    color: COLOR.textPrimary,
    flexShrink: 1,
    textAlign: "right",
    marginLeft: 16,
  },

  rowDivider: { height: 1, backgroundColor: COLOR.border },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6FBF8",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLOR.primary,
  },
  statusText: {
    fontSize: 13,
    fontFamily: FAMILY.semibold,
    color: COLOR.primary,
  },

  statsRow: { flexDirection: "row", gap: 12 },
  statCard: { flex: 1, padding: 16 },
  statLabel: {
    fontSize: 12,
    fontFamily: FAMILY.medium,
    color: COLOR.textSecondary,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontFamily: FAMILY.bold,
    color: COLOR.textPrimary,
    marginBottom: 4,
  },
  statSub: { fontSize: 12, fontFamily: FAMILY.regular, color: COLOR.textMuted },

  signOutBtn: {
    backgroundColor: COLOR.card,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#FFE4E6",
    marginTop: 4,
  },
  signOutText: {
    fontSize: 15,
    fontFamily: FAMILY.semibold,
    color: COLOR.danger,
  },
});
