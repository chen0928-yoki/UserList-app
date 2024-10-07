import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Platform,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';

const API_URL = 'https://random-data-api.com/api/v2/users';

const App = () => {
  interface User {
    uuid: string;
    first_name: string;
    last_name: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async (count = 10) => {
    try {
      const response = await fetch(`${API_URL}?size=${count}`);
      const data = await response.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const loadInitialUsers = useCallback(async () => {
    const newUsers = await fetchUsers();
    setUsers(newUsers);
  }, []);

  React.useEffect(() => {
    loadInitialUsers();
  }, [loadInitialUsers]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInitialUsers();
    setRefreshing(false);
  }, [loadInitialUsers]);

  const addNewUser = async () => {
    const newUser = await fetchUsers(1);
    if (newUser.length > 0) {
      setUsers(prevUsers => [newUser[0], ...prevUsers]);
    }
  };

  const renderItem = ({ item }: { item: User }) => {
    const isIOS = Platform.OS === 'ios';
    const initials = `${item.first_name.charAt(0)}${item.last_name.charAt(0)}`;

    return (
      <View style={[styles.item, isIOS ? styles.iosItem : styles.androidItem]}>
        {!isIOS && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.firstName}>{item.first_name}</Text>
          <Text style={styles.lastName}>{item.last_name}</Text>
        </View>
        {isIOS && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Welcome to the User List</Text>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.uuid}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity style={styles.fab} onPress={addNewUser}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iosItem: {
    justifyContent: 'space-between',
  },
  androidItem: {
    justifyContent: 'flex-start',
  },
  textContainer: {
    marginHorizontal: 16,
  },
  firstName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastName: {
    fontSize: 14,
    color: '#666',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    fontSize: 24,
    color: 'white',
  },
});

export default App;
