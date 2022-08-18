# Cristin Library for Enonic XP

[Cristin](https://www.cristin.no) is a service that gathers and makes available information about Norwegian research.

 > **Note** This library is a companion to the [xp-cristin](https://github.com/ItemConsulting/xp-cristin) application

This library is used to fetch data from the Cristin APIs, or read the data stored in a local [repo](https://developer.enonic.com/docs/xp/stable/api/lib-repo) by **xp-cristin**.

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
  include "com.enonic.lib:lib-http-client:3.1.0"
  include "no.item:lib-xp-cristin:1.0.15"
}
```

## Usage

### Getting Cristin data by ID

For most cases using the functions in `"/lib/cristin"` is the most effective way to get Cristin data.

When calling these functions the following happens:
 1. Check if the data with that Cristin ID is found in the local repo
 2. If not, fetch it from the Cristin API and save it to the repo
 3. Return the data (or `void` if it doesn't exist)

The following functions to get a single entity are exported from `"/lib/cristin"`:

* `getCristinPerson(id)`
* `getCristinInstitution(id)`
* `getCristinProject(id)`
* `getCristinUnit(id)`
* `getCristinResult(id)`
* `getCristinResultContributors(id)` (Returns an `Array` of contributors for a single `Result`)

The following functions to get `Arrays` of entries are exported from `"/lib/cristin"`:

* `getCristinPersons(ids)`
* `getCristinInstitutions(ids)`
* `getCristinProjects(ids)`
* `getCristinUnits(ids)`
* `getCristinResults(ids)`

*Example usage in an XP service:*

```javascript
var cristinLib = require('/lib/cristin');

exports.get = function() {
  const person = cristinLib.getCristinPerson("12345")
  
  return {
    status: 200,
    body: {
      person: person
    }
  }
}
```

### Fetch only from API

It is also possible to not use the local repo, and only get the data fresh from the API

The following functions to get a single entry are exported from `"/lib/cristin/service"`:

* `fetchPersons({ id })`
* `fetchProject({ id })`
* `fetchResult({ id })`
* `fetchResultContributors({ id })`
* `fetchInstitution({ id })`
* `fetchUnit({ id })`

The following functions to get an `Array` of entries are exported from `"/lib/cristin/service"`:

* `fetchPersons(params)`
* `fetchProjects(params)`
* `fetchResults(params)`
* `fetchPersonResults(params)`
* `fetchInstitutions(params)`
* `fetchResultCategories(params)`
* `fetchUnits(params)`

### Only get from local repo (no API usage)

The following functions to get a single entry are exported from `"/lib/cristin/storage"`:

* `lookupPerson(id)`
* `lookupInstitution(id)`
* `lookupProject(id)`
* `lookupUnit(id)`
* `lookupResult(id)`
* `lookupResultContributors(id)`

The following functions to get an `Array` of entries are exported from `"/lib/cristin/storage"`:

* `lookupPerson(ids)`
* `lookupInstitution(ids)`
* `lookupProject(ids)`
* `lookupUnit(ids)`
* `lookupResult(ids)`
* `lookupResultContributors(ids)`

## Graphql Schemas

This library also exports GraphQL-definitions for use with the [Guillotine library](https://developer.enonic.com/docs/guillotine/stable/usage).

### Names as strings

The following names as strings are exported from `"/lib/cristin/graphql"`:

- `GRAPHQL_OBJECT_NAME_CRISTIN_UNIT`
- `GRAPHQL_OBJECT_NAME_CRISTIN_INSTITUTION`
- `GRAPHQL_OBJECT_NAME_CRISTIN_PERSON`
- `GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT`
- `GRAPHQL_OBJECT_NAME_CRISTIN_RESULT`

The following functions to create GraphQL object types are exported from `"/lib/cristin/graphql"`:

- `createObjectTypeCristinPerson(context, options)`
- `createObjectTypeCristinInstitution(context, options)`
- `createObjectTypeCristinProject(context, options)`
- `createObjectTypeCristinResult(context, options)`
- `createObjectTypeCristinResultCategory(context, options)`
- `createObjectTypeCristinUnit(context, options)`

The following `reference()` types are exported from `"/lib/cristin/graphql"` (for usage after the object types has been registered):

- `GraphQLCristinPerson`
- `GraphQLCristinInstitution`
- `GraphQLCristinProject`
- `GraphQLCristinResult`
- `GraphQLCristinUnit`

*Example usage in Guillotine controller:*

```typescript
var guillotineLib = require("/lib/guillotine");
var cristinLib = require("/lib/cristin");
var cristinGraphqlLib = require("/lib/cristin/graphql");

var schema = guillotineLib.createSchema({
  applications: ["com.myapp"],
  creationCallbacks: {
    com_myapp_Employee_Data: function(context, params) {
      // Register GraphQL object types for Cristin objects needed
      context.addDictionaryType(cristinGraphqlLib.createObjectTypeCristinInstitution(context));
      context.addDictionaryType(cristinGraphqlLib.createObjectTypeCristinPerson(context));
      
      params.fields.cristinProfile = {
        // Use the reference type (`reference("no_item_cristin_Person")`)
        type: cristinGraphqlLib.GraphQLCristinPerson,
        resolve: function(env) {
          return cristinLib.getCristinPerson(env.source.cristinProfileId);
        }
      };
    },
  }
});
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
