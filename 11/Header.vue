<script setup>
import { ref, watch, nextTick, onMounted, getCurrentInstance } from 'vue'
import CardHeader from '@/components/card-header.vue'
import { useUserStore } from '@/store'
import { useRouter, useRoute } from 'vue-router'
import nav from '@/router/nav'
import recommendedActivity from '@/assets/img/card-header/innovation-trading-center.png'
import navExtra1 from '@/router/extra'
import navExtra2 from '@/router/extra-mul'
import navTemp from '@/router/temp'
import Menu from '@/assets/svg/header-menu.svg'
import Close from '@/assets/svg/header-close.svg'
import newMore from '@/assets/svg/new-more.svg'
import comfirm from '@/components/comfirm/index.ts'
import { cloneDeep } from 'lodash'
import noLogo from '@/assets/svg/no-login.svg'
import SvgIcon from '@/components/SvgIcon.vue'
import Logo from '@/components/Logo.vue'
import { getAssetsImg } from '@/util'
import notification from '@/assets/img/header/userInfoFun/notification.png'
import { goLogin } from '@/util/index.js'
import { isMobile } from '@/util'
import MemberType from '@/components/member-type.vue'
import UserInformation from '@/components/user-information.vue'

const routes = cloneDeep(nav)
const instance = getCurrentInstance()
// const lang =
const navExtra = [...navExtra1, ...navExtra2]
routes.forEach((item) => {
  if (item.name === 'innovationTradingCenter') {
    item.navExtra = navExtra
  }
})
const userStore = useUserStore()

if (userStore.userInfo && userStore.userInfo.roleList?.includes('PT-JGF')) {
  const currentTemp = navTemp.find((item) => item.name === 'hyhj')
  if (currentTemp) {
    currentTemp.meta.disabled = false
  }
}
const routersMore = [
  {
    name: 'moreContent',
    navExtra: navTemp,
    meta: {
      title: '增值服务',
      navExtra: navExtra,
      extra: true,
      disabledMore: true
    }
  }
]
// if (!isMobile()) {
// routes.push({

//   name: 'moreContent',
//   navExtra: navTemp,
//   meta: {
//     title: '更多功能1',
//     navExtra: navExtra,
//     extra: true,
//     disabledMore: true
//   }
// })
// }
const langs = [
  {
    name: '中文',
    value: 'zh-CN'
  },
  {
    name: 'English',
    value: 'en'
  },
  {
    name: 'French',
    value: 'fr'
  },
  {
    name: '日语',
    value: 'ja'
  },
  {
    name: '韩语',
    value: 'ko'
  },
  {
    name: '中文繁体',
    value: 'zh-TW'
  },
  {
    name: '葡萄牙语',
    value: 'pt'
  }
]
const route = useRoute()
const currenLang = langs.find((item) => item.value === route.query.lang)
const lang = currenLang ? currenLang.value : 'zh-CN'

const router = useRouter()
const showUser = ref(false)
const extraRoutes = ref(navExtra)
const isExtra = ref(false)
const active = ref(route.name)
const titleRef = ref([])
const extraCurName = ref('')
const currentShow = ref(false)
const sipleNode = ref({
  parent: null,
  navExtra: []
})
const isHoverUser = ref(false)
const changeLang = (value) => {
  const url = new URL(window.location.href)

if (value === 'zh-CN') {
  url.searchParams.delete('lang')
} else {
  url.searchParams.set('lang', value)
}

// 跳转到新 URL（含或不含 lang）
window.location.href = url.toString()
  

 
}
const navigationPosition = () => {
  if (navExtra.some((item) => item.name === route.name)) {
    active.value = 'innovationTradingCenter'
    // extraCurName.value = route.name;
    extraRoutes.value = navExtra
    nextTick(() => {
      initExtra(route)
    })
  } else {
    // extraCurName.value = '';
    active.value = route.name
  }

  isExtra.value = false
  if (route.meta.extra) {
    initExtra(route)
  }
}
watch(() => route.name, navigationPosition)
const initExtra = (route) => {
  extraCurName.value = route.name

  extraRoutes.value = navExtra
}
const useDoption = isMobile()
  ? [
      { label: '后台管理', key: 'table', icon: 'admin', type: 'url' },
      { label: '我的订单', key: 'MyOrder', icon: 'order' },
      { label: '企业积分', key: 'myStatistics', icon: 'my-statistics' },
      { label: '我的咨询', key: 'myConsult', icon: 'my-consult' },
      { label: '退出登录', key: 'logout', icon: 'logout' }
    ]
  : [
      {
        label: '会员中心',
        key: 'personalCenter',
        icon: 'personal-center',
        type: 'personalCenter'
      },
      { label: '后台管理', key: 'table', icon: 'admin', type: 'url' },
      { label: '我的订单', key: 'MyOrder', icon: 'order' },
      { label: '企业积分', key: 'myStatistics', icon: 'my-statistics' },
      { label: '我的咨询', key: 'myConsult', icon: 'my-consult' },
      { label: '退出登录', key: 'logout', icon: 'logout' }
    ]

