const STORAGE_KEY = "piar-control-data-v2";
const AUTH_USERS_KEY = "piar-auth-users-v1";

let state = structuredClone(window.APP_DATA);
let currentView = "dashboard";
let charts = {};
let apiConnected = false;
let currentSessionUser = null;

document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});

async function initializeApp() {
    state = await loadState();
    renderLogin();
}

async function loadState() {
    try {
        state = await apiGetData();
        apiConnected = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        return state;
    } catch (error) {
        apiConnected = false;
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }

        const base = structuredClone(window.APP_DATA);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(base));
        return base;
    }
}

async function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (!apiConnected) {
        return;
    }

    try {
        await apiSaveData(state);
    } catch (error) {
        apiConnected = false;
        showToastMessage("No se pudo guardar en la API externa. Quedo respaldo local.", "warning");
    }
}

function renderLogin(mode = "login") {
    const isRegister = mode === "register";

    document.getElementById("app").innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-left">
                    <h1>PIAR</h1>
                    <p>Control institucional para seguimiento, ajustes razonables, observaciones y reportes de estudiantes.</p>
                    <div class="auth-highlights">
                        <span><i class="bi bi-shield-check"></i> Acceso seguro</span>
                        <span><i class="bi bi-cloud-check"></i> API externa de prueba</span>
                        <span><i class="bi bi-clipboard2-pulse"></i> Seguimiento PIAR</span>
                    </div>
                </div>
                <div class="auth-right">
                    <div class="auth-tabs">
                        <button class="${!isRegister ? "active" : ""}" onclick="renderLogin('login')" type="button">Ingresar</button>
                        <button class="${isRegister ? "active" : ""}" onclick="renderLogin('register')" type="button">Registrarse</button>
                    </div>
                    <h2 class="auth-title">${isRegister ? "Crear cuenta" : "Bienvenido"}</h2>
                    <p class="auth-subtitle">${isRegister ? "Registra tu cuenta institucional" : "Inicia sesion para continuar"}</p>
                    ${isRegister ? registerForm() : loginForm()}
                    <div class="auth-divider"><span>o continua con</span></div>
                    <div class="social-login">
                        <button class="social-btn google-btn" onclick="socialLogin('google')" type="button">
                            <i class="bi bi-google"></i>
                            Google
                        </button>
                        <button class="social-btn outlook-btn" onclick="socialLogin('outlook')" type="button">
                            <i class="bi bi-microsoft"></i>
                            Outlook
                        </button>
                    </div>
                    <div class="auth-link">
                        ${isRegister ? "Ya tienes cuenta?" : "No tienes cuenta?"}
                        <a href="#" onclick="renderLogin('${isRegister ? "login" : "register"}')">${isRegister ? "Iniciar sesion" : "Registrarse"}</a>
                    </div>
                    <div class="auth-link">
                        ${apiConnected ? getApiConnectionMessage() : "API no conectada. Se usara respaldo local del navegador."}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loginForm() {
    return `
        <form onsubmit="login(event)" class="auth-form">
            <input id="loginEmail" type="email" class="input-modern" placeholder="Correo electronico" value="${state.auth.validEmail}" required>
            <input id="loginPassword" type="password" class="input-modern" placeholder="Contrasena" value="${state.auth.validPassword}" required>
            <button type="submit" class="btn-modern">Iniciar sesion</button>
        </form>
    `;
}

function registerForm() {
    return `
        <form onsubmit="registerUser(event)" class="auth-form">
            <input id="registerName" type="text" class="input-modern" placeholder="Nombre completo" required>
            <input id="registerEmail" type="email" class="input-modern" placeholder="Correo electronico" required>
            <input id="registerPassword" type="password" class="input-modern" placeholder="Contrasena" minlength="6" required>
            <input id="registerConfirm" type="password" class="input-modern" placeholder="Confirmar contrasena" minlength="6" required>
            <button type="submit" class="btn-modern">Crear cuenta</button>
        </form>
    `;
}

function login(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const user = getAuthUsers().find(item => item.email.toLowerCase() === email.toLowerCase() && item.password === password);

    if (user || (email === state.auth.validEmail && password === state.auth.validPassword)) {
        currentSessionUser = user || {
            name: state.institution.teacher,
            email: state.auth.validEmail,
            role: "Administrador",
            provider: "email"
        };
        renderApp("dashboard");
        return;
    }

    showToastMessage("Credenciales incorrectas. Revisa correo y contrasena.", "warning");
}

function registerUser(event) {
    event.preventDefault();
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const confirm = document.getElementById("registerConfirm").value.trim();
    const users = getAuthUsers();

    if (password !== confirm) {
        showToastMessage("Las contrasenas no coinciden.", "warning");
        return;
    }

    if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        showToastMessage("Ese correo ya esta registrado.", "warning");
        return;
    }

    const user = {
        id: nextId(users),
        name,
        email,
        password,
        provider: "email",
        role: "Usuario"
    };

    users.push(user);
    saveAuthUsers(users);
    currentSessionUser = user;
    showToastMessage("Cuenta creada correctamente.");
    renderApp("dashboard");
}

function socialLogin(provider) {
    const providerName = provider === "google" ? "Google" : "Outlook";
    const email = provider === "google" ? "usuario.google@demo.com" : "usuario.outlook@demo.com";
    const users = getAuthUsers();
    let user = users.find(item => item.email === email);

    if (!user) {
        user = {
            id: nextId(users),
            name: `Usuario ${providerName}`,
            email,
            password: "",
            provider,
            role: "Usuario"
        };
        users.push(user);
        saveAuthUsers(users);
    }

    currentSessionUser = user;
    showToastMessage(`Acceso de prueba con ${providerName}.`);
    renderApp("dashboard");
}

