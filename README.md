# Malachite UI

**Malachite UI** is a **component library** inspired by _Tailwind's Headless UI_. Built completely from scratch in _TypeScript_ for **Svelte**, designed to work nicely with CSS Frameworks like **Tailwind CSS** or **WindiCSS**.

## Table of contents

- [Malachite UI](#malachite-ui)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
  - [Building](#building)
  - [Features](#features)
  - [Components](#components)
    - [Accordion](#accordion)
    - [Dialog](#dialog)
    - [Disclosure](#disclosure)
    - [Menu](#menu)
    - [Navigable](#navigable)
    - [Popover](#popover)
    - [Switch](#switch)
    - [Tabs](#tabs)

## Installation

```
npm install malachite-ui -D
```

```
pnpm add malachite-ui -D
```

## Building

Make sure to import components from `malachite-ui/components` to trigger tree-shaking. For some reason it doesn't work from `malachite-ui`.

## Features

- **Functional**: Sit down and relax. Most components will handle all logic and state on their own.
- **Headless**: Build beautiful and unique components, we don't stand in your way.
- **Reactive**: Worry no more, components will react instantly to any prop changes.
- **Svelte Friendly**: All components are handled individually by a single action, meaning you can extract and use them on vanilla DOM elements, this way you have absolute control. You can use Svelte directives like transitions!

  ```html
  <Disclosure let:button let:panel let:close>
    <button use:button>Toggle</button>
    <div slot="panel" use:panel transition:fade>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
      <button on:click="{close}">Close Me</button>
    </div>
  </Disclosure>
  ```

- **Maximum Styling**: No more convoluted classNames. Most components support what I call **Object ClassNames** and **Switch ClassNames** (Don't know if other libraries have this but it's cool nonetheless):

  ```html
  <PopoverButton class="{{ base: 'button', open: 'button--open' }}"> Toggle </PopoverButton>
  <Tab class="{{ base:'tab', selected: { on: 'tab--selected', off: 'tab-unselected' } }}">
    The Tab
  </Tab>
  <!-- we support functional classNames too! -->
  <PopoverButton class={({ isOpen }) => "button `${isOpen ? 'button--open' : ''}`"}>
    Toggle
  </PopoverButton>
  <!-- or you can use the Svelte way -->
  <Popover let:button let:isOpen>
    <button class="button" button--open="{isOpen}" use:button>Toggle</button>
  </Popover>
  ```

  You can import and use the **useClassNameResolver hook** and apply it to normal HTML elements if you are using actions:

  ```html
  <script lang="ts">
    import { useClassNameResolver } from 'malachite-ui/hooks';

    let isDarkTheme = false;
    const resolve = useClassNameResolver<'isChecked' | 'isDisabled'>({
      base: 'switch',
      disabled: 'switch--disabled',
      checked: { on: 'switch--checked', off: 'switch--unchecked' }
    });
  </script>

  <Switch as="slot" bind:checked="{isDarkTheme}" let:button let:isChecked let:isDisabled>
    <button class="{resolve({ isChecked, isDisabled })}" use:button on:click="{toggleDarkTheme}">
      <span class="sr-only"> Toggle Dark Theme </span>
    </button>
  </Switch>
  ```

  This might seem like **overkill** if you are using **simple and short classNames**, however if you are using **utility CSS frameworks** like **Tailwind CSS** and **WindiCSS** you will very likely have a **substantial amount of classNames**, in that case this really comes in handy for **better readability**.

  ```html
  <AccordionItem let:isOpen let:header let:panel>
    <h2 use:header class="h-12">
      <AccordionButton
        class="{{
          base: 'w-full py-2 px-0 | button-reset border-b-blue-50 outline-none transition duration-150 ease-in',
          open: { on: 'font-bold focus:text-soft-violet', off: 'focus:text-soft-red' },
        }}"
      >
        <span class="flex items-center justify-between">
          <span class="text-[13.5px] sm:text-base md:text-lg"> {question} </span>
          <img
            class="transform duration-150 ease-in"
            class:rotate-180="{isOpen}"
            src="{iconArrow}"
            alt=""
          />
        </span>
      </AccordionButton>
    </h2>
    <div slot="panel" use:panel transition:slide="{{ duration: 175, easing: quadOut }}">
      <p class="text-xs sm:text-sm md:text-base">{answer}</p>
    </div>
  </AccordionItem>
  ```

## Components

### Accordion

```html
<Accordion let:accordion let:isOpen>
  <AccordionItem let:button let:header let:panel let:close let:isOpen>
    <AccordionHeader let:header let:isOpen>
      <AccordionButton class="{{ base: 'button', open:'button--open' }}" let:button let:isOpen>
        First Item
      </AccordionButton>
    </AccordionHeader>
    <AccordionPanel let:panel let:close>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
      <button on:click="{close}">Close Me</button>
    </AccordionPanel>
  </AccordionItem>
</Accordion>
```

### Dialog

```html
<script lang="ts">
  let open = false;
  let ref: HTMLElement;
</script>

<button on:click="{() => open = !open}">Toggle</button>

<dialog bind:open initialFocus="{ref}">
  <DialogContent let:close>
    <DialogTitle> Delete Account </DialogTitle>
    <DialogDescription> Are you sure about that? </DialogDescription>
    <div>
      <button on:click="{nuke}">Go Ahead</button>
      <button bind:this="{ref}" on:click="{close}">Cancel</button>
    </div>
  </DialogContent>
</dialog>
```

### Disclosure

```html
<Disclosure let:button let:panel let:isOpen>
  <DisclosureButton class="{{ base: 'button', open:'button--open' }}" let:button let:isOpen>
    First Item
  </DisclosureButton>
  <DisclosurePanel let:panel let:close>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
    <button on:click="{close}">Close Me</button>
  </DisclosurePanel>
</Disclosure>
```

### Menu

```html
<menu let:button let:items>
  <MenuButton class="{{ base: 'button', open: 'button--open' }}" let:button let:isOpen>
    Toggle
  </MenuButton>
  <MenuItems let:items>
    <menuitem class="{{ base: 'item', selected: 'item--selected' }}" let:item let:isSelected>
      Edit
    </menuitem>
  </MenuItems>
</menu>
```

### Navigable

```html
<Navigable finite global vertical let:navigable>
  <NavigableItem
    class="{{ base:'item', disabled:{ on:'item--disabled', off:'item--enabled' } }}"
    let:item
  >
    First Item
  </NavigableItem>
  <NavigableItem
    class="{{ base:'item', disabled:{ on:'item--disabled', off:'item--enabled' } }}"
    let:item
  >
    Second Item
  </NavigableItem>
  <NavigableItem
    class="{{ base:'item', disabled:{ on:'item--disabled', off:'item--enabled' } }}"
    let:item
  >
    Third Item
  </NavigableItem>
</Navigable>
```

### Popover

```html
<Popover let:button let:overlay let:panel let:isOpen>
  <PopoverOverlay let:overlay />
  <PopoverButton class="{{ base: 'button', open:'button--open' }}" let:button let:isOpen>
    First Item
  </PopoverButton>
  <PopoverPanel let:panel let:close>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
    <button on:click="{close}">Close Me</button>
  </PopoverPanel>
</Popover>

<!-- Popover Group -->

<PopoverGroup let:isOpen let:areAllOpen let:areAllClosed let:overlay>
  <PopoverOverlay let:overlay />
  <Popover let:button let:panel let:isOpen>
    <PopoverButton class="{{ base: 'button', open:'button--open' }}" let:button let:isOpen>
      First Item
    </PopoverButton>
    <PopoverPanel let:panel let:close>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
      <button on:click="{close}">Close Me</button>
    </PopoverPanel>
  </Popover>
  <Popover let:button let:panel let:isOpen>
    <PopoverButton class="{{ base: 'button', open:'button--open' }}" let:button let:isOpen>
      First Item
    </PopoverButton>
    <PopoverPanel let:panel let:close>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
      <button on:click="{close}">Close Me</button>
    </PopoverPanel>
  </Popover>
</PopoverGroup>
```

### Switch

```html
<Switch checked let:button let:label let:description on:click="{toggle}">
  <SwitchLabel class="sr-only" let:isChecked let:label> Toggle </SwitchLabel>
  <SwitchDescription class="sr-only" let:isChecked let:descriptions>
    Toggle Dark Theme
  </SwitchDescription>
</Switch>

<!-- Switch Group -->

<SwitchGroup>
  <SwitchLabel passive> Turn on Notifications </SwitchLabel>
  <SwitchDescription>
    We will send you notifications about our latest products once a week
  </SwitchDescription>
  <Switch class="{{ base: 'switch', checked: 'switch--checked' }}" on:click="{toggle}" />
</SwitchGroup>
```

### Tabs

```html
<TabGroup let:tabList let:tabPanels>
  <TabList let:tabList>
    <Tab class="{{ base: 'tab', selected: 'tab--selected' }}" let:tab let:isSelected>
      First Tab
    </Tab>
  </TabList>
  <TabPanels let:tabPanels>
    <TabPanel let:panel> First Panel </TabPanel>
  </TabPanels>
</TabGroup>
```
