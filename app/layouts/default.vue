<template>
  <div class="flex min-h-screen flex-col bg-slate-950 text-white">
    <Header />
    <main class="flex-1">
      <div class="container mx-auto">
        <slot />
      </div>
    </main>
    <Footer />
  </div>
</template>
