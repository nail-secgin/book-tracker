

export async function registerUser(username: string, email: string, password: string): Promise<void> {
    const login_data = {
        username: username,
        email: email,
        password: password
    }

    const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(login_data)
    });    

    if(!response.ok) {
        const error_info = await response.text();
        throw new Error(error_info)
    }    
}

export async function loginUser(username: string, password: string): Promise<void> {
    const login_data = {
        username: username,
        password: password
    }

    const response = await fetch("http://localhost:3000/login", {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(login_data)
    });    

    if(!response.ok) {
        const error_info = await response.text();
        throw new Error(error_info)
    }

}

export async function logoutUser():Promise<void> {
    const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include"
    });

    if(!response.ok) {
        const error_info = await response.text();
        throw new Error(error_info)
    }
}


export async function testUserId():Promise<string> {
    const response = await fetch("http://localhost:3000/login", {
        credentials: "include"
    });

    if(!response.ok) {
        const error_info = await response.text();
        throw new Error(error_info)
    }

    return response.text();
}