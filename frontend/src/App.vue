<template>
  <div class="flex flex-col min-h-screen bg-background text-on-surface font-body-md antialiased selection:bg-blue-600 selection:text-white">
    <!-- ================= TOP NAVIGATION BAR ================= -->
    <header class="flex justify-between items-center w-full px-6 py-3 border-b border-slate-200 sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm">
      <div class="flex items-center gap-7">
        <div class="flex items-center gap-2.5 cursor-pointer" @click="switchView('catalog')">
          <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-200">
            <span class="material-symbols-outlined text-lg">storefront</span>
          </div>
          <span class="text-headline-md font-bold tracking-tight text-slate-900">Pedidos</span>
        </div>
        <nav class="hidden md:flex items-center gap-1 text-body-sm font-medium">
          <button :class="currentView === 'catalog' ? 'text-blue-700 font-semibold bg-blue-50 border-blue-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'" class="px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 border border-transparent" @click="switchView('catalog')">
            <span class="material-symbols-outlined text-base">grid_view</span> Catálogo
          </button>
          <button :class="currentView === 'admin-products' ? 'text-blue-700 font-semibold bg-blue-50 border-blue-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'" class="px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 border border-transparent" @click="switchView('admin-products')">
            <span class="material-symbols-outlined text-base">inventory_2</span> Inventario
          </button>
          <button :class="currentView === 'admin-categories' ? 'text-blue-700 font-semibold bg-blue-50 border-blue-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'" class="px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 border border-transparent" @click="switchView('admin-categories')">
            <span class="material-symbols-outlined text-base">folder</span> Categorías
          </button>
        </nav>
      </div>

      <div class="flex items-center gap-3">
        <div class="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs">
          <span class="w-2 h-2 rounded-full" :class="isApiOnline ? 'bg-emerald-500' : 'bg-rose-500'"></span>
          <span class="text-slate-600 font-medium">{{ isApiOnline ? 'API Conectada' : 'API Desconectada' }}</span>
        </div>

        <button class="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-medium text-body-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shadow-blue-500/20" @click="openProductModal()">
          <span class="material-symbols-outlined text-base">add</span> Nuevo Producto
        </button>
        <div class="h-5 w-[1px] bg-slate-200 hidden md:block"></div>

        <div class="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button :class="currentView === 'catalog' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'" class="px-3 py-1 text-xs rounded-md font-semibold transition-all" @click="switchView('catalog')">Cliente</button>
          <button :class="currentView !== 'catalog' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'" class="px-3 py-1 text-xs rounded-md font-semibold transition-all" @click="switchView('admin-products')">Admin</button>
        </div>

        <button class="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all border border-transparent hover:border-slate-200" @click="isCartOpen = true">
          <span class="material-symbols-outlined text-lg">shopping_cart</span>
          <span v-if="cartItemCount > 0" class="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full">{{ cartItemCount }}</span>
        </button>

        <button class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all border border-transparent hover:border-slate-200" @click="showToast('Sistema sincronizado', 'info')">
          <span class="material-symbols-outlined text-lg">notifications</span>
        </button>

        <div class="w-8 h-8 rounded-full border border-blue-200 bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs cursor-pointer hover:border-blue-400 transition-colors">AD</div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden relative">
      <!-- ================= SIDEBAR NAVIGATION ================= -->
      <aside class="hidden lg:flex fixed left-0 top-[57px] h-[calc(100vh-57px)] w-64 z-30 flex-col justify-between p-4 border-r border-slate-200 bg-white shadow-xs transition-all duration-300">
        <div class="space-y-6">
          <div class="flex items-center gap-3 px-2 py-1">
            <div class="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <span class="material-symbols-outlined text-base">space_dashboard</span>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-slate-900 leading-tight">Panel Principal</h4>
              <p class="text-xs text-slate-500">Gestión de Tienda</p>
            </div>
          </div>

          <button class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-800 hover:text-blue-700 transition-all duration-150 text-body-sm font-medium active:scale-[0.98]" @click="openProductModal()">
            <span class="material-symbols-outlined text-base text-blue-600">add</span>
            <span>Crear Producto</span>
          </button>

          <nav class="space-y-1">
            <a href="javascript:void(0)" @click="switchView('catalog')" :class="currentView === 'catalog' ? 'bg-blue-50 text-blue-700 font-semibold border-blue-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'" class="flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors">
              <span class="material-symbols-outlined text-base" :class="currentView === 'catalog' ? 'text-blue-600' : 'text-slate-400'">grid_view</span>
              <span class="text-body-sm">Catálogo</span>
            </a>
            <a href="javascript:void(0)" @click="switchView('admin-products')" :class="currentView === 'admin-products' ? 'bg-blue-50 text-blue-700 font-semibold border-blue-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'" class="flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors">
              <span class="material-symbols-outlined text-base" :class="currentView === 'admin-products' ? 'text-blue-600' : 'text-slate-400'">inventory_2</span>
              <span class="text-body-sm">Inventario</span>
            </a>
            <a href="javascript:void(0)" @click="switchView('admin-categories')" :class="currentView === 'admin-categories' ? 'bg-blue-50 text-blue-700 font-semibold border-blue-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'" class="flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors">
              <span class="material-symbols-outlined text-base" :class="currentView === 'admin-categories' ? 'text-blue-600' : 'text-slate-400'">folder</span>
              <span class="text-body-sm">Categorías</span>
            </a>
            <a href="javascript:void(0)" @click="switchView('analytics-mock')" :class="currentView === 'analytics-mock' ? 'bg-blue-50 text-blue-700 font-semibold border-blue-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'" class="flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors">
              <span class="material-symbols-outlined text-base" :class="currentView === 'analytics-mock' ? 'text-blue-600' : 'text-slate-400'">insights</span>
              <span class="text-body-sm">Rendimiento</span>
            </a>
          </nav>
        </div>

        <div class="pt-4 border-t border-slate-200 space-y-1">
          <a href="javascript:void(0)" @click="isDocsModalOpen = true" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
            <span class="material-symbols-outlined text-sm">description</span> Documentación
          </a>
          <div class="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-500">
            <span class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full" :class="isApiOnline ? 'bg-emerald-500' : 'bg-rose-500'"></span> Base de Datos
            </span>
            <span class="text-slate-600 font-mono text-[11px] font-medium">{{ isApiOnline ? 'Sincronizada' : 'Offline' }}</span>
          </div>
        </div>
      </aside>

      <!-- ================= MAIN CONTENT CANVAS ================= -->
      <main class="flex-1 lg:ml-64 overflow-y-auto custom-scroll h-[calc(100vh-57px)] bg-slate-50 p-4 sm:p-6 lg:p-8">
        
        <!-- ================= CATALOG VIEW ================= -->
        <section v-if="currentView === 'catalog'" class="space-y-6">
          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 class="text-headline-xl font-bold text-slate-900 tracking-tight">Catálogo de Productos</h1>
                <p class="text-body-md text-slate-500 mt-1 max-w-xl">Explora el inventario disponible y gestiona productos en tiempo real.</p>
              </div>
              <div class="w-full md:w-80">
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
                  <input type="text" v-model="clientSearch" placeholder="Buscar por nombre o SKU..." class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-body-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none transition-all">
                </div>
              </div>
            </div>

            <div class="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between gap-4 overflow-x-auto custom-scroll pb-1">
              <div class="flex items-center gap-2">
                <button @click="activeClientCategory = 'ALL'" :class="activeClientCategory === 'ALL' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap">Todos</button>
                <button v-for="cat in categoriesState" :key="cat.category_id" @click="activeClientCategory = cat.category_id" :class="activeClientCategory === cat.category_id ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'" class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap">
                  <span class="material-symbols-outlined text-xs">{{ cat.icon || 'category' }}</span> {{ cat.name }}
                </button>
              </div>
              <div class="text-xs text-slate-500 whitespace-nowrap">Mostrando <span class="text-slate-900 font-semibold">{{ clientFilteredProducts.length }}</span> productos</div>
            </div>
          </div>

          <!-- Grid Products -->
          <div v-if="clientFilteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            <div v-for="p in clientFilteredProducts" :key="p.product_id" class="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
              <div>
                <div class="relative aspect-[4/3] bg-slate-100 overflow-hidden border-b border-slate-100">
                  <img :src="p.image_url || 'https://via.placeholder.com/400x300.png?text=Producto'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                  <div class="absolute top-2.5 left-2.5">
                    <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 shadow-xs uppercase">
                      {{ getCategoryName(p.category_id) }}
                    </span>
                  </div>
                  <div class="absolute top-2.5 right-2.5">
                    <span class="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-white/90 backdrop-blur-md border border-slate-200 text-slate-500 shadow-xs">
                      ID-{{ p.product_id }}
                    </span>
                  </div>
                </div>

                <div class="p-4 space-y-2">
                  <h3 class="text-headline-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{{ p.name }}</h3>
                  <p class="text-body-sm text-slate-500 line-clamp-2 min-h-[36px]">{{ p.description }}</p>

                  <div class="pt-2 flex items-center justify-between">
                    <div>
                      <span class="text-[11px] font-semibold text-slate-400 block tracking-wider">PRECIO</span>
                      <span class="text-lg font-bold text-slate-900 tracking-tight">${{ Number(p.price).toFixed(2) }}</span>
                    </div>
                    <div>
                      <span v-if="p.stock === 0" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200">
                        <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Agotado
                      </span>
                      <span v-else-if="p.stock <= 5" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> {{ p.stock }} disp.
                      </span>
                      <span v-else class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Disponible
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="p-4 pt-1">
                <button v-if="p.stock === 0" disabled class="w-full py-2 px-3 rounded-lg bg-slate-100 text-slate-400 text-body-sm font-medium flex items-center justify-center gap-1.5 cursor-not-allowed border border-slate-200">
                  No Disponible
                </button>
                <button v-else @click="clientAddToCart(p)" class="w-full py-2 px-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-body-sm flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-blue-500/20 active:scale-[0.98]">
                  <span class="material-symbols-outlined text-base">add_shopping_cart</span> Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="p-12 text-center rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <span class="material-symbols-outlined text-4xl text-slate-400">production_quantity_limits</span>
            <h3 class="text-headline-md font-semibold text-slate-900">No se encontraron productos</h3>
            <button @click="activeClientCategory = 'ALL'; clientSearch = ''" class="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-body-sm font-medium transition-colors">Restablecer Filtros</button>
          </div>
        </section>

        <!-- ================= ADMIN PRODUCTS VIEW ================= -->
        <section v-else-if="currentView === 'admin-products'" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div class="flex justify-between items-start">
                <div><p class="text-xs font-semibold text-slate-500 tracking-wider uppercase">Total</p><h3 class="text-2xl font-bold text-slate-900 mt-1.5">{{ statTotal }}</h3></div>
                <span class="p-2 rounded-lg bg-blue-50 text-blue-600 material-symbols-outlined text-lg">inventory_2</span>
              </div>
            </div>
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div class="flex justify-between items-start">
                <div><p class="text-xs font-semibold text-slate-500 tracking-wider uppercase">Disp. (>5)</p><h3 class="text-2xl font-bold text-emerald-600 mt-1.5">{{ statAvailable }}</h3></div>
                <span class="p-2 rounded-lg bg-emerald-50 text-emerald-600 material-symbols-outlined text-lg">check_circle</span>
              </div>
            </div>
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div class="flex justify-between items-start">
                <div><p class="text-xs font-semibold text-slate-500 tracking-wider uppercase">Bajo (<=5)</p><h3 class="text-2xl font-bold text-amber-600 mt-1.5">{{ statLow }}</h3></div>
                <span class="p-2 rounded-lg bg-amber-50 text-amber-600 material-symbols-outlined text-lg">warning</span>
              </div>
            </div>
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div class="flex justify-between items-start">
                <div><p class="text-xs font-semibold text-slate-500 tracking-wider uppercase">Agotados</p><h3 class="text-2xl font-bold text-rose-600 mt-1.5">{{ statOut }}</h3></div>
                <span class="p-2 rounded-lg bg-rose-50 text-rose-600 material-symbols-outlined text-lg">error_outline</span>
              </div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div class="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div class="relative flex-1 max-w-md">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
                <input v-model="adminSearch" type="text" class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-body-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none" placeholder="Buscar producto...">
              </div>
              <select v-model="adminCatFilter" class="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-body-sm focus:bg-white focus:border-blue-600 focus:outline-none">
                <option value="ALL">Todas las Categorías</option>
                <option v-for="cat in categoriesState" :key="cat.category_id" :value="cat.category_id">{{ cat.name }}</option>
              </select>
              <select v-model="adminStockFilter" class="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-body-sm focus:bg-white focus:border-blue-600 focus:outline-none">
                <option value="ALL">Todo el Inventario</option>
                <option value="AVAILABLE">En Stock (> 5)</option>
                <option value="LOW">Stock Bajo (1 a 5)</option>
                <option value="OUT">Agotados (0)</option>
              </select>
            </div>
            <button @click="openProductModal()" class="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-medium text-body-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20">
              <span class="material-symbols-outlined text-base">add</span> Nuevo Producto
            </button>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div class="overflow-x-auto custom-scroll">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th class="py-3 px-4">Producto</th>
                    <th class="py-3 px-4">Categoría</th>
                    <th class="py-3 px-4">Precio</th>
                    <th class="py-3 px-4">Stock</th>
                    <th class="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-body-sm">
                  <tr v-if="adminFilteredProducts.length === 0">
                    <td colspan="5" class="py-8 text-center text-slate-400 font-body-sm">No se encontraron productos.</td>
                  </tr>
                  <tr v-for="p in adminFilteredProducts" :key="p.product_id" class="hover:bg-slate-50/70 transition-colors group">
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                          <img :src="p.image_url || 'https://via.placeholder.com/40x40.png?text=IMG'" class="w-full h-full object-cover">
                        </div>
                        <div>
                          <div class="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{{ p.name }}</div>
                          <div class="text-xs text-slate-500 font-mono">ID-{{ p.product_id }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">{{ getCategoryName(p.category_id) }}</span>
                    </td>
                    <td class="py-3 px-4 text-slate-900 font-semibold">${{ Number(p.price).toFixed(2) }}</td>
                    <td class="py-3 px-4">
                      <span v-if="p.stock === 0" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200">0 uds</span>
                      <span v-else-if="p.stock <= 5" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200">{{ p.stock }} uds</span>
                      <span v-else class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200">{{ p.stock }} uds</span>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <div class="inline-flex items-center gap-1">
                        <button @click="editProduct(p)" class="p-1.5 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"><span class="material-symbols-outlined text-base">edit</span></button>
                        <button @click="openDeleteModal(p)" class="p-1.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"><span class="material-symbols-outlined text-base">delete</span></button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="p-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
              <div>Total de productos gestionados: <span class="text-slate-900 font-semibold">{{ adminFilteredProducts.length }}</span></div>
            </div>
          </div>
        </section>

        <!-- ================= ADMIN CATEGORIES VIEW ================= -->
        <section v-else-if="currentView === 'admin-categories'" class="space-y-6">
          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 class="text-headline-xl font-bold text-slate-900">Gestión de Categorías</h1>
              <p class="text-body-md text-slate-500 mt-1 max-w-lg">Organiza las familias de productos.</p>
            </div>
            <button @click="openCategoryModal()" class="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-body-sm hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20">
              <span class="material-symbols-outlined text-base">add</span> Nueva Categoría
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <div v-for="cat in categoriesState" :key="cat.category_id" class="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 shadow-xs">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                      <span class="material-symbols-outlined text-lg">{{ cat.icon || 'category' }}</span>
                    </div>
                    <div>
                      <h3 class="text-headline-sm font-bold text-slate-900">{{ cat.name }}</h3>
                    </div>
                  </div>
                </div>
                <p class="text-body-sm text-slate-500 min-h-[36px]">{{ cat.description }}</p>
              </div>
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button @click="editCategory(cat)" class="text-xs text-slate-600 hover:text-blue-600 flex items-center gap-1 font-medium transition-colors">
                  <span class="material-symbols-outlined text-sm">edit</span> Editar
                </button>
                <button @click="deleteCategory(cat)" class="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors">
                  <span class="material-symbols-outlined text-sm">delete</span> Eliminar
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= ANALYTICS ================= -->
        <section v-else-if="currentView === 'analytics-mock'" class="space-y-6">
          <div class="bg-white p-10 rounded-xl border border-slate-200 shadow-xs text-center space-y-4">
            <span class="material-symbols-outlined text-5xl text-blue-500">insights</span>
            <h2 class="text-headline-lg font-bold text-slate-900">Métricas de Inventario y Movimiento</h2>
            <div class="pt-3">
              <button @click="switchView('admin-products')" class="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium text-body-sm hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20">Volver al Inventario</button>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- Modals -->
    <div v-if="isProductModalOpen" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white border border-slate-200 rounded-xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <span class="material-symbols-outlined text-lg">edit_note</span>
            </div>
            <div>
              <h3 class="text-headline-sm font-bold text-slate-900">{{ productForm.product_id ? 'Editar Producto' : 'Crear Producto' }}</h3>
            </div>
          </div>
          <button @click="isProductModalOpen = false" class="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <form @submit.prevent="saveProduct" class="p-6 overflow-y-auto custom-scroll space-y-4 flex-1">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-slate-700 mb-1">Nombre *</label>
              <input v-model="productForm.name" type="text" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-body-sm">
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Descripción *</label>
            <textarea v-model="productForm.description" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-body-sm" rows="2"></textarea>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Categoría *</label>
              <select v-model="productForm.category_id" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-body-sm">
                <option v-for="cat in categoriesState" :key="cat.category_id" :value="cat.category_id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">URL de Imagen</label>
              <input v-model="productForm.image_url" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-body-sm">
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Precio *</label>
              <input v-model="productForm.price" type="number" step="0.01" min="0.01" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-body-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Stock *</label>
              <input v-model="productForm.stock" type="number" min="0" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-body-sm">
            </div>
          </div>
          <div class="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button @click="isProductModalOpen = false" type="button" class="px-4 py-2 rounded-lg bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-all text-body-sm font-medium">Cancelar</button>
            <button type="submit" class="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-body-sm hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-500/20">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Category Modal -->
    <div v-if="isCategoryModalOpen" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 class="text-headline-sm font-bold text-slate-900">{{ categoryForm.category_id ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
          <button @click="isCategoryModalOpen = false" class="text-slate-400 hover:text-slate-700"><span class="material-symbols-outlined text-lg">close</span></button>
        </div>
        <form @submit.prevent="saveCategory" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Nombre *</label>
            <input v-model="categoryForm.name" type="text" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-body-sm focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Descripción</label>
            <textarea v-model="categoryForm.description" rows="2" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-body-sm focus:outline-none"></textarea>
          </div>
          <div class="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button @click="isCategoryModalOpen = false" type="button" class="px-4 py-2 rounded-lg bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-body-sm font-medium">Cancelar</button>
            <button type="submit" class="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-body-sm hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Docs Modal -->
    <div v-if="isDocsModalOpen" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 class="text-headline-sm font-bold text-slate-900 flex items-center gap-2"><span class="material-symbols-outlined text-blue-600">description</span> Documentación</h3>
          <button @click="isDocsModalOpen = false" class="text-slate-400 hover:text-slate-700"><span class="material-symbols-outlined text-lg">close</span></button>
        </div>
        <div class="space-y-3 text-body-sm text-slate-600">
          <p>Catálogo de clientes con filtros, panel administrativo de productos y categorías. Integración real con el backend Node + MySQL.</p>
        </div>
        <div class="pt-2 text-right"><button @click="isDocsModalOpen = false" class="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-medium text-body-sm hover:bg-blue-700">Cerrar</button></div>
      </div>
    </div>

    <div class="fixed bottom-5 right-5 z-50 space-y-2 pointer-events-none flex flex-col">
      <div v-for="t in toasts" :key="t.id" class="pointer-events-auto flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xl text-body-sm text-slate-800 min-w-[280px] max-w-md mt-2">
        <span class="material-symbols-outlined text-lg" :class="t.type === 'error' ? 'text-rose-600' : 'text-emerald-600'">{{ t.type === 'error' ? 'warning' : 'check_circle' }}</span>
        <div class="flex-1 font-medium">{{ t.msg }}</div>
      </div>
    </div>
    <!-- Cart Sidebar -->
    <div v-if="isCartOpen" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end">
      <div class="bg-white w-full max-w-md h-full shadow-2xl flex flex-col transition-transform duration-300">
        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <h3 class="text-headline-sm font-bold text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-blue-600">shopping_cart</span> Tu Carrito
          </h3>
          <button @click="isCartOpen = false" class="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto custom-scroll p-4 space-y-4">
          <div v-if="cart.length === 0" class="text-center py-12 text-slate-500">
            <span class="material-symbols-outlined text-4xl mb-2 opacity-50">remove_shopping_cart</span>
            <p class="text-body-sm">Tu carrito está vacío.</p>
          </div>
          <div v-else v-for="item in cart" :key="item.product.product_id" class="flex gap-3 p-3 rounded-xl border border-slate-200 bg-white shadow-xs">
            <img :src="item.product.image_url || 'https://via.placeholder.com/60x60.png?text=IMG'" class="w-16 h-16 rounded-lg object-cover border border-slate-100">
            <div class="flex-1 flex flex-col justify-between">
              <div class="flex justify-between items-start">
                <h4 class="text-body-sm font-semibold text-slate-900 line-clamp-1">{{ item.product.name }}</h4>
                <button @click="removeFromCart(item.product.product_id)" class="text-slate-400 hover:text-rose-500"><span class="material-symbols-outlined text-sm">delete</span></button>
              </div>
              <div class="flex items-center justify-between mt-2">
                <span class="text-body-sm font-bold text-slate-900">${{ (item.product.price * item.quantity).toFixed(2) }}</span>
                <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-1 py-0.5">
                  <button @click="updateCartQuantity(item, -1)" class="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-md">-</button>
                  <span class="text-xs font-semibold w-4 text-center">{{ item.quantity }}</span>
                  <button @click="updateCartQuantity(item, 1)" :disabled="item.quantity >= item.product.stock" :class="item.quantity >= item.product.stock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-200'" class="w-6 h-6 flex items-center justify-center text-slate-600 rounded-md">+</button>
                </div>
              </div>
              <span v-if="item.quantity >= item.product.stock" class="text-[10px] text-amber-600 font-medium mt-1">Máximo stock alcanzado</span>
            </div>
          </div>
        </div>

        <div v-if="cart.length > 0" class="p-6 border-t border-slate-200 bg-slate-50/70 space-y-4">
          <div class="flex items-center justify-between text-slate-900">
            <span class="text-body-md font-semibold">Total a pagar:</span>
            <span class="text-headline-sm font-bold">${{ cartTotal.toFixed(2) }}</span>
          </div>
          <button @click="checkout()" class="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-body-sm hover:bg-blue-700 shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-base">payments</span> Procesar Pedido
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Modal -->
    <div v-if="isConfirmModalOpen" class="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white border border-slate-200 rounded-xl w-full max-w-sm p-6 shadow-2xl space-y-4 text-center">
        <div class="w-12 h-12 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mb-2">
          <span class="material-symbols-outlined text-2xl">warning</span>
        </div>
        <h3 class="text-headline-sm font-bold text-slate-900">{{ confirmConfig.title }}</h3>
        <p class="text-body-sm text-slate-500">{{ confirmConfig.message }}</p>
        <div class="pt-4 flex items-center justify-center gap-3">
          <button @click="isConfirmModalOpen = false" class="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-body-sm transition-colors">Cancelar</button>
          <button @click="executeConfirm()" class="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 font-medium text-body-sm transition-colors shadow-sm shadow-rose-500/20">Aceptar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from './services/api';
import { useCartStore } from './stores/cart';

const currentView = ref('catalog');
const activeClientCategory = ref('ALL');
const isApiOnline = ref(true);
const clientSearch = ref('');
const adminSearch = ref('');
const adminCatFilter = ref('ALL');
const adminStockFilter = ref('ALL');

const categoriesState = ref([]);
const productsState = ref([]);
const toasts = ref([]);

const isProductModalOpen = ref(false);
const isCategoryModalOpen = ref(false);
const isDocsModalOpen = ref(false);

const productForm = ref({ product_id: '', name: '', description: '', category_id: '', price: '', stock: '', image_url: '' });
const categoryForm = ref({ category_id: '', name: '', description: '' });

const showToast = (msg, type = 'success') => {
  const id = Date.now();
  toasts.value.push({ id, msg, type });
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id); }, 3000);
};