function renderApp(view) {
    currentView = view;
    document.getElementById("app").innerHTML = `
        <div class="dashboard-layout">
            ${sidebar(view)}
            <main class="dashboard-main">
                <div class="dashboard-wrapper">
                    ${navbar(view)}
                    <section id="viewRoot"></section>
                </div>
            </main>
        </div>
    `;
    renderView(view);
}

function sidebar(active) {
    const items = [
        ["dashboard", "bi-grid-fill", "Dashboard"],
        ["students", "bi-people-fill", "Estudiantes"],
        ["teachers", "bi-person-badge-fill", "Docentes"],
        ["piar", "bi-journal-text", "PIAR / PR"],
        ["reports", "bi-bar-chart-fill", "Reportes"],
        ["settings", "bi-gear-fill", "Configuracion"]
    ];

    return `
        <aside class="sidebar">
            <div>
                <div class="sidebar-logo"><h2>PIAR</h2></div>
                <ul class="sidebar-menu">
                    ${items.map(([id, icon, label]) => `
                        <li class="${active === id ? "active" : ""}" onclick="renderApp('${id}')">
                            <i class="bi ${icon}"></i>
                            <span>${label}</span>
                        </li>
                    `).join("")}
                </ul>
            </div>
            <button class="logout-btn" onclick="renderLogin()">
                <i class="bi bi-box-arrow-left"></i>
                Cerrar sesion
            </button>
        </aside>
    `;
}

function navbar(view) {
    const titles = {
        dashboard: ["Dashboard", "Resumen general del seguimiento institucional"],
        students: ["Gestion de estudiantes", "Perfiles, diagnosticos, barreras y apoyos"],
        teachers: ["Docentes", "Responsables, areas y acompanamiento"],
        piar: ["PIAR / PR", "Planes, ajustes razonables y observaciones"],
        reports: ["Reportes", "Generacion de informes para seguimiento y comite"],
        settings: ["Configuracion", "Datos institucionales y mantenimiento"]
    };
    const [title, subtitle] = titles[view];
    const profileName = currentSessionUser?.name || state.institution.teacher;
    const profileLabel = currentSessionUser?.role || state.institution.name;

    return `
        <div class="dashboard-navbar">
            <div>
                <button class="menu-toggle" onclick="toggleSidebar()"><i class="bi bi-list"></i></button>
                <h1 class="dashboard-title">${title}</h1>
                <p class="dashboard-subtitle">${subtitle}</p>
            </div>
            <div class="user-profile" onclick="toggleProfileMenu()">
                <span class="api-status ${apiConnected ? "online" : "offline"}">
                    <i class="bi ${apiConnected ? "bi-cloud-check-fill" : "bi-cloud-slash-fill"}"></i>
                    ${apiConnected ? getApiLabel() : "Local"}
                </span>
                <div class="user-avatar">${initials(profileName)}</div>
                <div>
                    <strong>${profileName}</strong>
                    <p>${profileLabel}</p>
                </div>
                <div class="profile-dropdown" id="profileDropdown">
                    <button onclick="renderApp('settings')"><i class="bi bi-building"></i> Institucion</button>
                    <button onclick="resetDemoData(event)"><i class="bi bi-arrow-counterclockwise"></i> Restaurar datos</button>
                    <button onclick="renderLogin()"><i class="bi bi-box-arrow-left"></i> Cerrar sesion</button>
                </div>
            </div>
        </div>
    `;
}

function renderView(view) {
    const views = {
        dashboard: renderDashboard,
        students: renderStudents,
        teachers: renderTeachers,
        piar: renderPIAR,
        reports: renderReports,
        settings: renderSettings
    };

    views[view]();
}

function renderDashboard() {
    const activePiars = state.piars.filter(piar => piar.estado === "activo").length;
    const pendingPiars = state.piars.filter(piar => piar.estado !== "cerrado").length;
    const observations = state.piars.reduce((total, piar) => total + piar.observaciones.length, 0);
    const averageProgress = getAverageProgress();

    document.getElementById("viewRoot").innerHTML = `
        <div class="stats-grid">
            ${statCard("bi-people-fill", state.students.length, "Estudiantes", "purple", "renderApp('students')")}
            ${statCard("bi-person-badge-fill", state.teachers.length, "Docentes", "blue", "renderApp('teachers')")}
            ${statCard("bi-journal-check", activePiars, "PIAR activos", "green", "renderApp('piar')")}
            ${statCard("bi-clipboard-pulse", observations, "Observaciones", "orange", "openObservationModal()")}
        </div>

        <div class="dashboard-content">
            <div class="table-card">
                <div class="table-header">
                    <h3>Seguimientos recientes</h3>
                    <button class="btn-modern small-btn" onclick="openObservationModal()">Nueva observacion</button>
                </div>
                ${recentObservationsTable()}
            </div>

            <div class="charts-grid">
                <div class="chart-card">
                    <h3>Avance promedio: ${averageProgress}%</h3>
                    <canvas id="progressChart"></canvas>
                </div>
                <div class="chart-card">
                    <h3>Distribucion por necesidad</h3>
                    <canvas id="studentsChart"></canvas>
                </div>
            </div>

            <div class="table-card">
                <div class="table-header">
                    <h3>Alertas de revision</h3>
                    <button class="table-btn" onclick="renderApp('reports')">Generar reporte</button>
                </div>
                ${alertsTable()}
            </div>
        </div>
    `;

    loadCharts();
}

