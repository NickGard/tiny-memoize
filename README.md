# tiny-memoize

[![source](https://badgen.net/npm/v/@ngard/tiny-memoize)](https://www.npmjs.com/package/@ngard/tiny-memoize)
[![bundle size](https://badgen.net/bundlephobia/minzip/@ngard/tiny-memoize)](https://bundlephobia.com/result?p=@ngard/tiny-memoize)
[![build status](https://badgen.net/travis/NickGard/tiny-memoize)](https://travis-ci.org/NickGard/tiny-memoize)
[![license](https://badgen.net/badge/license/MIT/blue)](https://badgen.net/badge/license/MIT/blue)

A minimal-weight utility similar to `lodash.memoize`. For when every byte counts!

<hr/>

lodash.memoize [![bundle size](https://badgen.net/bundlephobia/minzip/lodash.memoize)](https://bundlephobia.com/result?p=lodash.memoize)
<br/>
tiny-memoize [![bundle size](https://badgen.net/bundlephobia/minzip/@ngard/tiny-memoize)](https://bundlephobia.com/result?p=@ngard/tiny-memoize)

<hr/>

## Syntax

```js
memoize(/* function [, maxMemoizations, reconciler] */)
```

## Parameters

`function` - The function to memoize
<br/>
`maxMemoizations` - [optional = `1`] A positive numerical value that designates the number of unique function calls to memoize. Non-numeric and non-positive values will default to `1`. Positive non-integer values will round down to the nearest integer, or up to `1` for values between `0` and `1`.
<br/>
`reconciler` - [optional] A function that compares two cache keys for equality. Cache keys are `arguments` objects. The default reconciler checks each argument for equality using `===`.

## Return

A function that will return the value of the arguments applied to the passed function, either by invoking the function or by performing a lookup (by arguments) of previously generated values.

## Example

```javascript
import { memoize } from '@ngard/tiny-memoize';

const efficientPrimeCalculator = memoize(isPrime, Infinity);
efficientPrimeCalculator(1000000000000066600000000000001); // isPrime is called, returns true
efficientPrimeCalculator(1000000000000066600000000000001); // isPrime is NOT called, returns true
```

```javascript
import { memoize } from '@ngard/tiny-memoize';

const isSamePerson = (args1, args2) => {
  const person1 = args1[0];
  const person2 = args2[0];
  return person1.id === person2.id;
};
const greet = memoize(person => `Hi, ${person.givenName}!`, 1, isSamePerson);
greet({
  id: 845739,
  givenName: 'Janine',
  surname: 'Bloomfield',
  occupation: 'senior accountant',
  birthdate: new Date('Jan 02 1991')
}); // calculates 'Hi, Janine!'
greet({
  id: 845739,
  givenName: 'Janine',
  surname: 'Bloomfield',
  occupation: 'CTO',
  birthdate: new Date('Jan 02 1991')
}); // returns memoized result 'Hi, Janine!'
```
