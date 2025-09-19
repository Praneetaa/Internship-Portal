import { useState } from "react";
import { Link } from 'react-router-dom';
import {motion} from 'framer-motion';


const Signup = () => {

const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [role, setRole] = useState("");



const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    console.log({ firstName, lastName, email, password, role });

};


    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
            <input
            type="text"
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
            required
            />
            <input
            type="text"
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            required
            />
            <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
            />
            <input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <input type="password"
            placeholder="confirm your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            />
            <label>Are you "</label>
            <select onChange={(e) => setRole(e.target.value)} required>
                <option value="explorer">Explorer</option>
                <option value="organization">Organization</option>
            </select>
            <button type="submit">Sign Up</button>
            </form>

            <p>Already have an account? <Link to ="/">Log in</Link></p>
        </div>
    )
}

export default Signup;