function renderStudents() {
    document.getElementById("viewRoot").innerHTML = `
        <div class="students-topbar">
            <input id="studentSearch" type="text" class="search-input" placeholder="Buscar por nombre, documento, grado o diagnostico..." oninput="filterStudents()">
            <button class="btn-modern add-btn" onclick="openStudentModal()">
                <i class="bi bi-plus-circle"></i>
                Nuevo estudiante
            </button>
        </div>
        <div id="studentsGrid" class="students-grid">
            ${studentCards(state.students)}
        </div>
    `;
}

function renderTeachers() {
    document.getElementById("viewRoot").innerHTML = `
        <div class="students-topbar">
            <input id="teacherSearch" type="text" class="search-input" placeholder="Buscar docente, area o cargo..." oninput="filterTeachers()">
            <button class="btn-modern add-btn" onclick="openTeacherModal()">
                <i class="bi bi-person-plus-fill"></i>
                Nuevo docente
            </button>
        </div>
        <div id="teachersGrid" class="students-grid">
            ${teacherCards(state.teachers)}
        </div>
    `;
}

function renderPIAR() {
    document.getElementById("viewRoot").innerHTML = `
        <div class="students-topbar">
            <input id="piarSearch" type="text" class="search-input" placeholder="Buscar PIAR por estudiante, docente, estado o periodo..." oninput="filterPIAR()">
            <button class="btn-modern add-btn" onclick="openPIARModal()">
                <i class="bi bi-journal-plus"></i>
                Nuevo PIAR / PR
            </button>
        </div>
        <div id="piarGrid" class="piar-grid">
            ${piarCards(state.piars)}
        </div>
    `;
}

function renderReports() {
    document.getElementById("viewRoot").innerHTML = `
        <div class="report-builder">
            <div class="table-card">
                <div class="form-grid">
                    <label>
                        Tipo de reporte
                        <select id="reportType" class="input-modern">
                            ${state.reportTypes.map(type => `<option>${type}</option>`).join("")}
                        </select>
                    </label>
                    <label>
                        Estudiante
                        <select id="reportStudent" class="input-modern">
                            <option value="all">Todos</option>
                            ${state.students.map(student => `<option value="${student.id}">${fullName(student)}</option>`).join("")}
                        </select>
                    </label>
                    <label>
                        Periodo
                        <input id="reportPeriod" class="input-modern" value="${state.institution.year}">
                    </label>
                    <label>
                        Fecha
                        <input id="reportDate" type="date" class="input-modern" value="${today()}">
                    </label>
                </div>
                <div class="action-row">
                    <button class="btn-modern small-btn" onclick="generateReport()">Generar reporte</button>
                    <button class="table-btn" onclick="printReport()">Imprimir / guardar PDF</button>
                </div>
            </div>
            <div id="reportOutput" class="report-output">
                ${buildReportHTML("Seguimiento individual", "all", state.institution.year, today())}
            </div>
        </div>
    `;
}

function renderSettings() {
    document.getElementById("viewRoot").innerHTML = `
        <div class="table-card">
            <div class="table-header">
                <h3>Datos institucionales</h3>
                <button class="btn-modern small-btn" onclick="saveSettings()">Guardar cambios</button>
            </div>
            <div class="form-grid">
                <label>Institucion <input id="institutionName" class="input-modern" value="${state.institution.name}"></label>
                <label>Sede <input id="institutionSede" class="input-modern" value="${state.institution.sede}"></label>
                <label>Municipio <input id="institutionMunicipio" class="input-modern" value="${state.institution.municipio}"></label>
                <label>Departamento <input id="institutionDepartment" class="input-modern" value="${state.institution.department}"></label>
                <label>Responsable <input id="institutionTeacher" class="input-modern" value="${state.institution.teacher}"></label>
                <label>Vigencia <input id="institutionYear" class="input-modern" value="${state.institution.year}"></label>
            </div>
        </div>

        <div class="table-card maintenance-card">
            <h3>Mantenimiento</h3>
            <p class="dashboard-subtitle">Los datos se guardan localmente en este navegador. Mas adelante podemos conectarlo a una base de datos real.</p>
            <div class="action-row">
                <button class="table-btn" onclick="downloadData()">Descargar respaldo JSON</button>
                <button class="table-btn danger-btn" onclick="resetDemoData(event)">Restaurar datos iniciales</button>
            </div>
        </div>
    `;
}

function statCard(icon, number, label, color, action) {
    return `
        <button class="stat-card stat-action" onclick="${action}" type="button">
            <div class="stat-icon ${color}"><i class="bi ${icon}"></i></div>
            <h3>${number}</h3>
            <p>${label}</p>
        </button>
    `;
}

function studentCards(students) {
    if (!students.length) {
        return emptyState("No hay estudiantes con ese criterio.");
    }

    return students.map(student => `
        <div class="student-card">
            <div class="student-avatar">${initials(fullName(student))}</div>
            <h3>${fullName(student)}</h3>
            <p>${student.grado} | ${student.discapacidad}</p>
            <span class="student-status ${statusClass(student.estado)}">${labelStatus(student.estado)}</span>
            <div class="student-meta">
                <strong>Diagnostico:</strong>
                <span>${student.diagnostico}</span>
            </div>
            <div class="student-actions">
                <button class="table-btn" onclick="viewStudent(${student.id})">Ver</button>
                <button class="table-btn" onclick="openStudentModal(${student.id})">Editar</button>
            </div>
        </div>
    `).join("");
}

