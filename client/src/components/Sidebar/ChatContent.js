import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  unreadPreview: {
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
    letterSpacing: -0.17,
  }
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation, unreadMessageCount } = props;
  const { latestMessageText, otherUser } = conversation;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={unreadMessageCount === 0 || unreadMessageCount === undefined ? classes.previewText : classes.unreadPreview}>
          {latestMessageText}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatContent;
