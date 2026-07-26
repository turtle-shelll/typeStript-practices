let age: number = 28;
let name: string = "Hardik";
const randomNum: number[] = [1, 2, 3, 4, 5, 6, 8];

type userData = {
    user: string,
    age: number
};

const tuples: [string, number, userData] = ["hello", 24, { user: "hardik", age: 24 }];

const multipleUsers: userData[] = [
    { user: "Hardik", age: 24 },
    { user: "Akshay", age: 59 },
    { user: "khooshbu", age: 24 },
    { user: "smruti", age: 32 },
];

let isStudent: boolean = true;

function greetings(personName: string): string {
    return `Hello ${personName}!, I am Hardik.`;
};

const message: string = greetings(name);

const up = "hello";

enum directions {
    up,
    down,
    left,
    right
};

const upMove: directions = directions.up;
const downMove: directions = directions.down;
const leftMove: directions = directions.left;
const rightMove: directions = directions.right;

console.log("directions  ==>>>", upMove);
console.log("directions  ==>>>", downMove);
console.log("directions  ==>>>", leftMove);
console.log("directions  ==>>>", rightMove);


enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}

// console.log(Direction.Up);    // "UP"
// console.log(Direction.Down);  // "DOWN"
// console.log(Direction.Left);  // "Left"
// console.log(Direction.Right);  // "Right"


let randomValue: any = "Hello";
randomValue = 24;

const printInConsole = (message: string): void => {
    console.log(`Log:. ${message}`);
};

printInConsole("Hello world!");


const multiplyNumbers = (numA: number, numB: number): number => {
    return numA * numB;
};

console.log("multiplyNumbers  ==>>", multiplyNumbers(5, 8));

enum studentsClass {
    standerd_1,
    standerd_2,
    standerd_3,
    standerd_4,
    standerd_5,
    standerd_6,
    standerd_7,
    standerd_8,
    standerd_9,
    standerd_10,
}

type studentType = {
    fullName: string,
    age: number,
    class: studentsClass.standerd_10
};

const students: studentType[] = [
    {
        fullName: "Hardik Mistry",
        age: 24,
        class: studentsClass.standerd_10
    },
    {
        fullName: "KD",
        age: 25,
        class: studentsClass.standerd_10
    },
]

console.log("students  ==>>>>", students);

function throwNewError(errorMessage: string): never {
    throw new Error(errorMessage);
}

// throwNewError("custom error generated.");


//******************************** */ ✅ Write a function to reverse a string //********************************///
const sampleString: string = "Hello world";

function reversString(stringValue: string): string {
    const reversString = stringValue.split("").reverse().join("");
    return reversString;
};


console.log("reversString  ===>>>", reversString(sampleString));




// ✅ Create a function that takes a number and returns whether it's even or odd


const arrRandomNums: number[] = [5, 7, 8, 9, 6, 2, 4, 8, 9, 6];

function findOddEven(numValue: number): string { return (numValue % 2 ? "odd" : "even") };

for (let i = 0; i < arrRandomNums.length; i++) {
    console.log("findOddEven  ==>>>", findOddEven(arrRandomNums[i]));
};



// ✅ Define an array of your favorite movie names





// const makeDouble: void = (personName) => {
// return `Hello ${personName}!, I am Hardik.`;
// }