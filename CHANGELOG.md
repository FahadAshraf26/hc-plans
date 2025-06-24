# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.4.3](https://github.com/Miventure-Inc/miventure-api/compare/v1.4.2...v1.4.3) (2021-04-28)


### Bug Fixes

* **portfolio:** resolve circular dependency issue with CampaignFundMap ([581dc72](https://github.com/Miventure-Inc/miventure-api/commit/581dc721be7477238b9220d717b4fd5edae3056f))

### [1.4.2](https://github.com/Miventure-Inc/miventure-api/compare/v1.4.1...v1.4.2) (2021-04-28)


### Bug Fixes

* **campaign:** resolve owner campaigns error due to campaignFund.createFromObject ([9864c6f](https://github.com/Miventure-Inc/miventure-api/commit/9864c6f7c885fa3c2eaf92c7fb4c7a879fee13b0))

### [1.4.1](https://github.com/Miventure-Inc/miventure-api/compare/v1.4.0...v1.4.1) (2021-04-27)


### Bug Fixes

* **campaign-fund-charge:** resolve update charge status endpoint failure ([1c02e17](https://github.com/Miventure-Inc/miventure-api/commit/1c02e175f0f85036e3f33aa8d7e24efea0bd2ccc))
* **campaign-funds:** list user investments in descending order ([22703bf](https://github.com/Miventure-Inc/miventure-api/commit/22703bfaf8dc19282c4b2196def5cc563e032cd0))
* **campaing-funds:** include language that fee is applicable for all card payments ([5037f6a](https://github.com/Miventure-Inc/miventure-api/commit/5037f6acc6a14a3e0c6d9c741e27903071468742))
* **northcapitalwebhooks:** resolve northCapitalWebhookRepository import ([1ba9edc](https://github.com/Miventure-Inc/miventure-api/commit/1ba9edcb40b33f35320ba6bad2ea770d7a4325f7))
* **user:** add firstname and lastname to ssn check ([46a1de4](https://github.com/Miventure-Inc/miventure-api/commit/46a1de4db896d6e04f25e72dbfc936ccffbfdf84))

## [1.4.0](https://github.com/Miventure-Inc/miventure-api/compare/v1.3.3...v1.4.0) (2021-04-27)


### Features

* **investorDrip:** implement investors drips ([19a0c7f](https://github.com/Miventure-Inc/miventure-api/commit/19a0c7ff398a541d44b008ba9cec62a6bb6f7e5a))


### Bug Fixes

* **user-investment-repository:** include fee when displaying amount in history ([7748a13](https://github.com/Miventure-Inc/miventure-api/commit/7748a13de369d82a220ebf5ee5488d41b3d916f6))

### [1.3.3](https://github.com/Miventure-Inc/miventure-api/compare/v1.3.2...v1.3.3) (2021-04-23)


### Bug Fixes

* **camapign-funds:** resolve no pledge fund issue ([1947092](https://github.com/Miventure-Inc/miventure-api/commit/19470929de4c08d2df2128632c49fe7ad8709ff4))

### [1.3.2](https://github.com/Miventure-Inc/miventure-api/compare/v1.3.1...v1.3.2) (2021-04-23)


### Bug Fixes

* resolve fetchUsersWithNotificationToken failing due to payment options ([3adec2b](https://github.com/Miventure-Inc/miventure-api/commit/3adec2bc338004b65a8ba29b59c2800ce17131aa))
* **pushNotification:** fix push notification issue ([4810021](https://github.com/Miventure-Inc/miventure-api/commit/481002165fea1352d3cce1bb648be3429aa7018a))

### [1.3.1](https://github.com/Miventure-Inc/miventure-api/compare/v1.3.0...v1.3.1) (2021-04-22)

## [1.3.0](https://github.com/Miventure-Inc/miventure-api/compare/v1.2.4...v1.3.0) (2021-04-22)


### Features

* **create-trade:** send slack message on create trage with all details ([f522aa6](https://github.com/Miventure-Inc/miventure-api/commit/f522aa6f3416a1b5979112269fb914532b7dedb9))

## [1.3.0](https://github.com/Miventure-Inc/miventure-api/compare/v1.2.4...v1.3.0) (2021-04-22)


### Features

* **create-trade:** send slack message on create trage with all details ([f522aa6](https://github.com/Miventure-Inc/miventure-api/commit/f522aa6f3416a1b5979112269fb914532b7dedb9))

### [1.2.4](https://github.com/Miventure-Inc/miventure-api/compare/v1.2.3...v1.2.4) (2021-04-22)


### Bug Fixes

* **campaign-fund-map:** update toDTO response to include timestamps and user details ([abbffff](https://github.com/Miventure-Inc/miventure-api/commit/abbffff4dc2a9c4233c7d8ba9d84c030d2c7397e))

### [1.2.3](https://github.com/Miventure-Inc/miventure-api/compare/v1.2.2...v1.2.3) (2021-04-22)


### Bug Fixes

* **campaign-funds:** resolve invalid date issue in the investment receipt email ([cb00ec7](https://github.com/Miventure-Inc/miventure-api/commit/cb00ec77f9c4380b19f1ca1b7ffdfce9a11a47d9))

### [1.2.2](https://github.com/Miventure-Inc/miventure-api/compare/v1.2.1...v1.2.2) (2021-04-21)


### Bug Fixes

* **user-notifications:** add missing globalNotificationRoute ([b7256b6](https://github.com/Miventure-Inc/miventure-api/commit/b7256b6877e0ed22927c2305a182c1e4511dd074))

### [1.2.1](https://github.com/Miventure-Inc/miventure-api/compare/v1.2.0...v1.2.1) (2021-04-21)


### Bug Fixes

* **bootstrap:** disable overload middleware ([13e7676](https://github.com/Miventure-Inc/miventure-api/commit/13e76760070079c3e67d18ab2f4bd18e24818985))
* **campaign-order-service:** update current campaign expiry to 2 hours ([0fb4719](https://github.com/Miventure-Inc/miventure-api/commit/0fb47192870e267c16a592f88e239490110501e1))

## [1.2.0](https://github.com/Miventure-Inc/miventure-api/compare/v1.1.4...v1.2.0) (2021-04-21)


### Features

* **campaign-fund:** add credit card fee to investment amount ([e9d221d](https://github.com/Miventure-Inc/miventure-api/commit/e9d221d4be666694f724059cf13627bc8f3007b5))


### Bug Fixes

* **bootstrap:** disable overload middleware ([efb4021](https://github.com/Miventure-Inc/miventure-api/commit/efb4021677abcde65910c6e96a7de57cfcc4f37b))
* **user:** make sure only last four digits of ssn are retrived ([9c66c4d](https://github.com/Miventure-Inc/miventure-api/commit/9c66c4d45bed719ec6e27b26986fb516295ac529))

### [1.1.4](https://github.com/Miventure-Inc/miventure-api/compare/v1.1.3...v1.1.4) (2021-04-20)


### Bug Fixes

* **campaigns:** add campaign randomizer for coming soon campaigns as well ([14c2fa5](https://github.com/Miventure-Inc/miventure-api/commit/14c2fa5b87929ca927a7d53372415060c06c7b33))
* **northcapital:** resolve missing import for northCapital config ([d7489c2](https://github.com/Miventure-Inc/miventure-api/commit/d7489c2b94a09576b94067dc9d55564c1427de79))
* **TOSPopUps:** fix tos migration issues ([431541f](https://github.com/Miventure-Inc/miventure-api/commit/431541f6b0b4d9532775228d62aaa8b709269c2a))
* **TOSPopUps:** fix tos migration issues ([7b5f190](https://github.com/Miventure-Inc/miventure-api/commit/7b5f190f59faceb0fb00abb124fe3bce3f6f4a79))
* **TOSPopUps:** fix tos migration issues ([4394243](https://github.com/Miventure-Inc/miventure-api/commit/4394243566403001f070ad80d37cd4f59b50d935))
* **TOSPopUps:** fix tos migration issues ([f8c38a1](https://github.com/Miventure-Inc/miventure-api/commit/f8c38a14918771125955f38bcce202d9d43eeb11))

### [1.1.3](https://github.com/Miventure-Inc/miventure-api/compare/v1.1.2...v1.1.3) (2021-04-19)


### Bug Fixes

* **create-user:** fix user model hooks causing create user to crash ([e85aa36](https://github.com/Miventure-Inc/miventure-api/commit/e85aa36076426fe7e18d198fb96e04eba9865483))

### [1.1.2](https://github.com/Miventure-Inc/miventure-api/compare/v1.1.1...v1.1.2) (2021-04-19)


### Bug Fixes

* **campaign:** update maxAmount by 0.0325% when creating offering on NC ([ff5d9c5](https://github.com/Miventure-Inc/miventure-api/commit/ff5d9c5b5d0ab1b6720a8b3b0a4b7a81c03d11ab))
* fix investorBanks error and lastFour encrypted error on admin panel ([3032d85](https://github.com/Miventure-Inc/miventure-api/commit/3032d852dd93d554435ad40b1f97ee4c12cb6395))

### [1.1.1](https://github.com/Miventure-Inc/miventure-api/compare/v1.0.6...v1.1.1) (2021-04-16)


### Features

* **slackService:** add seperate channels for stagging and production ([a187732](https://github.com/Miventure-Inc/miventure-api/commit/a1877325d6de8325d69b936f7b0b60649a1717e4))
* will add slack service ([e3b5eec](https://github.com/Miventure-Inc/miventure-api/commit/e3b5eec32ccbf89eef88c2d3c7ebcb9f1e35a3d5))


### Bug Fixes

* **adminPanelUserscreen:** fix admin panel user screen account issuses ([58cada8](https://github.com/Miventure-Inc/miventure-api/commit/58cada8126827d9eb78cf5cf90cbce2a200b4ef5))
* **adminPanelUserscreen:** fix bank account issuses ([4158f3f](https://github.com/Miventure-Inc/miventure-api/commit/4158f3fd28be5f0ca187b9f8f58bf321d4f97bc7))
* **adminPanelUserScreen:** fix bank account issues of admin panel userscreen ([ecf62a5](https://github.com/Miventure-Inc/miventure-api/commit/ecf62a598e7784fdfdc2da59a696d12349daf7da))
* **slackservice:** how we import slackService ([317b260](https://github.com/Miventure-Inc/miventure-api/commit/317b260b1b95d006d1157d5b8b508ab0dab92dde))
* **slackService:** fix slack service issues ([151a83e](https://github.com/Miventure-Inc/miventure-api/commit/151a83e32d297840fd1e2bdb93bfd0ca72c5fcba))
* **tosPopups:** fix few issues in tos pop ups ([a2de85a](https://github.com/Miventure-Inc/miventure-api/commit/a2de85ac8e09f884a6140e719bfde3692158f776))
* **tosRepository:** added migrations ([d52cf88](https://github.com/Miventure-Inc/miventure-api/commit/d52cf886a89e588c0202e2ffaadbc7341328461f))

## [1.1.0](https://github.com/Miventure-Inc/miventure-api/compare/v1.0.6...v1.1.0) (2021-04-16)


### Features

* **slackService:** add seperate channels for stagging and production ([a187732](https://github.com/Miventure-Inc/miventure-api/commit/a1877325d6de8325d69b936f7b0b60649a1717e4))
* will add slack service ([e3b5eec](https://github.com/Miventure-Inc/miventure-api/commit/e3b5eec32ccbf89eef88c2d3c7ebcb9f1e35a3d5))


### Bug Fixes

* **adminPanelUserscreen:** fix admin panel user screen account issuses ([58cada8](https://github.com/Miventure-Inc/miventure-api/commit/58cada8126827d9eb78cf5cf90cbce2a200b4ef5))
* **adminPanelUserscreen:** fix bank account issuses ([4158f3f](https://github.com/Miventure-Inc/miventure-api/commit/4158f3fd28be5f0ca187b9f8f58bf321d4f97bc7))
* **adminPanelUserScreen:** fix bank account issues of admin panel userscreen ([ecf62a5](https://github.com/Miventure-Inc/miventure-api/commit/ecf62a598e7784fdfdc2da59a696d12349daf7da))
* **slackservice:** how we import slackService ([317b260](https://github.com/Miventure-Inc/miventure-api/commit/317b260b1b95d006d1157d5b8b508ab0dab92dde))
* **slackService:** fix slack service issues ([151a83e](https://github.com/Miventure-Inc/miventure-api/commit/151a83e32d297840fd1e2bdb93bfd0ca72c5fcba))
* **tosPopups:** fix few issues in tos pop ups ([a2de85a](https://github.com/Miventure-Inc/miventure-api/commit/a2de85ac8e09f884a6140e719bfde3692158f776))
* **tosRepository:** added migrations ([d52cf88](https://github.com/Miventure-Inc/miventure-api/commit/d52cf886a89e588c0202e2ffaadbc7341328461f))

### [1.0.6](https://github.com/Miventure-Inc/miventure-api/compare/v1.0.5...v1.0.6) (2021-04-14)


### Bug Fixes

* **campaignorderservice:** enable campaign randomizer ([04127a8](https://github.com/Miventure-Inc/miventure-api/commit/04127a82b35f54ef2ff83d289d2db09a349ea3d6))
* **emails:** update miventure logo in base template ([9b2542e](https://github.com/Miventure-Inc/miventure-api/commit/9b2542e6bea2a0331a258116c264f2c835d74f4a))
* **IssuerRoutes:** fix an authentication issue ([bc50f1b](https://github.com/Miventure-Inc/miventure-api/commit/bc50f1b294ef9ba03e166095301743da947d425c))
* **users:** update fetch users summary queries ([587aa02](https://github.com/Miventure-Inc/miventure-api/commit/587aa02c9db155bded582d2c98b06258db62a67f))
* add create user guards until refactored ([931a2a5](https://github.com/Miventure-Inc/miventure-api/commit/931a2a5395797d68b4df0adb706fb76f2fd93a0f))
* **updateUserCaseDTO:**  add missing imports ([3306450](https://github.com/Miventure-Inc/miventure-api/commit/33064501acc3cbc96f5f79a75a98f430cef8b0fe))

### [1.0.5](https://github.com/Miventure-Inc/miventure-api/compare/v1.0.4...v1.0.5) (2021-04-08)


### Bug Fixes

* resetPasswordTemplate password limit ([2d4c0cd](https://github.com/Miventure-Inc/miventure-api/commit/2d4c0cd9b3354e98b67c2285418ddf374fe981db))

### [1.0.4](https://github.com/Miventure-Inc/miventure-api/compare/v1.0.3...v1.0.4) (2021-04-08)


### Bug Fixes

* **issuer-campaigns:** fix notification issue on cmpgn create/update and dwolla issue on updt issuer ([d115479](https://github.com/Miventure-Inc/miventure-api/commit/d115479f9cec3f998fd125e45c546e531665c752))

### [1.0.3](https://github.com/Miventure-Inc/miventure-api/compare/v1.0.2...v1.0.3) (2021-04-07)


### Bug Fixes

* **userrepository:** user info wrong associations ([cd4e315](https://github.com/Miventure-Inc/miventure-api/commit/cd4e3157ca9bb20b635b8de7d9299a51d9c39c61))

### [1.0.2](https://github.com/Miventure-Inc/miventure-api/compare/v1.0.1...v1.0.2) (2021-04-07)


### Bug Fixes

* **investorbank:** add bank ([739ed2d](https://github.com/Miventure-Inc/miventure-api/commit/739ed2d62cf2c0043a79d38d807a94fc822f7d84))

### [1.0.1](https://github.com/Miventure-Inc/miventure-api/compare/v1.0.0...v1.0.1) (2021-04-07)

## [1.0.0](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.27...v1.0.0) (2021-04-07)

### [0.6.27](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.26...v0.6.27) (2021-04-07)


### Features

* **accreditation:** add initiate accreditation logic ([d832a36](https://github.com/Miventure-Inc/miventure-api/commit/d832a361a85e91a0b214b4abc363b58539c7c002))
* **campaign:** update campaign model/entity ([961fb43](https://github.com/Miventure-Inc/miventure-api/commit/961fb43d4a3f8133345e8f98f8557358015ec17a))
* **campaignfunds:** add investment through north capital logic ([bc4aae0](https://github.com/Miventure-Inc/miventure-api/commit/bc4aae09210873c06e377307f1fd9991f5a3a28b))
* **campaignfunds:** add investment through north capital logic ([ba9c5be](https://github.com/Miventure-Inc/miventure-api/commit/ba9c5be8bc203d2ea4bde727e2d04cb3b67c0308))
* **campaigns:** create offering on NC on CampaignCreate ([859327b](https://github.com/Miventure-Inc/miventure-api/commit/859327b6711fe84dcf6c8319a2dc3c0ebaf6207e))
* **creaditCard:** add send email to admin feature ([bed5fbd](https://github.com/Miventure-Inc/miventure-api/commit/bed5fbd5de87da935a2786d49197ee14de19405c))
* **creaditCard:** add update ai verification webhook ([3790e0f](https://github.com/Miventure-Inc/miventure-api/commit/3790e0fd239bab5408eb19c8e7bf37bc4ad09180))
* **creaditCard:** add update ai verification webhook ([4fc1934](https://github.com/Miventure-Inc/miventure-api/commit/4fc193457ba902485349d061257cb6c44284ccb7))
* **createinvestor:** add logic for createParty/createAccount/linkAccount when updating user ([9af882f](https://github.com/Miventure-Inc/miventure-api/commit/9af882fb3f4c9a948d71ca8e316356d40bea56e8))
* **creditCard:** add business owners will receive question emails ([c7e7236](https://github.com/Miventure-Inc/miventure-api/commit/c7e7236b97c169a4b98d6a37aaf8b4a04ebd8e0b))
* **creditCard:** add mark as set accreditate function into initiate accreditation usecase ([002e117](https://github.com/Miventure-Inc/miventure-api/commit/002e117ca7d2e961f4b2c9bafd3b49c88bb252ae))
* **creditCard:** add welcome email template ([b596245](https://github.com/Miventure-Inc/miventure-api/commit/b596245fe58e6698c4489824568f7373bb0b4e3b))
* **creditCard:** will add the following feature store forgot password into redis ([5c57c5c](https://github.com/Miventure-Inc/miventure-api/commit/5c57c5c2f626b00184c543c2aeaffec37ecce37c))
* **creditCardFeature:** add north capital webhook repository test cases ([f813123](https://github.com/Miventure-Inc/miventure-api/commit/f813123be08544d59659d81daa8c3db0db0759e9))
* **creditCardFeature:** add north capital webhooks ([d79cf5a](https://github.com/Miventure-Inc/miventure-api/commit/d79cf5a6f493b35abcc79ce7697f5a9040e53cd8))
* **creditCardFeature:** add update trade status webhook ([57b574f](https://github.com/Miventure-Inc/miventure-api/commit/57b574fcfbb904312d7ebb57b308e289c01d21a4))
* **creditCardFeature:** will refactor north capital webhook ([33ea3a4](https://github.com/Miventure-Inc/miventure-api/commit/33ea3a443e2e8d475e5aeca2a2a63794ca3241e9))
* **creditCardFeature:** will refactor north capital webhook ([b761eed](https://github.com/Miventure-Inc/miventure-api/commit/b761eedcd2ad9751b1acd6f6f9cecf5ca81943dc))
* **eventbus:** add boilerplate ([1104e4d](https://github.com/Miventure-Inc/miventure-api/commit/1104e4d068401dfcfd791cccd3b1da4541483dad))
* **eventBus:** finish event bus integration ([b8bd82d](https://github.com/Miventure-Inc/miventure-api/commit/b8bd82d6d3c3e5c22398e517fcaf52104514d0c9))
* **investors:** create party/account/link for investors and store that information in database ([1507237](https://github.com/Miventure-Inc/miventure-api/commit/15072371c2a3c3670fc3f7e07a58be2442716c36))
* **user:** create north capital  account on user kyc verified ([81d1db3](https://github.com/Miventure-Inc/miventure-api/commit/81d1db3ef48c6129d7fa647a1c5bb61c9508d520))
* add north capital webhooks ([3e96537](https://github.com/Miventure-Inc/miventure-api/commit/3e9653725bd4a1e41c7262055252614a3bbf2ba4))
* will update few eamil templates ([b6911fa](https://github.com/Miventure-Inc/miventure-api/commit/b6911faa11c625248fd7c06691efc81d0330502a))
* **investors:** add credit card ([a0a5472](https://github.com/Miventure-Inc/miventure-api/commit/a0a54720fad99437d9b18c50cff2c0a250673b50))
* **investors:** add credit card ([80a926b](https://github.com/Miventure-Inc/miventure-api/commit/80a926bab1ab80c9345af02a34e3aed294c0c72b))
* **issuer:** add logic create issuer on NorthCapital ([4b1e0b7](https://github.com/Miventure-Inc/miventure-api/commit/4b1e0b78a97b46d960970aff5a5fa027e1c4bf9b))
* **routes:** add live release route ([96a3154](https://github.com/Miventure-Inc/miventure-api/commit/96a31540251c5dd7fa10a56cd4127bee4cb1a6c3))


### Bug Fixes

* accrediationStatus missing migrations and commitment email funding source ([b5be20d](https://github.com/Miventure-Inc/miventure-api/commit/b5be20df31fecb5be20f934f3d92485a95bb61cd))
* fix migration ([064a54f](https://github.com/Miventure-Inc/miventure-api/commit/064a54fbe65e1dd8da2db45fec46476bffd09f91))
* make wireRoutingNumber optional ([6554872](https://github.com/Miventure-Inc/miventure-api/commit/65548725c893a0ab5c8c3f2afdff260e03f3ef26))
* update migration ([c0b2511](https://github.com/Miventure-Inc/miventure-api/commit/c0b251199e59ee4982d201190f846ade2281164f))
* **accrediation:** fix accreditation form webhook failure if option file not present ([68e6470](https://github.com/Miventure-Inc/miventure-api/commit/68e6470d0d3c7e6b93065e748b6fa22ae60a83a2))
* **accreditation:** add formsite server post handler to create AIRequest to NC ([f528fc6](https://github.com/Miventure-Inc/miventure-api/commit/f528fc6a889c9abfa079bfcbbd1603cefa57e684))
* **addinvestorbank:** fix plaid access token not being persisted when adding bank ([f84863e](https://github.com/Miventure-Inc/miventure-api/commit/f84863e282aff3c905ad5d7c36a1bdf4c0e84fa5))
* **auth:** remove calls to req.user ([1b2261c](https://github.com/Miventure-Inc/miventure-api/commit/1b2261c196042da3e233fe1189e02fda07cf845d))
* **bankaccounttype:** update valid BankACcountTypes enum ([4e8b35c](https://github.com/Miventure-Inc/miventure-api/commit/4e8b35c9b995481a516c7749551b4ca10e158fcc))
* **campaignfund:** fix invest in campaign ([4635d66](https://github.com/Miventure-Inc/miventure-api/commit/4635d66accf221826fc2c278c1386813a0343ba3))
* **campaignfunds:** fix portfolio endpoint not working due to inaccessible amount property ([0f143f5](https://github.com/Miventure-Inc/miventure-api/commit/0f143f54b6922bc867bc8616a83cdfe2b9f3ccb3))
* **campaignFundService:** remove dwolla check ([961c0e6](https://github.com/Miventure-Inc/miventure-api/commit/961c0e64573ce1390153906851064936f816cafd))
* **campaignFundService:** remove dwolla verification check ([85e9de0](https://github.com/Miventure-Inc/miventure-api/commit/85e9de07dcfa4436bc9a5d9b3a918b364ba210d7))
* **campaignorderservice:** fix bug where orderService would hang if there was only 1 campaign ([7e4796e](https://github.com/Miventure-Inc/miventure-api/commit/7e4796e653f5746f7ed551dcdbd79353b8fa50c8))
* **campaignRepository:** remove loanDuration from favorite campaigns endpoint ([8daf055](https://github.com/Miventure-Inc/miventure-api/commit/8daf05520477e115a20cacd713eefc5870c1b6f5))
* **campaigns:** add offering id ([4b738f4](https://github.com/Miventure-Inc/miventure-api/commit/4b738f4f1fd2bdc805e4068bce20e64483f0d471))
* **campaigns:** approve campaign on create ([15c927e](https://github.com/Miventure-Inc/miventure-api/commit/15c927e375956f9b3017a692ff7b3772af1af245))
* **createcampaign:** add offeringId ([c733cae](https://github.com/Miventure-Inc/miventure-api/commit/c733cae87737e43f92c3dbdf98c9e5fba467de46))
* **createcampaign:** add offeringId ([d292fa4](https://github.com/Miventure-Inc/miventure-api/commit/d292fa482211302df039596c0fb33f1304ca7f14))
* **dwollabizclassification:** remove dwolla business classification route ([8cc0ec0](https://github.com/Miventure-Inc/miventure-api/commit/8cc0ec068bb93f2224f55ea37ae1faed5f124ceb))
* **getOwnerCampaigns:** add numInvestors and rename totalRaised to amountInvested ([87684c0](https://github.com/Miventure-Inc/miventure-api/commit/87684c08e56246ba5f3319d603339c6dfefb8043))
* **invest:** fix amount send when creating trade for an offering ([cd1a38d](https://github.com/Miventure-Inc/miventure-api/commit/cd1a38d297eb2d5cc073a58c5791de0cdd8992a9))
* **investorbank:** fix dto isCreditCard check and set default value for isBank ([604b758](https://github.com/Miventure-Inc/miventure-api/commit/604b758a8ae868030e46248ad860f4dfe87e6000))
* **investorbank:** fix dto isCreditCard check and set default value for isBank ([67de7a4](https://github.com/Miventure-Inc/miventure-api/commit/67de7a4e1d0716939cc7caedb5e54bb5323c6fc8))
* **investorbankmigration:** separate file for custom query migration ([77a7647](https://github.com/Miventure-Inc/miventure-api/commit/77a7647ddc1178e59a75642d866f867b047f0f6c))
* **investorbankmodel:** add separate migration for foreign key query ([d588e1f](https://github.com/Miventure-Inc/miventure-api/commit/d588e1fdb2d59e3bc95fe587f4677c295682570a))
* **investorBankModel:** mark allowNull as true for non-required fields ([6ecb668](https://github.com/Miventure-Inc/miventure-api/commit/6ecb668990c9623d54ab586b6607007e3476e42c))
* **issuer:** create northCapital issuer and make non-required fields optional ([e75bdb9](https://github.com/Miventure-Inc/miventure-api/commit/e75bdb9dafcccfc6a8d7a2c9be8a97ec5ef53c49))
* **northcapitalservice:** add northCapitalClient and northCapitalService ([eaeaa03](https://github.com/Miventure-Inc/miventure-api/commit/eaeaa03dfda661ccd635383e42f1a09250865cf6))
* **northCapitalService:** fix createLink RequestBody ([8ed2daf](https://github.com/Miventure-Inc/miventure-api/commit/8ed2daf8955cec5b2dcd6caaad14fce7af3d0a8b))
* **ownerstory:** fix campaignStage filter for campaigns/stories ([2e571ac](https://github.com/Miventure-Inc/miventure-api/commit/2e571ac48219e9666caac642ee4946e2c4b34b91))
* **ownerstory:** fix campaignStage filter for campaigns/stories ([9967d5a](https://github.com/Miventure-Inc/miventure-api/commit/9967d5a3aac6cc5e76dbfbf3fdc56cc8e729f271))
* **ownerstory:** fix owner stories not showing ([0f5b8aa](https://github.com/Miventure-Inc/miventure-api/commit/0f5b8aa375869fbcf6cab9ea1388e002bcc5bacf))
* **paymentoptionsrepository:** add logic to decrypt encrypted db objects ([031d1be](https://github.com/Miventure-Inc/miventure-api/commit/031d1be158fd3c4ffbcf018d998dd590c9965124))
* **plaidlinktoken:** fix userId fetch when creating plaid token ([c75ef4b](https://github.com/Miventure-Inc/miventure-api/commit/c75ef4b1088bbfe3772b89f63defeae1b7295f39))
* **update-user:** remove create northCapital account logic from update user ([48df66f](https://github.com/Miventure-Inc/miventure-api/commit/48df66ff40fd5f05daebc56f8fb1ca12d140ec35))
* **userInfo:** remove references to campaignReturnsRepository in userService ([7854646](https://github.com/Miventure-Inc/miventure-api/commit/7854646bd2a281ceac5a38d93eb1d454607b23c1))
* **users:** calculate north capital suitability ([c536d78](https://github.com/Miventure-Inc/miventure-api/commit/c536d78fb5359e5c22989913de24c4266e039f9f))
* **uservalidation:** fix required password length to 8 instead of 12 ([b879962](https://github.com/Miventure-Inc/miventure-api/commit/b87996295505239e7b8f19ad2159110db8c20bd4))
* **www.ts:** remove async ([faf9dcf](https://github.com/Miventure-Inc/miventure-api/commit/faf9dcf20f81b25c58ac3d532505ea205114f9fb))
* **www.ts:** remove undefined variable ([5746346](https://github.com/Miventure-Inc/miventure-api/commit/57463465cfd6c9168576fe3aac1e7c2d391b0ac0))
* externalFundMvoe and ccFundMove ([6171037](https://github.com/Miventure-Inc/miventure-api/commit/6171037f48c57a260732a9f5e6ec22d219fa3470))
* fetchInvestorBank undefined error ([ca12c04](https://github.com/Miventure-Inc/miventure-api/commit/ca12c04137e5c49a11dfbe96c53bd9686fcd553d))
* fix a bug where redisConnection was closed unexpectedly ([9741d4b](https://github.com/Miventure-Inc/miventure-api/commit/9741d4baf90ab90c4f6ea8d41dd3241f746c7f8c))

### [0.6.26](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.25...v0.6.26) (2021-03-20)

### [0.6.25](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.24...v0.6.25) (2021-03-20)


### Bug Fixes

* **campaignservice:** disable redis ordering service ([c9bf82b](https://github.com/Miventure-Inc/miventure-api/commit/c9bf82baa55676c20125b0cdda80ed0b421ebc46))

### [0.6.24](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.23...v0.6.24) (2021-03-16)


### Features

* **GlobalNotification:** added push notification in global notification ([64f3aa2](https://github.com/Miventure-Inc/miventure-api/commit/64f3aa2c351e455f12384285aa40c4a55735d3eb))


### Bug Fixes

* **DowallaService:** resource cannot be modified ([ab1d1f9](https://github.com/Miventure-Inc/miventure-api/commit/ab1d1f96a2189304436ad1193832e56437019ffd))
* **DwollaService:** resouce cannot be modified error ([7949bf9](https://github.com/Miventure-Inc/miventure-api/commit/7949bf98e7ca9fb4cff1bdeb5bece5d7a224d82c))
* **GlobalNotification:** map method & promise ([01608a2](https://github.com/Miventure-Inc/miventure-api/commit/01608a22a5a8e12aa2f819bd075e9f7fe992fcb1))
* **GlobalNotification:** sendGlobalNotification route refactored ([e2f5b7c](https://github.com/Miventure-Inc/miventure-api/commit/e2f5b7c952e745bca0b19eeed7a3b09cc6a17dcc))
* **investmentlimit:** fix how we calculate investor's investment limit ([#586](https://github.com/Miventure-Inc/miventure-api/issues/586)) ([1b023f1](https://github.com/Miventure-Inc/miventure-api/commit/1b023f1a01a07265d80354226b53ba100af8ed85))
* **plaidlink:** change how we get userId from httpRequest ([bb8a762](https://github.com/Miventure-Inc/miventure-api/commit/bb8a7624e788965a29c255a20100f3d75107619e))
* **userservice-identitycheck:** allow us to force retry kyc ([d08d1aa](https://github.com/Miventure-Inc/miventure-api/commit/d08d1aa554bad7b53334c3abe0efc336e98112d1))

### [0.6.23](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.22...v0.6.23) (2021-03-02)

### [0.6.22](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.21...v0.6.22) (2021-03-01)

### [0.6.21](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.20...v0.6.21) (2021-03-01)


### Bug Fixes

* **userroutes:** fix loose authentication ([20945f9](https://github.com/Miventure-Inc/miventure-api/commit/20945f9f0c5ca88900b629a674902b03464b95be))

### [0.6.20](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.19...v0.6.20) (2021-02-26)


### Bug Fixes

* **auth:** fix update password enpoint to work with new auth flow ([61bd07f](https://github.com/Miventure-Inc/miventure-api/commit/61bd07f218cc55b382178cb947710f5760586122))
* **issuerbanks:** fix issuerBank circular dependancy ([874253b](https://github.com/Miventure-Inc/miventure-api/commit/874253b1207ff0262805d38a1e803614484a6e49))

### [0.6.19](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.18...v0.6.19) (2021-02-25)


### Bug Fixes

* **createdwollaaccount:** add idempotency keys to createDwolalAccount request ([1fb742f](https://github.com/Miventure-Inc/miventure-api/commit/1fb742fef7934856b1cc6317b29b7e063eada29e))

### [0.6.18](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.17...v0.6.18) (2021-02-24)


### Features

* **camapigns:** add earningProcesField ([bbd8093](https://github.com/Miventure-Inc/miventure-api/commit/bbd8093c6f078c93c05c64276bf045c459ec56ba))

### [0.6.17](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.16...v0.6.17) (2021-02-24)

### [0.6.16](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.15...v0.6.16) (2021-02-24)


### Features

* **newauthflow:** add redisAuthService alognwith logout and refreshToken routes ([c7b5bdc](https://github.com/Miventure-Inc/miventure-api/commit/c7b5bdcfca9b08e4a65c33a1fc9b2f98a2eb547c))


### Bug Fixes

* **auth:** update token expiry times ([889733c](https://github.com/Miventure-Inc/miventure-api/commit/889733c3de1e234d294c2440ea8f651b0e07c742))
* **campaignfunds:** fix invalid funding source when investing ([7d69b59](https://github.com/Miventure-Inc/miventure-api/commit/7d69b59b5c416ba20103a2bf58bba9b150c17444))
* **newauthflow:** fix refreshToken Api response and new auth logic to all sources ([757aac3](https://github.com/Miventure-Inc/miventure-api/commit/757aac3524e1218c816a13b335c7b401c2f59163))

### [0.6.15](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.13...v0.6.15) (2021-02-22)

### [0.6.14](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.13...v0.6.14) (2021-02-22)

### [0.6.13](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.12...v0.6.13) (2021-02-19)


### Bug Fixes

* **userdetails:** lower firstName/lastName limit to 2 ([52ae506](https://github.com/Miventure-Inc/miventure-api/commit/52ae5066dc1cc95d720db997c08c5da6141adc93))

### [0.6.12](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.11...v0.6.12) (2021-02-18)

### [0.6.11](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.10...v0.6.11) (2021-02-10)


### Features

* **usercrons:** add investor funnel push notification crons for users ([36c347d](https://github.com/Miventure-Inc/miventure-api/commit/36c347d0fe7c67156807617e15324bff48c0ea24))
* **usernotifications:** add messages for completeSingup,addBank,SendFeedbank,refer notifications ([d5fe525](https://github.com/Miventure-Inc/miventure-api/commit/d5fe525dc40afa1ae05d8a333638fb79210a4800))

### [0.6.10](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.9...v0.6.10) (2021-02-08)


### Features

* **tos:** add logic to store/check for faqUpdateEvents ([4544211](https://github.com/Miventure-Inc/miventure-api/commit/4544211d37db30bcdb4643a6a650c4e278abb955))


### Bug Fixes

* **tos:** fix user acknowledgement records not being stored ([b91ea13](https://github.com/Miventure-Inc/miventure-api/commit/b91ea13d867fef151e5da6656f0002196275b3bc))

### [0.6.9](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.8...v0.6.9) (2021-02-04)

### [0.6.8](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.7...v0.6.8) (2021-02-03)


### Features

* **usercrons:** add cron job to resend emails to privateRelayAppleUsers ([5866d52](https://github.com/Miventure-Inc/miventure-api/commit/5866d52eac903f978ca19d9a2ad0b7a159740f0c))


### Bug Fixes

* **usercrons:** fix apology cron processor users data ([dd2b9f6](https://github.com/Miventure-Inc/miventure-api/commit/dd2b9f608030434e8c812d0a4cab96b931955133))

### [0.6.6](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.5...v0.6.6) (2021-01-29)


### Bug Fixes

* **createuser:** fix incorrect values being set when creating a user ([eee0785](https://github.com/Miventure-Inc/miventure-api/commit/eee078588af544e24b0307469c05c5916c4b48df))

### [0.6.5](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.4...v0.6.5) (2021-01-26)


### Features

* **user:** add user summary ([606de82](https://github.com/Miventure-Inc/miventure-api/commit/606de82bae281a1da9de77d9133b3b6e37e7918e))
* **userevents:** add admin api to get specific user events ([0d0b368](https://github.com/Miventure-Inc/miventure-api/commit/0d0b368d8212aac6b825215493fce04a47418c70))


### Bug Fixes

* **forgotpasswordemail:** fix password validation text when resetting password ([a93fe67](https://github.com/Miventure-Inc/miventure-api/commit/a93fe6718674f5f438d2b13a08d277b975eaedaf))
* **userinfo:** show deleted user records for userInfo ([29e596c](https://github.com/Miventure-Inc/miventure-api/commit/29e596c02f3d09c5ba09b2f7b5609f848ad98d6f))
* **users:** add apartment column ([2d1af39](https://github.com/Miventure-Inc/miventure-api/commit/2d1af39c28820406c621343e80c2dc0a2b672174))
* **usersummary:** add start and end date parameters for user summary ([df45353](https://github.com/Miventure-Inc/miventure-api/commit/df453536967d041bddaa6a2098cc7f086bc47adc))
* **usersummary:** default stats query if not start/end date provided ([3504865](https://github.com/Miventure-Inc/miventure-api/commit/3504865f04db1b9b4e9a3178ebedca7b6c4cc89d))

### [0.6.3](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.2...v0.6.3) (2021-01-20)


### Features

* **campaignfund:** persist ip of user at the time of investment ([0fd63ac](https://github.com/Miventure-Inc/miventure-api/commit/0fd63ac4f2164cca98f1225f134bbb371ace0d6f))
* **httpserver:** log ip of all requests through morgan ([0d427a7](https://github.com/Miventure-Inc/miventure-api/commit/0d427a7f256cd33bc50d6f7a68b640904c99f48e))


### Bug Fixes

* **businessupdatenotification:** set correct resource type for business update notification ([89ce57b](https://github.com/Miventure-Inc/miventure-api/commit/89ce57b16da12ab1b3444da03b0bed14a24c92fc))
* **login:** fix bcrypt exception when user does not have a password set ([2385c79](https://github.com/Miventure-Inc/miventure-api/commit/2385c7996968b2a448b9b1bf72d917112d38197b))

### [0.6.2](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.1...v0.6.2) (2021-01-18)


### Features

* **campaignescrow:** add emailContact field to campaignEscrow ([79df05b](https://github.com/Miventure-Inc/miventure-api/commit/79df05bba1e1cab354b8fbe1e9feceac703831a5))
* **campaignfunds:** add daily cron processor ([fc40024](https://github.com/Miventure-Inc/miventure-api/commit/fc40024a107a9b0763f3dbb4c9721e85173f039e))
* **campaignfunds:** campaignFund daily email cron ([6b2aded](https://github.com/Miventure-Inc/miventure-api/commit/6b2aded552584c4cd692d2dd0b8d1173e64c75e4))
* **dripcampaign:** add drip campaign processor to handle crons ([31940b2](https://github.com/Miventure-Inc/miventure-api/commit/31940b2fc35c6849cd64b7eeec0e16725ce5568e))
* **dripcampaign:** add dripCampaignTempaltes ([2d89e4d](https://github.com/Miventure-Inc/miventure-api/commit/2d89e4d37f0d1d4acda4d4b7468ae2958547e8c9))
* **dripcampaign:** add support to send any template to all users ([c90c318](https://github.com/Miventure-Inc/miventure-api/commit/c90c318ca7082443ef0ff449f1b129531b574f6b))
* **dripcampaign:** finish process and add cron ([825d906](https://github.com/Miventure-Inc/miventure-api/commit/825d906796ee05172700008c3c2844f0ee82eca9))


### Bug Fixes

* **addcampaignescrow:** fix status and contactEmail values being assigned to each other ([43da45a](https://github.com/Miventure-Inc/miventure-api/commit/43da45a804f4640e412b69dff79abcfac760edb2))
* **campaignfundsdailyemail:** add john&jason's email as cc to escrow email ([0c775e8](https://github.com/Miventure-Inc/miventure-api/commit/0c775e8e61161ffb4dc38f8ea2e6fc3d2fd0f7f9))
* **campaignnews:** remove logic where we try to remove media from fileStorage ([9ee6eb0](https://github.com/Miventure-Inc/miventure-api/commit/9ee6eb050f8a4be649c6642a0bbbefcadde8eadd))
* **createuserdwollaaccount:** if user status !== verified , always return status ([e5fe6da](https://github.com/Miventure-Inc/miventure-api/commit/e5fe6daa31c85456359389d387251b5e06f80266))
* **dripcampaign:** add download links with UTM ([3925d46](https://github.com/Miventure-Inc/miventure-api/commit/3925d46c528009702d11d557104b8aea8cd0570f))
* **dripcampaign:** if username not present, just say 'hi,' ([788315a](https://github.com/Miventure-Inc/miventure-api/commit/788315a7808b9592cbce7bae18436b8466fcce99))
* **dripcampaign:** use email if username not present ([9a59e22](https://github.com/Miventure-Inc/miventure-api/commit/9a59e22ae97c6742027f189dc28716dc0b17ffaa))
* **getuser:** get user by id remove toPublicObject call ([f108a74](https://github.com/Miventure-Inc/miventure-api/commit/f108a7427491d019ff7a4e63e6a17c693de65faa))
* **guardagainstduplicatessn:** add firstName,lastName to duplicate ssn check ([42df34b](https://github.com/Miventure-Inc/miventure-api/commit/42df34b8fe9d6e2d16ebc1a254211bab3fd3b426))
* **idologykyc:** allow 4 digit ssn ([4526550](https://github.com/Miventure-Inc/miventure-api/commit/4526550d50d2236c6b396ad57b7a7a2ddb6d6d5b))

### [0.6.1](https://github.com/Miventure-Inc/miventure-api/compare/v0.6.0...v0.6.1) (2021-01-08)


### Bug Fixes

* **uploadmedia:** upload video to cloudinary as well ([f410f68](https://github.com/Miventure-Inc/miventure-api/commit/f410f68e8bbf8bc3017c324300fa5d438b82553d))

## [0.6.0](https://github.com/Miventure-Inc/miventure-api/compare/v0.5.7...v0.6.0) (2021-01-08)


### ⚠ BREAKING CHANGES

* **uploadmedia:** changed the video upload vendor

### Features

* **uploadvideos:** add cacheControl header when uploading media to GCP ([5f0f162](https://github.com/Miventure-Inc/miventure-api/commit/5f0f162a1b7d611873d28e15927e64c91073f64d))


### Bug Fixes

* **uploadmedia:** gcp uploadVideo make gzip parameter optional and true by default ([7a12f41](https://github.com/Miventure-Inc/miventure-api/commit/7a12f4163597e748ddd59dc3509e727d8465dada))


* **uploadmedia:** replace cloudinary for gcp ([9636dc8](https://github.com/Miventure-Inc/miventure-api/commit/9636dc85e76b82a6dcfb1d73a2491af46f0bd1d2))

### [0.5.7](https://github.com/Miventure-Inc/miventure-api/compare/v0.5.6...v0.5.7) (2021-01-07)

### [0.5.6](https://github.com/Miventure-Inc/miventure-api/compare/v0.5.5...v0.5.6) (2021-01-05)


### Bug Fixes

* **notifications:** business update notification revert resrceType change until frontend catches up ([08e3a2e](https://github.com/Miventure-Inc/miventure-api/commit/08e3a2e04673d95e3cd6430a56300a18098a4aa2))

### [0.5.5](https://github.com/Miventure-Inc/miventure-api/compare/v0.5.4...v0.5.5) (2021-01-05)


### Bug Fixes

* **campaignnews:** business update notification resource type and campaignname in payload ([46d5302](https://github.com/Miventure-Inc/miventure-api/commit/46d5302d4b777634c36f9d574454b9c7dbe0c6c4))
* **notifications:** update newLiveCampaignMessage body to include campaign name ([164c9d6](https://github.com/Miventure-Inc/miventure-api/commit/164c9d64d137fbc38a02c4f10b2aad78a09ee54b))

### [0.5.4](https://github.com/Miventure-Inc/miventure-api/compare/v0.5.3...v0.5.4) (2021-01-04)


### Bug Fixes

* **user:** create user ([b7040f1](https://github.com/Miventure-Inc/miventure-api/commit/b7040f121ed2f100eddc4bdecacaee4c52b2f2ac))

### [0.5.3](https://github.com/Miventure-Inc/miventure-api/compare/v0.5.2...v0.5.3) (2021-01-04)


### Bug Fixes

* **user:** fix portfolioVisited automatically being set as false on updates ([5c04935](https://github.com/Miventure-Inc/miventure-api/commit/5c049355474c540bb94415235b5fb967d5e13ef0))

### [0.5.2](https://github.com/Miventure-Inc/miventure-api/compare/v0.5.1...v0.5.2) (2021-01-04)


### Features

* **campaignnews:** add business update notification for all users ([25ac31f](https://github.com/Miventure-Inc/miventure-api/commit/25ac31f9d9618f77ddd4bfaf9174994f53b03580))


### Bug Fixes

* **portfoliovisited:** fix default false for protfolioVisited & isVerifiedPrompt ([298b661](https://github.com/Miventure-Inc/miventure-api/commit/298b6612253d681d73c91085c7a13d244bce6132))

### [0.5.1](https://github.com/Miventure-Inc/miventure-api/compare/v0.5.0...v0.5.1) (2021-01-01)


### Bug Fixes

* **camapignfunds/intermediatorycharge:** fix undo refund request not working ([1fa3a55](https://github.com/Miventure-Inc/miventure-api/commit/1fa3a554753e8e9c1a1ed3e80fbd3202617c33d7))

## [0.5.0](https://github.com/Miventure-Inc/miventure-api/compare/v0.4.6...v0.5.0) (2020-12-31)


### ⚠ BREAKING CHANGES

* **campaignfunds:** intermeidatoryCharge source

### Bug Fixes

* **campaignfundfinalcharge:** update cmpgn FundsfinalCharge cron flow to use issuer wallet as source ([222fb75](https://github.com/Miventure-Inc/miventure-api/commit/222fb7556f6ca78bd6caa43a794005b66fafbdb0))
* **campaignfunds:** change cfIntermediatoryCharge source && add idempotencyKey in 10sec interval ([3b03d0e](https://github.com/Miventure-Inc/miventure-api/commit/3b03d0ec01553c0c97714dc0af60fdc8da9add62))
* **media:** make mediaPath routeParamter optional ([d996f08](https://github.com/Miventure-Inc/miventure-api/commit/d996f089bbe9ab7ef89445ee0499c88e35af69ae))

### [0.4.6](https://github.com/Miventure-Inc/miventure-api/compare/v0.4.5...v0.4.6) (2020-12-31)


### Features

* **campaignfunds:** campaignSpecific FinalCharge cron ([d5b86c0](https://github.com/Miventure-Inc/miventure-api/commit/d5b86c05d115d65fcfb05d21cf418394008a7890))

### [0.4.5](https://github.com/Miventure-Inc/miventure-api/compare/v0.4.4...v0.4.5) (2020-12-30)


### Bug Fixes

* **campaigndetail:** fix totalFundsRaised wrong value ([cf2e1b0](https://github.com/Miventure-Inc/miventure-api/commit/cf2e1b065bb7c3e8a499074500df3fbf572d5ff1))

### [0.4.4](https://github.com/Miventure-Inc/miventure-api/compare/v0.4.3...v0.4.4) (2020-12-29)


### Features

* **admin/dwolla:** allow admins to upload verification documents to dwolla ([1eb4663](https://github.com/Miventure-Inc/miventure-api/commit/1eb4663bbad8557bd363ec603d9182b22714c303))
* **media:** serve media through api instead of through api url ([b69c57c](https://github.com/Miventure-Inc/miventure-api/commit/b69c57cd8a3b06772aa768eefeb589d8c9731298))


### Bug Fixes

* **campaignfundfinalcharge:** update Idempotency key ([41befd0](https://github.com/Miventure-Inc/miventure-api/commit/41befd05d72bd91a44e46bb2dce8d44c455f95c6))
* **campaignfundsfinalcharge:** add idempotency key for campaignFundFinalCharge ([7d747a5](https://github.com/Miventure-Inc/miventure-api/commit/7d747a5629ced81cf6cda0992401c7c8ebcbc350))
* **media:** fix video streaming not working on ios ([9bb9dbe](https://github.com/Miventure-Inc/miventure-api/commit/9bb9dbeaf012c89eee5b868fc1889861613ab2be))
* **media:** media streaming range headers ([3028c03](https://github.com/Miventure-Inc/miventure-api/commit/3028c03b3376452174d66e42178d4e359e149971))
* **media:** remove cache,connection, compression headers ([eafe93e](https://github.com/Miventure-Inc/miventure-api/commit/eafe93e7c0917d9099c1760491f04a7ebf2cc7ce))
* **media:** update respone headers ([d952870](https://github.com/Miventure-Inc/miventure-api/commit/d9528705a001d5ef09a45567d61447d2e46bbd72))
