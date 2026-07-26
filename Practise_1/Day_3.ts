// give me all the Type Narrowing with typeof
function processValue(value: string | number | boolean) {
    if (typeof value === 'string') {
        console.log(`String value: ${value}`);
    } else if (typeof value === 'number') {
        console.log(`Number value: ${value}`);
    } else if (typeof value === 'boolean') {
        console.log(`Boolean value value.valueOf(): ${value.valueOf()}`);
    } else {
        console.log('Unknown type');
    };

    // Additional type narrowing examples
    if (typeof value === 'string' && value.length > 0) {
        console.log(`Non-empty string: ${value}`);
    } else if (typeof value === 'number' && value > 0) {
        console.log(`Positive number: ${value}`);
    } else if (typeof value === 'boolean') {
        console.log(`Boolean is: ${value ? 'true' : 'false'}`);
    };  
};

// Example usage
processValue("Hello");
processValue(42);
processValue(true);
processValue("");
processValue(0);
processValue(false);
// Output:
// String value: Hello
// Number value: 42
// Boolean value: true
// String value:
// Non-empty string:
// Positive number: 0
// Boolean is: false
// Note: The last two calls will not produce the expected output for non-empty string and positive number
// because the values passed are empty string and zero respectively.
// To see the output, you can call the function with different values.



// Type Narrowing with in
interface Dog {
    type: 'dog';
    bark(): void;
};
interface Cat {
    type: 'cat';
    meow(): void;
};
function handleAnimal(animal: Dog | Cat) {
    if ('bark' in animal) {
        console.log('This is a dog.');
        animal.bark();
    } else if ('meow' in animal) {
        console.log('This is a cat.');
        animal.meow();
    } else {
        console.log('Unknown animal type.');
    };
};

// Example usage
const dog: Dog = {
    type: 'dog',
    bark: () => console.log('Woof!')
};
const cat: Cat = {
    type: 'cat',
    meow: () => console.log('Meow!')
};
handleAnimal(dog); // Output: This is a dog. Woof!
handleAnimal(cat); // Output: This is a cat. Meow!
// Note: The 'in' operator checks if a property exists in the object, which is useful for type narrowing in TypeScript.
// Type Narrowing with instanceof
// class Animal {
//     constructor(public name: string) {}
// }
// class Dog extends Animal {
//     bark() {
//         console.log(`${this.name} says Woof!`);
//     };
// };

// class Cat extends Animal {
//     meow() {
//         console.log(`${this.name} says Meow!`);
//     };
// };


//  Type Assertions
// function processAnimal(animal: Animal) {
//     if (animal instanceof Dog) {
//         animal.bark();
//     } else if (animal instanceof Cat) {
//         animal.meow();
//     } else {
//         console.log('Unknown animal type.');
//     };
// };
// // Example usage 
// const myDog = new Dog('Buddy');
// const myCat = new Cat('Whiskers');
// processAnimal(myDog); // Output: Buddy says Woof!

// processAnimal(myCat); // Output: Whiskers says Meow!
// processAnimal(new Animal('Generic Animal')); // Output: Unknown animal type.
// Note: The 'instanceof' operator checks if an object is an instance of a specific class, which is useful for type narrowing in TypeScript.
// Type Narrowing with null and undefined
// function processOptionalValue(value: string | null | undefined) {
//     if (value === null) {
//         console.log('Value is null');
//     } else if (value === undefined) {
//         console.log('Value is undefined');
//     } else {
//         console.log(`String value: ${value}`);
//     };

//     // Additional checks for non-empty string
//     if (typeof value === 'string' && value.length > 0) {
//         console.log(`Non-empty string: ${value}`);
//     } else {
//         console.log('Value is not a non-empty string');
//     };
// };
// // Example usage
// processOptionalValue("Hello");
// processOptionalValue(null);

// processOptionalValue(undefined);
// processOptionalValue(""); // Output: Value is not a non-empty string
