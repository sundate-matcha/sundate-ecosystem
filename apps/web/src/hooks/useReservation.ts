import { useState } from 'react';
import { reservationAPI, CreateReservationRequest, Reservation } from '../services/api';

interface UseReservationReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  reservation: Reservation | null;
  createReservation: (data: CreateReservationRequest) => Promise<void>;
  reset: () => void;
}

export const useReservation = (): UseReservationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  const createReservation = async (data: CreateReservationRequest) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const result = await reservationAPI.create(data);
      setReservation(result.reservation);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create reservation');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setReservation(null);
  };

  return {
    loading,
    error,
    success,
    reservation,
    createReservation,
    reset,
  };
};
