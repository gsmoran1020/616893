import React, { useEffect } from "react";
import { Box, Typography } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { updateUnreadMessages } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    }
  },
  notification: {
    backgroundColor: "#3E92FE",
    borderRadius: "50%",
    textAlign: "center",
    width: "25px",
    height: "25px",
  },
  unreadCounter: {
    color: "white"
  }
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation, activeConversation, updateUnreadMessages} = props;
  const { otherUser, messages } = conversation;
  const unreadMessages = messages.filter(msg => msg.messageRead === false && msg.senderId === otherUser.id);
  const unreadMessageCount = unreadMessages.length;


  const handleClick = async (conversation) => {
    await props.setActiveChat(conversation.otherUser.username);
  };

  useEffect(() => {
    if ((activeConversation && activeConversation === otherUser.username) && (unreadMessageCount !== 0 || unreadMessageCount !== undefined)) {
      updateUnreadMessages(messages, otherUser, conversation.id); // updates database and UI
    }
  }, [activeConversation, messages, otherUser, unreadMessageCount, updateUnreadMessages, conversation.id, unreadMessages]);

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} unreadMessageCount={unreadMessageCount}/>
      {unreadMessageCount === 0 || unreadMessageCount === undefined ? (
        ""
      ) : (
        <div className={classes.notification}>
          <Typography className={classes.unreadCounter}>
            {unreadMessageCount}
          </Typography>
        </div>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return  {
    activeConversation: state.activeConversation,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    updateUnreadMessages: (messages, otherUser, conversationId) => {
      dispatch(updateUnreadMessages(messages, otherUser, conversationId));
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