function teacherCards(teachers) {
    if (!teachers.length) {
        return emptyState("No hay docentes con ese criterio.");
    }

    return teachers.map(teacher => `
        <div class="student-card">
            <div class="student-avatar">${initials(fullTeacherName(teacher))}</div>
            <h3>${fullTeacherName(teacher)}</h3>
            <p>${teacher.cargo} | ${teacher.area}</p>
            <div class="student-meta">
                <strong>Correo:</strong>
                <span>${teacher.correo}</span>
            </div>
            <div class="student-actions">
                <button class="table-btn" onclick="viewTeacher(${teacher.id})">Ver</button>
                <button class="table-btn" onclick="openTeacherModal(${teacher.id})">Editar</button>
            </div>
        </div>
    `).join("");
}

function piarCards(piars) {
    if (!piars.length) {
        return emptyState("No hay PIAR/PR con ese criterio.");
    }

    return piars.map(piar => {
        const student = getStudent(piar.studentId);
        const teacher = getTeacher(piar.teacherId);
        const progress = getPIARProgress(piar);

        return `
            <div class="piar-card">
                <div class="piar-top">
                    <h3>${student ? fullName(student) : "Estudiante no asignado"}</h3>
                    <span class="piar-status ${statusClass(piar.estado)}">${labelStatus(piar.estado)}</span>
                </div>
                <p>${piar.objetivoGeneral}</p>
                <div class="detail-list">
                    <span><strong>Docente:</strong> ${teacher ? fullTeacherName(teacher) : "Sin asignar"}</span>
                    <span><strong>Periodo:</strong> ${piar.periodo}</span>
                    <span><strong>Revision:</strong> ${piar.fechaRevision}</span>
                </div>
                <div class="progress-section">
                    <div class="progress-info">
                        <span>Implementacion</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
                </div>
                <div class="student-actions">
                    <button class="btn-modern small-btn" onclick="viewPIAR(${piar.id})">Ver PIAR</button>
                    <button class="table-btn" onclick="openObservationModal(${piar.id})">Observacion</button>
                </div>
            </div>
        `;
    }).join("");
}

function recentObservationsTable() {
    const observations = state.piars.flatMap(piar => piar.observaciones.map(obs => ({
        ...obs,
        piar,
        student: getStudent(piar.studentId)
    }))).sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 6);

    if (!observations.length) {
        return emptyState("Aun no hay observaciones registradas.");
    }

    return `
        <table class="modern-table">
            <thead>
                <tr><th>Fecha</th><th>Estudiante</th><th>Tipo</th><th>Avance</th><th>Nota</th></tr>
            </thead>
            <tbody>
                ${observations.map(obs => `
                    <tr>
                        <td>${obs.fecha}</td>
                        <td>${obs.student ? fullName(obs.student) : "Sin estudiante"}</td>
                        <td>${obs.tipo}</td>
                        <td>${obs.avance}%</td>
                        <td>${obs.nota}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

function alertsTable() {
    const alerts = state.piars.filter(piar => piar.estado === "revision" || isReviewDue(piar.fechaRevision));

    if (!alerts.length) {
        return emptyState("No hay PIAR con revision pendiente.");
    }

    return `
        <table class="modern-table">
            <thead>
                <tr><th>Estudiante</th><th>Estado</th><th>Fecha revision</th><th>Responsable</th></tr>
            </thead>
            <tbody>
                ${alerts.map(piar => {
                    const student = getStudent(piar.studentId);
                    const teacher = getTeacher(piar.teacherId);
                    return `
                        <tr>
                            <td>${student ? fullName(student) : "Sin estudiante"}</td>
                            <td><span class="badge-active ${statusClass(piar.estado)}">${labelStatus(piar.estado)}</span></td>
                            <td>${piar.fechaRevision}</td>
                            <td>${teacher ? fullTeacherName(teacher) : "Sin asignar"}</td>
                        </tr>
                    `;
                }).join("")}
            </tbody>
        </table>
    `;
}

function openStudentModal(studentId = null) {
    const student = studentId ? getStudent(studentId) : null;
    const title = student ? "Editar estudiante" : "Nuevo estudiante";

    openModal(title, `
        <form onsubmit="saveStudent(event, ${studentId || "null"})" class="modal-form">
            <div class="form-grid">
                <input name="nombres" class="input-modern" placeholder="Nombres" value="${student?.nombres || ""}" required>
                <input name="apellidos" class="input-modern" placeholder="Apellidos" value="${student?.apellidos || ""}" required>
                <input name="documento" class="input-modern" placeholder="Documento" value="${student?.documento || ""}" required>
                <input name="fechaNacimiento" type="date" class="input-modern" value="${student?.fechaNacimiento || ""}">
                <select name="grado" class="input-modern">${options(state.grados, student?.grado)}</select>
                <input name="jornada" class="input-modern" placeholder="Jornada" value="${student?.jornada || ""}">
                <select name="discapacidad" class="input-modern">${options(state.discapacidades, student?.discapacidad)}</select>
                <select name="estado" class="input-modern">${options(["activo", "revision", "cerrado"], student?.estado)}</select>
                <input name="acudiente" class="input-modern" placeholder="Acudiente" value="${student?.acudiente || ""}">
                <input name="telefono" class="input-modern" placeholder="Telefono" value="${student?.telefono || ""}">
            </div>
            <textarea name="diagnostico" class="input-modern" placeholder="Diagnostico o condicion reportada" required>${student?.diagnostico || ""}</textarea>
            <textarea name="contexto" class="input-modern" placeholder="Contexto familiar y social">${student?.contexto || ""}</textarea>
            <textarea name="valoracion" class="input-modern" placeholder="Valoracion pedagogica">${student?.valoracion || ""}</textarea>
            <textarea name="fortalezas" class="input-modern" placeholder="Fortalezas separadas por coma">${(student?.fortalezas || []).join(", ")}</textarea>
            <textarea name="barreras" class="input-modern" placeholder="Barreras separadas por coma">${(student?.barreras || []).join(", ")}</textarea>
            <textarea name="apoyosRequeridos" class="input-modern" placeholder="Apoyos requeridos separados por coma">${(student?.apoyosRequeridos || []).join(", ")}</textarea>
            <textarea name="actividadesCasa" class="input-modern" placeholder="Actividades recomendadas en casa">${student?.actividadesCasa || ""}</textarea>
            <button class="btn-modern" type="submit">Guardar estudiante</button>
        </form>
    `);
}

