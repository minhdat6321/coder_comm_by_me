import React from 'react'
import useAuth from '../hooks/useAuth';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Button, Divider, IconButton, Menu, MenuItem, Modal, Stack, Typography } from '@mui/material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link as RouterLink } from "react-router-dom";
import PopupModal from './PopupModal';



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

function ButtonMore({ postId, commentId }) {

  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  const [openModalDelete, setOpenModalDelete] = React.useState(false);
  const handleOpenModalDelete = () => {
    setOpenModalDelete(true);
    handleMenuClose()
  };
  const handleCloseModalDelete = () => {
    setOpenModalDelete(false);
    handleMenuClose()

  };
  const [openModalEdit, setOpenModalEdit] = React.useState(false);
  const handleOpenModalEdit = () => {
    setOpenModalEdit(true);
    handleMenuClose()

  };
  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
    handleMenuClose()

  };


  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}

    >
      <MenuItem
        sx={{ mx: 1 }}
      >
        <Button onClick={handleOpenModalDelete}>Delete</Button>
        <PopupModal open={openModalDelete} handleClose={handleCloseModalDelete} name={'delete'} postId={postId} />
      </MenuItem>

      <MenuItem
        sx={{ mx: 1 }}
      >
        <Button onClick={handleOpenModalEdit}>Edit</Button>
        <PopupModal open={openModalEdit} handleClose={handleCloseModalEdit} name={'edit'} postId={postId} />

      </MenuItem>

    </Menu>

  );

  return (
    <>
      <IconButton onClick={handleProfileMenuOpen}>
        <MoreVertIcon sx={{ fontSize: 30 }} />
      </IconButton>
      {renderMenu}
    </>
  )
}

export default ButtonMore
