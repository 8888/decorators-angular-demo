/* tslint:disable:max-line-length */

/* SLIDE */
// Typescript decorators and meta programming
// RMD logo?
// Angular NYC logo?
// Lee Costello
// Lead front-end engineer
// RubiconMD
// -githublogo- @betterin30days

/* SLIDE */
// You use decorators regularly
/**
 * Talk about how angular uses them all over
 * @Component, @Injectable, @NgModule, etc
 * Everyone knows this, just might not know what they are doing
 */

/* SLIDE */
// Angular tour of heroes
/**
 * How many know what this is?
 * Angular tutorial
 */

/* SLIDE */
// first file you open in the tutorial
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tour-of-heroes';
}
/**
 * They first have you change the title, not explain the decorator
 * The decorator is much more complex than the title changes
 * So what's going on here?
 * This is Angular's Component decorator
 * We import it from core, becuase that is where it is originally declared
 * When using it, we can pass in some metadata
 * The components selector to be used in other templates
 * The paths to the template and style files
 * These are the most common, but there are actually plenty others like
 *   providers, and inline templates and styles
 * This part should all be familair, but I want to talk about what decorators
 *   actually do and how to write your own
 */

/* SLIDE */
// What are decorators?
/**
 * The typescript docs are vauge, something like "Decorators are a special kind
 *   of declaration that can be attached to a class or method etc"
 * While this is true, it doesn't tell you much.
 * So I googled it and also found:
 * "Decorators are just a clean syntax for wrapping a peice of code with a function"
 * What's interesting about that is it gives insight into what they are, functions.
 * Decorators are just functions. Everything you do with decorators can be done with
 *   standard function calls.
 * They are functions that follow a specific signature, and have a clean syntax
 */

/* SLIDE */
// They are different than javascript decorators
/**
 * I'm only talking about decorators in typescript
 * Right now, decorators are a stage 2 proposal for ecmascript
 * When decorators make it into the ecmascript standards they are likely
 *   to be different than what we are using in typescript today
 */

/* SLIDE */
// Decorators are an experimental feature of Typescript
/**
 * Since we are likely using Angular, this isn't relevant
 * But just know that if you wanted to use TS decorators in a TS project
 *   outside of angular, you need to setup your tsconfig.json with a few lines
 *   to tell the compiler to support decorators.
 * This is already done for you when you create a new angular project using the
 *   Angular CLI
 */

/* SLIDE */
// There are a few different types of decorators
/**
 * A decorator can be attached to a class, method, accessor, property, or parameter
 */

