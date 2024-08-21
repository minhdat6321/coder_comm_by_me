import { Box, Button, Modal, Stack } from '@mui/material';
import { isBuffer } from 'lodash';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { deletePost } from '../features/post/postSlice';
import useAuth from '../hooks/useAuth';
import { deleteComment } from '../features/comment/commentSlice';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function PopupModalComment({ handleClose, open, name, commentId }) {
  const dispatch = useDispatch();
  const handleYes = () => {
    if (name === 'delete') {
      dispatch(deleteComment({ commentId }))
      console.log(`Yes ${name} Comment`)
      handleClose()
    }
    else {
      console.log(`Yes ${name} CommentId ${commentId}`)
      handleClose()
    }
  }
  const handleNo = () => {
    console.log(`No ${name} Comment`)
    handleClose()
  }


  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="parent-modal-title">Do you still want to {name}?</h2>
          <Stack
            id="parent-modal-description"
            direction="row"
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
          >
            <Button onClick={handleYes}> YES </Button>
            <Button onClick={handleNo}> NO</Button>
          </Stack>
        </Box>
      </Modal>
    </>

  )
}

export default PopupModalComment
