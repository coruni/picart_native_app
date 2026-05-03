import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <FlatList
      data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>首页内容 {item}</Text>
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
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 16,
  },
});
