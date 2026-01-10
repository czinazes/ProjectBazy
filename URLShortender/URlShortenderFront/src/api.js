const API_BASE_URL="http://localhost:5000"

export async function ShortenUrl(url){
    const response = await fetch(`${API_BASE_URL}/api/shortender`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
        },
        body: JSON.stringify({ url }),
    });
    if(!response.ok){
        const data = await response.json.catch(() => ({}))
        throw new Error(data.Error || "Nie udało się skrócić linku")
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