/* SLIDE */
function classDecorator<T extends {new (...args: any[]): {}}>(constructor: T) {}
function methodDecorator(target: object, propertyName: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor { return propertyDescriptor; }
function accessorDecorator(target: object, propertyName: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor { return propertyDescriptor; }
function propertyDecorator(target: object, propertyKey: string | symbol): void {}
function parameterDecorator(target: object, propertyKey: string | symbol, parameterIndex: number): void {}

export class Dog {
  private species = 'dog';

  constructor(private name: string) {}

  public speak(message: string): void {
    console.log(`bark ${message} bark`);
  }

  public get fullName(): string {
    return `${this.name} the ${this.species}`;
  }
}

@classDecorator
export class Dog {
  @propertyDecorator private species = 'dog';

  constructor(private name: string) {}

  @methodDecorator
  public speak(@parameterDecorator message: string): void {
    console.log(`bark ${message} bark`);
  }

  @accessorDecorator
  public get fullName(): string {
    return `${this.name} the ${this.species}`;
  }
}
/**
 * Probably two or more slides. Show non-decorated code first
 * Expain the basic Dog class
 * Then show the code with each decorator
 * Just explain what portions of code are able to be decorated
 */

/* SLIDE */
// Class decorators
/**
 * Now let's look at how to write a decorator and what they do
 * We'll first start with a class decorators
 */

/* SLIDE */
// Class decorator type signature
// lib.es5.d.ts
declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;

// lib.es5.d.ts
declare type ClassDecorator =
  <TFunction extends Function>(target: TFunction) =>
    TFunction | void;
/**
 * If you go look at the typescript source code, either on github or in your node_modules
 *   you can find the type declaration for the available decorators
 * One thing to keep in mind is that when you write a decorator, you're not going to
 *   reference this type, or extend it etc. The compiler will know which decorator it is
 *   when you attach them. So if you put a decorator infront of a class, it will compare
 *   the decorator function to this type signature.
 * Basically class decorators take a in a function, and return a function or void
 * That function is the constructor function
 * So when you decorate a class, you are actually making introspections into the constructor,
 *   which should make sense if you are familair with JS before es6 (es2015) classes
 *   with constructor functions and prototypal inheritance. If not don't worry at all.
 * Just know that a classDecorator means we are going to do something with the constructor
 */

/* SLIDE */
// Let's write a class decorator
/**
 * The first example you see in the typecsript docs is about sealing an object.
 * We'll look at it super quickly because it is as basic as possible, but probably
 *   more simple than what you'll write later
 * What does it mean to seal an object? It makes it so the object is non-extensible, or
 *   you can't add or delete properties
 */

/* SLIDE */
// Define the sealed class decorator
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}
/**
 * This is a normal function
 * You don't have to do anything special to make it a decorator, just follow the signature
 * The constructor is passed in as a parameter, then used again as paremeter
 *   for Object.seal
 * This one is very basic because we are not making any changes to constructor function
 * We are just passing it into another function call
 */

/* SLIDE */
// Use the new decorator
@sealed
class Dog {}
/**
 * Using it is as simple as that. When a new instance of the Dog class is instantiated
 *   it will now also be sealed
 */

/* SLIDE */
// A more detailed class decorator
/**
 * Let's make another class decorator, but this time we will extend the constructor
 */

/* SLIDE */
// Our current Dog class
export class Dog {
  private species = 'dog';

  constructor(private name: string) {}

  public speak(message: string): void {
    console.log(`bark ${message} bark`);
  }

  public get fullName(): string {
    return `${this.name} the ${this.species}`;
  }
}

const nora = new Dog('nora');
nora.speak('hello');
// bark hello bark

/**
 * Right now we can instatiate a new dog that can speak or bark
 * What if we want to be able to create a super hero dog that could fly?
 * It seems weird to add a fly method right into the dog class.
 * And yeah we could do class approaches of inheritance or interfaces, but that's not why we are here
 * Lets write a decorator to keep that logic out of the main dog class
 */

/* SLIDE */
// Define the flyer class decorator
function flyer<T extends {new (...args: any[]): {}}>(constructor: T): T {
  return class extends constructor {
    public fly() {
      console.log('wooosh 🚀');
    }
  }
}
/**
 * this is still a class decorator like we had before, but there's much more going on here
 * First, it's still just a function, but we had to expand the signature some more
 * The signature of the generic type and passing in the constructor is pretty boilerplate,
 *   You'll find this right in the typescript docs. We are taking in a constructor, and returning
 *   another one
 * Now the return is a class that extends the constructor we passed in. So this isn't completely replacing
 *   it, just adding our new fly method.
 */

/* SLIDE */
// Use the new decorator
@flyer
export class Dog {
  private species = 'dog';

  constructor(private name: string) {}

  public speak(message: string): void {
    console.log(`bark ${message} bark`);
  }
}

const superNora = new Dog('Super Nora');
superNora.fly();
// wooosh 🚀

/**
 * Same as before, just simply decorate the class with our new flyer decorator
 * and now we can instantiate a new Dog named Super Nora
 * and she now has a fly method.
 */

/* SLIDE */
// Angular's component class decorator
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tour-of-heroes';
}

/**
 * We can write class decorators now, but lets look back at the one we started with
 * Looking at Angular's component class decorator, there is still much more going on.
 * We didn't use parentheses or pass in anything
 * The component decorator is actually a decorator factory
 * And the object that is being passed in is metadata, or data about data
 */

