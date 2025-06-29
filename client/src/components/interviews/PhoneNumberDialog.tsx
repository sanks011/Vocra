import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Loader2 } from 'lucide-react';

interface PhoneNumberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string) => Promise<void>;
  loading?: boolean;
}

const PhoneNumberDialog: React.FC<PhoneNumberDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [error, setError] = useState('');

  const validatePhoneNumber = (phone: string) => {
    // Basic validation for international phone numbers
    const phoneRegex = /^\+\d{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number with country code (e.g., +911234567890)');
      return;
    }

    try {
      await onSubmit(phoneNumber);
      setPhoneNumber('+91'); // Reset form
      onClose();
    } catch (error) {
      setError('Failed to start interview. Please try again.');
    }
  };

  const handleClose = () => {
    setPhoneNumber('+91');
    setError('');
    onClose();
  };

  const handlePhoneChange = (value: string) => {
    // Ensure the phone number always starts with +
    if (!value.startsWith('+')) {
      value = '+' + value.replace(/^\+*/, '');
    }
    
    // Only allow numbers and + sign
    const cleanValue = value.replace(/[^\d+]/g, '');
    setPhoneNumber(cleanValue);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Phone Number Required
          </DialogTitle>
          <DialogDescription>
            Please provide your phone number to receive the interview call. 
            You will receive a call from our AI interviewer shortly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+911234567890"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={error ? 'border-red-500' : ''}
              disabled={loading}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <p className="text-xs text-gray-500">
              Include your country code (e.g., +91 for India, +1 for US)
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !phoneNumber.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting Call...
                </>
              ) : (
                'Start Interview Call'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneNumberDialog;