function saveStudent(event, studentId) {
    event.preventDefault();
    const data = formData(event.target);
    const payload = {
        ...data,
        id: studentId || nextId(state.students),
        fortalezas: splitList(data.fortalezas),
        barreras: splitList(data.barreras),
        apoyosRequeridos: splitList(data.apoyosRequeridos)
    };

    if (studentId) {
        state.students = state.students.map(student => student.id === studentId ? payload : student);
    } else {
        state.students.push(payload);
    }

    saveState();
    closeModal();
    renderApp("students");
    showToastMessage("Estudiante guardado correctamente.");
}

function openTeacherModal(teacherId = null) {
    const teacher = teacherId ? getTeacher(teacherId) : null;
    openModal(teacher ? "Editar docente" : "Nuevo docente", `
        <form onsubmit="saveTeacher(event, ${teacherId || "null"})" class="modal-form">
            <div class="form-grid">
                <input name="nombres" class="input-modern" placeholder="Nombres" value="${teacher?.nombres || ""}" required>
                <input name="apellidos" class="input-modern" placeholder="Apellidos" value="${teacher?.apellidos || ""}" required>
                <input name="documento" class="input-modern" placeholder="Documento" value="${teacher?.documento || ""}">
                <input name="cargo" class="input-modern" placeholder="Cargo" value="${teacher?.cargo || ""}">
                <input name="area" class="input-modern" placeholder="Area" value="${teacher?.area || ""}" required>
                <input name="correo" type="email" class="input-modern" placeholder="Correo" value="${teacher?.correo || ""}">
                <input name="telefono" class="input-modern" placeholder="Telefono" value="${teacher?.telefono || ""}">
            </div>
            <textarea name="perfil" class="input-modern" placeholder="Perfil, funciones y responsabilidades">${teacher?.perfil || ""}</textarea>
            <button class="btn-modern" type="submit">Guardar docente</button>
        </form>
    `);
}

function saveTeacher(event, teacherId) {
    event.preventDefault();
    const payload = { ...formData(event.target), id: teacherId || nextId(state.teachers) };

    if (teacherId) {
        state.teachers = state.teachers.map(teacher => teacher.id === teacherId ? payload : teacher);
    } else {
        state.teachers.push(payload);
    }

    saveState();
    closeModal();
    renderApp("teachers");
    showToastMessage("Docente guardado correctamente.");
}

function openPIARModal() {
    openModal("Nuevo PIAR / PR", `
        <form onsubmit="savePIAR(event)" class="modal-form">
            <div class="form-grid">
                <select name="studentId" class="input-modern" required>
                    <option value="">Selecciona estudiante</option>
                    ${state.students.map(student => `<option value="${student.id}">${fullName(student)}</option>`).join("")}
                </select>
                <select name="teacherId" class="input-modern" required>
                    <option value="">Selecciona docente</option>
                    ${state.teachers.map(teacher => `<option value="${teacher.id}">${fullTeacherName(teacher)}</option>`).join("")}
                </select>
                <input name="fechaCreacion" type="date" class="input-modern" value="${today()}" required>
                <input name="fechaRevision" type="date" class="input-modern" required>
                <select name="estado" class="input-modern">${options(["activo", "revision", "cerrado"], "activo")}</select>
                <input name="periodo" class="input-modern" placeholder="Periodo" value="${state.institution.year}">
            </div>
            <textarea name="objetivoGeneral" class="input-modern" placeholder="Objetivo general" required></textarea>
            <textarea name="metas" class="input-modern" placeholder="Metas de aprendizaje y participacion"></textarea>
            <textarea name="informesSalud" class="input-modern" placeholder="Informes de salud o valoraciones aportadas"></textarea>
            <textarea name="proyectos" class="input-modern" placeholder="Proyectos o actividades institucionales vinculadas"></textarea>
            <h4>Ajuste inicial</h4>
            <div class="form-grid">
                <input name="area" class="input-modern" placeholder="Area" required>
                <input name="tipo" class="input-modern" placeholder="Tipo de ajuste" required>
                <input name="responsable" class="input-modern" placeholder="Responsable" required>
                <input name="avance" type="number" min="0" max="100" class="input-modern" placeholder="Avance %" value="0">
            </div>
            <textarea name="estrategia" class="input-modern" placeholder="Estrategia pedagogica" required></textarea>
            <textarea name="recursos" class="input-modern" placeholder="Recursos y apoyos"></textarea>
            <button class="btn-modern" type="submit">Crear PIAR / PR</button>
        </form>
    `);
}

