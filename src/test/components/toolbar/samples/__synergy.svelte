<script lang="ts">
  import type { Maybe } from '$lib/types';
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
    ToolbarLabel
  } from '$lib';

  function handleClick(this: HTMLElement) {
    if (this.textContent) fontFamily = this.textContent;
  }

  export let vertical: Maybe<boolean> = undefined;

  let fontFamily = 'Poppins';
  let textAlign = 'text-left';
</script>

<ToolbarGroup>
  <ToolbarLabel data-testid="toolbar-label" />
  <Toolbar data-testid="toolbar" {vertical}>
    <Button data-testid="button" />
    <Button data-testid="button" />
    <Button data-testid="button" />
    <Menu class="relative | flex flex-col items-start gap-3">
      <MenuButton data-testid="menu-button">
        {fontFamily}
      </MenuButton>
      <MenuItems data-testid="menu-panel">
        <MenuItem data-testid="menu-item" on:click={handleClick}>Victor Mono</MenuItem>
        <MenuItem data-testid="menu-item" on:click={handleClick}>Poppins</MenuItem>
        <MenuItem data-testid="menu-item" on:click={handleClick}>JetBrains Mono</MenuItem>
        <MenuItem data-testid="menu-item" on:click={handleClick}>Lato</MenuItem>
        <MenuItem data-testid="menu-item" on:click={handleClick}>Fira Code</MenuItem>
      </MenuItems>
    </Menu>
    <RadioGroup data-testid="radio-group" bind:value={textAlign}>
      <span data-testid="text-align-value">{textAlign}</span>
      <RadioGroupOption data-testid="radio-group-option" value="text-left">
        <span data-testid="radio-group-option-value">text-left</span>
      </RadioGroupOption>
      <RadioGroupOption data-testid="radio-group-option" value="text-center">
        <span data-testid="radio-group-option-value">text-center</span>
      </RadioGroupOption>
      <RadioGroupOption data-testid="radio-group-option" value="text-right">
        <span data-testid="radio-group-option-value">text-right</span>
      </RadioGroupOption>
      <RadioGroupOption data-testid="radio-group-option" value="text-justify">
        <span data-testid="radio-group-option-value">text-justify</span>
      </RadioGroupOption>
    </RadioGroup>
  </Toolbar>
</ToolbarGroup>
