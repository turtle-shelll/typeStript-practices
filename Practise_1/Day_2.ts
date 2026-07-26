console.log("Hello from day 2 of TypeScript!");


// ✅ Type Alias Example
enum genders {
    "Male" = "Male",
    "Female" = "female",
    "Not To Say" = "not to say"
};

type user = {
    name: string,
    age: number,
    gender: genders
};

const user1: user = { name: "john doe", age: 28, gender: genders.Male };
console.log("user1   ==>>>", user1);





// ✅ Interface Example (can be extended)
enum productTypes {
    "Electronics" = "electronics",
    "Clothing" = "clothing",
    "Food" = "food",
    "Furniture" = "furniture",
    "Books" = "books",
    "Toys" = "toys",
};
interface basicProductDetails {
    readonly id: number,
    name: string,
    price: number,
    description: string,
    rating?: number
    inStock: boolean,
};

interface productDetails extends basicProductDetails {
    type: productTypes,
    tags?: string[]
};



const product1: productDetails = {
    id: 1,
    name: "product1",
    price: 100,
    description: "this is product 1 description",
    rating: 4.5,
    inStock: true,
    type: productTypes.Electronics,
};
console.log("product1  ==>>>", product1);





// ✅ Readonly property
interface books {
    readonly id: number,
    title: string,
};

const book1: books = { id: 1, title: "book1" };
const book2: books = { id: 2, title: "book2" };
// book1.id = 2; // Error: Cannot assign to 'id' because it is a read-only property
// book1.id = 3; // Error: Cannot assign to 'id' because it is a read-only property
book1.title = "book1 updated"; // This is allowed
console.log("book1  ==>>>", book1);
console.log("book2  ==>>>", book2);





// ✅ Function with multiple parameter types (union)
function sumTwoNumbers(num1: number | string, num2: number | string): number {
    num1 = typeof num1 === "string" ? parseInt(num1) : num1;
    num2 = typeof num2 === "string" ? parseInt(num2) : num2;
    return num1 + num2;
};
console.log("sumTwoNumbers(1, 2)  ==>>>", sumTwoNumbers(1, 2));
console.log("sumTwoNumbers('1', '2')  ==>>>", sumTwoNumbers("1", "2"));
console.log("sumTwoNumbers(1, '2')  ==>>>", sumTwoNumbers(1, "2"));





function logValues(values: string | number | boolean): void {
    if (typeof values === "string") {
        console.log("String value: ", values);
    };
    if (typeof values === "number") {
        console.log("Number value: ", values);
    };
    if (typeof values === "boolean") {
        console.log("Boolean value: ", values);
    };
};

logValues("Hello");
logValues(101);
logValues(true);





// ✅ Class with Access Modifiers (public, private, protected)
class Car {
    public brand: string;
    private price: number;
    protected year: number;

    constructor(brand: string, price: number, year: number) {
        this.brand = brand;
        this.price = price;
        this.year = year;
    };
    public getInfo(): string {
        return `Brand Name ${this.brand} and has price of ${this.price} and  year of ${this.year}`;
    };
    public displayInfo(): string {
        return `${this.brand} (${this.year}) - Confidential Price`;
    };
};


const myCar = new Car("Tesla", 80000, 2024);

console.log("myCar  ==>>>", myCar);
console.log("myCar.getInfo()  ==>>>", myCar.getInfo());
console.log("myCar.displayInfo()  ==>>>", myCar.displayInfo());
// console.log("myCar.price  ==>>>", myCar.price); // Error: Property 'price' is private and only accessible within class 'Car'.
// console.log("myCar.year  ==>>>", myCar.year); // Error: Property 'year' is protected and only accessible within class 'Car' and its subclasses.




// ✅ Simple Generic Function

function getValue<Y>(value: Y): Y {
    return value;
};

console.log("getValue(1)  ==>>>", getValue(1));
console.log("getValue('1')  ==>>>", getValue("1"));
console.log("getValue(true)  ==>>>", getValue(true));
console.log("getValue([1, 2, 3])  ==>>>", getValue([1, 2, 3]));
console.log("getValue({ name: 'John' })  ==>>>", getValue({ name: "John" }));





