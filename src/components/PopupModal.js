import { Box, Button, Modal, Stack } from '@mui/material';
import { isBuffer } from 'lodash';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { deletePost } from '../features/post/postSlice';
import useAuth from '../hooks/useAuth';
import PostFormForEdit from '../features/post/PostFormForEdit';



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



function PopupModal({ handleClose, open, name, postId, totalPosts }) {
  const dispatch = useDispatch();
  const handleYes = () => {
    if (name === 'delete') {
      dispatch(deletePost({ postId, totalPosts }))
      console.log(`Yes ${name} PostId: ${postId}`)
      handleClose()
    }
  }
  const handleNo = () => {
    console.log(`No ${name} `)
    handleClose()
  }

  //Child Modal
  function ChildModal() {
    const [openFormEdit, setOpenFormEdit] = React.useState(false);
    const handleOpenFormEdit = () => {
      setOpenFormEdit(true);

    };
    const handleCloseFormEdit = () => {
      setOpenFormEdit(false);
      handleClose()
    };

    return (
      <React.Fragment>
        <Button onClick={handleOpenFormEdit}>YES Edit</Button>
        <Modal
          open={openFormEdit}
          onClose={handleCloseFormEdit}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style }}>
            <h2 id="child-modal-title">Editing the clicked post</h2>
            <p id="child-modal-description">
              Post Id: {postId}
            </p>
            <PostFormForEdit postId={postId} handleClose={handleClose} />

            <Button onClick={handleCloseFormEdit}>No Edit more</Button>
          </Box>
        </Modal>
      </React.Fragment>
    );
  }
  //Child Modal




  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          <h2 id="parent-modal-title">Do you still want to {name}?</h2>
          <Stack
            id="parent-modal-description"
            direction="row"
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
          >
            {name === 'delete' ? <Button onClick={handleYes}> YES Delete </Button> : <ChildModal />}
            <Button onClick={handleNo}> NO</Button>
          </Stack>
        </Box>
      </Modal>
    </>

  )
}

export default PopupModal
