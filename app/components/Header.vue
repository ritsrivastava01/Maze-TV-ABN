<script setup lang="ts">
import {PhList, PhMagnifyingGlass, PhX} from '@phosphor-icons/vue';
import {computed, nextTick, onBeforeUnmount, ref, watch} from 'vue';
import {useFetch} from 'nuxt/app';
import {useI18n} from 'vue-i18n';
import {useAppNavigation} from '#imports';
import type {
  HeaderViewModel,
  LayoutNavCategory
} from '../../domains/layout/viewModel/layoutViewModel.type';

const {locale, t} = useI18n();
const {selectedCategory, setCategory} = useAppNavigation();
const isMobileMenuOpen = ref(false);
const isSearchOpen = ref(false);
const searchQuery = ref('');
const menuPanel = ref<HTMLElement | null>(null);
const localeOptions = [
  {code: 'en', label: 'EN'},
  {code: 'nl', label: 'NL'}
] as const;

//fetch header nav items
const {data: headerNavItemsData} = useFetch<HeaderViewModel>('/api/layout');

const navItems = computed(() => {
  return (headerNavItemsData.value?.headerNavItems ?? []).map((item) => ({
    value: item.value as LayoutNavCategory,
    label: t(item.labelKey)
  }));
});

// used to style the active locale link
const getLocaleLinkClass = (localeCode: string): string => {
  return locale.value === localeCode
    ? 'bg-white text-black'
    : 'text-white hover:bg-white/10';
};

// used to select a category and close the mobile menu (if open)
const selectCategory = async (category: LayoutNavCategory): Promise<void> => {
  await setCategory(category);
  isMobileMenuOpen.value = false;
};

// used to close the mobile menu (if open) when the user clicks outside of the menu
watch(
  isMobileMenuOpen,
  (isOpen) => {
    if (typeof window === 'undefined') {
      return;
    }

    if (isOpen) {
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement) {
        activeElement.blur();
      }
      nextTick(() => {
        const firstMenuButton =
          menuPanel.value?.querySelector<HTMLElement>('input, button');
        firstMenuButton?.focus();
      });
    }

    document.body.style.overflow = isOpen ? 'hidden' : '';
  },
  {immediate: true}
);

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
</script>

<template>
  <header class="absolute inset-x-0 z-50 bg-transparent">
    <div class="mx-auto container px-4 sm:px-6 lg:px-10">
      <div
        class="grid h-16 grid-cols-[auto_1fr] items-center gap-3 lg:grid-cols-3"
      >
        <nav
          class="hidden gap-6 text-sm text-slate-200 lg:flex lg:justify-self-start"
        >
          <button
            v-for="item in navItems"
            :key="item.value"
            type="button"
            class="transition hover:text-white"
            :class="
              selectedCategory === item.value ? 'font-semibold text-white' : ''
            "
            @click="selectCategory(item.value)"
          >
            {{ item.label }}
          </button>
        </nav>

        <NuxtLink
          to="/"
          class="justify-self-start text-2xl font-black tracking-[0.18em] text-pink-400 sm:text-3xl sm:tracking-[0.25em] lg:justify-self-center"
        >
          {{ t('brand.appName') }}
        </NuxtLink>

        <div class="flex items-center gap-3 justify-self-end">
          <button
            class="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/20"
            type="button"
            :aria-label="t('actions.search')"
            @click.stop="isSearchOpen = !isSearchOpen"
          >
            <PhMagnifyingGlass
              v-if="!isSearchOpen"
              class="h-4 w-4 text-white"
              weight="bold"
            />
            <PhX v-else class="h-4 w-4 text-white" weight="bold" />
          </button>

          <div
            class="hidden h-10 items-center gap-1 rounded-full border border-white/30 bg-black/20 p-1 lg:flex"
          >
            <template
              v-for="(option, index) in localeOptions"
              :key="option.code"
            >
              <SwitchLocalePathLink
                :locale="option.code"
                class="inline-flex h-8 items-center rounded-full px-2 text-xs font-semibold transition"
                :class="getLocaleLinkClass(option.code)"
              >
                {{ option.label }}
              </SwitchLocalePathLink>
              <span
                v-if="index < localeOptions.length - 1"
                class="text-white/40"
              >
                |
              </span>
            </template>
          </div>

          <button
            class="hidden h-10 items-center rounded-full border border-white/40 bg-black/20 px-4 text-sm font-semibold transition hover:bg-white/10 lg:inline-flex"
            type="button"
          >
            {{ t('actions.signUp') }}
          </button>

          <button
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-white/40 bg-black/20 lg:hidden"
            type="button"
            aria-label="Toggle menu"
            @click.stop="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <PhList
              v-if="!isMobileMenuOpen"
              class="h-5 w-5 text-white"
              weight="bold"
            />
            <PhX v-else class="h-5 w-5 text-white" weight="bold" />
          </button>
        </div>
      </div>

      <div v-if="isSearchOpen" class="pb-2">
        <div
          class="flex h-10 w-full items-center gap-2 rounded-full border border-white/30 bg-black/20 px-3"
        >
          <PhMagnifyingGlass class="h-4 w-4 text-slate-200" weight="bold" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('actions.search')"
            class="w-full bg-transparent text-sm text-white placeholder:text-slate-300 focus:outline-none"
          />
        </div>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <div
      v-show="isMobileMenuOpen"
      class="fixed inset-0 z-40 bg-black/75 lg:hidden"
      @click="isMobileMenuOpen = false"
    />
    <div
      v-show="isMobileMenuOpen"
      ref="menuPanel"
      class="fixed inset-x-4 top-14 z-50 mx-auto max-w-full rounded-xl border border-white/20 bg-slate-900/95 p-2 shadow-2xl lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
      tabindex="-1"
    >
      <button
        v-for="item in navItems"
        :key="`mobile-${item.value}`"
        type="button"
        class="mb-1 block w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-white/10"
        :class="
          selectedCategory === item.value
            ? 'bg-white/15 text-white'
            : 'text-slate-200'
        "
        @click="selectCategory(item.value)"
      >
        {{ item.label }}
      </button>

      <hr class="my-2 border-white/20" />

      <div class="mb-2 flex items-center justify-between px-2 py-1">
        <span class="text-xs font-medium tracking-[0.08em] text-slate-300">
          {{ t('labels.switchLanguage') }}
        </span>
        <div
          class="flex h-9 items-center gap-1 rounded-full border border-white/30 bg-black/30 p-1"
        >
          <template
            v-for="(option, index) in localeOptions"
            :key="`mobile-${option.code}`"
          >
            <SwitchLocalePathLink
              :locale="option.code"
              class="inline-flex h-7 items-center rounded-full px-2 text-xs font-semibold transition"
              :class="getLocaleLinkClass(option.code)"
            >
              {{ option.label }}
            </SwitchLocalePathLink>
            <span v-if="index < localeOptions.length - 1" class="text-white/40">
              |
            </span>
          </template>
        </div>
      </div>

      <button
        type="button"
        class="mt-2 block w-full rounded-full border border-white/40 bg-black/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        {{ t('actions.signUp') }}
      </button>
    </div>
  </Teleport>
</template>
