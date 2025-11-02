import { useState } from 'react'
import { Snackbar, Alert } from '@mui/material'

const useNoti = () => {
  const [notification, setNotification] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error' | 'warning'
  }>({ open: false, message: '', severity: 'success' })

  const showNoti = (message: string, severity: 'success' | 'error' | 'warning') => {
    setNotification({ open: true, message, severity })
  }

  const NotificationComponent = () => (
    <Snackbar
      open={notification.open}
      autoHideDuration={5000}
      onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ minWidth: 350, maxWidth: 550, marginTop: 6 }}
    >
      <Alert
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        severity={notification.severity}
        sx={{
          width: "100%",
          borderRadius: 2,
          border: `2px solid ${
            notification.severity === 'success' ? '#4caf50' :
            notification.severity === 'error' ? '#f44336' :
            notification.severity === 'warning' ? '#ff9800' : '#2196f3'
          }`
        }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  )

  return { showNoti, NotificationComponent }
}

export default useNoti