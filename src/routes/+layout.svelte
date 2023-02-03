<script lang="ts">
  import 'virtual:windi.css';
	import { Header } from '@app/layout';
</script>

<Header/>

<div class="w-full mx-auto mt-16 mb-12 px-4 | layout-length | md:(mt-24) lg:(mt-6 px-0)">
  <slot />
</div>