onMounted(() => {
  navigationPosition()
})

const handleChange = (e) => {
  // debugger;
  if (e === 'moreContent' || e === 'innovationTradingCenter') {
    return
  }
  router.push({ name: e })
}

const onClickDoption = (item) => {
  showUser.value = false
  if (item.type === 'url') {
    window.open(`${window.location.origin}/ocean/home/dashboard`, '_blank')
  } else {
    if (item.key === 'logout') {
      userStore.logout()
    } else {
      router.push({
        name: item.key
      })
    }
  }
}
const handleClickExtra = (item) => {
  if (item.meta.disabled) {
    return
  }
  if (item.meta.url) {
    if (
      item.name === 'MarineNumericalSimulationPlatform' ||
      item.name === 'DeepseaDigitalCollaborationPlatform'
    ) {
      if (!userStore.isLogin) {
        goLogin(instance)
        return
      }
      // else if (!userStore.userInfo.vipInfo) {
      //   comfirm({
      //     type: 'CustomMessageMember',
      //     title: '提示',
      //     confirmText: '报名成功',

      //     onConfirm: () => {
      //       window.open(`${window.location.origin}/marine-technology/personal-center`);
      //     },

      //   })
      //   return
      // }
    }
    window.open(item.meta.url, '_blank')
    return
  }
  isExtra.value = false
  extraCurName.value = item.name

  router.push({ name: item.name })
}
watch(
  () => currentShow.value,
  () => {
    const body = document.body

    if (currentShow.value) {
      body.style.overflow = 'hidden'
    } else {
      body.style.overflow = 'inherit'
    }
  }
)
const handleClickMenu = (item) => {
  currentShow.value = false

  handleClickExtra(item)
}
const closeMenu = () => {
  currentShow.value = !currentShow.value
}
const hoverExtraCurName = ref('')
let timer = null
let extraTimer = null
let inExtra = false
const mouseoverHandle = (item, e) => {
  if (timer !== null) {
    clearTimeout(timer)
  }
  if (extraTimer !== null) {
    clearTimeout(extraTimer)
  }
  if (item.meta.extra) {
    timer = setTimeout(() => {
      timer = null
      hoverExtraCurName.value = item.name
      isExtra.value = true
      sipleNode.value = {
        parent: item.name !== 'moreContent' ? item : null,
        navExtra: item.navExtra
      }
    }, 300)
  }
}
const mouseoutHandle = (item) => {
  if (timer !== null) {
    clearTimeout(timer)
    timer = null
  }
  if (extraTimer !== null) {
    clearTimeout(extraTimer)
  }
  extraTimer = setTimeout(() => {
    if (timer === null) {
      if (item.meta.extra && !inExtra) {
        isExtra.value = false
      }
    } else {
      clearTimeout(timer)
    }
  }, 300)
}

const extraMouseover = (e) => {
  inExtra = true
  isExtra.value = true
}
const extraMouseout = (e) => {
  isExtra.value = false
  inExtra = false
}
</script>

