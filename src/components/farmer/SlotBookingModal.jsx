import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { X, Calendar, Clock, Wheat, CheckCircle2, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export const SlotBookingModal = ({ centre, onClose }) => {
  const { crops, timeSlots, bookSlot, user } = useDemo();

  const [selectedCrop, setSelectedCrop] = useState(crops[0]?.name || 'Paddy (Grade A)');
  const [expectedQty, setExpectedQty] = useState(40);
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[4]?.time || '11:00 AM - 11:30 AM');
  const [selectedDate, setSelectedDate] = useState('Today (Aug 29, 2026)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Perform insert into Supabase 'bookings' table
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            farmer_name: user?.user_metadata?.full_name || 'Farmer (Demo)',
            phone: user?.email || '9999999999',
            mandi_id: centre?.id || 'centre-01',
            crop_type: selectedCrop,
            quantity_quintals: Number(expectedQty),
            slot_time: selectedSlot,
            status: 'booked'
          }
        ]);

      if (error) {
        console.error('Supabase booking insertion error:', error);
        alert(`Supabase Insertion Alert: ${error.message || 'Could not insert row into database.'}`);
      }
    } catch (err) {
      console.error('Unexpected error inserting booking into Supabase:', err);
      alert('Network or Database Connection Error while saving booking.');
    } finally {
      setIsSubmitting(false);
    }

    // Always invoke context reactive store update
    bookSlot({
      centreId: centre?.id,
      cropName: selectedCrop,
      slotTime: selectedSlot,
      expectedQty
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-agri-surface rounded-2xl max-w-xl w-full border border-agri-ivory-muted shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-agri-green text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-agri-gold tracking-widest block">
              SMART SLOT BOOKING
            </span>
            <h3 className="font-heading text-xl font-bold text-white mt-0.5">
              {centre?.name || 'Sonipat Main Procurement Centre'}
            </h3>
            <p className="text-xs text-agri-ivory/80">
              {centre?.address || 'Sonipat GT Road, Haryana'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-agri-ivory hover:text-white hover:bg-agri-green-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitBooking} className="p-6 space-y-5">

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-agri-text mb-1.5 uppercase tracking-wider">
              Select Procurement Date
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedDate('Today (Aug 29, 2026)')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold text-left transition-all ${
                  selectedDate.includes('Today')
                    ? 'border-agri-green bg-agri-green-soft text-agri-green-dark ring-1 ring-agri-green'
                    : 'border-agri-ivory-muted bg-agri-ivory text-agri-text-muted'
                }`}
              >
                📅 Today (Aug 29, 2026)
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate('Tomorrow (Aug 30, 2026)')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold text-left transition-all ${
                  selectedDate.includes('Tomorrow')
                    ? 'border-agri-green bg-agri-green-soft text-agri-green-dark ring-1 ring-agri-green'
                    : 'border-agri-ivory-muted bg-agri-ivory text-agri-text-muted'
                }`}
              >
                📅 Tomorrow (Aug 30, 2026)
              </button>
            </div>
          </div>

          {/* Crop & Quantity Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1.5 uppercase tracking-wider">
                Select Crop Type
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full p-2.5 bg-agri-ivory border border-agri-ivory-muted rounded-xl text-xs font-bold text-agri-text focus:ring-2 focus:ring-agri-green/30"
              >
                {crops.map((crop) => (
                  <option key={crop.id} value={crop.name}>
                    {crop.name} (MSP ₹{crop.mspRate.toLocaleString()}/Qtl)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-agri-text mb-1.5 uppercase tracking-wider">
                Expected Harvest (Quintals)
              </label>
              <input
                type="number"
                min="5"
                max="500"
                value={expectedQty}
                onChange={(e) => setExpectedQty(e.target.value)}
                className="w-full p-2.5 bg-agri-ivory border border-agri-ivory-muted rounded-xl text-xs font-bold text-agri-text focus:ring-2 focus:ring-agri-green/30"
                required
              />
            </div>
          </div>

          {/* Time Slot Selection Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-agri-text uppercase tracking-wider">
                Available Time Slots
              </label>
              <span className="text-[10px] font-semibold text-agri-green">
                ⭐ 30-Min Arrival Window Guarantee
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {timeSlots.map((slot) => {
                const isFull = slot.status === 'FULL';
                const isSelected = selectedSlot === slot.time;

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={isFull}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isFull
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                        : isSelected
                        ? 'border-2 border-agri-green bg-agri-green-soft text-agri-green-dark shadow-sm ring-1 ring-agri-green'
                        : 'border-agri-ivory-muted bg-agri-ivory hover:border-agri-green-border text-agri-text'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{slot.time}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-agri-green" />}
                    </div>
                    <span className="text-[10px] block mt-1 font-semibold">
                      {isFull ? '🔒 FULL' : `🟢 ${slot.remaining} slots remaining`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Estimated Payout Formula Transparency Callout */}
          <div className="p-3 bg-agri-gold-light/20 rounded-xl border border-agri-gold/40 text-xs text-agri-text">
            <div className="flex items-center justify-between font-bold">
              <span>Estimated Minimum Support Payout:</span>
              <span className="text-agri-green-dark font-heading text-sm">
                ₹{(expectedQty * 2200).toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-agri-text-muted mt-1 font-mono">
              Formula: {expectedQty} Quintals × ₹2,200/Quintal = ₹{(expectedQty * 2200).toLocaleString()}
            </p>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-agri-ivory-muted flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-agri-text-muted hover:bg-agri-ivory"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-agri-green hover:bg-agri-green-dark text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-agri-sm flex items-center space-x-2 disabled:opacity-50"
            >
              <Wheat className="w-4 h-4 text-agri-gold" />
              <span>{isSubmitting ? 'Inserting into Supabase...' : 'Confirm & Issue Token Pass'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
