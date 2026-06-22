window.PIAR_API_CONFIG = {
    mode: "external",
    adapter: "jsonplaceholderUsers",

    // API publica temporal para pruebas con Fetch API.
    baseUrl: "https://jsonplaceholder.typicode.com",

    // Si tu API usa token, pegalo aqui.
    // Ejemplo: "Bearer eyJ..."
    token: "",

    endpoints: {
        data: "/users",
        reset: "/reset",
        health: "/health"
    },

    // Para APIs tipo JSONBin que envuelven la respuesta en una propiedad.
    // Ejemplo: responseDataPath: "record"
    responseDataPath: "",

    headers: {}
};
