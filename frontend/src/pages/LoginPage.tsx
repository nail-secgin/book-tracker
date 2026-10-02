import { useState } from 'react';
import { useNavigate } from 'react-router';
import { loginUser, testUserId, logoutUser } from '../api/auth_api.js';

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userid, setUserId] = useState("");
    const [error, setError] = useState("");
    
    const navigate = useNavigate();

    return (
        <>
            {error && <p>{error}</p>}
            {userid && <p>User ID: {userid}</p>}

            <h1> Login: </h1>
            <form onSubmit={async(e) => {
                e.preventDefault();
                try {
                    setError("");
                    await loginUser(username, password);
                    navigate("/books")

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
                
                <label> Password </label>
                <input 
                        type="password" 
                        id="password" 
                        value={ password }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>)  => setPassword(e.target.value)}
                    /><br/>
                    
                <input type="submit" value="login_data"/>
            </form>

            <form onSubmit={async(e) => {
                e.preventDefault();
                try {
                    setError("");
                    const id = await testUserId();
                    setUserId(id);
                } catch(error) {
                    if (error instanceof Error) {
                        setError(error.message);
                    }
                }
            }}>

                <input type="submit" value="test"/>
            </form>

            <form onSubmit={async(e) => {
                e.preventDefault();
                try {
                    setError("");
                    await logoutUser();
                    setUserId("");
                } catch(error) {
                    if (error instanceof Error) {
                        setError(error.message);
                    }
                }
            }}>

                <input type="submit" value="logout"/>
            </form>
            
        </>
    );
}

export default Login;