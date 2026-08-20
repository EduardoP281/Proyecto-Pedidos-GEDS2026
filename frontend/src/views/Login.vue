<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const router = useRouter()

const passwordFieldType = computed(() => showPassword.value ? 'text' : 'password')
const passwordIcon = computed(() => showPassword.value ? 'visibility' : 'visibility_off')

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = () => {
  if (!email.value || !password.value) {
    alert('Por favor, completa todos los campos obligatorios.')
    return
  }
  
  console.log('Iniciando sesión con:', {
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value
  })
}
</script>

<template>
  <div class="bg-surface text-on-surface font-body-md min-h-screen flex flex-col">
    <header class="bg-surface border-b border-outline-variant w-full">
      <div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto h-16">
        <div class="flex items-center gap-3">
        </div>
      </div>
    </header>

    <main class="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop">
      <div class="w-full max-w-[440px] bg-surface-container-lowest rounded-xl border border-outline-variant p-8 md:p-10 shadow-md">
        <div class="text-center mb-8 flex flex-col items-center">
          <div class="w-16 h-16 bg-surface-container rounded-xl flex items-center justify-center mb-6">
            <span class="material-symbols-outlined text-primary text-4xl" data-weight="fill" style="font-variation-settings: 'FILL' 1;">
              local_shipping
            </span>
          </div>
          <h1 class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">
            Iniciar Sesión
          </h1>
          <p class="font-body-md text-body-md text-on-surface-variant mt-2">
            Bienvenido al Sistema de Gestión de Pedidos
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="font-label-md text-label-md text-on-surface-variant block mb-2" for="email">
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
                class="block w-full pl-10 px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface font-body-md placeholder:text-outline focus:outline-none focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                id="email"
                name="email"
                placeholder="usuario@devsoft.com"
                required
                type="email"
              >
            </div>
          </div>

          <div>
            <label class="font-label-md text-label-md text-on-surface-variant block mb-2" for="password">
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
                :type="passwordFieldType"
                class="block w-full pl-10 pr-10 px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface font-body-md placeholder:text-outline focus:outline-none focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                id="password"
                name="password"
                placeholder="••••••••"
                required
              >
              <button
                aria-label="Toggle password visibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors focus:outline-none"
                @click="togglePassword"
                type="button"
              >
                <span class="material-symbols-outlined">
                  {{ passwordIcon }}
                </span>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between mt-4">
            <div class="flex items-center">
              <input
                v-model="rememberMe"
                class="h-4 w-4 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary focus:ring-offset-surface"
                id="remember-me"
                name="remember-me"
                type="checkbox"
              >
              <label class="ml-2 block font-body-sm text-body-sm text-on-surface-variant" for="remember-me">
                Recordarme
              </label>
            </div>
            <div class="text-sm">
              <a class="font-label-sm text-label-sm text-primary hover:text-on-primary-fixed-variant transition-colors hover:underline" href="#">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div class="pt-2">
            <button
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm font-label-md text-label-md font-bold text-white bg-primary-container hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              type="submit"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>

        <div class="mt-8 text-center">
          <p class="font-body-sm text-body-sm text-on-surface-variant">
            ¿No tienes cuenta?
            <router-link
              to="/register"
              class="font-label-md text-label-md font-semibold text-primary hover:text-on-primary-fixed-variant transition-colors hover:underline"
            >
              Regístrate
            </router-link>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