const getCategoryName = (id) => {
  const cat = categoriesState.value.find(c => c.category_id === id);
  return cat ? cat.name : 'Desconocida';
};

const switchView = (v) => { currentView.value = v; };
const toggleApiStatus = () => { isApiOnline.value = !isApiOnline.value; };

const loadData = async () => {
  try {
    const cRes = await api.getCategories();
    if(cRes.success && cRes.data.length > 0) {
      categoriesState.value = cRes.data;
    } else {
      throw new Error("No data");
    }
    const pRes = await api.getProducts();
    if(pRes.success) {
      productsState.value = pRes.data.map(p => ({...p, active: true}));
    }
    isApiOnline.value = true;
  } catch (e) {
    isApiOnline.value = false;
    showToast('Modo Offline: Operando con datos locales', 'info');
    
    if (categoriesState.value.length === 0) {
      categoriesState.value = [
        { id: 1, name: 'Bebidas', icon: 'local_cafe', description: 'Cafés y tés.' },
        { id: 2, name: 'Comida', icon: 'restaurant', description: 'Platillos fuertes.' }
      ];
    }
  }
};

const clientFilteredProducts = computed(() => {
  let f = productsState.value;
  if(activeClientCategory.value !== 'ALL') f = f.filter(p => p.category_id === activeClientCategory.value);
  if(clientSearch.value) f = f.filter(p => p.name.toLowerCase().includes(clientSearch.value.toLowerCase()));
  return f;
});

