import { Box ,Card, Typography} from '@mui/material'
import React from 'react'

export default function Profile() {
  
  return (
     <Card
        elevation={0}
        sx={{
          width: 450,
          borderRadius: 4,
          p: 4,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant='h2' ></Typography>
      </Card>
  )
}