function savePIAR(event) {
    event.preventDefault();
    const data = formData(event.target);
    state.piars.push({
        id: nextId(state.piars),
        studentId: Number(data.studentId),
        teacherId: Number(data.teacherId),
        fechaCreacion: data.fechaCreacion,
        fechaRevision: data.fechaRevision,
        estado: data.estado,
        periodo: data.periodo,
        objetivoGeneral: data.objetivoGeneral,
        metas: data.metas,
        informesSalud: data.informesSalud,
        proyectos: data.proyectos,
        ajustes: [{
            area: data.area,
            tipo: data.tipo,
            estrategia: data.estrategia,
            recursos: data.recursos,
            responsable: data.responsable,
            avance: Number(data.avance || 0)
        }],
        observaciones: []
    });

    saveState();
    closeModal();
    renderApp("piar");
    showToastMessage("PIAR / PR creado correctamente.");
}

function openObservationModal(piarId = null) {
    openModal("Nueva observacion de seguimiento", `
        <form onsubmit="saveObservation(event)" class="modal-form">
            <select name="piarId" class="input-modern" required>
                <option value="">Selecciona PIAR / PR</option>
                ${state.piars.map(piar => {
                    const student = getStudent(piar.studentId);
                    return `<option value="${piar.id}" ${piar.id === piarId ? "selected" : ""}>${student ? fullName(student) : "Sin estudiante"} - ${piar.periodo}</option>`;
                }).join("")}
            </select>
            <div class="form-grid">
                <input name="fecha" type="date" class="input-modern" value="${today()}" required>
                <select name="tipo" class="input-modern">${options(["Seguimiento", "Alerta", "Avance", "Reunion familiar", "Comite"], "Seguimiento")}</select>
                <input name="autor" class="input-modern" placeholder="Autor" value="${state.institution.teacher}" required>
                <input name="avance" type="number" min="0" max="100" class="input-modern" placeholder="Avance %" required>
            </div>
            <textarea name="nota" class="input-modern" placeholder="Observacion, acuerdos o compromisos" required></textarea>
            <button class="btn-modern" type="submit">Guardar observacion</button>
        </form>
    `);
}

function saveObservation(event) {
    event.preventDefault();
    const data = formData(event.target);
    const piar = state.piars.find(item => item.id === Number(data.piarId));

    piar.observaciones.push({
        id: nextId(piar.observaciones),
        fecha: data.fecha,
        tipo: data.tipo,
        autor: data.autor,
        nota: data.nota,
        avance: Number(data.avance)
    });

    saveState();
    closeModal();
    renderApp(currentView);
    showToastMessage("Observacion registrada.");
}

function viewStudent(studentId) {
    const student = getStudent(studentId);
    const piar = state.piars.find(item => item.studentId === studentId);

    openModal("Perfil del estudiante", `
        <div class="student-profile">
            <div class="student-avatar large-avatar">${initials(fullName(student))}</div>
            <h2>${fullName(student)}</h2>
            <p>${student.grado} | ${student.discapacidad} | ${labelStatus(student.estado)}</p>
            <div class="profile-info">
                ${infoCard("Documento", student.documento)}
                ${infoCard("Acudiente", `${student.acudiente} - ${student.telefono}`)}
                ${infoCard("Diagnostico", student.diagnostico)}
                ${infoCard("Valoracion pedagogica", student.valoracion)}
                ${infoCard("Fortalezas", student.fortalezas.join(", "))}
                ${infoCard("Barreras", student.barreras.join(", "))}
                ${infoCard("Apoyos", student.apoyosRequeridos.join(", "))}
                ${infoCard("PIAR vinculado", piar ? `${piar.periodo} - ${labelStatus(piar.estado)}` : "Pendiente por crear")}
            </div>
        </div>
    `);
}

function viewTeacher(teacherId) {
    const teacher = getTeacher(teacherId);
    const assigned = state.piars.filter(piar => piar.teacherId === teacherId).length;

    openModal("Perfil docente", `
        <div class="student-profile">
            <div class="student-avatar large-avatar">${initials(fullTeacherName(teacher))}</div>
            <h2>${fullTeacherName(teacher)}</h2>
            <p>${teacher.cargo} | ${teacher.area}</p>
            <div class="profile-info">
                ${infoCard("Documento", teacher.documento)}
                ${infoCard("Correo", teacher.correo)}
                ${infoCard("Telefono", teacher.telefono)}
                ${infoCard("PIAR asignados", assigned)}
                ${infoCard("Perfil", teacher.perfil)}
            </div>
        </div>
    `);
}

function viewPIAR(piarId) {
    const piar = state.piars.find(item => item.id === piarId);
    const student = getStudent(piar.studentId);
    const teacher = getTeacher(piar.teacherId);

    openModal("Documento PIAR / PR", `
        <div class="piar-detail">
            <div class="student-avatar large-avatar">${initials(fullName(student))}</div>
            <h2>${fullName(student)}</h2>
            <p>${piar.periodo} | ${labelStatus(piar.estado)} | Avance ${getPIARProgress(piar)}%</p>
            <div class="profile-info">
                ${infoCard("Docente responsable", teacher ? fullTeacherName(teacher) : "Sin asignar")}
                ${infoCard("Fecha de revision", piar.fechaRevision)}
                ${infoCard("Objetivo general", piar.objetivoGeneral)}
                ${infoCard("Metas", piar.metas)}
                ${infoCard("Informes aportados", piar.informesSalud)}
                ${infoCard("Proyectos", piar.proyectos)}
            </div>
            <h3 class="section-title">Ajustes razonables</h3>
            ${piar.ajustes.map(ajuste => `
                <div class="info-card wide-info">
                    <h4>${ajuste.area} - ${ajuste.tipo}</h4>
                    <p><strong>Estrategia:</strong> ${ajuste.estrategia}</p>
                    <p><strong>Recursos:</strong> ${ajuste.recursos}</p>
                    <p><strong>Responsable:</strong> ${ajuste.responsable}</p>
                    <p><strong>Avance:</strong> ${ajuste.avance}%</p>
                </div>
            `).join("")}
            <h3 class="section-title">Observaciones</h3>
            ${piar.observaciones.map(obs => `
                <div class="info-card wide-info">
                    <h4>${obs.fecha} | ${obs.tipo} | ${obs.avance}%</h4>
                    <p>${obs.nota}</p>
                    <small>${obs.autor}</small>
                </div>
            `).join("") || emptyState("Este PIAR aun no tiene observaciones.")}
        </div>
    `);
}

