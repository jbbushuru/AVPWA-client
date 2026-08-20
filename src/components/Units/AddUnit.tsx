import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { createUnits, UnitPayload, getCategories, getSummary } from '../../services/unitService';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

interface AddUnitModalProps {
    isOpen: boolean;
    onClose: () => void;
}
function getYrTrmTxt(year: number | undefined, term: number | undefined) {
    if (year === undefined || term === undefined) return '';
    return `Year ${year} Sem ${term}`;
}
const AddUnitModal = ({ isOpen, onClose }: AddUnitModalProps) => {
    const { profile } = useAuth();
    const { fetchUnitsSummary } = useApp();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [year, setYear] = useState(profile?.year);
    const [term, setTerm] = useState(profile?.term);
    const YrTrmTxt = getYrTrmTxt(year, term);
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

    useEffect(() => {
        getCategories()
            .then((data) => setCategories(data))
            .catch(() => setCategories([]));
    }, []);

    // Initial unit form state
    
    const [units, setUnits] = useState([
        { code: '', name: '', grade: '', category: '' }
    ]);

    if (!isOpen) return null;

    // Add a new empty unit block
    const handleAddUnitField = () => {
        setUnits([...units, { code: '', name: '', grade: '', category: '' }]);
    };

    // Remove a unit block
    const handleRemoveUnitField = (index: number) => {
        if (units.length === 1) return; // Keep at least one form row
        setUnits(units.filter((_, i) => i !== index));
    };

    // Handle nested input changes
    const handleInputChange = (index: number, field: string, value: string) => {
        const updatedUnits = [...units];
        updatedUnits[index] = { ...updatedUnits[index], [field]: value };
        setUnits(updatedUnits);
    };

    // Handle Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const payload: UnitPayload = {
            year: Number(year),
            term: Number(term),
            units,
        };

        try {
            await createUnits(payload);
            setSuccess('Units created successfully!');
            setUnits([{ code: '', name: '', grade: '', category: '' }]);

            fetchUnitsSummary();

            setTimeout(() => {
                setSuccess('');
                onClose();
            }, 2000);
        } catch (error: any) {
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-amber-50 rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-xl font-sister text-gray-800">Add Unit</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-200">
                            {success}
                        </div>
                    )}

                    {/* Year & Semester Selectors */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <select
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value={1}>Year 1</option>
                                <option value={2}>Year 2</option>
                                <option value={3}>Year 3</option>
                                <option value={4}>Year 4</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{profile?.academicSystem}</label>
                            <select
                                value={term}
                                onChange={(e) => setTerm(Number(e.target.value))}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                {profile?.academicSystem === 'Semester' ? (
                                    <>
                                        <option value={1}>Semester 1</option>
                                        <option value={2}>Semester 2</option>
                                    </>
                                ) : (
                                    <>
                                        <option value={1}>Term 1</option>
                                        <option value={2}>Term 2</option>
                                        <option value={3}>Term 3</option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>

                    {/* Dynamic Units List */}
                    {units.map((unit, index) => (
                        <div key={index} className="p-6 pt-4 bg-white shadow-md rounded-xl border border-slate-50 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-white bg-primary py-1 px-2 rounded-lg shadow-sm">Unit #{index + 1}</span>
                                {units.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveUnitField(index)}
                                        className="text-xs font-medium text-red-500 hover:text-red-700 flex items-center gap-1"
                                    >
                                        <Trash2 size={14} /> Remove
                                    </button>
                                )}
                            </div>

                            {/* Code & Name */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs uppercase font-medium text-gray-600 mb-1">Unit Code</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g., CS101"
                                        value={unit.code}
                                        onChange={(e) => handleInputChange(index, 'code', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase font-medium text-gray-600 mb-1">Unit Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g., Intro to CS"
                                        value={unit.name}
                                        onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Grade & Category */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs uppercase font-medium text-gray-600 mb-1">Grade</label>
                                    <select
                                        required
                                        value={unit.grade}
                                        onChange={(e) => handleInputChange(index, 'grade', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                    >
                                        <option value="">Select Grade</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                        <option value="E">E</option>
                                        <option value="F">F</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase font-medium text-gray-600 mb-1">Category</label>
                                    <select
                                        value={unit.category}
                                        onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add Another Unit Button */}
                    <button
                        type="button"
                        onClick={handleAddUnitField}
                        className="w-full py-3 border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-xl text-sm font-medium text-gray-600 flex items-center justify-center gap-2 transition"
                    >
                        <Plus size={16} /> Add another unit
                    </button>

                    {/* Submit Action Button */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-medium text-sm rounded-xl shadow-sm transition disabled:opacity-50"
                        >
                            {loading
                                ? 'Submitting...'
                                : `Add ${units.length} Unit${units.length > 1 ? 's' : ''} to ${YrTrmTxt}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUnitModal;