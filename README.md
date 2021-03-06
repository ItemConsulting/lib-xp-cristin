# Cristin Integration Library for Enonic XP

Enonic XP Library for fetching a copy of data from Cristin, and storing it in a local repo.

[![](https://jitpack.io/v/no.item/lib-xp-cristin.svg)](https://jitpack.io/#no.item/lib-xp-cristin)

<img src="https://github.com/ItemConsulting/lib-xp-cristin/raw/main/docs/icon.svg?sanitize=true" width="150">

## Installation

To install this library you need to add a new dependency to your app's build.gradle file.

### Gradle

```groovy
repositories {
  maven { url 'https://jitpack.io' }
}

dependencies {
  include "com.enonic.xp:lib-portal:${xpVersion}"
  include "com.enonic.xp:lib-repo:${xpVersion}"
  include "com.enonic.xp:lib-node:${xpVersion}"
  include "com.enonic.xp:lib-value:${xpVersion}"
  include "com.enonic.lib:lib-http-client:3.0.1"
  include "no.item:lib-cristin:1.0.10"
}
```

## Usage

After updating the gradle file, you can import the `/lib/cristin` library.

The library includes the following functions:

* `getCristinPerson(id)`
* `getCristinInstitution(id)`
* `getCristinProject(id)`
* `getCristinUnit(id)`
* `getCristinResult(id)`
* `getCristinResultContributors(id)`

### Controllers

```javascript
var cristinLib = require('/lib/cristin');

exports.get = function() {
  cristinLib.getCristinPerson("12345")
}
```

## Deploying

### Building

To build he project run the following code

```bash
./gradlew build
```

### Deploy locally

Deploy locally for testing purposes:

```bash
./gradlew publishToMavenLocal
```

## Deploy to Jitpack

Go to the [Jitpack page for lib-xp-cristin](https://jitpack.io/#no.item/lib-xp-cristin) to deploy from Github.
