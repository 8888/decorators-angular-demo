import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';


/**
 * class decorators
 * function classDecorator<T extends {new (...args: any[]): {}}>(constructor: T) {}
 */
function maskName<T extends {new(...args: any[]): {}}>(constructor: T) {
  return class extends constructor {
    name = 'decoratedComponent';
  };
}

function version(options: { version: string }) {
  return target => {
    target.version = options.version;
  };
}

function classDecorator<T extends {new (...args: any[]): {}}>(constructor: T) {
  return class extends constructor {
    newProperty = 'new property';
    hello = 'override';
  }
}

function sleeper<T extends {new (...args: any[]): {}}>(constructor: T): T {
  return class extends constructor {
    public sleep() {
      console.log('zzzz');
    }
  }
}

function flyer(speed: {velocity: number, unit: string}) {
  return function<T extends {new (...args: any[]): {}}>(constructor: T): T {
    return class extends constructor {
      public fly() {
        console.log(`wooosh at ${speed.velocity} ${speed.unit} 🚀`);
      }
    }
  }
}

@classDecorator
@sleeper
@flyer({
  velocity: 100,
  unit: 'mph'
})
class Greeter {
  property = 'property';
  hello: string;
  constructor(m: string) {
    this.hello = m;
  }
}

/**
 * method decorators
 * function methodDecorator(target: object, propertyName: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor { return propertyDescriptor; }
 */
function round(target: object, propertyName: string, propertyDescriptor): PropertyDescriptor {
  const method = propertyDescriptor.value;
  propertyDescriptor.value = function(...args: any[]) {
    const result = method.apply(this, args);
    return Math.round(result);
  };
  return propertyDescriptor;
}

function logResult(target: object, propertyName: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
  const method = propertyDescriptor.value;
  propertyDescriptor.value = function(...args: any[]) {
    const result = method.apply(this, args);
    console.log(`${propertyName}() => ${result}`);
    return result;
  }
  return propertyDescriptor;
}

function logMethod(
  target: object,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor
): PropertyDescriptor {
  const method = propertyDescriptor.value;
  propertyDescriptor.value = function(...args: any[]) {
    const params = args.map(a => JSON.stringify(a)).join();
    const result = method.apply(this, args);
    const r = JSON.stringify(result);
    console.log(`Call: ${propertyName}(${params}) => ${r}`);
    return result;
  };
  return propertyDescriptor;
}

function sub(target: object, propertyName: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
  const method = propertyDescriptor.value;
  propertyDescriptor.value = function(...args: any[]) {
    const result = method.apply(this,  args) as Observable<any>;
    result.pipe(take(1)).subscribe(x => console.log(x));
  }
  return propertyDescriptor;
}

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

function log2(includeClass: boolean) {
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
 * Accessor deorators
 * function accessorDecorator(target: object, propertyName: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor { return propertyDescriptor; }
 */
function configurable(value: boolean) {
  return function(target: object, propertyKey: string, descriptor: PropertyDescriptor): void {
    console.log(target);
    console.log(propertyKey);
    console.log(descriptor);
    descriptor.configurable = value;
  }
}

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
 * Property Decorators
 * function propertyDecorator(target: object, propertyKey: string | symbol): void {}
 * these don't do much
 * need to use reflect metadata api
 */
function format(target: object, propertyKey: string): void {
  console.log(target);
  console.log(propertyKey);
}


/**
 * Paramter Decorators
 * NOTE  A parameter decorator can only be used to observe that a parameter has been declared on a method.
 * The return value of the parameter decorator is ignored.
 * function parameterDecorator(target: object, propertyKey: string | symbol, parameterIndex: number): void {}
 */
function required(target: object, propertyKey: string, parameterIndex: number): void {
  console.log(target);
  console.log(propertyKey);
  console.log(parameterIndex);
}


// @maskName
@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.css']
})
export class SampleComponent implements OnInit {
  title: string;
  name: string;
  date: Date;
  private _hidden: string;

  constructor() {
    this.title = 'component name:';
    this.name = 'sampleComponent';
    this._hidden = 'some hidden value';
  }

  ngOnInit() {
    this.speak('hi');
  }

  // @configurable(false)
  @mask
  public get hidden(): string {
    return this._hidden;
  }

  @logMethod
  private makeFancy(text: string): string {
    return `*~*${text}*~*`;
  }

  @logResult
  @round
  private divide(dividend: number, divisor: number): number {
    return dividend / divisor;
  }

  @sub
  private someObs(): Observable<any> {
    return of('lee');
  }

  @log2(true)
  private speak(message: string): void {
    console.log(`bark ${message} bark`);
  }
}