function generateReport() {
    const type = document.getElementById("reportType").value;
    const studentId = document.getElementById("reportStudent").value;
    const period = document.getElementById("reportPeriod").value;
    const date = document.getElementById("reportDate").value;
    document.getElementById("reportOutput").innerHTML = buildReportHTML(type, studentId, period, date);
    showToastMessage("Reporte generado.");
}

function buildReportHTML(type, studentId, period, date) {
    const selectedStudents = studentId === "all"
        ? state.students
        : state.students.filter(student => student.id === Number(studentId));

    const selectedPiars = state.piars.filter(piar => selectedStudents.some(student => student.id === piar.studentId));

    return `
        <article class="print-report">
            <header>
                <h2>${type}</h2>
                <p>${state.institution.name} | ${state.institution.municipio}, ${state.institution.department}</p>
                <p>Periodo: ${period} | Fecha: ${date}</p>
            </header>
            <section>
                <h3>Resumen</h3>
                <div class="report-summary">
                    <span>Estudiantes: ${selectedStudents.length}</span>
                    <span>PIAR/PR: ${selectedPiars.length}</span>
                    <span>Avance promedio: ${getAverageProgress(selectedPiars)}%</span>
                    <span>Revisiones pendientes: ${selectedPiars.filter(piar => piar.estado === "revision").length}</span>
                </div>
            </section>
            ${selectedStudents.map(student => {
                const piar = selectedPiars.find(item => item.studentId === student.id);
                const teacher = piar ? getTeacher(piar.teacherId) : null;
                return `
                    <section class="report-student">
                        <h3>${fullName(student)}</h3>
                        <p><strong>Grado:</strong> ${student.grado} <strong>Necesidad:</strong> ${student.discapacidad}</p>
                        <p><strong>Diagnostico:</strong> ${student.diagnostico}</p>
                        <p><strong>Valoracion pedagogica:</strong> ${student.valoracion}</p>
                        <p><strong>Barreras:</strong> ${student.barreras.join(", ")}</p>
                        <p><strong>Apoyos:</strong> ${student.apoyosRequeridos.join(", ")}</p>
                        ${piar ? `
                            <p><strong>Responsable:</strong> ${teacher ? fullTeacherName(teacher) : "Sin asignar"}</p>
                            <p><strong>Objetivo:</strong> ${piar.objetivoGeneral}</p>
                            <p><strong>Metas:</strong> ${piar.metas}</p>
                            <ul>
                                ${piar.ajustes.map(ajuste => `<li>${ajuste.area}: ${ajuste.estrategia} (${ajuste.avance}%)</li>`).join("")}
                            </ul>
                            <p><strong>Ultimas observaciones:</strong></p>
                            <ul>
                                ${piar.observaciones.slice(-3).map(obs => `<li>${obs.fecha} - ${obs.tipo}: ${obs.nota}</li>`).join("") || "<li>Sin observaciones registradas.</li>"}
                            </ul>
                        ` : `<p><strong>PIAR:</strong> Pendiente por crear.</p>`}
                    </section>
                `;
            }).join("")}
            <footer>
                <p>Responsable: ${state.institution.teacher}</p>
            </footer>
        </article>
    `;
}

function printReport() {
    window.print();
}

async function saveSettings() {
    state.institution = {
        name: document.getElementById("institutionName").value,
        sede: document.getElementById("institutionSede").value,
        municipio: document.getElementById("institutionMunicipio").value,
        department: document.getElementById("institutionDepartment").value,
        teacher: document.getElementById("institutionTeacher").value,
        year: document.getElementById("institutionYear").value
    };
    await saveState();
    renderApp("settings");
    showToastMessage("Configuracion guardada.");
}

