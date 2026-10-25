import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Text } from "@/components/Text";
import { colors } from "@/lib/theme";

export type AvatarPerson = {
  name: string;
  avatarUrl: string | null;
  tint: string;
};

// Profile photo, falling back to a tinted initial when there is no photo or it fails to load (offline demo).
export function Avatar({
  person,
  size = 44,
  border = 0,
  borderColor = colors.card,
  style,
}: {
  person: AvatarPerson;
  size?: number;
  border?: number;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const [failed, setFailed] = useState(false);
  const showPhoto = !!person.avatarUrl && !failed;
  return (
    <View
      accessibilityLabel={person.name}
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: person.tint,
          borderWidth: border,
          borderColor,
        },
        style,
      ]}
    >
      {showPhoto ? (
        <Image
          source={{ uri: person.avatarUrl! }}
          style={styles.fill}
          contentFit="cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <Text
          style={{
            fontSize: Math.round(size * 0.38),
            fontWeight: "800",
            color: colors.ink,
          }}
        >
          {person.name.charAt(0).toUpperCase()}
        </Text>
      )}
    </View>
  );
}

// Overlapping row of avatars, e.g. group members.
export function AvatarStack({
  people,
  size = 40,
  border = 2,
  borderColor = colors.card,
  max = 5,
}: {
  people: AvatarPerson[];
  size?: number;
  border?: number;
  borderColor?: string;
  max?: number;
}) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <View style={styles.stack}>
      {shown.map((person, i) => (
        <Avatar
          key={`${person.name}-${i}`}
          person={person}
          size={size}
          border={border}
          borderColor={borderColor}
          style={i > 0 ? { marginLeft: -size * 0.25 } : undefined}
        />
      ))}
      {extra > 0 && (
        <View
          style={[
            styles.base,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: -size * 0.25,
              borderWidth: border,
              borderColor,
              backgroundColor: colors.accentSoft,
            },
          ]}
        >
          <Text
            style={{
              fontSize: Math.round(size * 0.34),
              fontWeight: "800",
              color: colors.ink,
            }}
          >
            +{extra}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center", overflow: "hidden" },
  fill: { width: "100%", height: "100%" },
  stack: { flexDirection: "row", alignItems: "center" },
});
