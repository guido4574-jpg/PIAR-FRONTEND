const API_CONFIG = window.PIAR_API_CONFIG || {};
const API_BASE_URL = getApiBaseUrl();

function getApiBaseUrl() {
    if (API_CONFIG.mode === "external" && API_CONFIG.baseUrl) {
        return API_CONFIG.baseUrl.replace(/\/$/, "");
    }

    return `${window.location.origin}/api`;
}

function apiUrl(name) {
    const endpoint = API_CONFIG.endpoints?.[name] || `/${name}`;
    return `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
}

function apiHeaders() {
    const headers = {
        "Content-Type": "application/json",
        ...(API_CONFIG.headers || {})
    };

    if (API_CONFIG.token) {
        headers.Authorization = API_CONFIG.token;
    }

    return headers;
}

function unwrapApiData(payload) {
    if (!API_CONFIG.responseDataPath) {
        return payload;
    }

    return API_CONFIG.responseDataPath.split(".").reduce((value, key) => value?.[key], payload);
}

async function apiGetData() {
    const response = await fetch(apiUrl("data"), {
        method: "GET",
        headers: apiHeaders()
    });

    if (!response.ok) {
        throw new Error("No se pudo cargar la informacion desde la API externa");
    }

    return adaptApiData(unwrapApiData(await response.json()));
}

async function apiSaveData(data) {
    if (API_CONFIG.adapter === "jsonplaceholderUsers") {
        return simulateExternalSave(data);
    }

    const response = await fetch(apiUrl("data"), {
        method: "PUT",
        headers: apiHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("No se pudo guardar la informacion en la API externa");
    }

    return unwrapApiData(await response.json());
}

async function apiResetData() {
    if (API_CONFIG.adapter === "jsonplaceholderUsers") {
        return adaptApiData(await apiGetUsersForReset());
    }

    const response = await fetch(apiUrl("reset"), {
        method: "POST",
        headers: apiHeaders()
    });

    if (!response.ok) {
        throw new Error("No se pudieron restaurar los datos desde la API externa");
    }

    return unwrapApiData(await response.json());
}

async function apiHealth() {
    try {
        const healthUrl = API_CONFIG.adapter === "jsonplaceholderUsers" ? apiUrl("data") : apiUrl("health");
        const response = await fetch(healthUrl, {
            method: "GET",
            headers: apiHeaders()
        });
        return response.ok;
    } catch {
        return false;
    }
}

function getApiLabel() {
    if (API_CONFIG.mode === "external" && API_CONFIG.baseUrl) {
        return "API externa";
    }

    return "API local";
}

function getApiConnectionMessage() {
    if (API_CONFIG.adapter === "jsonplaceholderUsers") {
        return "API externa de prueba conectada. Estudiantes cargados desde JSONPlaceholder; los cambios se guardan como respaldo local.";
    }

    return `${getApiLabel()} conectada. Los cambios se guardan fuera del navegador.`;
}

function adaptApiData(payload) {
    if (API_CONFIG.adapter === "jsonplaceholderUsers") {
        return adaptJsonPlaceholderUsers(payload);
    }

    return payload;
}

function adaptJsonPlaceholderUsers(users) {
    const base = getLocalBaseData();
    const discapacidades = base.discapacidades || ["Cognitiva", "Visual", "Auditiva", "Fisica"];
    const grados = base.grados || ["6A", "6B", "7A", "7B"];

    return {
        ...base,
        students: users.map((user, index) => ({
            id: user.id,
            nombres: getFirstNames(user.name),
            apellidos: getLastNames(user.name),
            documento: String(1000000000 + user.id),
            fechaNacimiento: `201${index % 5}-0${(index % 8) + 1}-15`,
            grado: grados[index % grados.length],
            jornada: index % 2 === 0 ? "Manana" : "Tarde",
            discapacidad: discapacidades[index % discapacidades.length],
            diagnostico: `Registro de prueba importado desde JSONPlaceholder: ${user.company?.catchPhrase || "sin diagnostico definitivo"}.`,
            estado: index % 3 === 0 ? "revision" : "activo",
            acudiente: user.company?.name || "Acudiente por registrar",
            telefono: user.phone || "Sin telefono",
            contexto: `Direccion de referencia: ${user.address?.street || ""}, ${user.address?.city || ""}.`,
            valoracion: "Valoracion pedagogica pendiente. Registro usado para probar consumo dinamico por Fetch API.",
            fortalezas: ["Participacion en clase", "Seguimiento con apoyo"],
            barreras: ["Informacion pendiente por completar", "Requiere caracterizacion institucional"],
            apoyosRequeridos: ["Entrevista familiar", "Valoracion pedagogica inicial"],
            actividadesCasa: "Completar ficha de caracterizacion y acuerdos con familia.",
            email: user.email,
            externalSource: "jsonplaceholder",
            externalId: user.id
        }))
    };
}

function getLocalBaseData() {
    const saved = localStorage.getItem("piar-control-data-v2");
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            return {
                ...structuredClone(window.APP_DATA),
                institution: parsed.institution || window.APP_DATA.institution,
                auth: parsed.auth || window.APP_DATA.auth,
                teachers: parsed.teachers || window.APP_DATA.teachers,
                piars: parsed.piars || window.APP_DATA.piars,
                reportTypes: parsed.reportTypes || window.APP_DATA.reportTypes,
                discapacidades: parsed.discapacidades || window.APP_DATA.discapacidades,
                grados: parsed.grados || window.APP_DATA.grados,
                areas: parsed.areas || window.APP_DATA.areas
            };
        } catch {
            return structuredClone(window.APP_DATA);
        }
    }

    return structuredClone(window.APP_DATA);
}

function getFirstNames(name) {
    const parts = name.split(" ");
    return parts.slice(0, Math.max(1, Math.ceil(parts.length / 2))).join(" ");
}

function getLastNames(name) {
    const parts = name.split(" ");
    return parts.slice(Math.max(1, Math.ceil(parts.length / 2))).join(" ") || "Sin apellido";
}

function simulateExternalSave(data) {
    localStorage.setItem("piar-control-data-v2", JSON.stringify(data));
    return Promise.resolve(data);
}

async function apiGetUsersForReset() {
    const response = await fetch(apiUrl("data"), {
        method: "GET",
        headers: apiHeaders()
    });

    if (!response.ok) {
        throw new Error("No se pudo restaurar desde JSONPlaceholder");
    }

    return response.json();
}
