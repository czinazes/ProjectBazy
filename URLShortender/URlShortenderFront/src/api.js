const API_BASE_URL="http://localhost:5000"

export async function ShortenUrl(url, lifetimeHours){
    const response = await fetch(`${API_BASE_URL}/api/shortender`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
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
    const response = await fetch(`${API_BASE_URL}/api/stats/${code}`)
    if(response.status === 404){
        throw new Error("Nie udało się znaleźć takiego linku")
    }
    if(!response.ok){
        throw new Error("Błąd polączenia")
    }

    return response.json();
}

export async function RegisterUser(payload) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
