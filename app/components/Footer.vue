<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const year = new Date().getFullYear();
</script>

<template>
  <footer class="ds-footer" role="contentinfo" :aria-label="t('footer.ariaSite')">
    <div class="ds-footer-inner">
      <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div class="lg:col-span-4">
          <p class="text-sm font-semibold tracking-wide text-white">{{ t('brand.appName') }}</p>
          <p class="mt-2 max-w-md text-xs leading-relaxed sm:text-sm">
            {{ t('footer.tagline') }}
          </p>
        </div>

        <nav class="lg:col-span-2" :aria-label="t('footer.ariaAbout')">
          <h2 class="ds-footer-nav-heading">{{ t('footer.headingAbout') }}</h2>
          <ul class="space-y-2.5 text-sm">
            <li>
              <a href="#" class="ds-footer-link" @click.prevent>{{ t('footer.aboutMe') }}</a>
            </li>
            <li>
              <a href="#" class="ds-footer-link" @click.prevent>{{ t('footer.howItWorks') }}</a>
            </li>
            <li>
              <a href="#" class="ds-footer-link" @click.prevent>{{ t('footer.ourTeam') }}</a>
            </li>
          </ul>
        </nav>

        <nav class="lg:col-span-2" :aria-label="t('footer.ariaContact')">
          <h2 class="ds-footer-nav-heading">{{ t('footer.headingContact') }}</h2>
          <ul class="space-y-2.5 text-sm">
            <li>
              <a href="#" class="ds-footer-link" @click.prevent>{{ t('footer.contactUs') }}</a>
            </li>
            <li>
              <a href="#" class="ds-footer-link" @click.prevent>{{ t('footer.support') }}</a>
            </li>
            <li>
              <a href="#" class="ds-footer-link" @click.prevent>{{ t('footer.feedback') }}</a>
            </li>
          </ul>
        </nav>

        <nav class="lg:col-span-2" :aria-label="t('footer.ariaExplore')">
          <h2 class="ds-footer-nav-heading">{{ t('footer.headingExplore') }}</h2>
          <ul class="space-y-2.5 text-sm">
            <li>
              <a href="#" class="ds-footer-link" @click.prevent>{{ t('footer.browseShows') }}</a>
            </li>
            <li>
              <a href="#" class="ds-footer-link" @click.prevent>{{ t('footer.searchTips') }}</a>
            </li>
            <li>
              <a href="#" class="ds-footer-link" @click.prevent>{{ t('footer.faq') }}</a>
            </li>
          </ul>
        </nav>

        <nav class="sm:col-span-2 lg:col-span-2" :aria-label="t('footer.ariaLegal')">
          <h2 class="ds-footer-nav-heading">{{ t('footer.headingLegal') }}</h2>
          <ul class="space-y-2.5 text-sm">
            <li>
              <a href="#" class="ds-footer-link" @click.prevent>{{ t('footer.privacyPolicy') }}</a>
            </li>
            <li>
              <a href="#" class="ds-footer-link" @click.prevent>{{ t('footer.termsOfUse') }}</a>
            </li>
            <li>
              <a href="#" class="ds-footer-link" @click.prevent>{{ t('footer.cookies') }}</a>
            </li>
          </ul>
        </nav>
      </div>

      <div class="ds-footer-bottom">
        <p class="ds-footer-copyright">© {{ year }} {{ t('brand.appName') }}. {{ t('footer.allRightsReserved') }}</p>
        <a href="https://www.tvmaze.com/api" class="ds-footer-link-external" target="_blank" rel="noopener noreferrer">
          {{ t('footer.dataFromTvmaze') }}
        </a>
      </div>
    </div>
  </footer>
</template>
