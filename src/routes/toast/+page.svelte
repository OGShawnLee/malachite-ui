<script lang="ts">
  import type { ToastObject } from '$lib/types';
  import { Toast, ToastGroup, useToast } from '$lib';
  import { Page } from '@app/layout';
  import { slide } from 'svelte/transition';

  interface EmojiToast extends ToastObject {
    emoji: string;
  }

  let toast = useToast<EmojiToast>(undefined, {
    info: "bg-neutral-800",
    success: "bg-green-800",
    warning: "bg-yellow-800",
    error: "bg-red-800"
  });

  function add() {
    const random = Math.random();
    if (random >= 0.75) {
      toast.push({
        message: 'This is a success toast',
        type: 'success',
        emoji: '🎉'
      });
    } else if (random >= 0.5 && random < 0.75) {
      toast.push({
        message: 'This is an error toast',
        emoji: '😢',
        type: 'error'
      });
    } else if (random >= 0.25 && random < 0.75) {
      toast.push({
        message: 'This is a warning toast',
        emoji: '⚠️',
        type: 'warning'
      });
    } else {
      toast.push({
        message: 'This is an info toast',
        emoji: '📣',
        type: 'info'
      });
    }
  }
</script>

<Page title="Toast">
  <div>
    <button class="button button--medium" on:click={add}> Add Toast </button>
  </div>
  <ToastGroup
    class="fixed bottom-6 z-10 right-1/2 transform translate-x-1/2 w-md | grid gap-12px"
    {toast}
  >
    {#each $toast as { id, message, emoji, type } (id)}
      <div transition:slide={{ duration: 150 }}>
        <Toast
          class="px-22px py-12px | flex items-center justify-between | {
            toast.getToastTypeClassName(type)
          } rounded-8px"
          {id}
          let:close
        >
          <div class="flex gap-3">
            <p class="text-xl">{emoji}</p>
            <p class="text-lg">{message}</p>
          </div>
          <button class="text-sm bg-transparent" on:click={close}>Close</button>
        </Toast>
      </div>
    {/each}
  </ToastGroup>
</Page>