<template>
  <header class="header-top" :class="heanderBackGound ? 'header-content' : ''">
    <div class="container-header-mobile">
      <div class="logo-conatiner">
        <Logo :style="{ height: '56px' }" />
      </div>
      <div class="header-mobile">
        <nav>
          <ul>
            <li v-if="!currentShow">
              <div
                @click="showUser = !showUser"
                v-if="userStore.userInfo.headPortrait"
              >
                <img
                  v-show="!showUser && !currentShow"
                  v-imageError
                  :src="userStore.userInfo.headPortrait"
                  alt=""
                  srcset=""
                  class="user-avatar"
                />
                <img
                  v-show="showUser"
                  :src="Close"
                  alt="close"
                  class="user-avatar"
                />
              </div>
              <img
                v-show="!userStore.userInfo.headPortrait"
                v-imageError
                :src="noLogo"
                alt=""
                srcset=""
                @click="goLogin(instance)"
                class="user-avatar"
              />
            </li>
            <li @click="closeMenu" v-if="!showUser">
              <img v-show="!currentShow" :src="Menu" alt="menu" /><img
                v-show="currentShow"
                :src="Close"
                alt="close"
              />
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="container-header">
      <div class="header-div">
        <div class="bussine-title">
          <Logo />
        </div>
        <div style="position: relative">
          <div class="tabs-container">
            <a-tabs :active-key="active" @tab-click="handleChange">
              <a-tab-pane
                :key="tab.name"
                :title="tab.meta.title"
                v-for="tab in routes"
                :disabled="tab.meta.disabled"
              >
                <template #title>
                  <div
                    v-if="tab.meta.extra"
                    ref="titleRef"
                    @mouseout="(e) => mouseoutHandle(tab, e)"
                    @mouseover="(e) => mouseoverHandle(tab, e)"
                    class="tab-title"
                    :class="
                      isExtra && hoverExtraCurName === tab.name
                        ? 'tab-title-active'
                        : ''
                    "
                  >
                    <span :class="tab.meta.disabled ? 'disabled' : ''">{{
                      tab.meta.title
                    }}</span>
                    <span class="icon-down">
                      <SvgIcon name="icon-down-v1" />
                    </span>
                  </div>
                  <div v-else class="tab-title tab-title-hover">
                    {{ tab.meta.title }}
                  </div>
                </template>
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>
      </div>
    </div>
    <div class="header-top-right">
      <div v-if="!userStore.isLogin" class="login-register">
        <div style="margin-right: 8px">
          <a-select
            :style="{ width: '100px' }"
            placeholder=""
            v-model="lang"
            @change="changeLang"
            :trigger-props="{ autoFitPopupMinWidth: true }"
          >
            <a-option
              v-for="item in langs"
              :key="item.value"
              :value="item.value"
              >{{ item.name }}</a-option
            >
            <!-- <a-option>英文</a-option>
            <a-option>法语</a-option> -->
          </a-select>
        </div>
        <div>
          <div class="tabs-container-more">
            <a-tabs :active-key="active" @tab-click="handleChange">
              <a-tab-pane
                :key="tab.name"
                :title="tab.meta.title"
                v-for="tab in routersMore"
                :disabled="tab.meta.disabled"
              >
                <template #title>
                  <div
                    v-if="tab.meta.extra"
                    ref="titleRef"
                    @mouseout="(e) => mouseoutHandle(tab, e)"
                    @mouseover="(e) => mouseoverHandle(tab, e)"
                    class="tab-title tab-title-more"
                    :class="
                      isExtra && hoverExtraCurName === tab.name
                        ? 'tab-title-active'
                        : ''
                    "
                  >
                    <span class="all-icon">
                      <SvgIcon
                        name="Union"
                        :iconStyle="{ width: '16px', height: '16px' }"
                      />
                    </span>
                    <img :src="newMore" alt="" />
                    <span :class="tab.meta.disabled ? 'disabled' : ''">{{
                      tab.meta.title
                    }}</span>
                    <span class="icon-down">
                      <SvgIcon name="icon-down-v1" />
                    </span>
                  </div>
                  <div v-else class="tab-title tab-title-hover">
                    {{ tab.meta.title }}
                  </div>
                </template>
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>
        <a-button @click="goLogin(instance)" type="primary"
          >登录 | 注册</a-button
        >
      </div>
      <div v-else class="user-info-fun">
        <div style="margin-right: 8px">
          <a-select
            :style="{ width: '100px' }"
            placeholder=""
            v-model="lang"
            @change="changeLang"
            :trigger-props="{ autoFitPopupMinWidth: true }"
          >
            <a-option
              v-for="item in langs"
              :key="item.value"
              :value="item.value"
              >{{ item.name }}</a-option
            >
            <!-- <a-option>英文</a-option>
            <a-option>法语</a-option> -->
          </a-select>
        </div>
        <div type="notification">
          <img v-imageError :src="notification" alt="" />
        </div>
        <div>
          <div class="tabs-container-more">
            <a-tabs :active-key="active" @tab-click="handleChange">
              <a-tab-pane
                :key="tab.name"
                :title="tab.meta.title"
                v-for="tab in routersMore"
                :disabled="tab.meta.disabled"
              >
                <template #title>
                  <div
                    v-if="tab.meta.extra"
                    ref="titleRef"
                    @mouseout="(e) => mouseoutHandle(tab, e)"
                    @mouseover="(e) => mouseoverHandle(tab, e)"
                    class="tab-title tab-title-more"
                    :class="
                      isExtra && hoverExtraCurName === tab.name
                        ? 'tab-title-active'
                        : ''
                    "
                  >
                    <span class="all-icon">
                      <SvgIcon
                        name="Union"
                        :iconStyle="{ width: '16px', height: '16px' }"
                      />
                    </span>
                    <img :src="newMore" alt="" />
                    <span :class="tab.meta.disabled ? 'disabled' : ''">{{
                      tab.meta.title
                    }}</span>
                    <span class="icon-down">
                      <SvgIcon name="icon-down-v1" />
                    </span>
                  </div>
                  <div v-else class="tab-title tab-title-hover">
                    {{ tab.meta.title }}
                  </div>
                </template>
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>
        <div class="userInfo" :class="isHoverUser ? 'userInfo-hover' : ''">
          <img v-imageError :src="userStore.userInfo.headPortrait" alt="" />
        </div>
        <div
          class="drop-down"
          @mouseover="isHoverUser = true"
          @mouseout="isHoverUser = false"
        >
          <div class="drop-down-info">
            <div class="info-avatar">
              <img
                v-imageError
                :src="userStore.userInfo.headPortrait"
                class="user-avatar"
              />
            </div>
            <div class="userName-certification">
              <div>{{ userStore.userInfo?.userName }}</div>
              <div class="user-level">
                <MemberType
                  v-if="userStore.userInfo.vipInfo"
                  :typeName="
                    userStore.userInfo.vipInfo
                      ? userStore.userInfo.vipInfo.vipType
                      : '0'
                  "
                />
                <MemberType
                  :typeName="
                    userStore.userInfo.enterprise &&
                    userStore.userInfo.enterprise.state === 'success'
                      ? '0'
                      : '00'
                  "
                />
              </div>
            </div>
          </div>
          <div class="drop-down-link">
            <div
              v-for="item in useDoption"
              :key="item.key"
              class="link-item"
              @click="onClickDoption(item)"
            >
              <div :class="item.icon !== 'logout' ? 'icon-color' : ''">
                <SvgIcon
                  :name="item.icon"
                  :iconStyle="{ width: '40px', height: '40px' }"
                />
              </div>
              <div>
                {{ item.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="title-extra"
      :class="isExtra ? 'title-extra-active' : ''"
      @mouseout="extraMouseout"
      data-type="out"
      @mouseover="extraMouseover"
    >
      <div class="title-extra-content">
        <div
          class="parent-content"
          :class="
            extraCurName === sipleNode.parent?.name
              ? 'parent-content-select'
              : ''
          "
          v-if="sipleNode.parent"
          @click.stop="handleClickExtra(sipleNode.parent)"
        >
          <CardHeader
            :titleCN="sipleNode.parent.meta.title"
            :titleUS="recommendedActivity"
            :alignment="true"
          >
            <icon-right />
          </CardHeader>
        </div>
        <div class="child-content" :class="sipleNode.parent ? '' : 'grid-4'">
          <div
            class="extra-item"
            :class="
              item.meta.disabled
                ? ''
                : `extra-item-hover ${
                    extraCurName === item.name ? 'extra-item-select' : ''
                  }`
            "
            @click.stop="handleClickExtra(item)"
            v-for="item in sipleNode.navExtra"
            :key="item.name"
          >
            <div class="extra-item-content">
              <div class="extra-item-content-icon">
                <img
                  :src="getAssetsImg(`header/extraNav/${item.name}.png`)"
                  alt=""
                />
              </div>
              <div class="extra-item-content-text">
                <div
                  type="title"
                  :class="item.meta.disabled ? 'title-disable' : ''"
                >
                  {{ item.meta.title }}
                </div>
                <div type="content">{{ item.meta.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <div class="container-mobile-menu" v-show="currentShow">
    <div v-for="menu in routes" @click.stop="handleClickMenu(menu)">
      <div
        class="level1"
        :class="extraCurName === menu.name ? 'child-active' : ''"
      >
        <span :class="menu.meta.disabledMore ? 'disabled' : ''">{{
          menu.meta.title
        }}</span
        ><icon-right v-if="!menu.meta.disabled" />
      </div>
      <template v-if="menu.navExtra">
        <div
          class="level2"
          @click.stop="handleClickMenu(child)"
          v-for="child in menu.navExtra"
          :class="extraCurName === child.name ? 'child-active' : ''"
        >
          <span :class="child.meta.disabled ? 'disabled' : ''">{{
            child.meta.title
          }}</span
          ><icon-right v-if="!child.meta.disabled" />
        </div>
      </template>
    </div>
  </div>
  <div class="container-mobile-user" v-show="showUser">
    <UserInformation
      @onClick="
        (key) => {
          router.push({ name: key })
          showUser = !showUser
        }
      "
    />
    <div
      v-for="(item, index) in useDoption"
      :key="index"
      @click="onClickDoption(item)"
    >
      <div class="doption-item">
        <SvgIcon
          :name="item.icon"
          :iconStyle="{ width: '32px', height: '32px' }"
        />
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
:deep(.arco-tabs-nav-ink) {
  display: none;
}

.tab-extra-position {
  left: 82px;
}

.user-avatar {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

@hover-color: #f5f8ff;

@media screen and (max-width: 899px) {
  .logo-conatiner {
    position: absolute;
    top: 0;
    left: 1.6rem;
    z-index: 10;
  }

  .header-top {
    position: sticky;
    top: 0;
    display: flex;
    font-size: var(--body-font-size-16);
    align-items: center;
    height: 56px;
    width: 100%;
    display: flex;
    justify-content: center;
    // z-index: 999;
    background: #ffffff;
    z-index: 10;
  }

  .container-mobile-user {
    position: fixed;
    top: 56px !important;
    border-radius: 0;
    width: 100%;
    z-index: 100;
    height: calc(100vh - 56px);
    padding: 16px;
    background: white;

    .doption-item {
      display: flex;
      align-items: center;
      padding: 16px 0;
    }
  }

  .container-mobile-menu {
    position: fixed;
    top: 56px !important;
    border-radius: 0;
    width: 100%;
    z-index: 100;
    height: calc(100vh - 56px);
    padding: 16px 24px;
    background: white;
    overflow-y: scroll;

    .arco-dropdown {
      border: 0;
      border-radius: 0;
    }

    .level1,
    .level2 {
      display: flex;
      padding: 12px 0;
      margin-bottom: 8px;
      align-items: center;
      .set-font-content(var(--body-font-size-16), var(--title-weight-500), rgba(var(--rgb-title-1), 1), 1.5, left);

      span {
        flex: 1;
      }
    }

    .child-active {
      .set-font-content(var(--body-font-size-16), var(--title-weight-500), rgba(var(--primary-6), 1), 1.5, left);
    }

    .level2 {
      font-weight: var(--title-weight-normal);
      margin-left: 32px;
    }

    .disabled {
      .set-font-content(var(--body-font-size-16), var(--title-weight-normal), rgba(var(--rgb-title-1), 0.4), 1.5, left);
    }
  }

  .container-header {
    display: none;
  }

  .header-top-right {
    display: none;
  }

  .container-header-mobile {
    font-family: Alibaba PuHuiTi 2;

    // .header-mobile {
    //   position: relative;
    //   font-size: 2rem;
    //   font-weight: bold;
    //   line-height: 1.4;
    //   letter-spacing: 0em;
    //   color: #1D2129;

    nav {
      position: absolute;
      right: 0;
      top: 0;
      height: 56px;
      padding-right: 2rem;

      ul {
        margin-bottom: 0;
        display: flex;
        align-items: center;
        height: 100%;
      }

      li {
        height: 24px;
        width: 24px;
        position: relative;
        margin-left: 1.6rem;

        > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }

  // }
}

.icon-down-common {
  .justify-align-center();
  transition: all 0.3s;
}

@media screen and (min-width: 900px) {
  .container-header-mobile {
    display: none;
  }

  .container-mobile-menu {
    display: none;
  }

  .tab-title {
    .justify-align-center();

    .icon-down {
      .icon-down-common();
    }
  }

  .tab-title-more {
    position: relative;
    height: 32px;
    font-size: 14px;
    background: #e8effe;
    padding: 0 8px;
    margin-right: 8px;
    .justify-align-center();

    span {
      .justify-align-center();
    }

    img {
      position: absolute;
      top: -6px;
      right: -8px;
    }

    .all-icon {
      margin-right: 8px;
    }
  }

  .tab-title-hover {
    &:hover {
      color: rgb(var(--primary-6));

      .icon-down {
        transform: rotate(-180deg);
      }
    }
  }

  .tab-title-active {
    color: rgb(var(--primary-6));

    .icon-down {
      transform: rotate(-180deg);
    }
  }

  .innovation-trading-center {
    position: relative;
  }

  .arco-tabs-tab:hover {
    .title-extra {
      display: block;
      z-index: 100;
    }
  }

  .title-nav-content {
    position: relative;
  }

  .title-extra {
    overflow: hidden;
    height: 0;
    width: 100%;
    position: absolute;
    top: 4em;
    left: 0;
    background: white;
    transition: all 0.3s;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);

    // padding: 10px 0;
    .title-extra-content {
      display: flex;
      .view-content-width(var(--content-body-width-1200));

      .parent-content {
        padding: 3em 6.5625em 0 3em;
        background: url('../assets/img/header/parent-bg.png') no-repeat center
          center;
        background-size: cover;

        > span {
          margin-right: 0.25em;
        }

        &:hover {
          .hover-pointer();
        }
      }

      .parent-content-select {
        .hover-pointer();
      }

      .child-content {
        flex: 1;
        padding: 1.5em;
        .set-grid(3, 1em);

        .extra-item {
          .extra-item-content {
            display: flex;

            .extra-item-content-icon {
              margin-right: 1em;
            }

            // padding: 1.5em;
            .extra-item-content-text {
              line-height: 1.5;

              div[type='title'] {
                color: rgb(var(--rgb-title-1));
                font-size: 1em;
                font-weight: 500;
              }

              div[type='content'] {
                margin-top: 0.25em;
                color: rgba(var(--rgb-title-1), 0.4);
                font-size: 0.875em;
                .ellipsis(2);
              }

              .title-disable {
                color: rgba(var(--rgb-title-1), 0.4) !important;
              }
            }
          }

          padding: 1.5em;
          font-size: 1em;
          font-weight: normal;
          line-height: 1.5;
          letter-spacing: 0em;
          font-variation-settings: 'opsz' auto;
          /* a文本/次强调正文标题 */
          color: rgba(29, 33, 41, 0.8);

          .active {
            color: #3d75f5;
          }
        }

        .hover {
          cursor: pointer;
          background: @hover-color;

          .title {
            color: #3d75f5;
          }
        }

        .extra-item-hover {
          &:hover {
            .hover();

            div[type='title'] {
              color: #3d75f5 !important;
            }
          }
        }

        .extra-item-select {
          .hover();
        }
      }

      .grid-4 {
        .set-grid(4, 1em);
      }

      .disabled {
        color: #aaa;
        cursor: not-allowed;
      }
    }
  }

  .title-extra-active {
    height: auto;
    overflow: inherit;
    // padding: 1px 0;
  }

  :deep(.arco-tabs-content) {
    padding: 0;
  }

  .user-info {
    width: 151px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .bussine-title {
    font-family: Alibaba PuHuiTi 2;
    font-size: 24px;
    font-weight: bold;
    line-height: 24px;
    letter-spacing: 0em;
    margin-right: 32px;
    font-variation-settings: 'opsz' auto;
    /* a文本/强调正文标题 */
    color: #1d2129;
    // margin-right: 48px;
  }

  :deep(.arco-tabs) {
    overflow: inherit;
    background: white;

    .arco-tabs-nav {
      overflow: inherit;
      background: white;

      .arco-tabs-nav-tab {
        overflow: inherit;
        background: white;

        .arco-tabs-tab-title {
          opacity: 1;
          font-size: inherit;

          padding: 0;
          line-height: 4em;
        }
      }
    }
  }

  .header-div {
    width: 1440px;
    height: 100%;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .container-header {
    height: 56px;
    position: relative;
  }

  .container-768 {
    display: none;
  }

  #header {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .login-btn {
    width: 80px;
    height: 40px;
    border-radius: 40px;
  }

  .header-top {
    position: sticky;
    top: 0;
    display: flex;
    font-size: var(--body-font-size-16);
    align-items: center;
    height: 4em;
    width: 100%;
    z-index: 10;
    background: #ffffff;
  }

  .header-content {
    background: #fafafc;
  }

  .header-top-left {
    display: flex;
    align-items: center;
    justify-content: center;

    :deep(.arco-tabs-content) {
      display: none;
    }

    img {
      width: 185px;
      height: 24px;
      margin-right: 50px;
      object-fit: cover;
    }
  }

  .header-top-right {
    margin-left: 10%;
    display: flex;
    align-items: center;
    font-size: inherit;
    position: absolute;
    right: 0;

    .user-info-fun {
      display: flex;
      position: relative;

      div[type='notification'] {
        padding: 1.25em;
        display: none;
      }

      > div {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .hover-common-userInfo {
        .hover-pointer();

        .icon-down {
          transform: rotate(-180deg);
        }
      }

      .userInfo {
        height: 64px;
        padding: 1em;
        color: rgb(var(--rgb-title-1));
        font-weight: var(--title-weight-500);
        .justify-align-center();

        > img {
          width: 32px;
        }

        .icon-down {
          .icon-down-common();
          margin-left: 0.5em;
        }

        > span:first-child {
          max-width: 8.5em;

          .ellipsis(1);
        }

        &:hover {
          .hover-common-userInfo();
        }

        &:hover + .drop-down {
          display: initial;
          width: 320px;
        }
      }

      .userInfo-hover {
        .hover-common-userInfo() !important;
      }

      .drop-down {
        &:hover {
          display: initial;
          width: 320px;
        }
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.6);
        display: none;
        position: absolute;
        top: 64px;
        right: 0;
        z-index: 999;
        width: 100%;
        background: rgb(var(--content-bg-color));
        border-radius: 0 0 0.25em 0.25em;
        padding-bottom: 1em;

        .drop-down-info {
          .justify-align-center();
          padding: 1em;

          .info-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            outline: 4px solid white;
            > img {
              width: 100%;
              height: 100%;
            }
          }

          .userName-certification {
            flex: 1;
            margin-left: 16px;

            color: rgb(var(--rgb-title-1));
            font-weight: var(--title-weight-500);

            .user-level {
              display: flex;
              margin-top: 8px;
              height: 18px;
            }
          }
        }

        .drop-down-link {
          font-size: 0.875em;
          .set-grid(3, 0.5em);
          padding: 0 0.5em;

          .link-item {
            .justify-align-center();
            flex-direction: column;
            padding: 0.5em 0.25em;
            background: white;
            border-radius: 0.25em;
            color: rgba(var(--rgb-title-1), 0.4);

            .icon-color {
              color: rgb(var(--rgb-title-1));
            }

            &:hover {
              .hover-pointer();

              .icon-color {
                color: rgb(var(--primary-6));
              }
            }
          }
        }
      }
    }
  }

  .login-register {
    .justify-align-center();
    font-weight: 400;
    line-height: 1.5;
    margin-right: 20px;
    cursor: pointer;
    /* 主色/常规 */
    color: #3d75f5;
  }

  :deep(.arco-tabs-nav-type-line .arco-tabs-tab) {
    padding: 0;
    font-size: inherit;
  }
}

@media screen and (min-width: 1921px) {
  .tabs-container {
    width: 1440px;
    overflow-x: hidden;
    padding-right: 100px;
    .tab-extra-position();
  }

  .tabs-container-more {
    // padding-right: 100px;
    .tab-extra-position();
  }

  .title-extra {
    .title-extra-content {
      .view-content-width(var(--content-body-width-1400));
    }
  }
}
</style>