const adminFilteredProducts = computed(() => {
  let f = productsState.value;
  if(adminCatFilter.value !== 'ALL') f = f.filter(p => p.category_id === adminCatFilter.value);
  if(adminStockFilter.value === 'AVAILABLE') f = f.filter(p => p.stock > 5);
  else if(adminStockFilter.value === 'LOW') f = f.filter(p => p.stock > 0 && p.stock <= 5);
  else if(adminStockFilter.value === 'OUT') f = f.filter(p => p.stock === 0);
  if(adminSearch.value) f = f.filter(p => p.name.toLowerCase().includes(adminSearch.value.toLowerCase()));
  return f;
});

const statTotal = computed(() => productsState.value.length);
const statAvailable = computed(() => productsState.value.filter(p => p.stock > 5).length);
const statLow = computed(() => productsState.value.filter(p => p.stock > 0 && p.stock <= 5).length);
const statOut = computed(() => productsState.value.filter(p => p.stock === 0).length);

const openProductModal = () => {
  productForm.value = { product_id: '', name: '', description: '', category_id: categoriesState.value[0]?.category_id || '', price: '', stock: '', image_url: '' };
  isProductModalOpen.value = true;
};
const editProduct = (p) => {
  productForm.value = { product_id: p.product_id, name: p.name, description: p.description, category_id: p.category_id, price: p.price, stock: p.stock, image_url: p.image_url };
  isProductModalOpen.value = true;
};
const saveProduct = async () => {
  if (productForm.value.price <= 0) return showToast('El precio debe ser mayor a 0', 'error');
  if (productForm.value.stock < 0) return showToast('El stock no puede ser negativo', 'error');
  try {
    if (isApiOnline.value) {
      if(productForm.value.product_id) await api.updateProduct(productForm.value.product_id, productForm.value);
      else await api.createProduct(productForm.value);
      await loadData();
    } else {
      if(productForm.value.product_id) {
        const idx = productsState.value.findIndex(p => p.product_id === productForm.value.product_id);
        if(idx > -1) productsState.value[idx] = { ...productForm.value };
      } else {
        const newId = productsState.value.length ? Math.max(...productsState.value.map(p => p.product_id)) + 1 : 1;
        productsState.value.push({ ...productForm.value, product_id: newId, active: true });
      }
    }
    isProductModalOpen.value = false;
    showToast('Producto guardado');
  } catch(e) { showToast('Error al guardar producto', 'error'); }
};
const cartStore = useCartStore();
const isCartOpen = ref(false);

