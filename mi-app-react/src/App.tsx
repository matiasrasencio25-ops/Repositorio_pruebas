import { useEffect, useState } from 'react'
import './App.css'

const topGames = [
  { title: 'The Legend of Zelda: Ocarina of Time', platform: 'Nintendo 64', year: 1998, score: 99, accent: '#b51f2b', image: 'https://upload.wikimedia.org/wikipedia/en/5/57/The_Legend_of_Zelda_Ocarina_of_Time.jpg', metacritic: 'the-legend-of-zelda-ocarina-of-time', review: 'Una aventura que convirtió la exploración 3D en un lenguaje propio, con mazmorras memorables y un ritmo todavía ejemplar.' },
  { title: 'Tony Hawk’s Pro Skater 2', platform: 'PlayStation', year: 2000, score: 98, accent: '#262b35', image: 'https://upload.wikimedia.org/wikipedia/en/6/6d/Tony_Hawks_Pro_Skater_2_cover.jpg', metacritic: 'tony-hawks-pro-skater-2', review: 'Controles precisos, niveles compactos y una banda sonora icónica: una fórmula arcade pulida casi hasta la perfección.' },
  { title: 'SoulCalibur', platform: 'Dreamcast', year: 1999, score: 98, accent: '#8b1e3f', image: 'https://upload.wikimedia.org/wikipedia/en/7/7e/Soulcalibur_Coverart.png', metacritic: 'soulcalibur', review: 'Combates accesibles y profundos que aprovechan el movimiento tridimensional para hacer que cada duelo se sienta distinto.' },
  { title: 'Grand Theft Auto IV', platform: 'Xbox 360', year: 2008, score: 98, accent: '#344b62', image: 'https://upload.wikimedia.org/wikipedia/en/b/b7/Grand_Theft_Auto_IV_cover.jpg', metacritic: 'grand-theft-auto-iv', review: 'Una historia criminal más sobria y una ciudad viva sostienen uno de los mundos abiertos más influyentes de su generación.' },
  { title: 'Super Mario Galaxy', platform: 'Wii', year: 2007, score: 97, accent: '#1d6091', image: 'https://upload.wikimedia.org/wikipedia/en/7/76/SuperMarioGalaxy.jpg', metacritic: 'super-mario-galaxy', review: 'Ideas gravitacionales, mundos diminutos y una imaginación desbordante convierten cada nivel en una pequeña sorpresa.' },
  { title: 'Super Mario Galaxy 2', platform: 'Wii', year: 2010, score: 97, accent: '#bf332d', image: 'https://upload.wikimedia.org/wikipedia/en/6/69/Super_Mario_Galaxy_2_Box_Art.jpg', metacritic: 'super-mario-galaxy-2', review: 'Toma la creatividad del original y la concentra en una sucesión de desafíos de plataformas especialmente inspirados.' },
  { title: 'The Legend of Zelda: Breath of the Wild', platform: 'Nintendo Switch', year: 2017, score: 97, accent: '#628b78', image: 'https://upload.wikimedia.org/wikipedia/en/0/0d/The_Legend_of_Zelda_Breath_of_the_Wild.jpg', metacritic: 'the-legend-of-zelda-breath-of-the-wild', review: 'Su mundo abierto premia la curiosidad y permite resolver problemas con libertad, física y una gran sensación de descubrimiento.' },
  { title: 'Red Dead Redemption 2', platform: 'PlayStation 4', year: 2018, score: 97, accent: '#71372d', image: 'https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg', metacritic: 'red-dead-redemption-2', review: 'Un western paciente y detallista que construye personajes complejos dentro de un mundo amplio, reactivo y atmosférico.' },
  { title: 'Perfect Dark', platform: 'Nintendo 64', year: 2000, score: 97, accent: '#283a49', image: 'https://upload.wikimedia.org/wikipedia/en/8/8e/Perfect_Dark_%28N64%29_cover.jpg', metacritic: 'perfect-dark', review: 'Acción y sigilo con una campaña ambiciosa y opciones multijugador que ampliaron notablemente el molde del shooter.' },
  { title: 'The Legend of Zelda: The Wind Waker', platform: 'GameCube', year: 2003, score: 96, accent: '#287e9a', image: 'https://upload.wikimedia.org/wikipedia/en/3/3d/The_Legend_of_Zelda_The_Wind_Waker.jpg', metacritic: 'the-legend-of-zelda-the-wind-waker', review: 'Su estilo visual permanece distintivo y su navegación convierte el océano en una invitación constante a explorar.' },
].sort((first, second) => second.score - first.score)

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [authMode, setAuthMode] = useState<'login' | 'registro'>('login')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')
  const [compactMode, setCompactMode] = useState(() => localStorage.getItem('compactMode') === 'true')
  const [showApiStatus, setShowApiStatus] = useState(true)
  const [apiResponse, setApiResponse] = useState('Conectando con el backend...')
  const [usuarios, setUsuarios] = useState<{ id: number; nombre: string; email: string }[]>([])
  const [usuariosLoading, setUsuariosLoading] = useState(false)
  const [usuariosError, setUsuariosError] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [userFilter, setUserFilter] = useState<'todos' | 'nombre' | 'email'>('todos')
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null)
  const [deleteUserError, setDeleteUserError] = useState('')
  const [editingUser, setEditingUser] = useState<{ id: number; nombre: string; email: string } | null>(null)
  const [editUserName, setEditUserName] = useState('')
  const [editUserEmail, setEditUserEmail] = useState('')
  const [editUserMessage, setEditUserMessage] = useState('')
  const [editUserLoading, setEditUserLoading] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [addUserMessage, setAddUserMessage] = useState('')
  const [addUserLoading, setAddUserLoading] = useState(false)
  const [selectedGame, setSelectedGame] = useState<typeof topGames[number] | null>(null)
  const [page, setPage] = useState<'inicio' | 'directorio' | 'juegos'>(() => window.location.pathname === '/directorio' ? 'directorio' : window.location.pathname === '/juegos' ? 'juegos' : 'inicio')

  useEffect(() => {
    document.body.dataset.theme = darkMode ? 'dark' : 'light'
  }, [darkMode])

  useEffect(() => {
    function handleHistoryChange() {
      setPage(window.location.pathname === '/directorio' ? 'directorio' : window.location.pathname === '/juegos' ? 'juegos' : 'inicio')
    }

    window.addEventListener('popstate', handleHistoryChange)
    return () => window.removeEventListener('popstate', handleHistoryChange)
  }, [])

  useEffect(() => {
    function closeGameDetails(event: KeyboardEvent) {
      if (event.key === 'Escape') setSelectedGame(null)
    }

    window.addEventListener('keydown', closeGameDetails)
    return () => window.removeEventListener('keydown', closeGameDetails)
  }, [])

  useEffect(() => {
    if (!token) return

    fetch('http://localhost:3000/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudo conectar con el backend')
        }
        return response.text()
      })
      .then(setApiResponse)
      .catch(() => setApiResponse('No se pudo conectar con el backend'))

    loadUsuarios()
  }, [token])

  async function loadUsuarios() {
    setUsuariosLoading(true)
    setUsuariosError('')

    try {
      const response = await fetch('http://localhost:3000/usuarios')
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudieron cargar los usuarios')
        }
        return response.json()
      })
      setUsuarios(response)
    } catch {
      setUsuariosError('No se pudieron cargar los usuarios desde PostgreSQL')
    } finally {
      setUsuariosLoading(false)
    }
  }

  async function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthMessage('')
    setAuthLoading(true)

    try {
      const response = await fetch(`http://localhost:3000/${authMode === 'login' ? 'login' : 'registro'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authMode === 'login' ? { email, password } : { nombre, email, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'No se pudo completar la operación')

      if (authMode === 'registro') {
        setAuthMode('login')
        setNombre('')
        setPassword('')
        setAuthMessage('Registro exitoso. Ahora puedes iniciar sesión.')
      } else {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      }
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : 'Ocurrió un error')
    } finally {
      setAuthLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    setToken(null)
    setUsuarios([])
  }

  function toggleDarkMode() {
    setDarkMode((enabled) => {
      localStorage.setItem('darkMode', String(!enabled))
      return !enabled
    })
  }

  function toggleCompactMode() {
    setCompactMode((enabled) => {
      localStorage.setItem('compactMode', String(!enabled))
      return !enabled
    })
  }

  function navigateTo(nextPage: 'inicio' | 'directorio' | 'juegos') {
    const path = nextPage === 'directorio' ? '/directorio' : nextPage === 'juegos' ? '/juegos' : '/'
    window.history.pushState({}, '', path)
    setPage(nextPage)
  }

  async function handleAddUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAddUserMessage('')
    setAddUserLoading(true)

    try {
      const response = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: newUserName, email: newUserEmail }),
      })
      const responseText = await response.text()
      let data: { id?: number; nombre?: string; email?: string; error?: string }
      try {
        data = JSON.parse(responseText)
      } catch {
        throw new Error('El backend no está disponible o la ruta /usuarios no existe')
      }
      if (!response.ok) throw new Error(data.error || 'No se pudo agregar el usuario')

      setUsuarios((currentUsers) => [...currentUsers, data as { id: number; nombre: string; email: string }])
      setNewUserName('')
      setNewUserEmail('')
      setAddUserMessage(`Usuario agregado con ID ${data.id}`)
    } catch (error) {
      setAddUserMessage(error instanceof Error ? error.message : 'Ocurrió un error')
    } finally {
      setAddUserLoading(false)
    }
  }

  async function handleDeleteUser(usuario: { id: number; nombre: string }) {
    if (!window.confirm(`¿Eliminar a ${usuario.nombre}?`)) return

    setDeleteUserError('')
    setDeletingUserId(usuario.id)
    try {
      const response = await fetch(`http://localhost:3000/usuarios/${usuario.id}`, { method: 'DELETE' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'No se pudo eliminar el usuario')
      setUsuarios((currentUsers) => currentUsers.filter((currentUser) => currentUser.id !== usuario.id))
    } catch (error) {
      setDeleteUserError(error instanceof Error ? error.message : 'No se pudo eliminar el usuario')
    } finally {
      setDeletingUserId(null)
    }
  }

  function openEditUser(usuario: { id: number; nombre: string; email: string }) {
    setEditingUser(usuario)
    setEditUserName(usuario.nombre)
    setEditUserEmail(usuario.email)
    setEditUserMessage('')
  }

  async function handleEditUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editingUser) return
    setEditUserMessage('')
    setEditUserLoading(true)

    try {
      const response = await fetch(`http://localhost:3000/usuarios/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: editUserName, email: editUserEmail }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'No se pudo actualizar el usuario')
      setUsuarios((currentUsers) => currentUsers.map((usuario) => usuario.id === data.id ? data : usuario))
      setEditingUser(null)
    } catch (error) {
      setEditUserMessage(error instanceof Error ? error.message : 'No se pudo actualizar el usuario')
    } finally {
      setEditUserLoading(false)
    }
  }

  if (!token) {
    return (
      <main className="auth-page">
        <section className="auth-intro">
          <div className="brand-mark" aria-hidden="true">SA</div>
          <p className="eyebrow accent-label">SALMONES AYSEN</p>
          <h1>Tu operación,<br /><em>siempre cerca.</em></h1>
          <p>Accede al panel para consultar y administrar los usuarios de tu aplicación.</p>
          <div className="auth-line" />
          <small>Plataforma interna · Acceso seguro</small>
        </section>
        <section className="auth-panel" aria-labelledby="auth-title">
          <div className="auth-heading">
            <p className="eyebrow">{authMode === 'login' ? 'BIENVENIDO DE VUELTA' : 'NUEVO ACCESO'}</p>
            <h2 id="auth-title">{authMode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}</h2>
            <p>{authMode === 'login' ? 'Ingresa tus datos para continuar.' : 'Completa tus datos para registrarte.'}</p>
          </div>
          <form onSubmit={handleAuthSubmit}>
            {authMode === 'registro' && (
              <label>Nombre<input value={nombre} onChange={(event) => setNombre(event.target.value)} required autoComplete="name" /></label>
            )}
            <label>Correo electrónico<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>
            <label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} /></label>
            {authMessage && <p className="auth-message">{authMessage}</p>}
            <button className="auth-submit" type="submit" disabled={authLoading}>{authLoading ? 'Procesando...' : authMode === 'login' ? 'Entrar al panel →' : 'Crear cuenta →'}</button>
          </form>
          <p className="auth-switch">{authMode === 'login' ? '¿Aún no tienes una cuenta?' : '¿Ya tienes una cuenta?'} <button type="button" onClick={() => { setAuthMode(authMode === 'login' ? 'registro' : 'login'); setAuthMessage('') }}>{authMode === 'login' ? 'Regístrate' : 'Inicia sesión'}</button></p>
        </section>
      </main>
    )
  }

  const isDirectory = page === 'directorio'
  const isGames = page === 'juegos'
  const filteredUsers = usuarios.filter((usuario) => {
    const search = userSearch.trim().toLowerCase()
    if (!search) return true
    const value = userFilter === 'email' ? usuario.email : userFilter === 'nombre' ? usuario.nombre : `${usuario.nombre} ${usuario.email}`
    return value.toLowerCase().includes(search)
  })
  const emailDomains = new Set(usuarios.map((usuario) => usuario.email.split('@')[1]?.toLowerCase()).filter(Boolean)).size
  const recentUsers = [...usuarios].sort((first, second) => second.id - first.id).slice(0, 4)

  return (
    <main className={`app-shell${darkMode ? ' dark-mode' : ''}${compactMode ? ' compact-mode' : ''}`}>
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">SA</div>
        <div>
          <p className="eyebrow">SALMONES AYSEN</p>
          <p className="brand-name">Panel de usuarios</p>
        </div>
        <span className="environment">● Desarrollo</span>
        <button className="settings-button" type="button" onClick={() => setSettingsOpen(true)} aria-label="Abrir ajustes">⚙ <span>Ajustes</span></button>
        <button className="nav-button" type="button" onClick={() => navigateTo(isGames ? 'inicio' : 'juegos')}>{isGames ? 'Inicio' : 'Juegos'}</button>
        <button className="logout-button" type="button" onClick={handleLogout}>Cerrar sesión</button>
      </header>

      <section className="welcome">
        <div className="welcome-copy">
          <p className="eyebrow accent-label">{isGames ? 'SELECCIÓN EDITORIAL' : isDirectory ? 'DIRECTORIO DE USUARIOS' : 'GESTIÓN CENTRALIZADA'}</p>
          <h1>{isGames ? <>Los juegos que<br /><em>hicieron historia.</em></> : isDirectory ? <>Todos tus usuarios<br /><em>en un solo lugar.</em></> : <>Personas conectadas<br /><em>a tu operación.</em></>}</h1>
          <p className="intro">{isGames ? 'Los 10 títulos con las puntuaciones más altas de Metacritic, ordenados para descubrir qué los hizo destacar.' : isDirectory ? 'Revisa los usuarios registrados en la base de datos PostgreSQL.' : 'Consulta los usuarios registrados y verifica en tiempo real la conexión entre tu aplicación y PostgreSQL.'}</p>
          <div className="page-actions">
            <button className="page-button" type="button" onClick={() => navigateTo(isGames || isDirectory ? 'inicio' : 'directorio')}>
              {isGames || isDirectory ? '← Volver al inicio' : 'Ver directorio completo →'}
            </button>
            {!isGames && !isDirectory && <button className="page-button secondary" type="button" onClick={() => navigateTo('juegos')}>Explorar top 10 de juegos →</button>}
          </div>
        </div>
        {showApiStatus && <div className="api-status">
          <div className="status-icon">↗</div>
          <div>
            <p className="status-label">Estado de la API</p>
            <strong>{apiResponse}</strong>
          </div>
          <span className="status-dot" aria-label="API conectada" />
        </div>}
      </section>

      {!isDirectory && !isGames && <section className="dashboard" aria-labelledby="dashboard-title">
        <div className="section-heading">
          <div><p className="eyebrow accent-label">RESUMEN OPERATIVO</p><h2 id="dashboard-title">Vista general</h2></div>
          <span className="dashboard-date">Actualizado ahora</span>
        </div>
        <div className="dashboard-stats">
          <article className="stat-card stat-card-primary"><span className="stat-label">Usuarios registrados</span><strong>{usuariosLoading ? '—' : usuarios.length}</strong><small>Registros disponibles</small></article>
          <article className="stat-card"><span className="stat-label">Dominios de correo</span><strong>{usuariosLoading ? '—' : emailDomains}</strong><small>Dominios representados</small></article>
          <article className="stat-card"><span className="stat-label">Estado del sistema</span><strong className="system-status"><span className={`status-dot${apiResponse.startsWith('No se') ? ' offline' : ''}`} />{apiResponse.startsWith('No se') ? 'Revisar' : 'Activo'}</strong><small>Conexión con el backend</small></article>
        </div>
        <div className="dashboard-lower">
          <div className="recent-users"><div className="subsection-heading"><div><p className="eyebrow">ACTIVIDAD RECIENTE</p><h3>Últimos usuarios agregados</h3></div><button className="text-button" type="button" onClick={() => navigateTo('directorio')}>Ver todos →</button></div>
            {usuariosLoading ? <p className="feedback loading"><span className="loading-spinner" />Cargando actividad...</p> : recentUsers.length === 0 ? <p className="feedback">Todavía no hay usuarios.</p> : <ul>{recentUsers.map((usuario) => <li key={usuario.id}><span className="recent-avatar">{usuario.nombre.charAt(0).toUpperCase()}</span><span><strong>{usuario.nombre}</strong><small>{usuario.email}</small></span><b>#{String(usuario.id).padStart(2, '0')}</b></li>)}</ul>}
          </div>
          <div className="dashboard-quick"><p className="eyebrow">ACCESOS RÁPIDOS</p><h3>Continúa trabajando</h3><button className="page-button" type="button" onClick={() => navigateTo('directorio')}>Gestionar usuarios →</button><button className="page-button secondary" type="button" onClick={() => navigateTo('juegos')}>Explorar juegos →</button></div>
        </div>
      </section>}

      {isGames ? (
        <section className="games-section" aria-labelledby="games-title">
          <div className="section-heading"><div><p className="eyebrow">RANKING METACRITIC</p><h2 id="games-title">Top 10 mejor valorados</h2></div><span className="count-badge">10 títulos</span></div>
          <div className="games-grid">
            {topGames.map((game, index) => (
              <article className="game-card" key={game.title} role="button" tabIndex={0} onClick={() => setSelectedGame(game)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedGame(game) } }}>
                <div className="game-cover" style={{ '--cover': game.accent } as React.CSSProperties}><img src={game.image} alt={`Portada de ${game.title}`} onError={(event) => { event.currentTarget.style.display = 'none' }} /><span className="game-rank">{String(index + 1).padStart(2, '0')}</span><span className="game-initial">{game.title.charAt(0)}</span></div>
                <div className="game-info"><div className="game-meta"><span>{game.platform}</span><span>{game.year}</span></div><h3>{game.title}</h3><p>{game.review}</p><div className="game-score"><strong>{game.score}</strong><span>METASCORE</span></div><a className="metacritic-link" href={`https://www.metacritic.com/game/${game.metacritic}/`} target="_blank" rel="noreferrer">Ver en Metacritic ↗</a></div>
              </article>
            ))}
          </div>
        </section>
      ) : <section className="usuarios" aria-labelledby="usuarios-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DIRECTORIO</p>
            <h2 id="usuarios-title">Usuarios registrados</h2>
          </div>
          <div className="section-actions">
            <button className="page-button add-user-button" type="button" onClick={() => { setShowAddUser(true); setAddUserMessage('') }}>+ Agregar usuario</button>
            <span className="count-badge">{usuarios.length} registros</span>
          </div>
        </div>
        <div className="user-tools">
          <label className="search-field">Buscar usuario<input type="search" value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="Nombre o correo electrónico" /></label>
          <label className="filter-field">Buscar por<select value={userFilter} onChange={(event) => setUserFilter(event.target.value as typeof userFilter)}><option value="todos">Todos</option><option value="nombre">Nombre</option><option value="email">Correo electrónico</option></select></label>
        </div>
        {deleteUserError && <p className="feedback error">{deleteUserError}</p>}
        {usuariosLoading ? (
          <p className="feedback loading" role="status"><span className="loading-spinner" />Cargando usuarios...</p>
        ) : usuariosError ? (
          <div className="feedback error"><p>{usuariosError}</p><button className="retry-button" type="button" onClick={loadUsuarios}>Reintentar</button></div>
        ) : usuarios.length === 0 ? (
          <p className="feedback">No hay usuarios registrados.</p>
        ) : filteredUsers.length === 0 ? (
          <p className="feedback">No hay usuarios que coincidan con la búsqueda.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Nombre</th><th>Correo electrónico</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {filteredUsers.map((usuario) => (
                  <tr key={usuario.id}>
                    <td><span className="id-chip">{String(usuario.id).padStart(2, '0')}</span></td>
                    <td className="user-name">{usuario.nombre}</td>
                    <td>{usuario.email}</td>
                    <td className="row-actions"><button className="edit-button" type="button" onClick={() => openEditUser(usuario)} disabled={deletingUserId === usuario.id}>Editar</button><button className="delete-button" type="button" onClick={() => handleDeleteUser(usuario)} disabled={deletingUserId === usuario.id}>{deletingUserId === usuario.id ? 'Eliminando...' : 'Eliminar'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>}

      <footer>Conectado a PostgreSQL <span>•</span> Backend Express <span>•</span> {new Date().getFullYear()}</footer>

      {selectedGame && <div className="game-modal-backdrop" onClick={() => setSelectedGame(null)}>
        <article className="game-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="game-detail-title">
          <button className="game-modal-close" type="button" onClick={() => setSelectedGame(null)} aria-label="Cerrar reseña">×</button>
          <div className="game-modal-cover" style={{ '--cover': selectedGame.accent } as React.CSSProperties}><img src={selectedGame.image} alt="" /><span>{selectedGame.title.charAt(0)}</span></div>
          <div className="game-modal-content"><p className="eyebrow">RESEÑA COMPLETA · {selectedGame.platform} · {selectedGame.year}</p><h2 id="game-detail-title">{selectedGame.title}</h2><div className="modal-score"><strong>{selectedGame.score}</strong><span>METASCORE</span></div><p className="full-review">{selectedGame.review}</p><a className="metacritic-link" href={`https://www.metacritic.com/game/${selectedGame.metacritic}/`} target="_blank" rel="noreferrer">Consultar ficha en Metacritic ↗</a></div>
        </article>
      </div>}

      {settingsOpen && <div className="settings-backdrop" onClick={() => setSettingsOpen(false)}>
        <aside className="settings-panel" onClick={(event) => event.stopPropagation()} aria-label="Ajustes de la aplicación">
          <div className="settings-header"><div><p className="eyebrow">PREFERENCIAS</p><h2>Ajustes</h2></div><button className="close-button" type="button" onClick={() => setSettingsOpen(false)} aria-label="Cerrar ajustes">×</button></div>
          <p className="settings-description">Personaliza la forma en que ves tu panel.</p>
          <div className="setting-row"><div><strong>Modo oscuro</strong><small>Reduce el brillo de la interfaz</small></div><button className={`toggle${darkMode ? ' is-on' : ''}`} type="button" onClick={toggleDarkMode} aria-pressed={darkMode}><span /></button></div>
          <div className="setting-row"><div><strong>Vista compacta</strong><small>Usa menos espacio en la tabla</small></div><button className={`toggle${compactMode ? ' is-on' : ''}`} type="button" onClick={toggleCompactMode} aria-pressed={compactMode}><span /></button></div>
          <div className="setting-row"><div><strong>Estado de la API</strong><small>Muestra la conexión del backend</small></div><button className={`toggle${showApiStatus ? ' is-on' : ''}`} type="button" onClick={() => setShowApiStatus((visible) => !visible)} aria-pressed={showApiStatus}><span /></button></div>
          <div className="settings-footer">Los cambios se guardan automáticamente en este dispositivo.</div>
        </aside>
      </div>}

      {showAddUser && <div className="settings-backdrop" onClick={() => setShowAddUser(false)}>
        <section className="add-user-panel" onClick={(event) => event.stopPropagation()} aria-labelledby="add-user-title">
          <div className="settings-header"><div><p className="eyebrow">DIRECTORIO</p><h2 id="add-user-title">Agregar usuario</h2></div><button className="close-button" type="button" onClick={() => setShowAddUser(false)} aria-label="Cerrar formulario">×</button></div>
          <p className="settings-description">El ID progresivo se asignará automáticamente.</p>
          <form className="add-user-form" onSubmit={handleAddUser}>
            <label>Nombre<input value={newUserName} onChange={(event) => setNewUserName(event.target.value)} required minLength={2} maxLength={100} pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+( [A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*" title="Usa solo letras y espacios" /></label>
            <label>Correo electrónico<input type="email" value={newUserEmail} onChange={(event) => setNewUserEmail(event.target.value)} required minLength={5} maxLength={150} /></label>
            {addUserMessage && <p className={`feedback${addUserMessage.startsWith('Usuario agregado') ? '' : ' error'}`}>{addUserMessage}</p>}
            <button className="page-button" type="submit" disabled={addUserLoading}>{addUserLoading ? <><span className="loading-spinner" />Guardando...</> : 'Guardar usuario'}</button>
          </form>
        </section>
      </div>}

      {editingUser && <div className="settings-backdrop" onClick={() => setEditingUser(null)}>
        <section className="add-user-panel" onClick={(event) => event.stopPropagation()} aria-labelledby="edit-user-title">
          <div className="settings-header"><div><p className="eyebrow">DIRECTORIO · ID {editingUser.id}</p><h2 id="edit-user-title">Editar usuario</h2></div><button className="close-button" type="button" onClick={() => setEditingUser(null)} aria-label="Cerrar formulario">×</button></div>
          <p className="settings-description">Actualiza los datos del usuario seleccionado.</p>
          <form className="add-user-form" onSubmit={handleEditUser}>
            <label>Nombre<input value={editUserName} onChange={(event) => setEditUserName(event.target.value)} required minLength={2} maxLength={100} pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+( [A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*" title="Usa solo letras y espacios" /></label>
            <label>Correo electrónico<input type="email" value={editUserEmail} onChange={(event) => setEditUserEmail(event.target.value)} required minLength={5} maxLength={150} /></label>
            {editUserMessage && <p className="feedback error">{editUserMessage}</p>}
            <button className="page-button" type="submit" disabled={editUserLoading}>{editUserLoading ? <><span className="loading-spinner" />Guardando...</> : 'Guardar cambios'}</button>
          </form>
        </section>
      </div>}
    </main>
  )
}

export default App
