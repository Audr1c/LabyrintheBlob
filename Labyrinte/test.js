let list1 = [0,1,2];
let list2 = list1.copy(); // list2 = [0,1,2]
list1[0] = 20;
console.log(list2) // [0,1,2]

const sheeps = ['🐑', '🐑', '🐑'];

const fakeSheeps = sheeps;
const cloneSheeps = [...sheeps];

console.log(sheeps === fakeSheeps);
// true --> it's pointing to the same memory space

console.log(sheeps === cloneSheeps);
// false --> it's pointing to a new memory space