const isConfirmModalOpen = ref(false);
const confirmConfig = ref({ title: '', message: '', action: null });

const openConfirmModal = (title, message, action) => {
  confirmConfig.value = { title, message, action };
  isConfirmModalOpen.value = true;
};
const executeConfirm = async () => {
  if (confirmConfig.value.action) await confirmConfig.value.action();
  isConfirmModalOpen.value = false;
};

const openDeleteModal = async (p) => {
  openConfirmModal(
    'Eliminar Producto',
    `¿Estás seguro de que deseas eliminar "${p.name}"? Esta acción no se puede deshacer.`,
    async () => {
      if (isApiOnline.value) {
        await api.deleteProduct(p.product_id);
        await loadData();
      } else {
        productsState.value = productsState.value.filter(x => x.product_id !== p.product_id);
      }
      showToast('Producto eliminado');
    }
  );
};

const openCategoryModal = () => { categoryForm.value = { category_id: '', name: '', description: '' }; isCategoryModalOpen.value = true; };
const editCategory = (c) => { categoryForm.value = { ...c }; isCategoryModalOpen.value = true; };
const saveCategory = async () => {
  try {
    if (isApiOnline.value) {
      if(categoryForm.value.category_id) await api.updateCategory(categoryForm.value.category_id, categoryForm.value);
      else await api.createCategory(categoryForm.value);
      await loadData();
    } else {
      if(categoryForm.value.category_id) {
        const idx = categoriesState.value.findIndex(c => c.category_id === categoryForm.value.category_id);
        if(idx > -1) categoriesState.value[idx] = { ...categoryForm.value };
      } else {
        const newId = categoriesState.value.length ? Math.max(...categoriesState.value.map(c => c.category_id)) + 1 : 1;
        categoriesState.value.push({ ...categoryForm.value, category_id: newId });
      }
    }
    isCategoryModalOpen.value = false;
    showToast('Categoría guardada');
  } catch(e) { showToast('Error al guardar', 'error'); }
};
const deleteCategory = async (c) => {
  openConfirmModal(
    'Eliminar Categoría',
    `¿Estás seguro de que deseas eliminar la categoría "${c.name}"?`,
    async () => {
      if (isApiOnline.value) {
        await api.deleteCategory(c.category_id);
        await loadData();
      } else {
        categoriesState.value = categoriesState.value.filter(x => x.category_id !== c.category_id);
      }
      showToast('Categoría eliminada');
    }
  );
};