/* SLIDE */
// What is a decorator factory?
/**
 * First what is a factory?
 * This is not anything specific to decorators, a factory is a function that returns a function
 * So a decorator factory is a function that returns a decorator function.
 * That's what Angular's Component decorator is doing
 * you pass the metadata object into a function, and it returns a decorator
 */

/* SLIDE */
// Let's write a decorator factory
function flyer(speed: {velocity: number, unit: string}) {
  return function<T extends {new (...args: any[]): {}}>(constructor: T): T {
    return class extends constructor {
      public fly() {
        console.log(`wooosh at ${speed.velocity} ${speed.unit} 🚀`);
      }
    }
  }
}
/**
We expanded on our flyer decorator
flyer is just a simple function that accepts an object of a velocity and unit of measurement
this now returns another function, that looked just like our original flyer declaration
  except we are using the speed object in our new fly method
Now we are able to pass in an object just like the component decorator does
 */

/* SLIDE */
// Using the new Flyer decorator
@flyer({
  velocity: 100,
  unit: 'mph'
})
export class Dog {
  private species = 'dog';

  constructor(private name: string) {}

  public speak(message: string): void {
    console.log(`bark ${message} bark`);
  }
}

const superNora = new Dog('Super Nora');
superNora.fly();
// wooosh at 100 mph 🚀
/**
now using the flyer decorator feels a lot like the component decorator we're used to seeing!
This allows us to configure our fly method, and when we call it, we see now that it uses
  the paremeters we originally passed into our decorator factory
The compiler will fist evaluate the flyer function and apply the passed in arguments
then the returned decorator will be called and the fly method will be added to that instance
  of the Dog class
 */

/* SLIDE */
// Method decorators

// lib.es5.d.ts
declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;

// lib.es5.d.ts
declare type MethodDecorator =
  <T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) =>
    TypedPropertyDescriptor<T> | void;

/**
 * Let's move on to method decorators
 * Back the source code of typescript, this is the type declaration for a method decorator
 * target is a reference to the object that the method belongs to
 * propertyKey is a string of the name of the method
 * descriptor is how we can access the method that we are decorating
 * This will all be passed into the decorator function on its own, this is just so we know what we have
 *   available to us when we write our own decorator
 * The return type is the same as descriptor, so we are returning the method that we decorated
 */

/* SLIDE */
// Let's write a method decorator

/**
 * We're going to write a decorator that will log everytime a method is called
 * I want it to log the method and the arguments that it was called with
 * Again, this can all be done inside the original method, but why pollute it with logging logic?
 */

/* SLIDE */
// Log method decorator
function log(
  target: object,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor
): PropertyDescriptor {
  const method = propertyDescriptor.value;
  propertyDescriptor.value = function(...args: any[]) {
    const params = args.map(arg => JSON.stringify(arg)).join();
    const result = method.apply(this, args);
    console.log(`Method called: ${propertyName}(${params})`);
    return result;
  };
  return propertyDescriptor;
}
/**
 * It seems like with this there is a lot going on already. Let's walk through it and see, it's not so bad
 * log is a normal function again, it takes three parameters that we went over before
 * target is the reference to object that the method belongs to
 * propertyName is a string of the name of the method
 * propertyDescriptor is how we can access the original method
 * We return a PropertyDescriptor, so it's going to be a method
 * The first thing we do is store a reference to the original method, that's what
 *   propertyDescriptor.value returns
 * This is so we can do the next block of code, which is redefine propertyDescriptor.value
 * So we now define a new function that is assigned as the method, becuase we want this block to be called
 *   when you call the method.
 * This portion is where I'm defining the logging logic
 * I want to get a string of all of the parameters passed into the method, not the decorator
 * I call the original method
 * and now I log that the method was called, and output the method name and string of parameters
 * I return the result of what was returned from the original method
 * The final return is the propertyDescriptor, this is the return of the decorator, that sets
 *   the new method
 * Let's use it!
 */

