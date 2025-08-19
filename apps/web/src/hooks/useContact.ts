import { useState } from 'react';
import { contactAPI, CreateContactRequest, Contact } from '../services/api';

interface UseContactReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  contact: Contact | null;
  submitContact: (data: CreateContactRequest) => Promise<void>;
  reset: () => void;
}

export const useContact = (): UseContactReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [contact, setContact] = useState<Contact | null>(null);

  const submitContact = async (data: CreateContactRequest) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const result = await contactAPI.submit(data);
      setContact(result.contact);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit contact form');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setContact(null);
  };

  return {
    loading,
    error,
    success,
    contact,
    submitContact,
    reset,
  };
};
