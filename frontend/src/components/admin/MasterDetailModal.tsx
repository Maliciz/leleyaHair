import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Close, ContentCut, Person, Phone, CalendarToday, AccessTime } from '@mui/icons-material';
import { MasterDetailsResponse } from '../../api/financeApi';

interface MasterDetailModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  details: MasterDetailsResponse | null;
}

export const MasterDetailModal: React.FC<MasterDetailModalProps> = ({
  open,
  onClose,
  loading,
  details,
}) => {
  const totalRevenue = details?.bookings.reduce((sum, b) => sum + b.priceValue, 0) || 0;
  const totalMasterShare = details?.bookings.reduce((sum, b) => sum + b.masterShare, 0) || 0;
  const totalSalonShare = details?.bookings.reduce((sum, b) => sum + b.salonShare, 0) || 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: '#0C0C0E',
          color: '#FFFFFF',
          border: '1px solid rgba(197, 154, 119, 0.3)',
          borderRadius: '16px',
        },
      }}
    >
      <DialogTitle style={{ padding: '20px 24px', borderBottom: '1px solid rgba(197, 154, 119, 0.2)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <ContentCut />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Деталізація стрижок: {details?.masterName || 'Перукар'}
              </h3>
              <p className="text-xs text-gold-400">
                Період: {details?.startDate} — {details?.endDate}
              </p>
            </div>
          </div>
          <IconButton onClick={onClose} style={{ color: '#9CA3AF' }}>
            <Close />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent style={{ padding: '24px' }}>
        {loading ? (
          <div className="flex justify-center py-12">
            <CircularProgress style={{ color: '#C59A77' }} />
          </div>
        ) : !details || details.bookings.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            За вибраний період виконаних стрижок у даного майстра не знайдено.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Summary Chips */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-dark-950 p-3 rounded-xl border border-gray-800 text-center">
                <span className="text-[11px] text-gray-400 block">Всього стрижок</span>
                <span className="text-lg font-bold text-white">{details.bookings.length}</span>
              </div>
              <div className="bg-dark-950 p-3 rounded-xl border border-emerald-500/30 text-center">
                <span className="text-[11px] text-emerald-400 block">До виплати майстру (40%)</span>
                <span className="text-lg font-bold text-emerald-400">₴ {totalMasterShare.toLocaleString()}</span>
              </div>
              <div className="bg-dark-950 p-3 rounded-xl border border-sky-500/30 text-center">
                <span className="text-[11px] text-sky-400 block">Частка салону (60%)</span>
                <span className="text-lg font-bold text-sky-400">₴ {totalSalonShare.toLocaleString()}</span>
              </div>
            </div>

            {/* Itemized Table */}
            <TableContainer component={Paper} style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
              <Table size="small">
                <TableHead>
                  <TableRow style={{ borderBottom: '1px solid rgba(197, 154, 119, 0.3)' }}>
                    <TableCell style={{ color: '#C59A77', fontWeight: 'bold' }}>Дата & Час</TableCell>
                    <TableCell style={{ color: '#C59A77', fontWeight: 'bold' }}>Клієнт</TableCell>
                    <TableCell style={{ color: '#C59A77', fontWeight: 'bold' }}>Послуга</TableCell>
                    <TableCell align="right" style={{ color: '#C59A77', fontWeight: 'bold' }}>Ціна (100%)</TableCell>
                    <TableCell align="right" style={{ color: '#4ADE80', fontWeight: 'bold' }}>Майстру (40%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details.bookings.map((b) => (
                    <TableRow key={b.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <TableCell style={{ color: '#E5E7EB' }}>
                        <div className="flex items-center gap-1">
                          <CalendarToday style={{ fontSize: '12px', color: '#C59A77' }} />
                          <span className="text-xs font-semibold">{b.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-400">
                          <AccessTime style={{ fontSize: '11px' }} />
                          <span>{b.timeSlot}</span>
                        </div>
                      </TableCell>

                      <TableCell style={{ color: '#FFFFFF' }}>
                        <div className="font-semibold text-xs flex items-center gap-1">
                          <Person style={{ fontSize: '12px', color: '#C59A77' }} />
                          <span>{b.clientName}</span>
                        </div>
                        <a href={`tel:${b.clientPhone}`} className="text-[10px] text-gold-400 hover:underline flex items-center gap-0.5">
                          <Phone style={{ fontSize: '10px' }} />
                          <span>{b.clientPhone}</span>
                        </a>
                      </TableCell>

                      <TableCell style={{ color: '#FFFFFF', fontWeight: '500', fontSize: '12px' }}>
                        {b.serviceName}
                      </TableCell>

                      <TableCell align="right" style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '12px' }}>
                        ₴ {b.priceValue.toLocaleString()}
                      </TableCell>

                      <TableCell align="right" style={{ color: '#4ADE80', fontWeight: 'bold', fontSize: '12px' }}>
                        +₴ {b.masterShare.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </DialogContent>

      <DialogActions style={{ padding: '16px 24px', borderTop: '1px solid rgba(197, 154, 119, 0.2)' }}>
        <Button
          onClick={onClose}
          style={{
            color: '#0C0C0E',
            backgroundColor: '#C59A77',
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '6px 20px',
          }}
        >
          Закрити
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MasterDetailModal;
