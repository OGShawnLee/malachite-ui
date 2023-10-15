# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.10.1](https://github.com/OGShawnLee/malachite-ui/compare/v0.10.0...v0.10.1) (2023-10-15)


### Bug Fixes

* add all modules to package.json exports ([cd1b243](https://github.com/OGShawnLee/malachite-ui/commit/cd1b243cf60fa8dd1be7b19b86b976df057c4458))

## [0.10.0](https://github.com/OGShawnLee/malachite-ui/compare/v0.9.1...v0.10.0) (2023-10-15)


### Features

* add toast component ([8fa398e](https://github.com/OGShawnLee/malachite-ui/commit/8fa398e8f2c976c5e8a1a2db0cf8eeda0263be4a))


### Bug Fixes

* **hooks/ts:** add missing type ([1635449](https://github.com/OGShawnLee/malachite-ui/commit/1635449088e3c3a1653e971ce5c3d1513d3307d7))
* **hooks/ts:** ensure return type is a promise ([9b3beee](https://github.com/OGShawnLee/malachite-ui/commit/9b3beee2452e2a06627da4a50f2cb362fc29011a))

### [0.9.1](https://github.com/OGShawnLee/malachite-ui/compare/v0.9.0...v0.9.1) (2023-04-18)


### Features

* **hooks:** add useAwait hook ([208ce41](https://github.com/OGShawnLee/malachite-ui/commit/208ce41978b8bb7a81ab2d87d0ff8c88d3275920))
* **hooks:** add useCatch hook ([6588d29](https://github.com/OGShawnLee/malachite-ui/commit/6588d29a6a9f6390a59a6a8e22dd91bd9dba3ee0))


### Bug Fixes

* **toggleable:** do not always mutate button type attribute ([e3089ad](https://github.com/OGShawnLee/malachite-ui/commit/e3089ad82337a83cf976747c0de27d837f6e0a19))

## [0.9.0](https://github.com/OGShawnLee/malachite-ui/compare/v0.9.0-0...v0.9.0) (2023-04-16)


### ⚠ BREAKING CHANGES

* **dialog:** render description as a p element by default
* **utils:** remove createReadableRef fn
* **utils:** remove createDerivedRef fn and related types
* **utils:** rename makeReadable fn to readonly
* **utils:** make ref value field a fn instead of getter/setter

### Features

* **hooks:** rename overwrite param to overwriteWith ([8864d97](https://github.com/OGShawnLee/malachite-ui/commit/8864d9752698222506785cb2b50901ab1ecff7b2))
* **hooks:** turn useDOMTraversal predicate fn optional again ([3ab4724](https://github.com/OGShawnLee/malachite-ui/commit/3ab472430a26bd2816d7c65d4f6df286fe63389a))
* **render:** verify 'as' prop is not nullish ([67d2826](https://github.com/OGShawnLee/malachite-ui/commit/67d28262dd2847c561df72e27be620ea1aaa6367))
* **toggleable:** allow disabling button focus after close ([8321bfd](https://github.com/OGShawnLee/malachite-ui/commit/8321bfd3b5fd4692e1ef2f538b965444d0c274dc))
* **types:** add maybe type ([f770708](https://github.com/OGShawnLee/malachite-ui/commit/f7707085d676da74ec70ad769b81039a4a23ac02))
* **utils:** add computed store ([46967a8](https://github.com/OGShawnLee/malachite-ui/commit/46967a8653bf8ebbcc6ac65d2a7cd3d362e25952))
* **utils:** add watch fn ([e910743](https://github.com/OGShawnLee/malachite-ui/commit/e910743efa9d73dd3b1cc43f43c4c9960f0351a7))
* **utils:** enable computed to receive an array of composables ([9802610](https://github.com/OGShawnLee/malachite-ui/commit/98026104372a9f752c1a155b50e94f9c4807ca41))
* **utils:** enable computed to receive another computed ([f2283ee](https://github.com/OGShawnLee/malachite-ui/commit/f2283ee6f41401176b904412ac9a2f8b7cbd0f65))
* **utils:** enable readonly to take a ref ([1574759](https://github.com/OGShawnLee/malachite-ui/commit/15747597dbf8851d2da0207d42e5510e5c55adeb))


### Bug Fixes

* **accordion:** set panel role from action properly ([26ac41b](https://github.com/OGShawnLee/malachite-ui/commit/26ac41b832adef8b49b77fdcf456e89148eba9b7))
* **button:** do not toggle if button is disabled ([817779e](https://github.com/OGShawnLee/malachite-ui/commit/817779e80c457727cf91a57f82d20b4cbb3a622b))
* **button:** forward disabled prop ([98a9265](https://github.com/OGShawnLee/malachite-ui/commit/98a9265769006d95a68fba23725ea447d792a3a6))
* **core:** do not call destroy method of deleted actions ([02b4386](https://github.com/OGShawnLee/malachite-ui/commit/02b4386a1c9fbcc9c8d94953b0ac5cde02aec9dd))
* **core:** ensure compound id is undefined instead of empty string ([7a4a00f](https://github.com/OGShawnLee/malachite-ui/commit/7a4a00f90548fd20f35d4deb3e2db49bdb9767ea))
* **dialog:** ensure title has correct title id ([fa7a6c3](https://github.com/OGShawnLee/malachite-ui/commit/fa7a6c36bae82ecc518282d682740a0501e0b1bc))
* **dialog:** render description as a p element by default ([03db752](https://github.com/OGShawnLee/malachite-ui/commit/03db75248f3ca1e36e06f90f6863525ed7d82145))
* **listbox:** do no reset navigation if use has selected ([3f17cc2](https://github.com/OGShawnLee/malachite-ui/commit/3f17cc2dd8bbb9db56efea3dd93e41d777af2e70))
* **listbox:** ensure label for attribute is set from action ([d3ae56a](https://github.com/OGShawnLee/malachite-ui/commit/d3ae56aed934aad26b35883742174d5eb52ee7af))
* **menu:** ensure aria-haspopup is set in action fn ([ecca935](https://github.com/OGShawnLee/malachite-ui/commit/ecca935b070ecdf00e7da5ce3dbbe90c998df14a))
* **navigable:** better handling of key match ([0f8f281](https://github.com/OGShawnLee/malachite-ui/commit/0f8f2810a4bd693faf771ccff73566a45aca92ad))
* **navigable:** do not ignore ctrlKey when waiting interaction ([7191e76](https://github.com/OGShawnLee/malachite-ui/commit/7191e7648df4d81fb167a0dbe8d8bed264a5bb49))
* **navigable:** improve menu and listbox behaviour ([121bd94](https://github.com/OGShawnLee/malachite-ui/commit/121bd94814d60708928c1b70a8c6eff960f8049a))
* **navigable:** start navigation at index 0 when container had no focus ([98bcbdf](https://github.com/OGShawnLee/malachite-ui/commit/98bcbdf4db163a53511437f91439fd3836adddb0))
* **predicate:** ensure value is a readable ref instead of just a store ([bcf5aa5](https://github.com/OGShawnLee/malachite-ui/commit/bcf5aa5040d9a9c96c2a0202ac053119aeca7a28))
* **radio-group:** ensure label for attribute is set from action ([8345084](https://github.com/OGShawnLee/malachite-ui/commit/834508417e27a8a9e2c5ab37573af413e8b5a985))
* **radio-group:** expose group action as intended ([9b63573](https://github.com/OGShawnLee/malachite-ui/commit/9b635736dae02d84fc88087be877fa42d8d2559c))
* **radio-group:** reference group id in option id ([5e3d53c](https://github.com/OGShawnLee/malachite-ui/commit/5e3d53cc70da96e5f6576b49cd2efc7abca95966))
* **radio-group:** set group and option roles from action fn ([f89fb4c](https://github.com/OGShawnLee/malachite-ui/commit/f89fb4c4d1c9ee828ce03b04f7b5866d9bee6480))
* **stores:** ensure manual navigation works properly ([b455a92](https://github.com/OGShawnLee/malachite-ui/commit/b455a922c61bb76ae20f84637b4b984d5ff10385))
* **switch:** do not toggle when disabled ([ca0274c](https://github.com/OGShawnLee/malachite-ui/commit/ca0274cce35a7c1b3c78e1ae16e1a835fb5714ce))
* **switch:** set 'for' attribute from action fn ([8e6a2e3](https://github.com/OGShawnLee/malachite-ui/commit/8e6a2e3c51e26fbe50a7abdbc0d61e14470d50ad))
* **toggleable:** do not use focus fallback when focus is forced ([3548382](https://github.com/OGShawnLee/malachite-ui/commit/3548382d3668732663cfb9262ebc91af8edc97c9))
* **toggleable:** handle aria-disabled properly ([d30addc](https://github.com/OGShawnLee/malachite-ui/commit/d30addcc2d07db302f60adf3b68db95a7e867cd2))
* **toolbar:** ensure aria-labelledby is set when it should ([236dfbb](https://github.com/OGShawnLee/malachite-ui/commit/236dfbb6196a21b11ab2e5b1ec45be12abc2a8cb))
* **utils:** do not override computed $$onSet fn ([4840f58](https://github.com/OGShawnLee/malachite-ui/commit/4840f582aa816ed42f9fe9e381546c7db3741ed5))
* **utils:** make ref value field a fn instead of getter/setter ([cda0409](https://github.com/OGShawnLee/malachite-ui/commit/cda0409a52224e9c3d8971474ae4e358489d825e))
* **utils:** remove createDerivedRef fn and related types ([f7fd42e](https://github.com/OGShawnLee/malachite-ui/commit/f7fd42eafc13dc0be3ba02e6eebadb906a4c815e))
* **utils:** remove createReadableRef fn ([1437bf1](https://github.com/OGShawnLee/malachite-ui/commit/1437bf119061d6862c8ee225ff1c81465d281a41))
* **utils:** return a readable ref when it should ([efcb22e](https://github.com/OGShawnLee/malachite-ui/commit/efcb22e489818e53aeeac7a7c44566359d8f2f34))


* **utils:** rename makeReadable fn to readonly ([466bc5a](https://github.com/OGShawnLee/malachite-ui/commit/466bc5a74f712200aa1d3c3cae9f3994a29559c0))

## [0.9.0-0](https://github.com/OGShawnLee/malachite-ui/compare/v0.8.0...v0.9.0-0) (2023-02-13)


### ⚠ BREAKING CHANGES

* **hooks:** remove useValidator hook
* **hooks:** remove useDataSync hook
* **stores:** remove Group store
* **stores:** remove Ordered store
* **utils:** remove createStoreWrapper fn and related types
* **stores:** remove storable store
* **stores:** remove notifiable store
* **stores:** remove activable store
* **switch:** update component
* **accordion:** update component
* **tabs:** update component
* **utils:** rename getFocusableElements to getFocusableChildren
* **utils:** narrow down container type to HTMLElement
* **menu:** update component
* **stores:** rewrite navigable from scratch
* **dialog:** update component
* **utils:** rename focusFirstElement fn to focusFirstChildElement
* **hooks:** consider only HTMLElement children
* **popover:** update Popover and PopoverGroup component
* **hashable:** rewrite store
* **disclosure:** update component
* **hooks:** generate uid instead of requiring index
* **hooks:** update useClassNameResolver fn
* **render:** rewrite component
* **core:** drop support for actions with parameters
* **core:** update defineActionComponent fn
* **core:** rewrite Binder store from scratch
* **predicate:** rename is VoidTagName to isVoidElement
* **hooks:** drop support for async unsubcribers
* **toggleable:** rewrite from scratch
* **plugins:** rename plugin
* **stores:** move toggleable file to stores root dir
* **plugins:** move plugins and handlers to plugins dir
* **component:** drop support for passing a store as a prop
* **utils:** rewrite ref store
* **menu:** migrate state class to factory
* **popover:** migrate state class to factory
* **disclosure:** migrate state class to factory

### Features

* **accordion:** update component ([a45f321](https://github.com/OGShawnLee/malachite-ui/commit/a45f3217a9caf82d33b5712cb5a0985ac2fac1fe))
* add button component ([1f5a572](https://github.com/OGShawnLee/malachite-ui/commit/1f5a57251513c79b514c2b03993a19a5a39d28d1))
* add listbox component ([ddc0028](https://github.com/OGShawnLee/malachite-ui/commit/ddc00281635bdb0700f74b8b6f64d2c09544a8a6))
* add radio-group component ([4c069be](https://github.com/OGShawnLee/malachite-ui/commit/4c069be25364dcd7b47ebe9475d7ec3bdcd6ba89))
* add toolbar component ([dae2a07](https://github.com/OGShawnLee/malachite-ui/commit/dae2a07866173d89a8f394696d6d4b42b8807b38))
* **button:** add toolbar synergy ([37eb80b](https://github.com/OGShawnLee/malachite-ui/commit/37eb80bdad9795e52d26caa45cbd5e6a34a42e01))
* **core:** rewrite Binder store from scratch ([60bc5e0](https://github.com/OGShawnLee/malachite-ui/commit/60bc5e037c8f7dd2ad8138c50abd3da05fe1c746))
* **dialog:** update component ([610bab6](https://github.com/OGShawnLee/malachite-ui/commit/610bab6b34f44f730d6b0dba4a08d652ff4515e1))
* **disclosure:** migrate state class to factory ([f834f0d](https://github.com/OGShawnLee/malachite-ui/commit/f834f0d024d4df28ec9a366174a8926c67f62a77))
* **disclosure:** update component ([3278a60](https://github.com/OGShawnLee/malachite-ui/commit/3278a604a01a8d186e84bb4b76d2aa9abb921e8b))
* **hooks:** add hasContext useContext method ([a61ff80](https://github.com/OGShawnLee/malachite-ui/commit/a61ff801d51b2152719a68f40cfa66b7cc5bd493))
* **hooks:** add useSwitch hook ([e854c92](https://github.com/OGShawnLee/malachite-ui/commit/e854c927488bbad63005bc71d0b379e7b12c6c27))
* **hooks:** allow passing a callback to usePair hook ([534b4a8](https://github.com/OGShawnLee/malachite-ui/commit/534b4a8615d66cae2c18de9bb789c40d038f2a31))
* **hooks:** generate uid instead of requiring index ([3c8d701](https://github.com/OGShawnLee/malachite-ui/commit/3c8d70174c0f1eba5263306736594aa76f0b8ea8))
* **menu:** add toolbar synergy ([413a7af](https://github.com/OGShawnLee/malachite-ui/commit/413a7af56822018b7b0a728385245a3b90114409))
* **menu:** migrate state class to factory ([efc516a](https://github.com/OGShawnLee/malachite-ui/commit/efc516ad4cc850702e419a9dc78b56f29c9859bd))
* **menu:** update component ([40b4c61](https://github.com/OGShawnLee/malachite-ui/commit/40b4c612086df661a8014ad4f5b55d98e40746c0))
* **navigable:** update component ([31d6d3b](https://github.com/OGShawnLee/malachite-ui/commit/31d6d3b802c32cf4dd690e2416d88458a8a2b4df))
* **popover:** migrate state class to factory ([c84a6b9](https://github.com/OGShawnLee/malachite-ui/commit/c84a6b987130dabcf6040f82ec879ebb8164f6d3))
* **popover:** update Popover and PopoverGroup component ([a5adc7b](https://github.com/OGShawnLee/malachite-ui/commit/a5adc7b0b91db046e69168a9392feefa582d86e9))
* **predicate:** add isChildless fn ([36ea2f6](https://github.com/OGShawnLee/malachite-ui/commit/36ea2f6b2d4004b4fb87ebfebe40c1d37bd47d34))
* **predicate:** add isClient fn ([0467138](https://github.com/OGShawnLee/malachite-ui/commit/0467138342ac03455d78c2d22212438e779648ff))
* **predicate:** add isVoidTagName predicate ([5065978](https://github.com/OGShawnLee/malachite-ui/commit/5065978668a7243f89a34d8f10778292efe90b9e))
* **predicate:** add isWhitespace fn ([58aeecc](https://github.com/OGShawnLee/malachite-ui/commit/58aeecc2fe0ea4f6aa3f7dd27444e27fce2d918f))
* **radio-group:** add toolbar synergy ([8063529](https://github.com/OGShawnLee/malachite-ui/commit/806352981adc5ce4b6599b03c3cd538f1f9d89d0))
* **switch:** update component ([ffeafa0](https://github.com/OGShawnLee/malachite-ui/commit/ffeafa0564ff7132da4a99628d052742bf643d7f))
* **tabs:** update component ([11d9975](https://github.com/OGShawnLee/malachite-ui/commit/11d9975243f9bb844cfb7c66ba2a704881dec333))
* **utils:** rewrite ref store ([dedcd85](https://github.com/OGShawnLee/malachite-ui/commit/dedcd855385876d24f5d190a19d93f844b174116))


### Bug Fixes

* **component:** drop support for passing a store as a prop ([be27e92](https://github.com/OGShawnLee/malachite-ui/commit/be27e927c0346dc65f5fed7b9d067f9843b00e1b))
* **core:** drop support for actions with parameters ([eeb753c](https://github.com/OGShawnLee/malachite-ui/commit/eeb753ce2f78048bb37cc806cc4c20ea22b2fa7f))
* **core:** update defineActionComponent fn ([b2b366f](https://github.com/OGShawnLee/malachite-ui/commit/b2b366f27cf88f4db6fea127951c12e9f78b2945))
* **hashable:** rewrite store ([d21c782](https://github.com/OGShawnLee/malachite-ui/commit/d21c782a5eb395c27b42586a9d8f2650a0dd2182))
* **hooks:** consider only HTMLElement children ([54ce9c9](https://github.com/OGShawnLee/malachite-ui/commit/54ce9c9d0bead7e0d8d94d017436c1e68da46c96))
* **hooks:** drop support for async unsubcribers ([a31841f](https://github.com/OGShawnLee/malachite-ui/commit/a31841f579e00fb198a809bb7f8b0f567a984455))
* **hooks:** return unsubscriber instead of async fn ([98c2688](https://github.com/OGShawnLee/malachite-ui/commit/98c26882433fb8cbdedb65142012c2ffe10a0265))
* **hooks:** update useClassNameResolver fn ([a7cee70](https://github.com/OGShawnLee/malachite-ui/commit/a7cee7032a3fbf2f35945b51e8e882dc7fb97fc1))
* **render:** handle void elements properly ([1e5f2e2](https://github.com/OGShawnLee/malachite-ui/commit/1e5f2e29c6908462dd51f0c74802d0033b2ce6a2))
* **render:** rewrite component ([75d5082](https://github.com/OGShawnLee/malachite-ui/commit/75d5082e266862da923e62fe24201cea08fa64f1))
* **stores:** rewrite navigable from scratch ([3be016a](https://github.com/OGShawnLee/malachite-ui/commit/3be016a5652d19063062a91a0f89530158ee985a))
* **toggleable:** rewrite from scratch ([f280fd0](https://github.com/OGShawnLee/malachite-ui/commit/f280fd0f4313b6fc9db51615bcb322f5a338c519))


* **hooks:** remove useDataSync hook ([741d762](https://github.com/OGShawnLee/malachite-ui/commit/741d7628572f9d26a0109b7cffcc8fc317021748))
* **hooks:** remove useValidator hook ([cc9cecc](https://github.com/OGShawnLee/malachite-ui/commit/cc9ceccbb16bf67ad42d7f4db88139c19e7cbf75))
* **plugins:** move plugins and handlers to plugins dir ([450e370](https://github.com/OGShawnLee/malachite-ui/commit/450e37029066d8a72015b8286e2506a5670e8cca))
* **plugins:** rename plugin ([837e706](https://github.com/OGShawnLee/malachite-ui/commit/837e706dc4ed0311342d68fb6f36fa62714e2882))
* **predicate:** rename is VoidTagName to isVoidElement ([65172db](https://github.com/OGShawnLee/malachite-ui/commit/65172dbbc32c2d6d417c8f5fc969248771806e51))
* **stores:** move toggleable file to stores root dir ([116391d](https://github.com/OGShawnLee/malachite-ui/commit/116391d9f1e058896fa631bb45e6edc9bce5ce6c))
* **stores:** remove activable store ([e0e9439](https://github.com/OGShawnLee/malachite-ui/commit/e0e9439c1ef85ff31f2c99078bd639458b38162e))
* **stores:** remove Group store ([db942c7](https://github.com/OGShawnLee/malachite-ui/commit/db942c7427542baa88a4fb3591d2e4a9a8f28323))
* **stores:** remove notifiable store ([dc0f5d3](https://github.com/OGShawnLee/malachite-ui/commit/dc0f5d390a8e3dde11ab4747991999453aaabdff))
* **stores:** remove Ordered store ([0975e24](https://github.com/OGShawnLee/malachite-ui/commit/0975e24aea96a5c137810f10a6b0824478396d34))
* **stores:** remove storable store ([3b780ae](https://github.com/OGShawnLee/malachite-ui/commit/3b780aec28eff353fadfa178a53ce2614355daa1))
* **utils:** narrow down container type to HTMLElement ([f320b4b](https://github.com/OGShawnLee/malachite-ui/commit/f320b4b6099f958c7f64971d61bc8fa9f68bc6f4))
* **utils:** remove createStoreWrapper fn and related types ([e640ce6](https://github.com/OGShawnLee/malachite-ui/commit/e640ce606677a39d09f82ada54279de159665ec1))
* **utils:** rename focusFirstElement fn to focusFirstChildElement ([beb8d37](https://github.com/OGShawnLee/malachite-ui/commit/beb8d376dcab10e4c58634e3698d6485b20c2614))
* **utils:** rename getFocusableElements to getFocusableChildren ([9a89622](https://github.com/OGShawnLee/malachite-ui/commit/9a896227339ba21ce9d0f05261b6eda906080275))

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