// ✅ Generic Function with Constraints
function getLength<T extends { length: number }>(value: T): number {
    return value.length;
};
console.log("getLength('Hello')  ==>>>", getLength("Hello"));
console.log("getLength([1, 2, 3])  ==>>>", getLength([1, 2, 3]));
console.log("getLength({ length: 5 })  ==>>>", getLength({ length: 5 }));
// console.log("getLength(1)  ==>>>", getLength(1)); // Error: Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
// console.log("getLength(true)  ==>>>", getLength(true)); // Error: Argument of type 'boolean' is not assignable to parameter of type '{ length: number; }'.
// console.log("getLength({})  ==>>>", getLength({})); // Error: Argument of type '{}' is not assignable to parameter of type '{ length: number; }'.
// console.log("getLength({ name: 'John' })  ==>>>", getLength({ name: "John" })); // Error: Argument of type '{ name: string; }' is not assignable to parameter of type '{ length: number; }'.
// console.log("getLength({ length: 5, name: 'John' })  ==>>>", getLength({ length: 5, name: "John" })); // Error: Argument of type '{ length: number; name: string; }' is not assignable to parameter of type '{ length: number; }'.




// ✅ Generic Array function
function getFirstElement<J>(arr: J[]): J {
    return arr[0];
};

console.log("\n");
console.log("\n");
console.log("\n");

console.log("getFirstElement([1, 2, 3])  ==>>>", getFirstElement<number>([1, 2, 3]));
console.log("getFirstElement(['1', '2', '3'])  ==>>>", getFirstElement<string>(["1", "2", "3"]));
console.log("getFirstElement([true, false])  ==>>>", getFirstElement<boolean>([true, false]));
console.log("getFirstElement([1, '2', true])  ==>>>", getFirstElement<number | string | boolean>([1, "2", true]));
console.log("getFirstElement([1, '2', true, { name: 'John' }])  ==>>>", getFirstElement([1, "2", true, { name: "John" }]));


// Create a generic function wrapInArray that takes any value and returns it inside an array.


function wrapInArray<T>(anyValue: T): T[] {
    return [anyValue];
};

console.log("wrapInArray(5)  ==>>>", wrapInArray(5));// wrapInArray(5) ➝ [5]
console.log("wrapInArray('Hardik')  ==>>>", wrapInArray("Hardik"));// wrapInArray("Hardik") ➝ ["Hardik"]


// Create a generic function getLastElement that returns the last element of an array.

function getLastElement<J>(arr: J[]): J {
    return arr[arr.length - 1];
}
console.log("getLastElement([1, 2, 3, 4])  ==>>>", getLastElement<number>([1, 2, 3, 4]));// getLastElement([1, 2, 3, 4]) ➝ 4
console.log("getLastElement(['a', 'b', 'c'])  ==>>>", getLastElement<string>(["a", "b", "c"]));// getLastElement(["a", "b", "c"]) ➝ "c"




// Write a generic function that takes two objects and merges them into one.


function mergeObjects<T, U>(obj1: T, obj2: U): T & U {
    return { ...obj1, ...obj2 };
};


console.log("mergeObjects({name: 'Hardik'}, {age: 25})  ==>>>", mergeObjects({ name: "Hardik" }, { age: 25 }));// mergeObjects({name: "Hardik"}, {age: 25}) ➝ {name: "Hardik", age: 25}
console.log("mergeObjects({name: 'Hardik'}, {age: 25, city: 'New York'})  ==>>>", mergeObjects({ name: "Hardik" }, { age: 25, city: "New York" }));// mergeObjects({name: "Hardik"}, {age: 25, city: "New York"}) ➝ {name: "Hardik", age: 25, city: "New York"}




// Write a generic function isInArray that checks if a value exists inside an array.

function isInArray<N>(arr: N[], findingValue: N): boolean {
    return arr.includes(findingValue);
};


console.log("isInArray([1, 2, 3, 4], 3)  ==>>>", isInArray<number>([1, 2, 3, 4], 3));// isInArray([1, 2, 3, 4], 3) ➝ true
console.log("isInArray(['a', 'b', 'c'], 'd')  ==>>>", isInArray<string>(["a", "b", "c"], "d"));// isInArray(["a", "b", "c"], "d") ➝ false
console.log("isInArray([1, 2, 3, 4], 5)  ==>>>", isInArray<number>([1, 2, 3, 4], 5));// isInArray([1, 2, 3, 4], 5) ➝ false