/* SLIDE */
// Using the log decorator
export class Dog {
  private species = 'dog';

  constructor(private name: string) {}

  @log
  public speak(message: string): void {
    console.log(`bark ${message} bark`);
  }
}

const nora = new Dog('nora');
nora.speak('hello');
// bark hello bark
// Method called: speak("hello")

/**
 * We decorated the speak method with the log decorator
 * When speak is called, we'd see the log output in our console
 * Now we could put this on any method and not need to edit our method just to add logging logic
 */

/* SLIDE */
// Methods can use decorator factories as well
/**
 * We looked at decorator factories earlier when we built out our class decorator
 * Remember, they are just functions that return a decorator, which is still just a function
 * We can do the same for method decorators, we will create a factory that takes parameters
 *   and returns a method decorator
 * Let's use our same log decorator, but make it so it can be customized a little
 */

/* SLIDE */
// Declaring the method decorator factory
function log(includeClass: boolean) {
  return function(
    target: object,
    propertyName: string,
    propertyDescriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const method = propertyDescriptor.value;
    propertyDescriptor.value = function(...args: any[]) {
      const params = args.map(arg => JSON.stringify(arg)).join();
      const result = method.apply(this, args);
      const className = includeClass ? `${target.constructor.name}.` : '';
      console.log(`Method called: ${className}${propertyName}(${params})`);
      return result;
    };
    return propertyDescriptor;
  }
}

/**
 * We have our log function, but the signature has changed
 * Now it only takes one parameter, includeClass, which is a boolean
 * This now returns a function that looks a lot like our previous log function
 * The only difference in here is we are checking what boolean was passed in and
 *   prepending the classname to the property name
 * The decorator that is returned will be very similair to what we had before
 */

/* SLIDE */
// Using the new log method decorator factory
export class Dog {
  private species = 'dog';

  constructor(private name: string) {}

  @log(true)
  public speak(message: string): void {
    console.log(`bark ${message} bark`);
  }
}

const nora = new Dog('nora');
nora.speak('hello');
// bark hello bark
// Method called: Dog.speak("hello")

/**
 * Again, this looks very similair to our previous usage of the log decorator
 * the only difference is now we are calling the function and passing in a boolean, true in this case
 * This will call the factory, assign true to the boolean we had in there, and return a method decorator
 * The method decorator will then override the speak method to include that logging logic
 * When we call speak we will see that method is logged again, but now it will show the class, Dog.speak
 * It's worth noting that if we passed in false this would have the same output as our previous log decorator
 */

/* SLIDE */
// Accessor decorators

// lib.es5.d.ts
declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;

/**
 * I said earlier that you can also create Accessor decorators
 * An accessor is just a getter or a setter
 * But this time, if we go check the typescript source code we won't find a signature for accessor decorators
 * But since these are decorating getters and setters, they use the same signature of the method decorator
 *   that we just looked at
 * So lets look at that again real quick
 * Same as before, target is a reference to the object
 * property Key is the method name
 * descriptor is how we can access the method
 */


/* SLIDE */
// Writing an accessor decorator

function mask(
  target: object,
  propertyKey: string,
  propertyDescriptor: PropertyDescriptor
): PropertyDescriptor {
  const accessor = propertyDescriptor.get;
  propertyDescriptor.get = function(...args: any[]) {
    const result = accessor.apply(this);
    return `definitely not ${result}`;
  };
  return propertyDescriptor;
}

/**
 * We want to make an accessor decorator that will hide our super hero's name
 * This should feel a lot like writing a method decorator, with just one small change
 * same parameters as we just saw, but then the change is that before we would get the
 *   original method from properDescriptor.value, but now we get it from propertyDescriptor.get
 * So same idea, store a reference to the original, then redefine it on propertyDescriptor
 * We just prepending a string to the result of the original method, and then return the descriptor as normal
 */

/* SLIDE */
// Using our accessor method

export class Dog {
  private species = 'dog';

  constructor(private name: string) {}

