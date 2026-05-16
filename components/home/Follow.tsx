import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function FollowScreen() {
  const { t } = useTranslation();
  return (
    <FlatList
      data={[1, 2, 3, 4, 5]}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>
            {t("follow")} {item}
          </Text>
        </View>
      )}
      keyExtractor={(item) => item.toString()}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 16,
  },
});
