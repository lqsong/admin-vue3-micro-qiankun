<template>
  <a v-if="isExternal(to)" :href="to" target="_blank" rel="noreferrer">
    <slot></slot>
  </a>
  <router-link
    v-else
    :to="to"
    custom
    v-slot="{ href,  navigate }"
  >
    <a v-if="target==='_blank'" :href="href" :target="target">
     <slot></slot>
    </a>
    <a v-else :href="href" @click.prevent="toLink(href, navigate)">
      <slot></slot>
    </a>

  </router-link>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from 'vue-router';
import useParentMainRouter from '@/composables/useParentMainRouter';
import { isExternal } from '@/utils/validate';
export default defineComponent({
  name: 'ALink',
  props: {
      target: {
        type: String,
        default: '_self'
      },
      to: {
          type: String,
          required: true
      },
      replace: {
          type: Boolean,
          default: false
      }
  },
  setup(props) {

    const pRouter = useParentMainRouter(); // 主框架路由
    const router = useRouter(); // 当前子框架路由
    const toLink = (href, navigate) => {
      if(pRouter){
        // 判断在主应用中，如果在，用主应用跳转，主应用tabNav需要
        const baseLen = pRouter.options.history.base.length;
        const pHref = href.substring(baseLen);
        if(props.replace === true) {
          pRouter.replace(pHref)
        } else {
          pRouter.push(pHref)
        }
      } else {
        if(props.replace === true) {
          router.replace(href)
        } else {
          router.push(href)
        }
      }

    }

    return {
        isExternal,
        toLink
    }
  }
})
</script>