const cartItemCount = computed(() => cartStore.itemCount);
const cartTotal = computed(() => cartStore.subtotal);

const clientAddToCart = (p) => {
  const ok = cartStore.addItem(p, 1);
  if (ok) showToast(`${p.name} añadido al carrito`);
  else showToast(`No hay suficiente stock para ${p.name}`, 'error');
};

const updateCartQuantity = (itemOrProduct, delta) => {
  if (itemOrProduct && itemOrProduct.product) {
    const productId = itemOrProduct.product.product_id;
    const newQty = Number(itemOrProduct.quantity) + Number(delta);
    cartStore.updateQuantity(productId, newQty);
  } else {
    // fallback: treat first arg as productId and second as absolute qty
    cartStore.updateQuantity(itemOrProduct, delta);
  }
};

const removeFromCart = (productId) => {
  cartStore.removeItem(productId);
};

const checkout = async () => {
  if (cartStore.items.length === 0) return;
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const items = cartStore.items.map(i => ({ product_id: i.product.product_id, quantity: i.quantity, unit_price: i.product.price }));
    const payload = { address_id: 1, items };
    const res = await api.post('/orders', payload, headers);
    if (res && res.status === 201 && res.data && res.data.success) {
      cartStore.clear();
      showToast('Pedido creado correctamente', 'success');
      isCartOpen.value = false;
    } else {
      const msg = res && res.data && res.data.error ? res.data.error.message || res.data.error : 'Error en el pedido';
      showToast(msg, 'error');
    }
  } catch (e) {
    showToast('Error al procesar el pedido', 'error');
  }
};

onMounted(() => {
  loadData();
});
</script>