import React, { useState, useEffect } from 'react';
import { createLesson, Lesson } from '../../services/lessonService';
import { Clock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { calculateExpectedStartTime } from '../../utils/calculateExpectedStartTime';

interface AddLessonProps {
  isOpen: boolean;
  onClose: () => void;
  onLessonAdded: () => void;
  date: Date;
  slot?: number;
}

export default function AddLesson({ isOpen, onClose, onLessonAdded, date, slot }: AddLessonProps) {
  const { settings } = useApp();
  const [formData, setFormData] = useState<Partial<Lesson>>({
    dateKey: date.toISOString().split('T')[0],
    slot: slot || 1,
    unitName: '',
    time: '',
    venue: '',
    lecturer: '',
    repeat: 'never',
    sourceDate: new Date().toISOString(),
  });

  const [startTime, setStartTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const numSlot = slot || 1;
      const firstLessonStartTime=settings?.firstLessonStartTime || '08:00 AM';
      const lessonDuration = settings?.lessonDuration || 120;
      let calculatedStartTime = calculateExpectedStartTime({firstLessonStartTime,lessonDuration,numSlot});

      setFormData({
        dateKey: date.toISOString().split('T')[0],
        slot: numSlot,
        unitName: '',
        time: '',
        venue: '',
        lecturer: '',
        repeat: 'never',
        sourceDate: new Date().toISOString(),
      });
      setStartTime(calculatedStartTime);
    }
  }, [isOpen, date, slot, settings]);

  useEffect(() => {
    if (startTime) {
      setFormData(prev => ({ ...prev, time: startTime }));
    }
  }, [startTime]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createLesson(formData as Lesson);
      onLessonAdded();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error creating lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-[#FFFCF8] rounded-3xl w-full max-w-sm overflow-hidden shadow-xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-2">
          <h2 className="text-xl text-gray-800 font-sister ">Add Lesson (Slot {formData.slot})</h2>
          <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Form Content - Scrollable if needed */}
        <div className="overflow-y-auto px-6 pb-6 custom-scrollbar">
          <form id="add-lesson-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Hidden fields for data integrity */}
            <input type="hidden" name="dateKey" value={formData.dateKey} />
            <input type="hidden" name="slot" value={formData.slot} />

            {/* Unit Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-600 ml-1">Unit Name <span className="text-red-600">*</span></label>
              <input 
                className="w-full border border-gray-300 px-4 py-3 max-md:py-2 max-md:text-xs rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8C7A8E] focus:border-transparent text-gray-800 placeholder-gray-500 transition-all" 
                name="unitName" 
                value={formData.unitName} 
                onChange={handleChange} 
                placeholder="e.g. Network Security" 
                required 
              />
            </div>

            {/* Time */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-600 ml-1">Start Time</label>
              <div className="relative flex items-center justify-between border border-gray-300 px-4 py-3 max-md:py-2 max-md:text-xs rounded-2xl focus-within:ring-2 focus-within:ring-[#8C7A8E] focus-within:border-transparent text-gray-800 transition-">
                <div className="font-medium text-sm max-md:text-xs text-primary">{startTime || "08:00 AM"}</div>
                <div className="hidden md:block">
                  <Clock className="text-gray-400 pointer-events-none self-center ml-3 -mt-[1.5px]" size={16}/>
                </div>
                <input 
                  type="time"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  value={(() => {
                    if (!startTime || !startTime.includes(' ')) return "08:00";
                    const [time, modifier] = startTime.split(' ');
                    let [hours, minutes] = time.split(':');
                    if (hours === '12') hours = '00';
                    if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
                    return `${hours.padStart(2, '0')}:${minutes}`;
                  })()}
                  onChange={(e) => {
                    const time24h = e.target.value;
                    if (!time24h) {
                      setStartTime("08:00 AM");
                      return;
                    }
                    const [hours24, minutes] = time24h.split(':');
                    let hours = parseInt(hours24, 10);
                    const modifier = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12 || 12;
                    setStartTime(`${hours.toString().padStart(2, '0')}:${minutes} ${modifier}`);
                  }}
                />
              </div>
            </div>

            {/* Venue */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-600 ml-1">Venue</label>
              <input 
                className="w-full border border-gray-300 px-4 py-3 max-md:py-2 max-md:text-xs rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8C7A8E] focus:border-transparent text-gray-800 placeholder-gray-500 transition-all" 
                name="venue" 
                value={formData.venue} 
                onChange={handleChange} 
                placeholder="e.g. Lab 4" 
              />
            </div>

            {/* Lecturer */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-600 ml-1">Lecturer</label>
              <input 
                className="w-full border border-gray-300 px-4 py-3 max-md:py-2 max-md:text-xs rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8C7A8E] focus:border-transparent text-gray-800 placeholder-gray-500 transition-all" 
                name="lecturer" 
                value={formData.lecturer} 
                onChange={handleChange} 
                placeholder="" 
              />
            </div>

            {/* Repeat */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-600 ml-1">Repeat</label>
              <div className="flex gap-2">
                {(['never', 'weekly', 'bi-weekly'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData({ ...formData, repeat: opt })}
                    className={`flex-1 py-3 px-2 max-md:py-2 max-md:text-xs rounded-2xl text-sm font-medium transition-all ${
                      formData.repeat === opt 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {opt === 'never' ? 'Never' : opt === 'weekly' ? 'Weekly' : '2 Weeks'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pb-2 ">
              <button 
                type="submit" 
                className="w-full py-4 max-md:py-3 max-md:text-xs bg-primary hover:bg-primary/90 text-white font-medium rounded-2xl shadow-sm transition-all flex justify-center items-center gap-2 disabled:bg-gray-200 disabled:cursor-not-allowed"
                disabled={loading || !formData.unitName?.trim()}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Lesson'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
