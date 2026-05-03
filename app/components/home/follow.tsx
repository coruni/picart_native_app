import { Text, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native';

export default function FollowScreen() {
  return (
    <FlatList
      data={[1, 2, 3, 4, 5]}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>关注内容 {item}</Text>
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
