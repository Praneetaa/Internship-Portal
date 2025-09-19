import { useState } from 'react';
import { motion } from 'framer-motion';
import {Mail, Lock, Eye, EyeOff, Loader, AlertCircle, CheckCircle} from 'lucide-react';
import { Link } from 'react-router-dom';



const Login = () => {

    // const [formData, setFormData] = useState({
    //     email:'',
    //     password:'',
    //     rememberMe: false
    // });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setshowPassword] = useState(false);

    const handleLogin = (e) => {
        console.log(e);
        e.preventDefault();
        console.log({email, password});
    }

    return (
        <div className ='flex justify-center items-center h-screen bg-gray-100'>
            <div className='w-md max-wd-md bg-white p-6 rounded-lg shadow-lg'>
            <h2 className ='text-3xl font-bold text-center text-primary mb-4'>Welcome Back!</h2>
            <p className='text-center text-gray-500 mb-6'>Sign in to your account to continue</p>

            <form
            onSubmit={handleLogin}
            className='space-y-4'>

                <div className='relative'>
                <label className='block p-2'>Email Address </label>
                <Mail className='absolute left-3 top-1/2 translate-y-3 text-gray-400' size={20}/>
                <input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500'
                />
                </div>

                <div className='relative'>
                <label className='block p-2'>Password </label>
                <Lock className='absolute left-3 top-1/2 translate-y-3 text-gray-400' size={20}/>
                <input
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className='w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500'
                />
                </div>

                <button type="submit"
                className='w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition-colors '>Log in</button>
            </form>

            <p className='text-sm text-center mt-4 text-gray-600'>Don't have an account? {" "} <Link to ="/Signup" className='text-teal-500 hover:underline'
            >Sign Up
            </Link>
            </p>

        </div>
        </div>

    )
}

export default Login;
