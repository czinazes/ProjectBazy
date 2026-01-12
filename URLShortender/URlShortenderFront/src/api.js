const API_BASE_URL="http://localhost:5000"

function buildAuthHeaders(token) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function ShortenUrl(url, lifetimeHours, token){
    const response = await fetch(`${API_BASE_URL}/api/links/shorten`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "accept": "*/*",
        ...buildAuthHeaders(token)
        },
        body: JSON.stringify({ url, lifetimeHours }),
    });
    if(!response.ok){
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || "Nie udało się skrócić linku")
    }

    return response.json();
}

export async function GetStats(code) {
    const response = await fetch(`${API_BASE_URL}/api/links/stats/${code}`)
    if(response.status === 404){
        throw new Error("Nie udało się znaleźć takiego linku")
    }
    if(!response.ok){
        throw new Error("Błąd polączenia")
    }

    return response.json();
}

export async function RegisterUser(payload) {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "accept": "*/*"
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Nie udało się utworzyć konta");
    }

    return response.json();
}

export async function LoginUser(payload) {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "accept": "*/*"
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Nie udało się zalogować");
    }

    return response.json();
}

export async function GetProfile(token) {
    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: {
            "accept": "*/*",
            ...buildAuthHeaders(token)
        }
    });
    if (!response.ok) {
        throw new Error("Nie udało się pobrać profilu");
    }

    return response.json();
}

export async function UpdateProfile(payload, token) {
    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "accept": "*/*",
            ...buildAuthHeaders(token)
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Nie udało się zaktualizować profilu");
    }

    return response.json();
}

export async function GetUserLinks(token) {
    const response = await fetch(`${API_BASE_URL}/api/users/links`, {
        headers: {
            "accept": "*/*",
            ...buildAuthHeaders(token)
        }
    });
    if (!response.ok) {
        throw new Error("Nie udało się pobrać linków");
    }

    return response.json();
}
