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
import useRestRouter from '@/composables/useRestRouter';
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
      const router = useRestRouter();
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