function downloadData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `respaldo-piar-${today()}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

async function resetDemoData(event) {
    event?.stopPropagation();
    if (!confirm("Deseas restaurar los datos iniciales? Se perderan cambios locales.")) {
        return;
    }
    try {
        state = apiConnected ? await apiResetData() : structuredClone(window.APP_DATA);
        if (!state) {
            state = structuredClone(window.APP_DATA);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        apiConnected = false;
        state = structuredClone(window.APP_DATA);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    renderApp("dashboard");
    showToastMessage("Datos restaurados.");
}

function loadCharts() {
    Object.values(charts).forEach(chart => chart?.destroy());
    charts = {};

    const progressCtx = document.getElementById("progressChart");
    if (progressCtx && window.Chart) {
        charts.progress = new Chart(progressCtx, {
            type: "bar",
            data: {
                labels: state.piars.map(piar => fullName(getStudent(piar.studentId)).split(" ")[0]),
                datasets: [{
                    label: "Avance",
                    data: state.piars.map(getPIARProgress),
                    backgroundColor: ["#7B4DFF", "#3B82F6", "#10B981", "#F59E0B"]
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }
        });
    }

    const studentsCtx = document.getElementById("studentsChart");
    if (studentsCtx && window.Chart) {
        const distribution = countBy(state.students, "discapacidad");
        charts.students = new Chart(studentsCtx, {
            type: "doughnut",
            data: {
                labels: Object.keys(distribution),
                datasets: [{
                    data: Object.values(distribution),
                    backgroundColor: ["#7B4DFF", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"]
                }]
            },
            options: { responsive: true }
        });
    }
}

function filterStudents() {
    const term = document.getElementById("studentSearch").value.toLowerCase();
    const filtered = state.students.filter(student => searchable([
        fullName(student), student.documento, student.grado, student.diagnostico, student.discapacidad
    ], term));
    document.getElementById("studentsGrid").innerHTML = studentCards(filtered);
}

function filterTeachers() {
    const term = document.getElementById("teacherSearch").value.toLowerCase();
    const filtered = state.teachers.filter(teacher => searchable([
        fullTeacherName(teacher), teacher.area, teacher.cargo, teacher.correo
    ], term));
    document.getElementById("teachersGrid").innerHTML = teacherCards(filtered);
}

function filterPIAR() {
    const term = document.getElementById("piarSearch").value.toLowerCase();
    const filtered = state.piars.filter(piar => {
        const student = getStudent(piar.studentId);
        const teacher = getTeacher(piar.teacherId);
        return searchable([
            student ? fullName(student) : "",
            teacher ? fullTeacherName(teacher) : "",
            piar.estado,
            piar.periodo,
            piar.objetivoGeneral
        ], term);
    });
    document.getElementById("piarGrid").innerHTML = piarCards(filtered);
}

function openModal(title, body) {
    closeModal();
    document.body.insertAdjacentHTML("beforeend", `
        <div class="custom-modal-overlay" id="appModal">
            <div class="custom-modal">
                <div class="modal-header-custom">
                    <h2>${title}</h2>
                    <button class="close-modal" onclick="closeModal()"><i class="bi bi-x-lg"></i></button>
                </div>
                <div class="modal-body-custom">${body}</div>
            </div>
        </div>
    `);
}

function closeModal() {
    document.getElementById("appModal")?.remove();
}

function showToastMessage(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `custom-toast ${type}`;
    toast.innerHTML = `<i class="bi bi-check-circle-fill"></i>${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show-toast"), 100);
    setTimeout(() => toast.remove(), 3000);
}

function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("sidebar-collapsed");
}

function toggleProfileMenu() {
    document.getElementById("profileDropdown")?.classList.toggle("show-profile-menu");
}

function getAuthUsers() {
    const saved = localStorage.getItem(AUTH_USERS_KEY);
    if (saved) {
        return JSON.parse(saved);
    }

    const users = state.auth.users || [
        {
            id: 1,
            name: state.institution.teacher,
            email: state.auth.validEmail,
            password: state.auth.validPassword,
            provider: "email",
            role: "Administrador"
        }
    ];
    saveAuthUsers(users);
    return users;
}

function saveAuthUsers(users) {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function getStudent(id) {
    return state.students.find(student => student.id === Number(id));
}

function getTeacher(id) {
    return state.teachers.find(teacher => teacher.id === Number(id));
}

function fullName(student) {
    return `${student.nombres} ${student.apellidos}`;
}

function fullTeacherName(teacher) {
    return `${teacher.nombres} ${teacher.apellidos}`;
}

function initials(name) {
    return name.split(" ").filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
}

function nextId(items) {
    return items.length ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

function formData(form) {
    return Object.fromEntries(new FormData(form).entries());
}

function splitList(value) {
    return value.split(",").map(item => item.trim()).filter(Boolean);
}

function options(items, selected) {
    return items.map(item => `<option value="${item}" ${item === selected ? "selected" : ""}>${labelStatus(item)}</option>`).join("");
}

function today() {
    return new Date().toISOString().slice(0, 10);
}

function getPIARProgress(piar) {
    const values = [
        ...piar.ajustes.map(ajuste => Number(ajuste.avance || 0)),
        ...piar.observaciones.map(obs => Number(obs.avance || 0))
    ];
    if (!values.length) {
        return 0;
    }
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function getAverageProgress(piars = state.piars) {
    if (!piars.length) {
        return 0;
    }
    return Math.round(piars.map(getPIARProgress).reduce((sum, value) => sum + value, 0) / piars.length);
}

function countBy(items, key) {
    return items.reduce((result, item) => {
        result[item[key]] = (result[item[key]] || 0) + 1;
        return result;
    }, {});
}

function searchable(values, term) {
    return values.join(" ").toLowerCase().includes(term);
}

function statusClass(status) {
    return `status-${status}`;
}

function labelStatus(value) {
    const labels = {
        activo: "Activo",
        revision: "En revision",
        cerrado: "Cerrado"
    };
    return labels[value] || value;
}

function isReviewDue(date) {
    const review = new Date(date);
    const limit = new Date();
    limit.setDate(limit.getDate() + 15);
    return review <= limit;
}

function infoCard(title, value) {
    return `
        <div class="info-card">
            <h4>${title}</h4>
            <p>${value || "Sin registrar"}</p>
        </div>
    `;
}

function emptyState(message) {
    return `<div class="empty-state">${message}</div>`;
}
