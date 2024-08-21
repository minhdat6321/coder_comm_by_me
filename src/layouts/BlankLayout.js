import { Stack } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Logo from '../components/Logo'

function BlankLayout() {
  return (
    <Stack justifyContent='center' alignItems="center" minHeight='100vh'>
      <Logo sx={{ width: 90, height: 90, mb: 5 }} disabledLink='true' />
      <Outlet />
    </Stack>
  )
}

export default BlankLayout
