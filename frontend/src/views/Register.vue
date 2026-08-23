<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const fullname = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')

const router = useRouter()

const handleRegister = async () => {
  if (!fullname.value || !email.value || !phone.value || !password.value || !confirmPassword.value) {
    alert('Por favor, completa todos los campos.')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('Las contraseñas no coinciden.')
    return
  }

  // Derivar un username simple a partir del email (antes de @) para cumplir la columna NOT NULL
  const username = email.value.split('@')[0] || fullname.value.replace(/\s+/g, '').toLowerCase()

  const payload = {
    full_name: fullname.value,
    username,
    email: email.value,
    password: password.value,
    phone: phone.value
  }

  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    if (res.ok) {
      alert(data.message || 'Registro exitoso')
      router.push('/login')
    } else {
      alert(data.error || JSON.stringify(data))
    }
  } catch (err) {
    console.error('Error al registrar desde frontend:', err)
    alert('Error de red al registrar. Revisa la consola del navegador.')
  }
}
</script>

<template>
  <div class="bg-background text-on-background min-h-screen flex flex-col font-body-md antialiased">
    <main class="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop">
      <div class="w-full max-w-md bg-surface-container-lowest rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.05),0_2px_4px_-2px_rgb(0,0,0,0.05)] border border-outline-variant/30 overflow-hidden">
        <div class="p-8">
          <div class="text-center mb-8">
            <h1 class="font-headline-lg text-headline-lg text-primary mb-2">
              Crear Cuenta
            </h1>
            <p class="font-body-md text-body-md text-on-surface-variant">
              Sistema de Gestión de Pedidos y Entregas
            </p>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-5">
            <div>
              <label class="block font-label-md text-label-md text-on-surface-variant mb-1" for="fullname">
                Nombre Completo
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-outline">
                    person
                  </span>
                </div>
                <input
                  v-model="fullname"
                  class="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-xl bg-surface-container-lowest text-on-surface placeholder-outline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all font-body-md text-body-md"
                  id="fullname"
                  name="fullname"
                  placeholder="Juan Pérez"
                  required
                  type="text"
                />
              </div>
            </div>

            <div>
              <label class="block font-label-md text-label-md text-on-surface-variant mb-1" for="email">
                Correo Electrónico
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-outline">
                    mail
                  </span>
                </div>
                <input
                  v-model="email"
                  class="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-xl bg-surface-container-lowest text-on-surface placeholder-outline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all font-body-md text-body-md"
                  id="email"
                  name="email"
                  placeholder="juan@ejemplo.com"
                  required
                  type="email"
                />
              </div>
            </div>

            <div>
              <label class="block font-label-md text-label-md text-on-surface-variant mb-1" for="phone">
                Teléfono
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-outline">
                    phone
                  </span>
                </div>
                <input
                  v-model="phone"
                  class="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-xl bg-surface-container-lowest text-on-surface placeholder-outline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all font-body-md text-body-md"
                  id="phone"
                  name="phone"
                  placeholder="+1 234 567 8900"
                  required
                  type="tel"
                />
              </div>
            </div>

            <div>
              <label class="block font-label-md text-label-md text-on-surface-variant mb-1" for="password">
                Contraseña
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-outline">
                    lock
                  </span>
                </div>
                <input
                  v-model="password"
                  class="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-xl bg-surface-container-lowest text-on-surface placeholder-outline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all font-body-md text-body-md"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                />
              </div>
            </div>

            <div>
              <label class="block font-label-md text-label-md text-on-surface-variant mb-1" for="confirm_password">
                Confirmar Contraseña
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-outline">
                    lock
                  </span>
                </div>
                <input
                  v-model="confirmPassword"
                  class="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-xl bg-surface-container-lowest text-on-surface placeholder-outline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all font-body-md text-body-md"
                  id="confirm_password"
                  name="confirm_password"
                  placeholder="••••••••"
                  required
                  type="password"
                />
              </div>
            </div>

            <div class="pt-2">
              <button
                class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-[12px] shadow-sm font-label-md text-label-md text-on-primary bg-primary-container hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container transition-colors"
                type="submit"
              >
                Registrarse
              </button>
            </div>
          </form>

          <div class="mt-6 text-center">
            <router-link
              to="/login"
              class="font-body-sm text-body-sm text-primary hover:underline transition-all"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </router-link>
          </div>
        </div>

        <div class="bg-surface-container-low py-4 px-8 border-t border-outline-variant/30 flex items-center justify-center gap-2 text-on-surface-variant">
          <span class="material-symbols-outlined text-[18px]">
            verified_user
          </span>
          <span class="font-label-sm text-label-sm">
            Plataforma segura y encriptada
          </span>
        </div>
      </div>
    </main>
  </div>
</template>
