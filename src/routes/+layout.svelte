<script lang="ts">
	import "virtual:windi.css";
</script>

<header class="fixed top-0 inset-x-0 z-90 h-16 | md:h-24 lg:static">
	<div class="w-full h-full mx-auto px-4 | layout-length | flex items-center gap-12 | lg:px-0">
		<div>
			<a class="font-bold font-poppins text-2xl text-white md:text-4xl" href="/"> Malachite </a>
		</div>
  </div>
</header>

<div class="w-full mx-auto mt-16 mb-12 px-4 | layout-length | md:(mt-24) lg:(mt-6 px-0)">
	<slot />
</div>