  @mask
  public get fullName(): string {
    return `${this.name} the ${this.species}`;
  }
}

const superNora = new Dog('nora');
superNora.fullName;
// definitely not nora the dog

/**
 * We decorated our getter fullName that is returning a concatenation of name and species
 * Now, our super hero should be safe, when anyone asks her for her name, the decorator
 *   has modified the getter to prevent her true identity from being revealed
 */

/* SLIDE */
// You can't decorate the get and set accessor for a single member

// lib.es5.d.ts
declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;

export class Dog {
  @accessorDecorator1
  public get fullName() {}

  @accessorDecorator2
  public set fullName() {}
}

/**
 * One thing before we finish with accessor decorators
 * We know you can have a getter and setter for the same member, but interestingly you can't decorate
 *   the get and set accessor for a single member
 * This is because the decorator applies to the propertyDescriptor, which will be the same for
 *   the getter and setter
 * It doesn't apply to each declaration separately
 * To do this correctly, they have to all be applied to whichecer accessor is specified first
 */

/* SLIDE */
// Multiple decorators for a getter and setter

export class Dog {
  @accessorDecorator1
  @accessorDecorator2
  public get fullName() {}

  public set fullName() {}
}

/**
 * this is the correct way of applying these two decorators since the getter is first
 * But this is the first time we are seeing multiple decorators on a single declaration
 * This is fine, and you can actually do even more
 * But what is interesting, is how do they chain? what order does what happen in?
 */


/* SLIDE */
// Decorator composition

@f
@g
x

(f o g)(x)
f(g(x))

/**
 * multiple decorators, or decorator composition, are evaluated similair to function
 *   composition in mathematics.
 * x is what we are decorating, and we apply two decorators, f and g
 * in mathematics, this would be f compose g of x
 * or we pass x into the function g, then pass that result into the function f
 * this is exactly how decorators work
 * The expressions are evaluated from top to bottom
 * then the functions are called from bottom to top
 * The typescript docs use decorator factories to show this, and it's probably
 *   the best example
 */


/* SLIDE */
// Decorator composition

function f() {
  console.log("f(): evaluated");
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
      console.log("f(): called");
  }
}

function g() {
  console.log("g(): evaluated");
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
      console.log("g(): called");
  }
}

class C {
  @f()
  @g()
  method() {}
}

// calling method would output this to the console
// f(): evaluated
// g(): evaluated
// g(): called
// f(): called

/* SLIDE */
// What about property and parameter decorators

/**
 * We said earlier that you could also decorate properties and parameters.
 * These work much more different than the 3 we went over
 * We are just going to look at the signatures of each, but not write our own
 */

/* SLIDE */
// Property decorators

// lib.es5.d.ts
declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;


export class Dog {
  @propertyDecorator private species = 'dog';
}

/**
 * We can look at the property decorator signature from the typescript docs and see there are
 *   only two parameters
 * Target is the reference to the object
 * and propertyKey is a string of the name of the property
 * That is it, we do not have a descriptor like we did in the others
 * We don't have access to the value that is being assigned
 * A property decorator can only be used to observe that a property of a specific name
 *   has been declared for a class
 */

/* SLIDE */
// Parameter decorators

// lib.es5.d.ts
declare type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;

// lib.es5.d.ts
declare type ParameterDecorator =
  (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;

export class Dog {
  public speak(@parameterDecorator message: string): void {
    console.log(`bark ${message} bark`);
  }
}

/**
 * The signature for a parameter decorator has the same two parameters as before,
 *   the target to reference the object and the property key as the name of the parameter
 * Here we also have a parameter index, which is exactly that, the indexed order that the parameter
 *   came in the parameter list
 * So again we have the same limitation, no descriptor, so no access to any values
 * Again, a parameter decorator can only be used to observe that a parameter was declared on a method
 */

/* SLIDE */

/* SLIDE */

/* SLIDE */

/* SLIDE */

/* SLIDE */

/* SLIDE */

/* SLIDE */

