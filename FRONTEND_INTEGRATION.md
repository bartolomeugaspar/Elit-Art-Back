# 🔗 Guia de Integração Frontend-Backend

## Configuração do Frontend

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` no frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2. Cliente HTTP

Crie um arquivo `src/lib/api.ts`:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token')
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  },

  // Auth
  auth: {
    register: (data: any) => api.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    login: (data: any) => api.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getMe: () => api.request('/auth/me'),
    updateProfile: (data: any) => api.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },

  // Events
  events: {
    getAll: (filters?: any) => {
      const params = new URLSearchParams(filters).toString()
      return api.request(`/events${params ? '?' + params : ''}`)
    },
    getById: (id: string) => api.request(`/events/${id}`),
    search: (query: string) => api.request(`/events/search/${query}`),
    create: (data: any) => api.request('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => api.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => api.request(`/events/${id}`, {
      method: 'DELETE',
    }),
    register: (id: string) => api.request(`/events/${id}/register`, {
      method: 'POST',
    }),
    cancelRegistration: (registrationId: string) => api.request(
      `/events/registrations/${registrationId}`,
      { method: 'DELETE' }
    ),
    getRegistrations: (id: string) => api.request(`/events/${id}/registrations`),
    getMyRegistrations: () => api.request('/events/user/my-registrations'),
    addTestimonial: (id: string, data: any) => api.request(
      `/events/${id}/testimonials`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),
    getTestimonials: (id: string) => api.request(`/events/${id}/testimonials`),
  },

  // Newsletter
  newsletter: {
    subscribe: (email: string) => api.request('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
    unsubscribe: (email: string) => api.request('/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  },
}
```

## Exemplos de Uso

### Autenticação

```typescript
// src/hooks/useAuth.ts
import { useState } from 'react'
import { api } from '@/lib/api'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  const register = async (name: string, email: string, password: string) => {
    const data = await api.auth.register({ name, email, password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }

  const login = async (email: string, password: string) => {
    const data = await api.auth.login({ email, password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return { user, token, register, login, logout }
}
```

### Eventos

```typescript
// src/hooks/useEvents.ts
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const data = await api.events.getAll()
      setEvents(data.events)
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const registerEvent = async (eventId: string) => {
    await api.events.register(eventId)
    await loadEvents()
  }

  const searchEvents = async (query: string) => {
    const data = await api.events.search(query)
    return data.events
  }

  return {
    events,
    loading,
    loadEvents,
    registerEvent,
    searchEvents,
  }
}
```

### Newsletter

```typescript
// Componente de Newsletter
'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.newsletter.subscribe(email)
      setMessage('Inscrição realizada com sucesso!')
      setEmail('')
    } catch (error) {
      setMessage('Erro ao inscrever-se')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Seu email"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Inscrevendo...' : 'Inscrever'}
      </button>
      {message && <p>{message}</p>}
    </form>
  )
}
```

## Fluxo de Dados

### 1. Registro de Usuário
```
Frontend (Register Form)
    ↓
api.auth.register()
    ↓
Backend POST /api/auth/register
    ↓
Validação + Hash de senha
    ↓
Salvar no MongoDB
    ↓
Gerar JWT
    ↓
Retornar user + token
    ↓
Frontend armazena token em localStorage
```

### 2. Inscrição em Evento
```
Frontend (Event Card)
    ↓
api.events.register(eventId)
    ↓
Backend POST /api/events/:id/register
    ↓
Verificar autenticação
    ↓
Verificar vagas disponíveis
    ↓
Criar Registration
    ↓
Atualizar contagem de attendees
    ↓
Retornar registration
    ↓
Frontend atualiza UI
```

## Tratamento de Erros

```typescript
// Exemplo de tratamento robusto
async function handleApiCall(fn: () => Promise<any>) {
  try {
    return await fn()
  } catch (error: any) {
    if (error.message.includes('401')) {
      // Token expirado - fazer logout
      localStorage.removeItem('token')
      window.location.href = '/login'
    } else if (error.message.includes('403')) {
      // Sem permissão
      alert('Você não tem permissão para fazer isso')
    } else {
      // Erro genérico
      console.error('Erro:', error)
    }
  }
}
```

## CORS

O backend está configurado para aceitar requisições do frontend:

```typescript
// src/index.ts
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
```

Se tiver problemas de CORS, verifique:
1. `FRONTEND_URL` está correto em `.env`
2. Frontend está na URL correta
3. Requisições incluem `credentials: true` se necessário

## Autenticação com Token

O token JWT deve ser enviado em todas as requisições protegidas:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

O cliente HTTP deve adicionar automaticamente este header.

## Exemplo Completo: Página de Eventos

```typescript
'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const data = await api.events.getAll()
      setEvents(data.events)
    } catch (err) {
      setError('Erro ao carregar eventos')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (eventId: string) => {
    try {
      await api.events.register(eventId)
      alert('Inscrição realizada com sucesso!')
      await loadEvents()
    } catch (err) {
      alert('Erro ao inscrever-se')
    }
  }

  if (loading) return <div>Carregando...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      {events.map((event) => (
        <div key={event._id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <button onClick={() => handleRegister(event._id)}>
            Inscrever-se
          </button>
        </div>
      ))}
    </div>
  )
}
```

---

**Pronto para integrar! 🚀**
