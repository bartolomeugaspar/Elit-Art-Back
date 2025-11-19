# Integração do Campo Telefone no Frontend

## 📱 Como Adicionar o Campo de Telefone no Formulário de Inscrição

### 1. Atualizar EventRegistrationModal (Frontend)

Você precisa adicionar o campo de telefone no formulário de inscrição em:
`/home/kali/Documentos/Elit-Art-Front/src/components/EventRegistrationModal.tsx`

#### Adicionar estado para phoneNumber:

```tsx
const [phoneNumber, setPhoneNumber] = useState('')
```

#### Adicionar campo no formulário (após o campo de email):

```tsx
{/* Telefone/WhatsApp */}
<div>
  <label htmlFor="phoneNumber" className="block text-sm font-medium text-elit-dark mb-1">
    Telefone/WhatsApp *
  </label>
  <input
    type="tel"
    id="phoneNumber"
    value={phoneNumber}
    onChange={(e) => setPhoneNumber(e.target.value)}
    placeholder="+244 999 123 456"
    className="w-full px-4 py-2 bg-white border border-elit-dark/20 rounded-lg text-elit-dark placeholder-elit-dark/40 focus:outline-none focus:border-elit-orange focus:ring-2 focus:ring-elit-orange/20 transition"
    required
  />
  <p className="text-xs text-elit-dark/60 mt-1">
    Formato: +244 seguido de 9 dígitos (para receber confirmação via WhatsApp)
  </p>
</div>
```

#### Adicionar validação no handleSubmit:

```tsx
// Validar telefone
if (!phoneNumber.trim()) {
  toast.error('Telefone é obrigatório')
  return
}

// Validar formato básico
if (!/^\+244\d{9}$/.test(phoneNumber.replace(/\s/g, ''))) {
  toast.error('Telefone inválido. Use formato: +244 999 123 456')
  return
}
```

#### Incluir phone_number no body da requisição:

```tsx
const response = await fetch(`${API_URL}/events/${eventId}/register`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    full_name: fullName.trim(),
    email: email.trim(),
    phone_number: phoneNumber.replace(/\s/g, ''), // Remove espaços
    payment_method: isFree ? null : paymentMethod,
    proof_url: proofUrl,
  }),
})
```

### 2. Atualizar Rota de Registro (Backend)

A rota `/events/:id/register` precisa aceitar o campo `phone_number`:

#### Em `src/routes/events.ts`, adicione validação:

```typescript
body('phone_number')
  .optional()
  .matches(/^\+244\d{9}$/)
  .withMessage('Phone number must be in format +244XXXXXXXXX'),
```

#### Certifique-se de salvar o phone_number no banco:

```typescript
const { data: registration, error: registrationError } = await supabase
  .from('registrations')
  .insert({
    // ... outros campos
    phone_number: req.body.phone_number, // Adicionar esta linha
  })
```

### 3. Executar a Migration

Execute a migration SQL no Supabase para adicionar a coluna:

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para **SQL Editor**
3. Execute o arquivo `src/migrations/add_phone_number_to_registrations.sql`:

```sql
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

COMMENT ON COLUMN registrations.phone_number IS 'Número de telefone no formato internacional';
```

### 4. Atualizar Interface TypeScript (opcional)

Se você tiver interfaces no frontend, atualize também:

```typescript
interface RegistrationData {
  full_name: string
  email: string
  phone_number: string  // Adicionar
  payment_method?: string
  proof_url?: string
}
```

### 5. Exemplo de Máscara de Telefone (opcional)

Para melhorar a UX, você pode adicionar uma máscara no input:

```tsx
const formatPhoneNumber = (value: string) => {
  // Remove tudo exceto números e +
  const cleaned = value.replace(/[^\d+]/g, '')
  
  // Adiciona +244 automaticamente se não tiver
  if (!cleaned.startsWith('+244') && cleaned.length > 0) {
    return '+244' + cleaned
  }
  
  // Formata: +244 999 123 456
  if (cleaned.length <= 4) return cleaned
  if (cleaned.length <= 7) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`
  if (cleaned.length <= 10) return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 10)} ${cleaned.slice(10, 13)}`
}

// No input:
onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
```

### 6. Exemplo Completo de Componente Atualizado

```tsx
// Estado
const [phoneNumber, setPhoneNumber] = useState('')

// Validação
const validatePhone = (phone: string) => {
  const cleaned = phone.replace(/\s/g, '')
  return /^\+244\d{9}$/.test(cleaned)
}

// No JSX
<div>
  <label className="block text-sm font-medium text-elit-dark mb-1">
    Telefone/WhatsApp *
  </label>
  <input
    type="tel"
    value={phoneNumber}
    onChange={(e) => setPhoneNumber(e.target.value)}
    placeholder="+244 999 123 456"
    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elit-orange"
    required
  />
  {phoneNumber && !validatePhone(phoneNumber) && (
    <p className="text-xs text-red-600 mt-1">
      Formato inválido. Use: +244 999 123 456
    </p>
  )}
</div>

// No submit
if (!validatePhone(phoneNumber)) {
  toast.error('Por favor, insira um telefone válido')
  return
}
```

### 7. Testar o Fluxo Completo

1. ✅ Preencher formulário com telefone
2. ✅ Enviar inscrição
3. ✅ Admin confirma inscrição (status → attended)
4. ✅ Email enviado automaticamente
5. ✅ WhatsApp enviado automaticamente

---

**Nota**: Certifique-se de configurar as credenciais do WhatsApp no `.env` antes de testar!
