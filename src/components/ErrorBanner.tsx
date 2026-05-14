import { Box, Alert, AlertTitle, Button } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: Props) {
  return (
    <Box sx={{ width: '100%', my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Alert 
        severity="error" 
        variant="filled"
        sx={{ width: '100%', borderRadius: 2, boxShadow: 2 }}
      >
        <AlertTitle sx={{ fontWeight: 'bold' }}>Wystąpił błąd połączenia</AlertTitle>
        {message || 'Nie udało się pobrać danych z bazy filmów. Spróbuj odświeżyć stronę.'}
      </Alert>
      
      {onRetry && (
        <Button
          variant="outlined"
          color="error"
          startIcon={<ReplayIcon />}
          onClick={onRetry}
          sx={{ fontWeight: 'bold' }}
        >
          Spróbuj ponownie
        </Button>
      )}
    </Box>
  );
}