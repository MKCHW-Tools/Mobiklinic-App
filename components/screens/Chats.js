import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {Feather} from '@expo/vector-icons';
import {COLORS, DIMENS} from '../constants/styles';
import {AuthContext} from '../contexts/auth';
import {CustomStatusBar} from '../ui/custom.status.bar';

export default function Chats({route, navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const {user, setUser} = useContext(AuthContext);

  const _header = () => (
    <CustomHeader
      left={
        <TouchableOpacity
          style={{paddingLeft: 10}}
          onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={25} color={COLORS.SECONDARY} />
        </TouchableOpacity>
      }
      title={<Text style={[STYLES.centerHeader, STYLES.title]}>Messages</Text>}
    />
  );
  const _keyExtractor = item => item._id;

  useEffect(() => {
    const fetchChats = async user => {
      try {
        const response = await axios.get(`${URLS.BASE}/chats`, {
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Accept: 'application/json',
            Authorization: `Bearer ${user.tokens.access}`,
          },
        });

        const data = response.data;
        if (data) {
          // chat with no message should be hidden
          const serverChats = data.filter(chat => chat.latestMessage);

          /*
          let itemsOnDevice = await AsyncStorage.getItem(`@${items[i]}`);
          itemsOnDevice = JSON.parse(itemsOnDevice) || [];
          const all = uniqWith([..._items, ...itemsOnDevice], isEqual);
          AsyncStorage.setItem(`@${items[i]}`, JSON.stringify(all));
          */

          setChats(serverChats);
          setLoading(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          const newUser = await tokensRefresh(user);

          if (newUser === null) {
            Alert.alert(
              'Login expired!',
              'Please sign out once and sign in again',
              [
                {
                  text: 'Cancel',
                  onPress: () => navigation.goBack(),
                },
              ],
            );
            return;
          }
          setUser(newUser);
          await fetchChats(newUser);
        }
      }
    };

    fetchChats(user);
  }, []);

  const _renderItem = ({item}) => (
    <TouchableOpacity onPress={() => navigation.navigate('Chat', item)}>
      <ListItem bottomDivider>
        <Icon name="circle" color={COLORS.GREY} SIZE={25} />
        <ListItem.Content>
          <ListItem.Title style={STYLES.listTitle}>
            {item.latestMessage.content}
          </ListItem.Title>
          <ListItem.Subtitle style={STYLES.subtitle}>
            <View style={STYLES.wrapper}>
              <View style={STYLES.subtitle}>
                <Text>at </Text>
                <Text style={STYLES.label}>{item.latestMessage.createdAt}</Text>
              </View>
              <View style={STYLES.subtitle}>
                <Text>with </Text>
                <Text style={STYLES.label}>
                  {item.users
                    .filter(u => u._id !== user.id)
                    .map(u => u.name)
                    .join(', ')}
                </Text>
              </View>
            </View>
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron size={30} />
      </ListItem>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <Loader />;
  }

  if (chats?.length == 0) {
    return (
      <View style={STYLES.wrapper}>
        <CustomStatusBar />
        {_header()}
        <View style={STYLES.body}>
          <Icon name="smile" size={60} color={COLORS.GREY} />
          <Text style={STYLES.alert}>
            Choose a doctor to send your first message.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={STYLES.wrapper}>
      <CustomStatusBar />
      {_header()}
      <FlatList
        data={chats}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
      />
    </View>
  );
}

const STYLES = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
  },
  darkWrapper: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },
  header: {
    flex: 1,
    borderColor: COLORS.ACCENT_1,
  },
  body: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  messageHeader: {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.ACCENT_1,
  },
  messageHeaderInner: {
    paddingLeft: 20,
  },
  messageReceiver: {
    fontWeight: 'bold',
  },
  lastSeen: {
    fontSize: 9,
  },
  messageTime: {
    textAlign: 'right',
    color: '#064374',
  },
  message: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 0.5,
    elevation: 1,
    marginBottom: 8,
    borderRadius: 8,
    padding: 10,
    paddingBottom: 5,
  },
  threadBody: {
    flex: 2,
    padding: 20,
  },
  contentContainerStyle: {
    paddingBottom: 40,
  },
  messageInput: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 50,
    flexDirection: 'row',
    flex: 3,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10,
  },
  messageInputEmoji: {
    flex: 1,
  },
  messageInputControl: {
    flex: 2,
    padding: 0,
    paddingLeft: 5,
    paddingRight: 5,
  },
  messageInputBtn: {
    backgroundColor: COLORS.PRIMARY,
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.SECONDARY,
    textAlign: 'center',
  },
  alert: {
    color: COLORS.GREY,
    textAlign: 'center',
    marginTop: 15,
  },
  listTitle: {
    color: COLORS.BLACK,
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    flexDirection: 'row',
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  leftHeader: {
    flex: 1,
    paddingLeft: 10,
  },
  centerHeader: {
    flex: 2,
    flexDirection: 'row',
  },
  yesText: {
    color: COLORS.PRIMARY,
  },
  rightHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  icon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: COLORS.ERRORS,
    marginTop: 20,
    padding: 10,
  },
  buttonTextWhite: {
    color: COLORS.WHITE,
    fontSize: 20,
  },
  error: {
    color: COLORS.ERRORS,
    fontSize: 30,
  },
});
