# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.8.0](https://github.com/OGShawnLee/malachite-ui/compare/v0.7.1...v0.8.0) (2022-06-19)

### ⚠ BREAKING CHANGES

- **stores:** reimplement navigable initNavigationHandler method
- **stores:** remove navigable HandlerCallbackContext generic
- **disclosure:** remove "global" disabled state

### Features

- **component:** add navigable component ([b32982f](https://github.com/OGShawnLee/malachite-ui/commit/b32982fa5e47114e716a4a8d735dd91df0527dc2))
- **hooks:** add useClickOutside hook ([017eb34](https://github.com/OGShawnLee/malachite-ui/commit/017eb34188d1105e38c0c1049b9b85ae0e5ad076))
- **hooks:** add useComponentNaming hook ([5f34e89](https://github.com/OGShawnLee/malachite-ui/commit/5f34e89abd3cf0f49cdf7f7c78c80100edc18888))
- **hooks:** add useFocusOutside hook ([3838868](https://github.com/OGShawnLee/malachite-ui/commit/3838868bbbd8f39e87dea0c93ba8e04c9373c28d))
- **hooks:** allow ClassName disabled to be a SwitchClassName ([6b091e6](https://github.com/OGShawnLee/malachite-ui/commit/6b091e660b75c6da0eff60a06e23e1ad111be320))
- **navigable:** allow navigation to be finite ([e00ca4d](https://github.com/OGShawnLee/malachite-ui/commit/e00ca4db346199d27e132dc61f03d156281be396))
- **navigable:** forward blur, click and focus events ([fb0b3d2](https://github.com/OGShawnLee/malachite-ui/commit/fb0b3d2ccd48ce287b9b7d53549ba3f678661a17))
- **predicate:** add isIncluded predicate ([f9eb1ce](https://github.com/OGShawnLee/malachite-ui/commit/f9eb1ce204fa0a08871b5607bc7d075872c95196))
- **render:** forward blur and focus events ([3c1eae6](https://github.com/OGShawnLee/malachite-ui/commit/3c1eae684c243bb2a690b4b904b1fce3ccfda276))
- **stores:** reimplement navigable initNavigationHandler method ([b3a4df2](https://github.com/OGShawnLee/malachite-ui/commit/b3a4df2094d028c4e653b9d192747155cbb2750b))
- **utils:** add clearString function ([dfd0183](https://github.com/OGShawnLee/malachite-ui/commit/dfd01838a0a2e46fd18e36f7841d15bc18e1b0d9))
- **utils:** add createStoreWrapper ([1e5b32f](https://github.com/OGShawnLee/malachite-ui/commit/1e5b32f1fbebceb8193090ba2bfdbf3210b7807a))
- **utils:** add ref function ([d902236](https://github.com/OGShawnLee/malachite-ui/commit/d90223623d842f120b1c42dcb4f8dd552773d5fe))
- **utils:** allow to turn off tickCheck in setAttribute function ([7ac229d](https://github.com/OGShawnLee/malachite-ui/commit/7ac229d3e92723b2ecc0c81ecefcc429ae407bd4))

### Bug Fixes

- **component:** always expose isDisabled slot prop as boolean ([ead32bc](https://github.com/OGShawnLee/malachite-ui/commit/ead32bcab9e82be577568ebdd85ed6a1765ec993))
- **component:** dont scroll after pressing End or Home with navigable components ([5e0cb44](https://github.com/OGShawnLee/malachite-ui/commit/5e0cb448b6d3c6152987c34efaccda745e7016fe))
- **menu:** dont always prevent default on button keydown ([3df66e8](https://github.com/OGShawnLee/malachite-ui/commit/3df66e828b0e66b94d72414137e335289a968237))
- **menu:** improve item click events ([b4e1cbc](https://github.com/OGShawnLee/malachite-ui/commit/b4e1cbcaaf7d630642d70cca956a316dc6d8217a))
- **navigable:** dont get stuck during global navigation ([188fbd0](https://github.com/OGShawnLee/malachite-ui/commit/188fbd05a49996f0629ab47bd5bab911b4b5d271))
- **stores:** remove navigable HandlerCallbackContext generic ([d2864d7](https://github.com/OGShawnLee/malachite-ui/commit/d2864d742f362ba25bc184668c036add96a7f22c))
- **ts:** add missing Expand type ([722a2f0](https://github.com/OGShawnLee/malachite-ui/commit/722a2f07eb073e1eb78141c5975991f48ac682b8))

- **disclosure:** remove "global" disabled state ([449dcb9](https://github.com/OGShawnLee/malachite-ui/commit/449dcb97d6b6ce5e59be42396e2c89fff03c172c))

### [0.7.1](https://github.com/OGShawnLee/malachite-ui/compare/v0.7.0...v0.7.1) (2022-06-10)

### ⚠ BREAKING CHANGES

- **predicate:** return store predicate with generic any

### Features

- **component:** improve context validation ([91d14e4](https://github.com/OGShawnLee/malachite-ui/commit/91d14e40541fede7cbfb9b15f2dec8066a55d25b))
- **predicate:** add isInterface predicate function ([15c6f83](https://github.com/OGShawnLee/malachite-ui/commit/15c6f839a2ca3aa1f04cad9f19ad2f1ba4891ec7))
- **tabs:** dont wait until mount to render panel ([221e315](https://github.com/OGShawnLee/malachite-ui/commit/221e315ad5956b2601a32ddac60ae72623f8a289))

### Bug Fixes

- **accordion:** only set role heading if Header is not a heading element ([e557210](https://github.com/OGShawnLee/malachite-ui/commit/e5572103cc34e22ef5075763fb1deb158d88df3b))
- **component:** expose use prop with correct type ([f8a8743](https://github.com/OGShawnLee/malachite-ui/commit/f8a874380e3bc0d26460e7431a7ffafb4dbc48bd))
- **utils:** make sure setAttribute overwrite works in Svelte actions ([77c88d9](https://github.com/OGShawnLee/malachite-ui/commit/77c88d911ece27f3b0a14543a25757c39ab820da))

- **predicate:** return store predicate with generic any ([8448604](https://github.com/OGShawnLee/malachite-ui/commit/8448604d38ddcf3556cf9c11d6bd91653096050b))

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
