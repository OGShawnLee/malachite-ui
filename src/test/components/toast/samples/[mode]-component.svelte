<script>
  import { Toast, ToastGroup, useToast } from '$lib';

  export let toast = useToast(3000);
</script>

<ToastGroup data-testid="toast-container" {toast}>
  {#each $toast as { id, message, type } (id)}
    <Toast data-testid="toast" {id} let:close>
      <p>{message}</p>
      <p>{type}</p>
      <button data-testid="toast-close-button" on:click={close}>Close</button>
    </Toast>
  {/each}
</ToastGroup>