// Write a generic function that takes two values of possibly different types and returns them as a tuple.

function createPair<A, B>(value1: A, value2: B): [A, B] {
    return [value1, value2];
};


console.log("createPair(1, 'Hardik')  ==>>>", createPair<number, string>(1, "Hardik"));// createPair(1, "Hardik") ➝ [1, "Hardik"]
console.log("createPair('Hardik', 25)  ==>>>", createPair<string, number>("Hardik", 25));// createPair("Hardik", 25) ➝ ["Hardik", 25]
console.log("createPair(true, 'Done')  ==>>>", createPair<boolean, string>(true, "Done"));// createPair(true, "Done") ➝ [true, "Done"]





class DataHolder<D> {
    private data: D;
    constructor(data: D) {
        this.data = data;
    };

    getValue(): D {
        return this.data;
    };
    setValue(newData: D): void {
        this.data = newData;
    };
};



const numberHolder = new DataHolder<number>(5);
const stringHolder = new DataHolder<string>("Hello");
const booleanHolder = new DataHolder<boolean>(true);
const objectHolder = new DataHolder<{ name: string }>({ name: "Hardik" });


console.log("numberHolder.getValue()  ==>>>", numberHolder.getValue());
console.log("stringHolder.getValue()  ==>>>", stringHolder.getValue());
console.log("booleanHolder.getValue()  ==>>>", booleanHolder.getValue());
console.log("objectHolder.getValue()  ==>>>", objectHolder.getValue());
numberHolder.setValue(10);
stringHolder.setValue("World");
booleanHolder.setValue(false);
objectHolder.setValue({ name: "John" });
console.log("numberHolder.getValue()  ==>>>", numberHolder.getValue());
console.log("stringHolder.getValue()  ==>>>", stringHolder.getValue());
console.log("booleanHolder.getValue()  ==>>>", booleanHolder.getValue());
console.log("objectHolder.getValue()  ==>>>", objectHolder.getValue());
// numberHolder.setValue("Hello"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.




// printName

function printName<T extends { name: string }>(obj: T): T {
    console.log("Name ===>>", obj.name);
    return obj;
};


printName({ name: "Hardik", age: 25 }); // { name: "Hardik", age: 25 }
printName({ name: "John", city: "New York" }); // { name: "John", city: "New York" }



// Explore default generic types:


function identity<T = string>() {
    return (arg: T): T => {
        return arg;
    };
};


const stringIdentity = identity();
console.log("stringIdentity('Hello')  ==>>>", stringIdentity("Hello")); // "Hello"
const numberIdentity = identity<number>();
console.log("numberIdentity(123)  ==>>>", numberIdentity(123)); // 123
const booleanIdentity = identity<boolean>();
console.log("booleanIdentity(true)  ==>>>", booleanIdentity(true)); // true
const objectIdentity = identity<{ name: string }>();
console.log("objectIdentity({ name: 'Hardik' })  ==>>>", objectIdentity({ name: "Hardik" })); // { name: "Hardik" }
// const arrayIdentity = identity<number[]>(); // Uncommenting this line will cause an error because the default type is string, not number[].
const arrayIdentity = identity<number[]>();
console.log("arrayIdentity([1, 2, 3])  ==>>>", arrayIdentity([1, 2, 3])); // [1, 2, 3]
// const mixedIdentity = identity<number | string>(); // Uncommenting this line will cause an error because the default type is string, not number | string.
const mixedIdentity = identity<number | string>();
console.log("mixedIdentity(123)  ==>>>", mixedIdentity(123)); // 123
console.log("mixedIdentity('Hello')  ==>>>", mixedIdentity("Hello")); // "Hello"
// console.log("mixedIdentity(true)  ==>>>", mixedIdentity(true)); // true
// const invalidIdentity = identity<boolean | number>(); // Uncommenting this line will cause an error because the default type is string, not boolean | number.
const invalidIdentity = identity<boolean | number>();
console.log("invalidIdentity(false)  ==>>>", invalidIdentity(false)); // false


