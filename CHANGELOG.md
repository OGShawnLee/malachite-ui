# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.7.1](https://github.com/OGShawnLee/malachite-ui/compare/v0.7.0...v0.7.1) (2022-06-10)


### ⚠ BREAKING CHANGES

* **predicate:** return store predicate with generic any

### Features

* **component:** improve context validation ([91d14e4](https://github.com/OGShawnLee/malachite-ui/commit/91d14e40541fede7cbfb9b15f2dec8066a55d25b))
* **predicate:** add isInterface predicate function ([15c6f83](https://github.com/OGShawnLee/malachite-ui/commit/15c6f839a2ca3aa1f04cad9f19ad2f1ba4891ec7))
* **tabs:** dont wait until mount to render panel ([221e315](https://github.com/OGShawnLee/malachite-ui/commit/221e315ad5956b2601a32ddac60ae72623f8a289))


### Bug Fixes

* **accordion:** only set role heading if Header is not a heading element ([e557210](https://github.com/OGShawnLee/malachite-ui/commit/e5572103cc34e22ef5075763fb1deb158d88df3b))
* **component:** expose use prop with correct type ([f8a8743](https://github.com/OGShawnLee/malachite-ui/commit/f8a874380e3bc0d26460e7431a7ffafb4dbc48bd))
* **utils:** make sure setAttribute overwrite works in Svelte actions ([77c88d9](https://github.com/OGShawnLee/malachite-ui/commit/77c88d911ece27f3b0a14543a25757c39ab820da))


* **predicate:** return store predicate with generic any ([8448604](https://github.com/OGShawnLee/malachite-ui/commit/8448604d38ddcf3556cf9c11d6bd91653096050b))

## [0.7.0](https://github.com/OGShawnLee/malachite-ui/compare/v0.6.2...v0.7.0) (2022-05-13)

### ⚠ BREAKING CHANGES

- **tabs:** remove isActive slot prop

### Features

- **component:** add accordion component ([2416eb0](https://github.com/OGShawnLee/malachite-ui/commit/2416eb09f03ed558b9dbbdd9c827300d9fc19a25))

### Bug Fixes

- **component:** prevent scrolling while using a navigable component ([ace1ecf](https://github.com/OGShawnLee/malachite-ui/commit/ace1ecf106434e20292d236aa5071fff7bcf376a))

- **tabs:** remove isActive slot prop ([6163b08](https://github.com/OGShawnLee/malachite-ui/commit/6163b0887c1d857726b9e3d2954e0f3945711fb3))

### [0.6.2](https://github.com/OGShawnLee/malachite-ui/compare/v0.6.1...v0.6.2) (2022-05-09)

### Bug Fixes

- **popover:** forceFocus no longer prevents closing via button click ([3a3d8fc](https://github.com/OGShawnLee/malachite-ui/commit/3a3d8fc97d86af36d29db55cd0826ae19e07ad1f))

### [0.6.1](https://github.com/OGShawnLee/malachite-ui/compare/v0.6.0...v0.6.1) (2022-05-09)

### Bug Fixes

- **ts:** correct NullableRecursively syntax typo ([23e0184](https://github.com/OGShawnLee/malachite-ui/commit/23e01841548d9413238afca9aeb11da38a4780bb))

## [0.6.0](https://github.com/**OGShawnLee**/malachite-ui/compare/v0.5.1...v0.6.0) (2022-05-09)

### Features

- **component:** add menu component ([1806a23](https://github.com/OGShawnLee/malachite-ui/commit/1806a2307694087d759606484109da1febe550ab))
- **component:** add support for advanced className prop ([00a18b5](https://github.com/OGShawnLee/malachite-ui/commit/00a18b5f8447481dec59cc27bd37d1dfdede6537))
- **hooks:** add useClassNameResolver hook ([c31f784](https://github.com/OGShawnLee/malachite-ui/commit/c31f78457da72afb43a49b9686239aef8f93d690))
- improve tree-shaking ([a8bf994](https://github.com/OGShawnLee/malachite-ui/commit/a8bf9948c2d234b20fe8bbea4855eea312d86067))
- **switch:** forward Switch click events ([d47b155](https://github.com/OGShawnLee/malachite-ui/commit/d47b155a7c678afe1e291b4859ee3acf578a1a21))
- **tabs:** expose Tab active state via isActive slot prop ([a6e5132](https://github.com/OGShawnLee/malachite-ui/commit/a6e513242bfbac998be75ee75b7bcf73b72b85ff))

### Bug Fixes

- **tabs:** expose TabGroup disabled state via isDisabled slot prop ([0f76c4e](https://github.com/OGShawnLee/malachite-ui/commit/0f76c4e04a7f1fe03b8069e804072e311ae931eb))

### [0.5.1](https://github.com/OGShawnLee/malachite-ui/compare/v0.4.0...v0.5.1) (2022-05-01)

### Bug Fixes

- **package:** export library entry point properly ([8ba97f7](https://github.comOGShawnLee/malachite-ui/commit/8ba97f7699c2c1b4094acfbcbf1b40e0af93a3ff))

## [0.5.0](https://github.com/OGShawnLee/malachite-ui/compare/v0.4.0...v0.5.0) (2022-04-30)

### Features

- **component:** add tabs component ([d4dfba8](https://github.com/OGShawnLee/malachite-ui/commit/d4dfba83603d8d80e8da26acf4c7d685b91b992a))

### Bug Fixes

- **ts:** add missing Expand type ([d9cd128](https://github.com/OGShawnLee/malachite-ui/commit/d9cd128b2f0a7ff9db0e60111b5edc0a96be4da8))

### [0.4.2](https://github.com/OGShawnLee/malachite-ui/compare/v0.4.0...v0.4.2) (2022-04-24)

### Bug Fixes

- **dialog:** hide scrollbar while dialog is open ([9b9f5cf](https://github.com/OGShawnLee/malachite-ui/commit/9b9f5cf284095f56e227fdd11b34dfda122d711c))
- **disclosure:** prevent focusing panel children during outro transition ([72e9097](https://github.com/OGShawnLee/malachite-ui/commit/72e9097f3200cac404ad91786d93a77865845082))

### [0.4.1](https://github.com/OGShawnLee/malachite-ui/compare/v0.4.0...v0.4.1) (2022-04-23)

### Bug Fixes

- **dialog:** expose description action properly ([e093174](https://github.com/OGShawnLee/malachite-ui/commit/e09317454873839c0e3b9e6d05c475eb3ef433db))

## [0.4.0](https://github.com/OGShawnLee/malachite-ui/compare/v0.3.0...v0.4.0) (2022-04-23)

### Features

- **component:** add switch component ([cf5a889](https://github.com/OGShawnLee/malachite-ui/commit/cf5a8894504782d3916d5d0d1e97965fe266e471))

## [0.3.0](https://github.com/OGShawnLee/malachite-ui/compare/v0.2.0...v0.3.0) (2022-04-23)

### Features

- **component:** add popover component ([497c555](https://github.com/OGShawnLee/malachite-ui/commit/497c555198dcaa82bb6578fdf4280bdfcc3f6547))
- **component:** add popover group component ([7fbc4f2](https://github.com/OGShawnLee/malachite-ui/commit/7fbc4f29f50c663dd873c36bbc4f9dbff86e15bf))

### Bug Fixes

- only throw unset context error when using strict ([9cdf50a](https://github.com/OGShawnLee/malachite-ui/commit/9cdf50a34346b05484a8aed997dd58dd755aa4ec))

## [0.2.0](https://github.com/OGShawnLee/malachite-ui/compare/v0.1.0...v0.2.0) (2022-04-23)

### Features

- **component:** add dialog component ([707a74c](https://github.com/OGShawnLee/malachite-ui/commit/707a74cac44d72c874f5f2344ab2ece0e6ad711f))

### Bug Fixes

- forward className properly ([dc137e7](https://github.com/OGShawnLee/malachite-ui/commit/dc137e72d939169fa32239da05a69f109576cd35))
- **ts:** add missing type ([382d45f](https://github.com/OGShawnLee/malachite-ui/commit/382d45fccb6c8cd18f3239d95821b0b45809a5a7))

## [0.1.0](https://github.com/OGShawnLee/malachite-ui/compare/v0.0.0...v0.1.0) (2022-04-23)

### Features

- **component:** add disclosure component ([22d60ee](https://github.com/OGShawnLee/malachite-ui/commit/22d60eea0017d714cc94cfacab06a4f9d4b003fd))
