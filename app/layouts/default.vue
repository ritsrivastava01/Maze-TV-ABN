<template>
  <div class="flex min-h-screen flex-col bg-slate-950 text-white">
    <Header />
    <main id="main-content" class="flex-1">
      <div class="container mx-auto">
        <slot />
      </div>
    </main>
    <Footer />
  </div>
</template>
