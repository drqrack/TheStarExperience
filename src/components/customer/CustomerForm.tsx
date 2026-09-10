'use client';

import React, { useState } from 'react';
import { User, Phone, ArrowRight, QrCode, AlertCircle , Sparkles} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TableBadge } from './TableBadge';
import { useCart } from '@/context/CartContext';

interface CustomerFormProps {
  onComplete: () => void;
  hasTableParam?: boolean;
}

export function CustomerForm({ onComplete, hasTableParam = true }: CustomerFormProps) {
  const { tableNumber, setTableNumber, customerInfo, setCustomerInfo } = useCart();

  const [name, setName] = useState<string>(customerInfo.name || '');
  const [phone, setPhone] = useState<string>(customerInfo.phone || '');
  const [manualTable, setManualTable] = useState<string>(tableNumber || '12');
  const [showTableInput, setShowTableInput] = useState<boolean>(!hasTableParam && !tableNumber);

  const [errors, setErrors] = useState<{ name?: string; phone?: string; table?: string }>({});

  const validate = (): boolean => {
    const newErrors: { name?: string; phone?: string; table?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Ghanaian phone validation: 10 digits starting with 02, 05, or international +233
    const cleanedPhone = phone.replace(/[\s-]/g, '');
    const ghanaPhoneRegex = /^(0|\+?233)(20|50|24|54|55|59|27|57|26|56|28)\d{7}$/;
    const simple10Digit = /^0\d{9}$/;

    if (!phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (!simple10Digit.test(cleanedPhone) && !ghanaPhoneRegex.test(cleanedPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit Ghanaian number (e.g. 024 XXX XXXX)';
    }

    if (showTableInput && (!manualTable || manualTable.trim() === '')) {
      newErrors.table = 'Please specify your table number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const resolvedTable = showTableInput ? manualTable.trim() : tableNumber;
    setTableNumber(resolvedTable);
    setCustomerInfo({
      name: name.trim(),
      phone: phone.trim(),
      tableNumber: resolvedTable,
    });

    onComplete();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#121212] border border-[#262626] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-star-gold to-transparent" />

      {/* Header section */}
      <div className="text-center mb-6">
        <div className="inline-flex p-2.5 rounded-2xl bg-star-gold/10 border border-star-gold/30 text-star-gold mb-3">
          <Sparkles className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-extrabold text-white tracking-wide uppercase">
          THE STAR EXPERIENCE
        </h2>

        {/* Prominent Table Announcement */}
        <div className="my-3 flex flex-col items-center justify-center gap-1.5">
          <TableBadge tableNumber={showTableInput ? manualTable : tableNumber} size="lg" />
          <p className="text-xs text-star-muted font-medium">Order directly from your table</p>
        </div>

        {!hasTableParam && (
          <div className="mt-3 flex items-start gap-2 text-left bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 text-xs text-amber-200">
            <AlertCircle className="w-4 h-4 text-star-gold shrink-0 mt-0.5" />
            <div>
              <span>No table detected from URL. Please scan your table’s QR code, or enter your table number below.</span>
              <button
                type="button"
                onClick={() => setShowTableInput(true)}
                className="block mt-1 text-star-gold underline font-bold"
              >
                Change table number
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {showTableInput && (
          <Input
            label="Table Number"
            type="number"
            placeholder="e.g. 12"
            value={manualTable}
            onChange={(e) => setManualTable(e.target.value)}
            error={errors.table}
            leftIcon={<QrCode className="w-4 h-4" />}
            helperText="Check the placard or coaster on your table"
          />
        )}

        <Input
          label="Your Name"
          type="text"
          placeholder="e.g. Kofi Appiah"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          leftIcon={<User className="w-4 h-4" />}
          autoFocus
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="e.g. 024 XXX XXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
          leftIcon={<Phone className="w-4 h-4" />}
          helperText="For order updates & bar staff contact"
        />

        <Button
          type="submit"
          variant="gold"
          size="lg"
          className="w-full mt-3 text-base"
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          CONTINUE TO MENU
        </Button>

        <p className="text-center text-[11px] text-star-muted pt-1">
          No registration required • Swift service by The Republic Bar
        </p>
      </form>
    </div>
  );
}
