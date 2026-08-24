import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileService, CreateProfileDTO } from '../services/profileService';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    
    // Step 1: User Registration
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Step 2: Profile Creation
    const [profileData, setProfileData] = useState<CreateProfileDTO>({
        firstName: '',
        lastName: '',
        course: '',
        courseDuration: 1,
        academicSystem: 'Semester',
        year: 1,
        term: 1,
    });

    const [error, setError] = useState('');
    const { register, fetchProfile } = useAuth();

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await register({ email, password });
            setStep(2); // Proceed to profile creation step
        } catch (err: any) {
            setError(err.customMessage || err.message|| 'Registration failed');
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await profileService.createProfile(profileData);
            await fetchProfile(); // Hydrate the auth context with the new profile
            navigate('/'); // Redirect to dashboard/home after successful setup
        } catch (err: any) {
            setError(err.customMessage || err.message || 'Profile creation failed');
        }
    };

    return (
        <div className="w-full flex flex-col justify-center items-center h-screen">
            {step === 1 ? (
                <form onSubmit={handleSignupSubmit} className="w-1/2 flex flex-col justify-center items-center gap-4">
                    <h1 className="text-2xl font-bold">Signup</h1>
                    {error && <div className="text-red-500">{error}</div>}
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border p-2 rounded w-full"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border p-2 rounded w-full"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Continue to Profile</button>
                </form>
            ) : (
                <form onSubmit={handleProfileSubmit} className="w-1/2 flex flex-col justify-center items-center gap-4">
                    <h1 className="text-2xl font-bold">Create Profile</h1>
                    {error && <div className="text-red-500">{error}</div>}
                    <input 
                        type="text" 
                        placeholder="First Name" 
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        required
                        className="border p-2 rounded w-full"
                    />
                    <input 
                        type="text" 
                        placeholder="Last Name" 
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        required
                        className="border p-2 rounded w-full"
                    />
                    <input 
                        type="text" 
                        placeholder="Course (e.g. Computer Science)" 
                        value={profileData.course}
                        onChange={(e) => setProfileData({...profileData, course: e.target.value})}
                        required
                        className="border p-2 rounded w-full"
                    />
                    <div className="flex gap-2 w-full">
                        <label className="flex-1 flex flex-col text-sm text-gray-600">
                            Course Duration (Years)
                            <input 
                                type="number" 
                                min="1"
                                value={profileData.courseDuration}
                                onChange={(e) => setProfileData({...profileData, courseDuration: parseInt(e.target.value)})}
                                required
                                className="border p-2 rounded w-full text-black"
                            />
                        </label>
                        <label className="flex-1 flex flex-col text-sm text-gray-600">
                            Academic System
                            <select 
                                value={profileData.academicSystem}
                                onChange={(e) => setProfileData({...profileData, academicSystem: e.target.value as 'Semester' | 'Trimester'})}
                                required
                                className="border p-2 rounded w-full h-[42px] text-black"
                            >
                                <option value="Semester">Semester</option>
                                <option value="Trimester">Trimester</option>
                            </select>
                        </label>
                    </div>
                    <div className="flex gap-2 w-full">
                        <label className="flex-1 flex flex-col text-sm text-gray-600">
                            Current Year
                            <input 
                                type="number" 
                                min="1"
                                value={profileData.year}
                                onChange={(e) => setProfileData({...profileData, year: parseInt(e.target.value)})}
                                required
                                className="border p-2 rounded w-full text-black"
                            />
                        </label>
                        <label className="flex-1 flex flex-col text-sm text-gray-600">
                            Current Term
                            <input 
                                type="number" 
                                min="1"
                                value={profileData.term}
                                onChange={(e) => setProfileData({...profileData, term: parseInt(e.target.value)})}
                                required
                                className="border p-2 rounded w-full text-black"
                            />
                        </label>
                    </div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full mt-2">Complete Setup</button>
                </form>
            )}
        </div>
    );
}