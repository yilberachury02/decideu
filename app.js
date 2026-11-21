// =============================================================
// DecideU – Lógica del prototipo
// =============================================================

const App = {
  state: {
    user: null,
    location: null,       // { name, lat, lng }
    answers: [],          // valor de cada pregunta
    current: 0,           // pregunta actual
    results: [],          // carreras recomendadas
    scores: {},           // puntaje por área (0-100)
    career: null,         // carrera elegida
    university: null      // universidad elegida
  },
  map: null,
  flow: ["welcome", "register", "location", "test", "results", "universities", "detail", "saved"],

  // ---------- Navegación ----------
  go(screen) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(screen).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.renderSteps(screen);
    if (screen === "universities" && this.map) setTimeout(() => this.map.invalidateSize(), 50);
  },

  renderSteps(screen) {
    const idx = this.flow.indexOf(screen);
    document.getElementById("steps").innerHTML = this.flow
      .map((_, i) => `<span class="${i <= idx ? "done" : ""}"></span>`).join("");
  },

  // ---------- Guardar en el navegador ----------
  save() {
    try { localStorage.setItem("decideu", JSON.stringify(this.state)); } catch (e) { /* sin almacenamiento */ }
  },

  // ---------- Inicio ----------
  init() {
    this.renderSteps("welcome");

    // Registro
    document.getElementById("registerForm").addEventListener("submit", e => {
      e.preventDefault();
      this.state.user = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        age: document.getElementById("age").value,
        stage: document.getElementById("stage").value
      };
      this.save();
      this.go("location");
    });

    // Ubicación
    const select = document.getElementById("townSelect");
    select.innerHTML = `<option value="">Selecciona tu municipio</option>` +
      TOWNS.map((t, i) => `<option value="${i}">${t.name}</option>`).join("");
    select.addEventListener("change", () => {
      if (select.value === "") return;
      this.state.location = { ...TOWNS[select.value] };
      this.setLocStatus(`✅ Ubicación: ${this.state.location.name}`);
    });
    document.getElementById("gpsBtn").addEventListener("click", () => this.useGPS());
    document.getElementById("locContinue").addEventListener("click", () => {
      if (!this.state.location) { this.setLocStatus("⚠️ Elige tu municipio o usa tu ubicación."); return; }
      this.save();
      this.startTest();
    });

    // Test
    document.getElementById("prevQ").addEventListener("click", () => {
      if (this.state.current > 0) { this.state.current--; this.renderQuestion(); }
    });
  },

  setLocStatus(msg) { document.getElementById("locStatus").textContent = msg; },

  useGPS() {
    if (!navigator.geolocation) { this.setLocStatus("Tu navegador no permite ubicación. Elige tu municipio."); return; }
    this.setLocStatus("Buscando tu ubicación…");
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude, lng = pos.coords.longitude;
        // Se toma el municipio de la lista más cercano para mostrar un nombre
        const nearest = TOWNS.map(t => ({ ...t, d: this.distance(lat, lng, t.lat, t.lng) }))
          .sort((a, b) => a.d - b.d)[0];
        this.state.location = { name: `cerca de ${nearest.name}`, lat, lng };
        this.setLocStatus(`✅ Ubicación encontrada (${this.state.location.name})`);
      },
      () => this.setLocStatus("No pudimos obtener tu ubicación. Elige tu municipio en la lista."),
      { timeout: 8000 }
    );
  },

  // ---------- Test ----------
  startTest() {
    this.state.answers = new Array(QUESTIONS.length).fill(null);
    this.state.current = 0;
    this.renderQuestion();
    this.go("test");
  },

  restartTest() { this.startTest(); },

  renderQuestion() {
    const i = this.state.current;
    const q = QUESTIONS[i];
    document.getElementById("qCounter").textContent = `Pregunta ${i + 1} de ${QUESTIONS.length}`;
    document.getElementById("qText").textContent = q.text;
    document.getElementById("testBar").style.width = `${(i / QUESTIONS.length) * 100}%`;
    document.getElementById("prevQ").style.visibility = i === 0 ? "hidden" : "visible";

    const box = document.getElementById("answers");
    box.innerHTML = "";
    ANSWERS.forEach(a => {
      const b = document.createElement("button");
      b.className = "answer" + (this.state.answers[i] === a.value ? " selected" : "");
      b.textContent = a.label;
      b.onclick = () => this.answer(a.value);
      box.appendChild(b);
    });
  },

  answer(value) {
    this.state.answers[this.state.current] = value;
    if (this.state.current < QUESTIONS.length - 1) {
      this.state.current++;
      this.renderQuestion();
    } else {
      document.getElementById("testBar").style.width = "100%";
      this.go("loading");
      setTimeout(() => { this.calculate(); this.go("results"); }, 1800);
    }
  },

  // ---------- Motor de recomendación ----------
  // 1) Calcula un puntaje de 0 a 100 por área.
  // 2) Compara ese perfil con el perfil de cada carrera (similitud coseno).
  calculate() {
    const totals = {}, counts = {};
    Object.keys(AREAS).forEach(k => { totals[k] = 0; counts[k] = 0; });
    QUESTIONS.forEach((q, i) => { totals[q.area] += this.state.answers[i] || 0; counts[q.area]++; });

    const scores = {};
    Object.keys(AREAS).forEach(k => { scores[k] = Math.round((totals[k] / (counts[k] * 4)) * 100); });
    this.state.scores = scores;

    const keys = Object.keys(AREAS);
    const user = keys.map(k => scores[k] / 100);
    const uLen = Math.hypot(...user) || 1;

    this.state.results = CAREERS.map(c => {
      const v = keys.map(k => c.profile[k] || 0);
      const dot = v.reduce((s, x, i) => s + x * user[i], 0);
      const sim = dot / (Math.hypot(...v) * uLen);
      return { ...c, match: Math.round(Math.max(0, Math.min(1, sim)) * 100) };
    }).sort((a, b) => b.match - a.match).slice(0, 3);

    this.save();
    this.renderResults();
  },

  renderResults() {
    const s = this.state.scores;
    const top = Object.keys(s).sort((a, b) => s[b] - s[a]).slice(0, 2);
    document.getElementById("resultsTitle").textContent = `${this.state.user?.name || "Hola"}, este es tu perfil`;
    document.getElementById("profileText").textContent =
      `Tu perfil es principalmente ${AREAS[top[0]].name} y ${AREAS[top[1]].name}: ${AREAS[top[0]].desc}, y ${AREAS[top[1]].desc}.`;

    document.getElementById("profileBars").innerHTML = Object.keys(AREAS).map(k => `
      <div class="pbar"><small><span>${AREAS[k].name}</span><span>${s[k]} %</span></small>
      <div class="track"><div class="fill" style="width:${s[k]}%"></div></div></div>`).join("");

    document.getElementById("careerGrid").innerHTML = this.state.results.map((c, i) => `
      <div class="career">
        <span class="small muted">Opción ${i + 1}</span>
        <h3 style="margin:0">${c.name}</h3>
        <div class="match">${c.match} % <small>de compatibilidad</small></div>
        <p>${c.desc}</p>
        <div class="tags">${c.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
        <button class="btn primary full" onclick="App.showUniversities('${c.id}')">Ver universidades cerca</button>
      </div>`).join("");
  },

  // ---------- Universidades cercanas ----------
  distance(lat1, lng1, lat2, lng2) {
    const R = 6371, toRad = x => x * Math.PI / 180;
    const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  },

  money(n) { return "$" + n.toLocaleString("es-CO"); },

  showUniversities(careerId) {
    const career = CAREERS.find(c => c.id === careerId);
    this.state.career = career;
    const loc = this.state.location;

    const list = UNIVERSITIES
      .filter(u => u.programs[careerId])
      .map(u => ({ ...u, cost: u.programs[careerId], km: this.distance(loc.lat, loc.lng, u.lat, u.lng) }))
      .sort((a, b) => a.km - b.km);
    this.currentList = list;

    document.getElementById("uniTitle").textContent = `${career.name} cerca de ti`;
    document.getElementById("uniSubtitle").textContent = list.length
      ? `Encontramos ${list.length} instituciones ordenadas por distancia desde ${loc.name}.`
      : "Todavía no tenemos instituciones con este programa en nuestra base de datos.";

    document.getElementById("uniList").innerHTML = list.map((u, i) => `
      <div class="uni" onclick="App.showDetail(${i})">
        <div class="row"><b>${u.name}</b><span class="dist">${u.km.toFixed(1)} km</span></div>
        <small>${u.town} · Semestre desde ${this.money(u.cost)}</small><br>
        <span class="badge ${u.type === "Pública" ? "pub" : "priv"}">${u.type}</span>
      </div>`).join("");

    this.go("universities");
    this.drawMap(list);
  },

  drawMap(list) {
    const el = document.getElementById("map");
    if (typeof L === "undefined") {
      el.innerHTML = `<p class="muted" style="padding:20px">El mapa necesita internet. La lista de la derecha funciona igual.</p>`;
      return;
    }
    if (this.map) this.map.remove();
    const loc = this.state.location;
    this.map = L.map("map").setView([loc.lat, loc.lng], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(this.map);

    L.circleMarker([loc.lat, loc.lng], { radius: 10, color: "#ff8a3d", fillOpacity: .9 })
      .addTo(this.map).bindPopup("Tú estás aquí");

    const bounds = [[loc.lat, loc.lng]];
    list.forEach((u, i) => {
      L.marker([u.lat, u.lng]).addTo(this.map)
        .bindPopup(`<b>${u.name}</b><br>${u.km.toFixed(1)} km<br><a href="#" onclick="App.showDetail(${i});return false;">Ver costos y becas</a>`);
      bounds.push([u.lat, u.lng]);
    });
    if (bounds.length > 1) this.map.fitBounds(bounds, { padding: [30, 30] });
  },

  // ---------- Costos y apoyos ----------
  showDetail(i) {
    const u = this.currentList[i];
    this.state.university = u;
    const c = this.state.career;
    const supports = SUPPORTS.filter(s =>
      s.applies === "all" || s.applies === u.type ||
      (s.applies === "local" && u.km < 25));

    document.getElementById("detailContent").innerHTML = `
      <div class="detail-head">
        <span class="pill" style="background:#ffffff33;color:#fff">${u.type} · ${u.km.toFixed(1)} km de ti</span>
        <h2 style="margin-top:10px">${c.name}</h2>
        <p>${u.name} – ${u.town}</p>
      </div>
      <div class="detail-grid">
        <div class="card cost-box">
          <h3 style="margin-top:0">💰 Costo</h3>
          <p class="muted">Valor de referencia por semestre</p>
          <div class="price">${this.money(u.cost)}</div>
          <p class="muted small">Carrera de 8 a 10 semestres aprox. Total estimado: ${this.money(u.cost * 9)}</p>
          <a class="btn secondary full" style="display:block;text-align:center;text-decoration:none" href="${u.web}" target="_blank">Ir a la página oficial</a>
          <div class="demo-note">⚠️ Datos de demostración del prototipo. Verifica el valor real en la página de la universidad.</div>
        </div>
        <div class="card">
          <h3 style="margin-top:0">🎁 Becas, descuentos y apoyos para ti</h3>
          <p class="muted small">Según el tipo de institución y tu ubicación (${this.state.location.name}).</p>
          ${supports.map(s => `
            <div class="support">
              <b>${s.name}</b>
              <span class="small muted">${s.scope}</span>
              <p class="small" style="margin:6px 0">${s.detail}</p>
              <span class="save">${s.saving}</span>
            </div>`).join("")}
          <button class="btn primary full" onclick="App.finish()">Guardar mi plan</button>
        </div>
      </div>`;
    this.save();
    this.go("detail");
  },

  finish() {
    const { user, career, university, location } = this.state;
    document.getElementById("planSummary").innerHTML = `
      👤 <b>${user?.name || ""}</b> · ${location.name}<br>
      🎓 Carrera: <b>${career.name}</b><br>
      🏫 Universidad: <b>${university.name}</b> (${university.km.toFixed(1)} km)<br>
      💰 Semestre desde: <b>${this.money(university.cost)}</b><br>
      🎁 Siguiente paso: revisar becas y créditos y la fecha de inscripciones.`;
    this.save();
    this.go("saved");
  }
};

document.addEventListener("DOMContentLoaded", () => App.init());
