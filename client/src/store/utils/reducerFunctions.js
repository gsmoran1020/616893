export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    newConvo.unreadMessageCount += 1;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const newMessages = [...convo.messages, message];
      const newConvo = {
        ...convo,
        messages: newMessages,
        latestMessageText: message.text,
        unreadMessageCount: convo.unreadMessageCount + 1
      }
      return newConvo;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { 
        ...convo,
        id: message.conversationId,
        messages: [...convo.messages, message],
        latestMessageText: message.text,
      }
      return newConvo;
    } else {
      return convo;
    }
  });
};

export const updateReadMessages = (state, payload) => {
  const { conversationId, messages } = payload;
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const newConvo = {
        ...convo,
        messages: [...messages],
        unreadMessageCount: messages.filter(msg => msg.messageRead === false && msg.senderId === convo.otherUser.id).length,
      }
      return newConvo;
    } else {
      return convo;
    }
  });
};