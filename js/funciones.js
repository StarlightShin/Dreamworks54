const app = Vue.createApp({

  data() {
    return {
      urlApi: "https://spapi.dev/api/characters",
      personajes: [],
      personajesFiltrados: [],
      textoBusqueda: "",
      sexoSeleccionado: "Todos",
      modalAbierto: false,
      personajeSeleccionado: null
    }
  },

  created() {
    this.cargarPersonajes();
  },

  computed: {

    cantidadFiltrados() {
      return this.personajesFiltrados.length;
    },

    porcentajeProgreso() {
      let total = this.personajes.length || 1;
      return Math.round((this.cantidadFiltrados / total) * 100);
    },

    htmlDetalle() {
      if (!this.personajeSeleccionado) return "";

      let eps = this.personajeSeleccionado.episodes
        ? this.personajeSeleccionado.episodes.length
        : 0;

      return `<strong>Episodios:</strong> ${eps}`;
    }
  },

  methods: {

    cargarPersonajes() {
      axios.get(this.urlApi)
        .then(res => {
          this.personajes = res.data.data;
          this.personajesFiltrados = this.personajes;
        })
        .catch(() => {
          alert("Error al cargar API");
        });
    },

    aplicarFiltros() {
      let texto = this.textoBusqueda.toLowerCase();

      this.personajesFiltrados = this.personajes.filter(p => {
        let nombre = (p.name || "").toLowerCase();
        let sexo = p.sex || "Unknown";

        if (texto && !nombre.includes(texto)) return false;
        if (this.sexoSeleccionado !== "Todos" &&
            sexo !== this.sexoSeleccionado) return false;

        return true;
      });
    },

    abrirModal(p) {
      this.personajeSeleccionado = p;
      this.modalAbierto = true;
    },

    cerrarModal() {
      this.modalAbierto = false;
      this.personajeSeleccionado = null;
    },

    imagenPorNombre(nombre) {
      return `./assets/${nombre}.png`;
    }

  }

});

app.mount("#app");