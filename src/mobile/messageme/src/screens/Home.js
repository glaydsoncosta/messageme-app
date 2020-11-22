import React, {Component} from 'react';
import {  Platform, StyleSheet, Text, Image, View, NativeModules, ScrollView, RefreshControl, FlatList, Modal, StatusBar, ActivityIndicator, BackHandler } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Utils from '../helpers/Utils';
import apiRequest from '../services/APIRequest';
import UIButton from '../components/UIButton';

const Consts = require('../helpers/Consts');
const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT;

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      isLoadingMessages: false,
      isSendingData: false,
      messagesList: [],
      selectedMessage: {
        id: 0,
        user_id: 0,
        timestamp: '',
        read_at: '',
        read: false,
        subject: '',
        detail: '',
        user: {
          id: 0,
          name: '',
          email: '',
          avatar: ''
        }
      },
      modalMessageDetailsVisible: false
    };
  }

  componentDidMount() {
    //this.fetchMessages();
    // Handling Android-only backpress (in this case we close application)
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    BackHandler.exitApp();
  }

  showDemoOnlyPurposeMessage = () => {
    Utils.showInformation('Only for demonstrations purpose. Thank you!');
  }

  showMessagesList = () => {
    if (this.state.isLoadingMessages) {
      return    <View>
                  <View style={styles.emptyStateContainer}>
                    <ActivityIndicator size='large' style={{color: Consts.colorPrimary, paddingBottom: 10}}/>
                    <Text style={styles.emptyStateTitleText}>Loading messages, please wait...</Text>
                  </View>
                </View>;
    } else if ( this.state.messagesList.length <= 0) {
      return  <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={false}
                    onRefresh={this.fetchMessages}/>}
                    contentContainerStyle={styles.scrollViewContentContainerStyle}>
                <View style={styles.emptyStateContainer}>
                  <Image style={styles.emptyStateIcon} source={require('../media/img/email_empty_state.png')}/>
                  <Text style={styles.emptyStateTitleText}>Your inbox looks like empty</Text>
                  <Text style={styles.emptyStateDetailsText}>This empty state was created intentionally. Please, pull down to refresh</Text>
                </View>
              </ScrollView>;
    } else {
      return  <View>
                {Utils.renderIf(this.getUnreadMessagesCount() > 0,
                  <View style={{paddingHorizontal: 10, paddingVertical: 10}}>
                    <Text style={{fontSize: 15, fontWeight: '500', color: '#656464'}}>{this.getUnreadMessagesText()}</Text>
                  </View>
                )}
                <FlatList
                    refreshControl={
                        <RefreshControl 
                          refreshing={this.state.isLoadingMessages}
                          onRefresh={this.fetchMessages}/>}            
                      keyboardShouldPersistTaps="always"
                      data={this.state.messagesList}
                      extraData={this.state}
                      keyExtractor={(item, index) => index.toString()}
                      initialScrollIndex={0}
                      renderItem={({ item }) => (
                        this.renderMessageItem(item)
                )}/>
              </View>;

    }
  }

  renderMessageItem = (message) => {
    return  <TouchableOpacity style={styles.messageItem} onPress={ () => this.selectMessage(message)}>
              <View style={styles.messageUserAvatar}>
                {this.getSenderAvatar(message.user.name, message.user.avatar)}                
              </View>
              <View style={{width: '80%'}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{ fontSize: 16, fontWeight: (message.read ? 'normal' : 'bold')}}>{message.user.name}</Text>
                  <Text style={{ fontSize: 14, fontWeight: message.read ? '500' : 'bold', color: message.read ? '#656464' : undefined}}>{Utils.unformatAPIDateTime(message.timestamp, false)}</Text>
                </View>
                <Text style={styles.userEmailText}>{message.user.email}</Text>
                <Text style={[styles.messageDetails, { color: message.read ? '#656464' : undefined, fontWeight: !message.read ? 'bold' : 'normal' }]} numberOfLines={1} ellipsizeMode="tail">{message.subject}</Text>
              </View>
            </TouchableOpacity>;
  }

  selectMessage = (message) => {
    this.setState({ selectedMessage: message, modalMessageDetailsVisible: true});
  }

  getSenderAvatar = (userName, profileImage) => {
    if (profileImage !== undefined) {
      if (profileImage === null){
        return this.getUserNameInitials(userName);
      } else {
        if (profileImage.length > 0){
          return <Image style={styles.userAvatarStyle} source={{ uri: profileImage }}/>;
        } else {
          return this.getUserNameInitials(userName);
        }
      }  
    } else {
      return undefined;
    }
  }

  getUserNameInitials = (userName) => {
    var initials = userName.match(/\b\w/g) || [];
    var initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    //var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    return  <View style={{width: 64, height: 64, borderRadius: 100, backgroundColor: Consts.colorPrimary, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.userInitialsText}>{initials}</Text>
            </View>;
  }

  getUnreadMessagesCount = () => {
    var arrMessages = this.state.messagesList;
    var unreadMessagesCount = 0;
    if (arrMessages !== undefined) {
      arrMessages.forEach(element => {
        if (!element.read) {
          unreadMessagesCount++;
        }
      });
    }
    return unreadMessagesCount;
  }

  getUnreadMessagesText = () => {
    var unreadMessagesCount = this.getUnreadMessagesCount();
    if (unreadMessagesCount > 0) {
      return 'You have ' + unreadMessagesCount.toString() + ' unread message(s)';
    } else {
      return 'Great, everything is clean overhere';
    }
  }  

  fetchMessages = () => {
    var requestHeaders = {};
    requestHeaders['Content-Type'] = 'application/json';
    var url = Consts.api.endpoint.messages.get.messages;
    this.setState({ isLoadingMessages: true}, () => {
      apiRequest({
        url: url,
        method: Consts.httpGet,
        headers: requestHeaders
      }).then((response) => {
        if (response.success) {
          this.setState({ isSendingData: false, messagesList: response.data, isLoadingMessages: false });
        } else {
          this.setState({ isSendingData: false, isLoadingMessages: false }, () => {
            Utils.showError('Error while fetching your messages. Error: ' + response.error);
          });
        }
      }).catch((error) => {
        this.setState({ isSendingData: false, isLoadingMessages: false }, () => {
          Utils.showError('Error while fetching your messages. Error: ' + error);
        });      
      });
    });
  }

  markMessageAsRead = (messageId) => {
    var requestHeaders = {};
    requestHeaders['Content-Type'] = 'application/json';
    var url = Consts.api.endpoint.messages.post.markAsRead.replace('{message_id}', messageId);
    this.setState({ isSendingData: true }, () => {
      apiRequest({
        url: url,
        method: Consts.httpPost,
        headers: requestHeaders
      }).then((response) => {
        if (response.success) {
          this.setState({ modalMessageDetailsVisible: false }, () => this.fetchMessages());
        } else {
          this.setState({ modalMessageDetailsVisible: false, isSendingData: false }, () => {
            Utils.showError('Error while updating message. Error: ' + response.error);
          });
        }
      }).catch((error) => {
        this.setState({ modalMessageDetailsVisible: false, isSendingData: false }, () => {
          Utils.showError('Error while updating message. Error: ' + error);
        });      
      });
    });     
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal 
          visible={this.state.modalMessageDetailsVisible}
          animationType='slide'
          onRequestClose={() => this.setState({ modalMessageDetailsVisible: false })}>
            <StatusBar barStyle="dark-content" translucent={true} backgroundColor="transparent" />
            <SafeAreaView style={{flex: 1, paddingHorizontal: 15, paddingVertical: 10}}>
              {Utils.renderIf(Platform.OS === 'ios',
                <View style={{paddingBottom: 10}}>
                  <TouchableOpacity onPress={ () => this.setState({ modalMessageDetailsVisible: false})}>
                    <Text style={{fontSize: 16, color: Consts.colorPrimary}}>Close</Text>
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.messageItemModal}>
                <View style={styles.messageUserAvatar}>
                  {this.getSenderAvatar(this.state.selectedMessage.user.name, this.state.selectedMessage.user.avatar)}                
                </View>
                <View style={{width: '80%'}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{ fontSize: 16, fontWeight: (this.state.selectedMessage.read ? 'normal' : 'bold')}}>{this.state.selectedMessage.user.name}</Text>
                    <Text style={{ fontSize: 14, fontWeight: this.state.selectedMessage.read ? '500' : 'bold', color: this.state.selectedMessage.read ? '#656464' : undefined}}>{Utils.unformatAPIDateTime(this.state.selectedMessage.timestamp, true)}</Text>
                  </View>
                  <Text style={styles.userEmailText}>{this.state.selectedMessage.user.email}</Text>
                </View>
              </View>
              <View style={{height: Utils.heightPercentToDP('80%'), alignSelf: 'stretch'}}>
                <ScrollView>
                  <Text style={styles.messageTitleModal}>{this.state.selectedMessage.subject}</Text>
                  <Text style={styles.messageDetailsModal}>{this.state.selectedMessage.detail}</Text>
                  <View style={{marginTop: 20}}>
                    <UIButton 
                    backgroundColor={Consts.colorPrimary}
                    borderColor="transparent"
                    borderWidth={1.5}
                    textColor={Consts.colorWhite}
                    height={50}
                    text="Mark as read"
                    marginTop={20}
                    fontSize={18}
                    enabled={!this.state.selectedMessage.read}
                    isLoading={this.state.isSendingData}
                    onPress={ () => { this.markMessageAsRead(this.state.selectedMessage.id)}}/>
                  </View>
                </ScrollView>
              </View>
            </SafeAreaView>
        </Modal>
        <View style={styles.mainHeader}>
          <View style={styles.headerUserInfo}>
            <View style={styles.userAvatarSection}>
              <Image style={styles.userAvatarStyle} source={require('../media/img/user_avatar.png')}/>
            </View>
            <View style={styles.userInfoSection}>
              <Text style={styles.userHelloText}>Hello, <Text style={styles.userNameText}>Susan</Text></Text>
              <Text style={styles.welcomeMessageText}>Welcome back to your Inbox</Text>
            </View>
            <View style={styles.userSettingsSection}>
              <TouchableOpacity onPress={ () => this.showDemoOnlyPurposeMessage() }>
                <Image style={styles.userSettingsStyle} source={require('../media/img/icons/settings.png')}/>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.actionButtonsSection}>
            <TouchableOpacity style={styles.actionButtonEnabled}>
              <Image style={styles.actionButton} source={require('../media/img/icons/email.png')}/>
              <Text style={styles.actionButtonEnabledText}>Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonDisabled} onPress={ () => this.showDemoOnlyPurposeMessage() }>
              <Image style={styles.actionButton} source={require('../media/img/icons/calendar.png')}/>
              <Text style={styles.actionButtonDisabledText}>Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonDisabled} onPress={ () => this.showDemoOnlyPurposeMessage() } >
              <Image style={styles.actionButton} source={require('../media/img/icons/todo.png')}/>
              <Text style={styles.actionButtonDisabledText}>Todo</Text>  
            </TouchableOpacity>                        
          </View>
        </View>
        <View style={[styles.mainContent, { height: this.getUnreadMessagesCount() > 0 ? Utils.heightPercentToDP('70%') : Utils.heightPercentToDP('73%') }]}>
          {this.showMessagesList()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  mainHeader: {
    backgroundColor: Consts.colorPrimary,
    height: Platform.OS === 'android' ? Utils.heightPercentToDP('28%') : Utils.heightPercentToDP('18%'),
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT + 20 : undefined,
    paddingBottom: 10
  },
  mainContent: {
    backgroundColor: Consts.colorWhite,
    height: Utils.heightPercentToDP('73%'),
    alignSelf: 'stretch',
    paddingHorizontal: 5,
    paddingVertical: 0 
  },
  headerUserInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  userAvatarStyle: {
    borderRadius: 100,
    resizeMode: 'cover',
    width: 64,
    height: 64
  },
  senderUserAvatar: {
    borderRadius: 100,
    resizeMode: 'cover',
    width: 58,
    height: 58
  },  
  userSettingsStyle: {
    width: 24,
    height: 24
  },
  actionButton: { 
    width: 22,
    height: 22,
    marginBottom: 5
  },
  userAvatarSection: {
    width: '20%'
  },
  userInfoSection: {
    width: '70%', 
    marginLeft: 10,
    justifyContent: 'center'
  },
  userSettingsSection: {
    width: '10%',
    alignItems: 'center', 
    justifyContent: 'center'
  },
  userHelloText: {
    color: Consts.colorWhite, fontSize: 20
  },
  userNameText: {
    fontWeight: 'bold'    
  },
  welcomeMessageText: {
    color: Consts.colorWhite,
    fontSize: 15
  },
  actionButtonsSection: {
    paddingBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'    
  },
  actionButtonEnabled: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionButtonDisabled: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5
  },
  actionButtonEnabledText: {
    color: Consts.colorWhite, fontSize: 13, fontWeight: 'bold'
  },
  actionButtonDisabledText: {
    color: Consts.colorWhite,
    fontSize: 13
  },
  emptyStateContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  emptyStateIcon: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    opacity: 0.3    
  },
  emptyStateTitleText: {
    fontWeight: '700', 
    fontSize: 18,
    color: '#B4B4B4',
    textAlign: 'center'
  },
  emptyStateDetailsText: {
    fontWeight: '300',
    fontSize: 16,
    color: '#B4B4B4',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 10
  },
  scrollViewContentContainerStyle: {
    flexGrow: 1
  },
  messageTitle: {
    fontWeight: 'bold',
    fontSize: 16
  },
  userEmailText: { 
    fontSize: 15,
    fontWeight: '300',
    color: '#656464'
  },
  emailDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#656464'
  },
  messageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 15,
    paddingTop: 5,
    paddingHorizontal: 10
  },
  messageItemModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 15,
    paddingTop: 5,
    paddingHorizontal: 0
  },  
  messageUserAvatar: {
    width: '20%'    
  },
  userInitialsText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Consts.colorWhite    
  },
  messageDetails: {
    marginTop: 5,
    width: '98%',
    alignSelf: 'stretch'   
  },
  messageTitleModal: {
    marginTop: 5,
    width: '98%',
    alignSelf: 'stretch',
    fontSize: 15,
    fontWeight: 'bold',
    paddingBottom: 10
  },  
  messageDetailsModal: {
    marginTop: 5,
    width: '98%',
    alignSelf: 'stretch',
    fontSize: 15,
    textAlign: 'justify'   
  }  
});