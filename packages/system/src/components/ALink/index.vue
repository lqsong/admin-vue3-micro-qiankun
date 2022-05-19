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
      
      /*  
      const router = useRouter();     
      const toLink = (href, navigate) => {
        const routerBase = router.options.history.base;
        const newHref = href.replace(routerBase, ""); // 微服务时考虑替换
        if(props.replace === true) {
          router.replace(newHref)
        } else {
          router.push(newHref)
        }
      } 
      */

      const router = useParentMainRouter() || useRouter(); // 判断是否在主应用中，如果在，用主应用跳转，因为routerBase不是空的，而且主应用tabNav需要
      const toLink = (href, navigate) => {       
        if(props.replace === true) {
          router.replace(href)
        } else {
          router.push(href)
        }
      }

      return {
          isExternal,
          toLink
      }
    }
})
</script>
