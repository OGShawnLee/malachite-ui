<script lang="ts">
  import { Toggle } from '@app/components';
  import { Page } from '@app/layout';
  import {
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    RadioGroup,
    RadioGroupOption,
    Toolbar,
    ToolbarGroup,
    ToolbarItem,
    ToolbarLabel
  } from '$lib';
  import { useClassNameResolver } from '$lib/hooks';
  import { slide } from 'svelte/transition';

  const className = useClassNameResolver<'ACTIVE' | 'DISABLED'>({
    base: 'px-4 py-2 | flex items-center gap-1.75 | text-light text-left',
    disabled: 'opacity-50',
    active: 'bg-neutral-700 text-white'
  });
  const buttonClassName = useClassNameResolver<'PRESSED'>({
    base: 'px-4 py-2 | bg-neutral-800 outline-none | focus:(ring-2 ring-white)',
    pressed: { off: "text-neutral-500", on :'text-white'}
  });
  const radioItemClasName = useClassNameResolver<'SELECTED'>({
    base: 'px-4 py-2 | grid place-content-center | bg-neutral-800 | outline-none focus:(ring-2 ring-white)',
    selected: { off: "text-neutral-500", on :'text-white'}
  });

  let fontFamily = 'Poppins';

  function handleClick(this: HTMLElement) {
    if (this.textContent) fontFamily = this.textContent;
  }

  let bold = false;
  let italic = false;
  let underline = false;
  let textAlign = 'text-left';
  let vertical = false;
</script>

<Page title="Toolbar">
  <svelte:fragment slot="options">
    <Toggle text="Toggle Vertical" bind:checked={vertical} />
  </svelte:fragment>
  <div class="grid gap-9">
    <ToolbarGroup class="grid gap-3" as="div">
      <ToolbarLabel class="text-white">Text Formatting</ToolbarLabel>
      <Toolbar
        class="p-4 | flex gap-3 bg-neutral-800/30 focus-within:(ring-2 ring-neutral-700)"
        {vertical}
      >
        <ToolbarItem
          class="px-4 py-2 | bg-neutral-800 outline-none | focus:(ring-2 ring-white) {bold
            ? 'text-white'
            : 'text-neutral-500'}"
          on:click={() => (bold = !bold)}
        >
          <span class="sr-only">Toggle Text Bold</span>
          <i class="bx bx-bold" />
        </ToolbarItem>
        <Button class={buttonClassName} bind:pressed={italic}>
          <span class="sr-only">Toggle Text Italic</span>
          <i class="bx bx-italic" />
        </Button>
        <Button class={buttonClassName} bind:pressed={underline}>
          <span class="sr-only">Toggle Text Underline</span>
          <i class="bx bx-underline" />
        </Button>
        <Menu class="relative | flex flex-col items-start gap-3" let:isOpen>
          <MenuButton class="button button--medium">
            {fontFamily}
          </MenuButton>
          <div class="absolute top-15" slot="items" transition:slide|local>
            <MenuItems class="w-40 | grid | bg-neutral-800 outline-none" static>
              <MenuItem class={className} on:click={handleClick}>Victor Mono</MenuItem>
              <MenuItem class={className} on:click={handleClick}>Poppins</MenuItem>
              <MenuItem class={className} on:click={handleClick}>JetBrains Mono</MenuItem>
              <MenuItem class={className} on:click={handleClick}>Lato</MenuItem>
              <MenuItem class={className} on:click={handleClick}>Fira Code</MenuItem>
            </MenuItems>
          </div>
        </Menu>
        <RadioGroup class="contents" bind:value={textAlign}>
          <RadioGroupOption class={radioItemClasName} value="text-left">
            <i class="bx bx-align-left" />
          </RadioGroupOption>
          <RadioGroupOption class={radioItemClasName} value="text-center">
            <i class="bx bx-align-middle" />
          </RadioGroupOption>
          <RadioGroupOption class={radioItemClasName} value="text-right">
            <i class="bx bx-align-right" />
          </RadioGroupOption>
          <RadioGroupOption class={radioItemClasName} value="text-justify">
            <i class="bx bx-align-justify" />
          </RadioGroupOption>
        </RadioGroup>
      </Toolbar>
    </ToolbarGroup>
    <p
      class={textAlign}
      class:font-bold={bold}
      class:italic
      class:underline
      style="font-family: {fontFamily};"
    >
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe magni delectus nam consequatur
      architecto illo provident aperiam ad quaerat, nobis ea id fuga exercitationem error unde autem
      eum inventore debitis quasi explicabo, ratione consectetur? Magnam non culpa sint omnis
      repudiandae similique molestiae vero ipsa, atque, velit autem inventore recusandae dicta
      deleniti veniam! Reiciendis assumenda ratione commodi eos illo odio facilis facere quos saepe
      eveniet natus sequi tempore quidem est iste maxime error at ex omnis deleniti vel, laborum sit
      dolore. Obcaecati voluptate eveniet itaque dolorum unde. Quis voluptates vitae qui!
    </p>
  </div>
</Page>
