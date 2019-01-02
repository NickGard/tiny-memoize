const { memoize } = require("./index");
const { expect } = require("chai");
const { spy } = require("sinon");

describe("tiny-memoize", () => {
  it("should not call memoized functions with the same arguments more than once", () => {
    const fn = spy(x => x);
    const memFn = memoize(fn, 1);
    expect(fn.callCount).to.equal(0);
    memFn("a");
    expect(fn.callCount).to.equal(1);
    memFn("a");
    memFn("a");
    expect(fn.callCount).to.equal(1);
    memFn("b");
    expect(fn.callCount).to.equal(2);
    memFn("b");
    memFn("b");
    expect(fn.callCount).to.equal(2);
  });
  it("should default to memoizing only the last call", () => {
    const fn = spy(x => x);
    const memFn = memoize(fn);
    expect(fn.callCount).to.equal(0);
    memFn("a");
    expect(fn.callCount).to.equal(1);
    memFn("a");
    memFn("a");
    expect(fn.callCount).to.equal(1);
    memFn("b");
    expect(fn.callCount).to.equal(2);
    memFn("b");
    memFn("b");
    expect(fn.callCount).to.equal(2);
  });
  it("should not memoize more calls than the maximum memoizations", () => {
    const fn = spy(x => x);
    const memFn = memoize(fn, 3);
    memFn("a");
    memFn("b");
    memFn("c");
    expect(fn.callCount).to.equal(3);
    memFn("a");
    memFn("c");
    memFn("b");
    memFn("c");
    memFn("b");
    memFn("a");
    expect(fn.callCount).to.equal(3);
    memFn("d");
    expect(fn.callCount).to.equal(4);
    memFn("a");
    expect(fn.callCount).to.equal(5);
    memFn("b");
    expect(fn.callCount).to.equal(6);
  });
  it("should accept any integer greater than 1 for the maximum memoizations", () => {
    const fn = spy(x => x);
    const memFn = memoize(fn, 3);
    memFn("a");
    memFn("b");
    memFn("c");
    expect(fn.callCount).to.equal(3);
    memFn("a");
    memFn("c");
    memFn("b");
    memFn("c");
    memFn("b");
    memFn("a");
    expect(fn.callCount).to.equal(3);
  });
  it("should accept, and round down, any number greater than 1 for the maximum memoizations", () => {
    const fn = spy(x => x);
    const memFn = memoize(fn, 3.99);
    memFn("a");
    memFn("b");
    memFn("c");
    expect(fn.callCount).to.equal(3);
    memFn("a");
    memFn("c");
    memFn("b");
    expect(fn.callCount).to.equal(3);
    memFn("d");
    expect(fn.callCount).to.equal(4);
  });
  it("should overwrite (with 1) any number less than 1 for the maximum memoizations", () => {
    const fn = spy(x => x);
    const memFn = memoize(fn, -2);
    memFn("a");
    memFn("b");
    memFn("c");
    expect(fn.callCount).to.equal(3);
    memFn("a");
    expect(fn.callCount).to.equal(4);
  });
  it("should overwrite (with 1) any non-numeric maximum memoizations", () => {
    const fn = spy(x => x);
    const memFn = memoize(fn, NaN);
    memFn("a");
    memFn("b");
    memFn("c");
    expect(fn.callCount).to.equal(3);
    memFn("a");
    expect(fn.callCount).to.equal(4);
  });
  it("should accept a reconciler function to compare cache keys", () => {
    const fn = spy(person => `Hi, ${person.givenName}!`);
    const memFn = memoize(fn, 1);
    const isSamePerson = (args1, args2) => {
      const person1 = args1[0];
      const person2 = args2[0];
      return person1.id === person2.id;
    };
    const memFnWithReconciler = memoize(fn, 1, isSamePerson);
    const Janine = {
      id: 845739,
      givenName: "Janine",
      surname: "Bloomfield",
      occupation: "senior accountant",
      birthdate: new Date("Jan 02 1991")
    };
    const JanineCTO = {
      id: 845739,
      givenName: "Janine",
      surname: "Bloomfield",
      occupation: "CTO",
      birthdate: new Date("Jan 02 1991")
    };
    memFn(Janine);
    memFnWithReconciler(Janine);
    expect(fn.callCount).to.equal(2);

    memFn(JanineCTO);
    expect(fn.callCount).to.equal(3);
    memFnWithReconciler(JanineCTO);
    expect(fn.callCount).to.equal(3);
  });
  it("should pass the arguments to the memoized function when called", () => {
    const fn = spy(x => x);
    const memFn = memoize(fn, 1);
    memFn("a", "b", "c");
    expect(fn.calledWithExactly("a", "b", "c")).to.be.true;
  });
  it("should preserve the context of the memoized function when called", () => {
    const fn = spy(function() {
      return this;
    });
    class Person {
      constructor(name) {
        this.name = name;
        this.say = memoize(this.say.bind(this), 1);
      }
      say(message) {
        return `${this.name} says, "${message}"`;
      }
    }
    const bob = new Person("Bob");
    expect(memoize(fn)()).to.equal(global);
    expect(bob.say("boo!")).to.equal('Bob says, "boo!"');
  });
});
