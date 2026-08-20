import React, { useState } from 'react';
import { createLesson, Lesson } from '../../services/lessonService';

interface AddLessonProps {
  isOpen: boolean;
  onClose: () => void;
  onLessonAdded: () => void;
  date: Date;
  slot?: number;
}

export default function AddLesson({ isOpen, onClose, onLessonAdded, date, slot }: AddLessonProps) {
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

  const [loading, setLoading] = useState(false);

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-96 max-w-full">
        <h2 className="text-xl mb-4 font-bold">Add Lesson</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input className="border p-2 rounded" name="dateKey" value={formData.dateKey} onChange={handleChange} placeholder="Date Key (YYYY-MM-DD)" required />
          <input className="border p-2 rounded" name="slot" type="number" value={formData.slot} onChange={handleChange} placeholder="Slot" required />
          <input className="border p-2 rounded" name="unitName" value={formData.unitName} onChange={handleChange} placeholder="Unit Name" required />
          <input className="border p-2 rounded" name="time" value={formData.time} onChange={handleChange} placeholder="Time (e.g., 08:00-10:00)" />
          <input className="border p-2 rounded" name="venue" value={formData.venue} onChange={handleChange} placeholder="Venue" />
          <input className="border p-2 rounded" name="lecturer" value={formData.lecturer} onChange={handleChange} placeholder="Lecturer" />
          <select className="border p-2 rounded" name="repeat" value={formData.repeat} onChange={handleChange}>
            <option value="never">Never</option>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-weekly</option>
          </select>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100" disabled={loading}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
