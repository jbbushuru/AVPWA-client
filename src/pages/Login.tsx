import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login({ email, password });
            navigate('/'); // Redirect to dashboard/home after successful login
        } catch (err: any) {
            setError(err.customMessage || err.message || 'Login failed');
        }
    };

    return (
        <div className="w-full flex flex-col justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="w-1/2 flex flex-col justify-center items-center gap-4">
                <h1 className="text-2xl font-bold">Login</h1>
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
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Login</button>
            </form>
        </div>
    );
}