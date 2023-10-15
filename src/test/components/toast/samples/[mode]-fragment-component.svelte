<script>
  import { Toast, ToastGroup, useToast } from '$lib';

  export let toast = useToast(3000);
</script>

<ToastGroup as="fragment" {toast} let:toastgroup>
  <div data-testid="toast-container" use:toastgroup>
    {#each $toast as { id, message, type } (id)}
      <Toast as="fragment" {id} let:close let:item>
        <div data-testid="toast" use:item>
          <p>{message}</p>
          <p>{type}</p>
          <button data-testid="toast-close-button" on:click={close}>Close</button>
        </div>
      </Toast>
    {/each}
  </div>
</ToastGroup>
