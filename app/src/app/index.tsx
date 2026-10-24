import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { CardView } from "@/components/CardView";
import { api, type Card } from "@/lib/api";
import { colors } from "@/lib/theme";

// Phase 1 home: every idea card, newest first. Phase 2 replaces this with the real home (events + groups).
export default function Index() {
  const [cards, setCards] = useState<Card[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      setCards(await api.listCards());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <View style={styles.screen}>
      {error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={load} style={styles.retry}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : cards === null ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(c) => String(c.id)}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
          ListHeaderComponent={<Text style={styles.heading}>Ideas ({cards.length})</Text>}
          renderItem={({ item }) => (
            <CardView card={item} onPress={() => router.push({ pathname: "/card/[id]", params: { id: String(item.id) } })} />
          )}
        />
      )}
      <Pressable style={styles.fab} onPress={() => router.push("/add")}>
        <Text style={styles.fabText}>+ Add idea</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 16, paddingBottom: 110 },
  heading: { fontSize: 22, fontWeight: "800", color: colors.ink, marginBottom: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 14 },
  error: { color: colors.ink, textAlign: "center", lineHeight: 20 },
  retry: { backgroundColor: colors.accent, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 10 },
  retryText: { color: "#fff", fontWeight: "700" },
  fab: {
    position: "absolute",
    bottom: 32,
    alignSelf: "center",
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: 26,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  fabText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
