import { useState } from 'react';
import { useNavigate } from 'react-router';
import { registerUser } from '../api/auth_api.js';


function Register() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    
    return (
        <>
            {error && <p>{error}</p>}

            <h1> Register: </h1>
            <form onSubmit={async(e) => {
                e.preventDefault();
                try {

                    await registerUser(username, email, password);
                    navigate("/login")

                } catch(error) {

                    if (error instanceof Error) {
                        setError(error.message)
                    }
                    
                }
            }}>
                
                <label> Username </label>
                <input 
                        type="text" 
                        id="username" 
                        value={ username }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>)  => setUsername(e.target.value)}
                    /><br/>
                
                <label> Email </label>
                <input 
                        type="text" 
                        id="email" 
                        value={ email }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>)  => setEmail(e.target.value)}
                    /><br/>
                
                <label> Password </label>
                <input 
                        type="password" 
                        id="password" 
                        value={ password }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>)  => setPassword(e.target.value)}
                    /><br/>
                    
                <input type="submit" value="register_data"/>

            </form>

        </>
    );
}

export default Register;