<script setup>
import Layout from '@/layout/index.vue'
import { useRoute } from 'vue-router'
import other from '@/router/other.js'
import { onMounted } from 'vue'

// 当前路由
const route = useRoute()

// 获取 URL 参数中的语言
const url = new URL(window.location.href)
const lang = url.searchParams.get('lang') || '' // 可能为 '' 或 'fr' 等

function clearAllGoogtransCookies() {
  // 删除当前域 Cookie
  document.cookie = 'googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT'

  // 删除主域 Cookie（如 .example.com）
  const domainParts = location.hostname.split('.')
  if (domainParts.length >= 2) {
    const rootDomain = '.' + domainParts.slice(-2).join('.')
    document.cookie = `googtrans=;domain=${rootDomain};path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}

function setTranslateCookie(from = 'zh-CN', to = '') {
  clearAllGoogtransCookies()
  const value = `/auto/${to}`
  document.cookie = `googtrans=${value};path=/`
}

// function autoTranslate(lang) {
// 	document.cookie = ``
//   // 设置 hash（必须）
//   if (!location.hash.includes('#googtrans')) {
//     location.hash = `#googtrans=/zh-CN/${lang}`
//   }
//   // 设置 cookie（必须）
//   setTranslateCookie('zh-CN', lang)
// }

function autoTranslate(lang) {
  const hash = `#googtrans=/zh-CN/${lang}`
  if (!location.hash.includes('#googtrans')) {
    location.hash = hash
  }
  setTranslateCookie('zh-CN', lang)
}
// 定义全局 callback
window.googleTranslateElementInit = function () {
  new window.google.translate.TranslateElement(
    {
      pageLanguage: 'zh-CN',
      includedLanguages: '',
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
    },
    'google_translate_element'
  )
}

onMounted(() => {
  if (lang && lang !== 'zh-CN') {
    autoTranslate(lang)

    // 动态加载 Google 翻译脚本（只加载一次）
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      document.body.appendChild(script)
    }
  }
})
</script>

<template>
  <!-- 翻译挂载点（必须存在） -->
  <div id="google_translate_element" style="display: none"></div>

  <template v-if="other.some((item) => route.name === item.name)">
    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component
          v-if="route.meta.keepAlive"
          :key="route.name"
          :is="Component"
        />
      </keep-alive>
      <component
        v-if="!route.meta.keepAlive"
        :key="route.name"
        :is="Component"
      />
    </router-view>
  </template>
  <template v-else-if="route.path !== '/'">
    <Layout />
  </template>
</template>
