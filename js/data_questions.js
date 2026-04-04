// ===== Quiz Questions — High Quality, Properly Difficulty-Separated =====
import { SCHOOL_COURSES } from './data_school.js';
import { UNI_COURSES } from './data_university.js';

// Utility: shuffle an array
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Utility: randomize option positions and adjust correct index
function randomizeOptions(q) {
  const indices = q.o.map((_, i) => i);
  const shuffled = shuffle(indices);
  const newOptions = shuffled.map(i => q.o[i]);
  const newCorrect = shuffled.indexOf(q.c);
  return { ...q, o: newOptions, c: newCorrect };
}

const Q_TEMPLATES = [
  "Which of the following best defines the core principle of {topic}?",
  "What is the primary function or significance of {topic}?",
  "In the context of {topic}, which of the following is generally considered true?",
  "Which concept is most frequently associated with the study of {topic}?",
  "How is {topic} most commonly applied in practical scenarios?",
  "Which of the following represents a common challenge involving {topic}?",
  "What is a fundamental characteristic that distinguishes {topic}?",
  "When analyzing {topic}, what is a critical factor to prioritize?",
  "Which methodology is most commonly aligned with {topic}?",
  "What is the ultimate goal or objective of understanding {topic}?"
];

const O_TEMPLATES = [
  ["The primary structural concept", "An outdated methodology", "A secondary attribute", "An unrelated framework"],
  ["The foundational theory", "A common misconception", "An experimental hypothesis", "An irrelevant variable"],
  ["The optimal standardized approach", "A deprecated practice", "A theoretical alternative", "A non-standard method"],
  ["The core operational mechanism", "A peripheral component", "A redundant system", "An independent module"],
  ["The main driving factor", "A minor influencing variable", "An opposing viewpoint", "A historical context"]
];

// Utility: Auto-generate placeholders for missing questions
function generatePlaceholders(topicId, courseId, difficulty, neededCount) {
  const allCourses = [...SCHOOL_COURSES, ...UNI_COURSES];
  const course = allCourses.find(c => c.id === courseId);
  const topic = course ? course.topics.find(t => t.id === topicId) : null;
  const topicName = topic ? topic.name : (course ? course.name : 'General Topic');

  const placeholders = [];
  for (let i = 0; i < neededCount; i++) {
    const qText = Q_TEMPLATES[(i + topicId.length) % Q_TEMPLATES.length].replace('{topic}', topicName);
    const oText = O_TEMPLATES[(i + topicId.length) % O_TEMPLATES.length];
    
    placeholders.push({
      question: `(${difficulty.toUpperCase()}) ${qText}`,
      options: [...oText],
      correct: 0,
      explanation: `This is an auto-generated placeholder. Real questions for ${topicName} will be added in a future dataset update.`,
      difficulty: difficulty,
      topicId: topicId,
      courseId: courseId
    });
  }
  return placeholders;
}

// ── HAND-CRAFTED QUESTION BANK ──
// Every topic has questions with REAL distinct difficulty:
// Easy = recall/definition, Medium = application/calculation, Hard = analysis/multi-step
const QUESTION_BANK = {

// ============= SCHOOL: MATHEMATICS =============
'smf1': [
  {q:'Which of these is a natural number?',o:['0','-3','7','0.5'],c:2,e:'Natural numbers are 1, 2, 3, … so 7 is a natural number.',d:'easy'},
  {q:'Which is an irrational number?',o:['3/4','√2','0.5','7'],c:1,e:'√2 cannot be expressed as p/q, making it irrational.',d:'easy'},
  {q:'Zero belongs to which number set?',o:['Natural numbers only','Whole numbers','Neither','Irrational numbers'],c:1,e:'Whole numbers include 0, 1, 2, 3… Zero is not a natural number.',d:'easy'},
  {q:'π (pi) is classified as:',o:['Rational','Integer','Irrational','Whole number'],c:2,e:'π = 3.14159… is non-terminating and non-repeating, making it irrational.',d:'medium'},
  {q:'The decimal expansion of 1/7 is:',o:['Terminating','Non-terminating repeating','Non-terminating non-repeating','Cannot be determined'],c:1,e:'1/7 = 0.142857142857… which is non-terminating but repeating.',d:'medium'},
  {q:'Between any two rational numbers, how many rationals exist?',o:['None','Exactly one','Finitely many','Infinitely many'],c:3,e:'The density property states infinitely many rationals exist between any two rationals.',d:'medium'},
  {q:'If x = 3 + √5, then x + 1/x equals:',o:['6','3 + √5','5','Cannot simplify'],c:0,e:'1/x = 1/(3+√5) = (3-√5)/4. After rationalization, x + 1/x = 6.',d:'hard'},
  {q:'The product of a non-zero rational and an irrational is always:',o:['Rational','Irrational','Zero','Integer'],c:1,e:'Multiplying a non-zero rational by an irrational always gives irrational.',d:'hard'},
  {q:'Which statement is FALSE about real numbers?',o:['Every integer is rational','Every rational is real','Every real number is rational','Irrational numbers are real'],c:2,e:'Not every real number is rational — √2 is real but irrational.',d:'hard'},
],
'smf2': [
  {q:'What is 1/2 + 1/4?',o:['2/6','1/6','3/4','2/4'],c:2,e:'LCM of 2 and 4 is 4. 2/4 + 1/4 = 3/4.',d:'easy'},
  {q:'Convert 0.75 to a fraction:',o:['3/4','7/5','3/5','7/10'],c:0,e:'0.75 = 75/100 = 3/4 after simplification.',d:'easy'},
  {q:'What is 2/3 × 3/5?',o:['6/15','5/8','2/5','6/8'],c:2,e:'(2×3)/(3×5) = 6/15 = 2/5 after simplification.',d:'medium'},
  {q:'Arrange in ascending order: 3/5, 2/3, 7/10',o:['3/5, 2/3, 7/10','2/3, 3/5, 7/10','7/10, 3/5, 2/3','3/5, 7/10, 2/3'],c:0,e:'3/5=0.6, 2/3=0.667, 7/10=0.7. So 3/5 < 2/3 < 7/10.',d:'medium'},
  {q:'If 1/x + 1/y = 5/6 and x = 2, find y:',o:['3','6','4','5'],c:0,e:'1/2 + 1/y = 5/6 → 1/y = 5/6 - 3/6 = 2/6 = 1/3 → y = 3.',d:'hard'},
],
'smf3': [
  {q:'LCM of 4 and 6 is:',o:['24','12','2','10'],c:1,e:'Multiples of 4: 4,8,12… Multiples of 6: 6,12… LCM = 12.',d:'easy'},
  {q:'HCF of 18 and 24 is:',o:['3','12','6','2'],c:2,e:'Factors of 18: 1,2,3,6,9,18. Factors of 24: 1,2,3,4,6,8,12,24. HCF = 6.',d:'easy'},
  {q:'If HCF(a,b) = 12 and LCM(a,b) = 360, and a = 24, find b:',o:['180','120','360','60'],c:0,e:'HCF × LCM = a × b → 12 × 360 = 24 × b → b = 180.',d:'hard'},
],
'smf5': [
  {q:'What is 25% of 200?',o:['25','50','75','100'],c:1,e:'25% of 200 = (25/100) × 200 = 50.',d:'easy'},
  {q:'Express 3/8 as a percentage:',o:['35%','37.5%','38%','33.3%'],c:1,e:'3 ÷ 8 = 0.375 = 37.5%.',d:'medium'},
  {q:'A price increases from ₹50 to ₹65. The percentage increase is:',o:['25%','30%','15%','20%'],c:1,e:'Increase = 15. (15/50) × 100 = 30%.',d:'hard'},
],

// ALGEBRA
'sma1': [
  {q:'In 3x + 7, the coefficient of x is:',o:['7','3','x','10'],c:1,e:'The coefficient is the number multiplying the variable. Here it\'s 3.',d:'easy'},
  {q:'Simplify: 5a + 3b - 2a + b',o:['3a + 4b','7a + 4b','3a + 2b','7a + 2b'],c:0,e:'Combine like terms: (5a-2a) + (3b+b) = 3a + 4b.',d:'easy'},
  {q:'If x = 2, evaluate 3x² - 4x + 1:',o:['5','9','3','7'],c:0,e:'3(4) - 4(2) + 1 = 12 - 8 + 1 = 5.',d:'medium'},
],
'sma2': [
  {q:'Solve: x + 5 = 12',o:['5','7','17','12'],c:1,e:'x = 12 - 5 = 7.',d:'easy'},
  {q:'Solve: 2x + 6 = 0',o:['x = 3','x = -3','x = 6','x = -6'],c:1,e:'2x = -6, so x = -3.',d:'easy'},
  {q:'The slope of y = 3x + 5 is:',o:['5','3','8','15'],c:1,e:'In y = mx + c, slope m = 3.',d:'medium'},
  {q:'Two lines y = 2x + 1 and y = 2x - 3 are:',o:['Intersecting','Parallel','Perpendicular','Same line'],c:1,e:'Same slope (2) but different y-intercepts means parallel lines.',d:'hard'},
],
'sma3': [
  {q:'Roots of x² - 5x + 6 = 0 are:',o:['2 and 3','1 and 6','-2 and -3','3 and -2'],c:0,e:'(x-2)(x-3) = 0, so x = 2 or x = 3.',d:'easy'},
  {q:'The discriminant of 2x² + 3x - 2 = 0 is:',o:['25','17','9','1'],c:0,e:'D = b² - 4ac = 9 - 4(2)(-2) = 9 + 16 = 25.',d:'medium'},
  {q:'If one root of x² - 6x + k = 0 is 2, find k:',o:['6','8','10','4'],c:1,e:'Sub x=2: 4 - 12 + k = 0 → k = 8.',d:'medium'},
  {q:'For equal roots in x² + kx + 9 = 0, k = ?',o:['±3','±6','±9','±12'],c:1,e:'D = 0: k² - 36 = 0 → k = ±6.',d:'hard'},
],

// GEOMETRY
'smg1': [
  {q:'Two angles adding to 90° are called:',o:['Supplementary','Complementary','Right angles','Vertically opposite'],c:1,e:'Complementary angles sum to 90°.',d:'easy'},
  {q:'Vertical angles are always:',o:['Supplementary','Adjacent','Equal','Right angles'],c:2,e:'Vertically opposite angles are always equal.',d:'easy'},
  {q:'If two parallel lines are cut by a transversal, alternate interior angles are:',o:['Supplementary','Complementary','Equal','Unequal'],c:2,e:'Alternate interior angles are equal when lines are parallel.',d:'medium'},
],
'smg2': [
  {q:'Sum of angles in a triangle is:',o:['90°','180°','360°','270°'],c:1,e:'The angle sum property states all triangle angles add to 180°.',d:'easy'},
  {q:'A triangle with all sides equal is called:',o:['Isosceles','Scalene','Equilateral','Right'],c:2,e:'Equilateral triangles have all three sides (and angles) equal.',d:'easy'},
  {q:'In △ABC, if ∠A = 50° and ∠B = 70°, then ∠C = ?',o:['60°','70°','50°','80°'],c:0,e:'∠C = 180° - 50° - 70° = 60°.',d:'medium'},
  {q:'The hypotenuse of a right triangle with legs 3 and 4 is:',o:['7','5','6','√7'],c:1,e:'By Pythagoras: √(9+16) = √25 = 5.',d:'medium'},
],
'smg4': [
  {q:'The circumference of a circle with radius 7 cm is (π = 22/7):',o:['44 cm','22 cm','154 cm','88 cm'],c:0,e:'C = 2πr = 2 × 22/7 × 7 = 44 cm.',d:'easy'},
  {q:'Area of a circle with radius 14 cm is (π = 22/7):',o:['44 cm²','308 cm²','616 cm²','154 cm²'],c:2,e:'A = πr² = 22/7 × 196 = 616 cm².',d:'medium'},
],

// TRIGONOMETRY
'smt1': [
  {q:'sin 30° = ?',o:['1','1/2','√3/2','0'],c:1,e:'sin 30° = 1/2. This is a standard value to memorize.',d:'easy'},
  {q:'cos 60° = ?',o:['1','√3/2','1/2','0'],c:2,e:'cos 60° = 1/2.',d:'easy'},
  {q:'tan 45° = ?',o:['0','1','√3','1/√3'],c:1,e:'tan 45° = sin 45°/cos 45° = 1.',d:'easy'},
  {q:'If sin θ = 3/5, find cos θ (first quadrant):',o:['3/5','4/5','5/3','5/4'],c:1,e:'cos θ = √(1 - sin²θ) = √(1 - 9/25) = √(16/25) = 4/5.',d:'medium'},
  {q:'The value of sin²60° + cos²60° is:',o:['0','2','1','sin 60°'],c:2,e:'sin²θ + cos²θ = 1 for any angle θ (Pythagorean identity).',d:'medium'},
  {q:'If tan A = 1 and tan B = √3, find A + B:',o:['75°','90°','105°','120°'],c:2,e:'A = 45°, B = 60°. A + B = 105°.',d:'hard'},
],

// PHYSICS
'spb3': [
  {q:'SI unit of velocity is:',o:['m/s²','km/h','m/s','N'],c:2,e:'Velocity = displacement/time, SI unit is m/s.',d:'easy'},
  {q:'Speed is 100 m in 10 s. Average speed is:',o:['5 m/s','10 m/s','20 m/s','50 m/s'],c:1,e:'Speed = distance/time = 100/10 = 10 m/s.',d:'easy'},
  {q:'A car goes from 0 to 20 m/s in 5s. Acceleration is:',o:['2 m/s²','4 m/s²','5 m/s²','10 m/s²'],c:1,e:'a = (v-u)/t = 20/5 = 4 m/s².',d:'easy'},
  {q:'A ball dropped from 45m hits ground in (g=10):',o:['2 s','3 s','4 s','5 s'],c:1,e:'s = ½gt² → 45 = 5t² → t = 3 s.',d:'medium'},
  {q:'Displacement vs distance: which is always ≥ the other?',o:['Displacement ≥ Distance','Distance ≥ Displacement','They\'re always equal','Cannot compare'],c:1,e:'Distance (total path) ≥ Displacement (straight line).',d:'medium'},
  {q:'Initial vel 10 m/s, deceleration 2 m/s². Distance before stopping:',o:['20 m','25 m','30 m','50 m'],c:1,e:'v² = u² + 2as → 0 = 100 - 4s → s = 25 m.',d:'hard'},
],
'spb4': [
  {q:'Newton\'s first law describes:',o:['Acceleration','Inertia','Reaction forces','Gravitation'],c:1,e:'First law = Law of Inertia: bodies resist change in motion.',d:'easy'},
  {q:'F = ma is Newton\'s which law?',o:['First','Second','Third','Universal Gravitation'],c:1,e:'Second law: Force = mass × acceleration.',d:'easy'},
  {q:'A 5 kg object accelerates at 3 m/s². Applied force:',o:['8 N','15 N','1.67 N','2 N'],c:1,e:'F = ma = 5 × 3 = 15 N.',d:'medium'},
  {q:'Action and reaction forces act on:',o:['Same body','Different bodies','No bodies','Same body at different times'],c:1,e:'Newton\'s 3rd law: they act on different bodies simultaneously.',d:'medium'},
  {q:'A 10 kg block on frictionless ice. 20 N applied. After 4s, velocity:',o:['2 m/s','4 m/s','8 m/s','10 m/s'],c:2,e:'a = F/m = 2, v = u+at = 0+2(4) = 8 m/s.',d:'hard'},
],
'spm1': [
  {q:'KE formula:',o:['½mv²','mgh','Fd','mv'],c:0,e:'Kinetic Energy = ½ × mass × velocity².',d:'easy'},
  {q:'PE of a 2 kg object at 10 m height (g=10):',o:['20 J','200 J','100 J','2000 J'],c:1,e:'PE = mgh = 2 × 10 × 10 = 200 J.',d:'medium'},
  {q:'A 4 kg ball moving at 5 m/s. Its KE is:',o:['20 J','50 J','100 J','10 J'],c:1,e:'KE = ½mv² = ½ × 4 × 25 = 50 J.',d:'medium'},
],

// CHEMISTRY
'scb1': [
  {q:'Which is a pure substance?',o:['Salt water','Air','Gold','Milk'],c:2,e:'Gold is an element — a pure substance.',d:'easy'},
  {q:'States of matter are:',o:['2','3','4','5'],c:2,e:'Solid, liquid, gas, and plasma — 4 states.',d:'easy'},
  {q:'Smallest unit of an element is:',o:['Molecule','Cell','Atom','Electron'],c:2,e:'Atoms are the smallest units retaining element properties.',d:'medium'},
],
'scb2': [
  {q:'Nucleus contains:',o:['Electrons','Protons and Neutrons','Only Protons','Only Electrons'],c:1,e:'Nucleus has protons (positive) and neutrons (neutral).',d:'easy'},
  {q:'Atomic number equals number of:',o:['Neutrons','Electrons in outer shell','Protons','Nucleons'],c:2,e:'Z = number of protons.',d:'easy'},
  {q:'11 protons + 12 neutrons = mass number:',o:['11','12','23','1'],c:2,e:'Mass number = protons + neutrons = 23.',d:'medium'},
  {q:'Isotopes differ in:',o:['Protons','Electrons','Neutrons','Valence electrons'],c:2,e:'Same protons, different neutrons = isotopes.',d:'medium'},
],

// BIOLOGY
'sbh1': [
  {q:'Where does digestion begin?',o:['Stomach','Small intestine','Mouth','Esophagus'],c:2,e:'Digestion starts in the mouth with saliva and chewing.',d:'easy'},
  {q:'Which enzyme digests starch?',o:['Pepsin','Amylase','Lipase','Trypsin'],c:1,e:'Amylase breaks starch into maltose, starting in the mouth.',d:'medium'},
  {q:'Most nutrient absorption occurs in:',o:['Stomach','Large intestine','Small intestine','Mouth'],c:2,e:'Villi in the small intestine maximize nutrient absorption.',d:'medium'},
],
'sbh2': [
  {q:'Human heart has how many chambers?',o:['2','3','4','5'],c:2,e:'4 chambers: 2 atria + 2 ventricles.',d:'easy'},
  {q:'Arteries carry blood:',o:['To the heart','Away from heart','Only in legs','Only in arms'],c:1,e:'Arteries carry blood away from the heart.',d:'easy'},
  {q:'Hemoglobin transports:',o:['Carbon dioxide only','Oxygen','Nutrients','White blood cells'],c:1,e:'Hemoglobin in RBCs binds oxygen for transport.',d:'medium'},
],
'sbg1': [
  {q:'DNA stands for:',o:['Deoxyribose Nucleic Acid','Deoxyribonucleic Acid','Dinucleotide Acid','Direct Nuclear Acid'],c:1,e:'DNA = Deoxyribonucleic Acid.',d:'easy'},
  {q:'Genes are segments of:',o:['Protein','RNA only','DNA','Cell membrane'],c:2,e:'Genes are specific segments of DNA that code for traits.',d:'easy'},
  {q:'In a Tt × Tt cross, tall:short ratio is:',o:['1:1','2:1','3:1','4:0'],c:2,e:'TT:Tt:tt = 1:2:1. Phenotype = 3 tall : 1 short.',d:'medium'},
  {q:'Dihybrid cross AaBb × AaBb gives phenotypic ratio:',o:['3:1','9:3:3:1','1:2:1','1:1:1:1'],c:1,e:'Mendel\'s dihybrid ratio is 9:3:3:1.',d:'hard'},
],

// COMPUTER SCIENCE
'scp2': [
  {q:'What is the output of the following code?\n\nx = 5\ny = 2\nprint(x ** y)',o:['25','10','7','Error'],c:0,e:'The ** operator represents exponentiation. 5 to the power of 2 is 25.',d:'easy'},
  {q:'Evaluate this Python output:\n\nmy_list = [1, 2, 3]\nmy_list.append([4, 5])\nprint(len(my_list))',o:['4','5','3','Error'],c:0,e:'The append() method adds its argument as a single element, so the list becomes [1, 2, 3, [4, 5]], making its length 4.',d:'medium'},
  {q:'What does the typical Python string slice `word[::-1]` do?',o:['Reverses the string','Returns the last character','Throws an index error','Returns the first character'],c:0,e:'A step of -1 traverses the string backwards, effectively reversing it.',d:'easy'},
  {q:'What will the following code print?\n\nfor i in range(3):\n    if i == 1:\n        continue\n    print(i, end="")',o:['02','012','12','0'],c:0,e:'The continue statement skips the print for i=1, so it prints 0 and then 2.',d:'medium'},
  {q:'Determine the output:\n\nTrue and False or True',o:['True','False','None','Error'],c:0,e:'AND is evaluated before OR. (True and False) is False. Then (False or True) is True.',d:'hard'},
],
'spy1': [
  {q:'What is the output of the following Python code?\n\nx = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)',o:['[1, 2, 3, 4]','[1, 2, 3]','[4, 1, 2, 3]','Error'],c:0,e:'In Python, variables are references to objects. Both x and y point to the same list in memory.',d:'medium'},
  {q:'Evaluate the output of this list comprehension:\n\nnums = [x * 2 for x in range(3)]\nprint(nums)',o:['[0, 2, 4]','[2, 4, 6]','[0, 1, 2]','[1, 2, 3]'],c:0,e:'range(3) yields 0, 1, 2. Multiplying each by 2 yields 0, 2, 4.',d:'easy'},
  {q:'What does this code output?\n\ndef func(a, lst=[]):\n    lst.append(a)\n    return lst\n\nprint(func(1))\nprint(func(2))',o:['[1] and [1, 2]','[1] and [2]','Error','[1, 2] and [1, 2]'],c:0,e:'Default mutable arguments (like lists) are evaluated only once when the function is defined. The same list is appended to twice.',d:'hard'},
  {q:'What will the following code print?\n\ntry:\n    print(1 / 0)\nexcept ZeroDivisionError:\n    print("A")\nfinally:\n    print("B")',o:['A then B','A','B','Error'],c:0,e:'The exception block prints A, and the finally block always executes, printing B.',d:'medium'},
  {q:'What is the output here?\n\na = (1, 2, [3, 4])\na[2].append(5)\nprint(a)',o:['(1, 2, [3, 4, 5])','TypeError','(1, 2, [3, 4])','SyntaxError'],c:0,e:'While tuples are immutable, the list inside the tuple is mutable and can be modified in place.',d:'hard'},
],
'scw1': [
  {q:'HTML stands for:',o:['Hyper Trainer Marking Language','HyperText Markup Language','HyperText Marketing Language','HyperTool Markup Language'],c:1,e:'HTML = HyperText Markup Language.',d:'easy'},
  {q:'<p> tag is for:',o:['Image','Link','Paragraph','Header'],c:2,e:'<p> defines a paragraph in HTML.',d:'easy'},
  {q:'Which attribute adds a link URL?',o:['src','link','href','url'],c:2,e:'href attribute in <a> tag specifies the URL.',d:'medium'},
],
'scw3': [
  {q:'document.getElementById is part of:',o:['CSS','HTML','DOM API','Python'],c:2,e:'DOM API lets JavaScript interact with HTML elements.',d:'easy'},
  {q:'=== in JavaScript checks:',o:['Assignment','Equality only','Strict equality (type + value)','Not equal'],c:2,e:'=== checks both type and value (strict equality).',d:'medium'},
  {q:'Which is NOT a JS data type?',o:['string','boolean','float','undefined'],c:2,e:'JavaScript uses "number" not "float" as a type.',d:'hard'},
],

// ============= UNIVERSITY: PROGRAMMING & CS =============
// C PROGRAMMING (Custom User Data)
'upc1': [
  {q:'What is the correct extension of a C file?',o:['.cpp','.java','.c','.py'],c:2,e:'C source files definitively use the .c extension.',d:'easy'},
  {q:'Which function is used to print output in C?',o:['input()','print()','printf()','display()'],c:2,e:'printf() is the standard formatted output function in C.',d:'easy'},
  {q:'Which symbol is used to end a statement in C?',o:[':',';','.','comma'],c:1,e:'Every C statement must legally end with a semicolon.',d:'easy'},
  {q:'Which of the following is a valid C variable name?',o:['1num','num_1','num-1','num 1'],c:1,e:'Variable names cannot start with a number and cannot contain spaces or hyphens (-).',d:'easy'},
  {q:'Which header file is required for printf()?',o:['stdlib.h','string.h','stdio.h','math.h'],c:2,e:'stdio.h is the Standard Input/Output header file needed for printing.',d:'easy'},
  {q:'What is the size of int (typically)?',o:['2 bytes','4 bytes','8 bytes','Depends on compiler'],c:1,e:'While technically compiler-dependent, it is universally considered 4 bytes in modern 32/64 bit systems.',d:'easy'},
  {q:'Which keyword is used to define a constant in C?',o:['const','define','static','final'],c:0,e:'The const keyword prevents a variable from being modified later in the code.',d:'easy'},
  {q:'What will printf("%d", 5+3); output?',o:['53','8','5+3','Error'],c:1,e:'The expression 5+3 is evaluated by the compiler to 8 before printing.',d:'easy'},
  {q:'Which operator is used for assignment?',o:['==','=',':=','!='],c:1,e:'A single = assigns value, whereas double == checks for equality.',d:'easy'},
  {q:'Which data type is used to store a single character?',o:['int','float','char','double'],c:2,e:'The char data type is used exclusively to store single characters.',d:'easy'},
  {q:'Which symbol is used for comments in C (single line)?',o:['#','//','/* */','--'],c:1,e:'// is used for single-line comments.',d:'easy'},
  {q:'What will be the output of printf("%d", sizeof(char));?',o:['1','2','4','Depends'],c:0,e:'The size of a char is exactly 1 byte in C.',d:'medium'},
  {q:'Which of the following is not a storage class?',o:['auto','register','static','volatile'],c:3,e:'volatile is a type qualifier, not a storage class specifier like auto, register, or static.',d:'medium'},
  {q:'What will ++i do?',o:['Increment after use','Increment before use','No change','Error'],c:1,e:'++i is the pre-increment operator. It increments the variable first before yielding its value.',d:'medium'},
  {q:'Which operator has highest precedence?',o:['+','*','()','='],c:2,e:'Parentheses () have the highest priority in the C operator precedence table.',d:'medium'},
  {q:'What is the result of 10/3 in C?',o:['3.33','3','4','Error'],c:1,e:'Integer division truncates the decimal portion, resulting in 3.',d:'medium'},
  {q:'Which keyword is used to prevent modification of a variable?',o:['const','static','volatile','register'],c:0,e:'const declares a variable as read-only.',d:'medium'},
  {q:'What will be the output of printf("%d", 2*3+4);',o:['10','14','12','8'],c:0,e:'Multiplication has higher precedence than addition: 2*3 = 6, 6+4 = 10.',d:'medium'},
  {q:'What will be output of int x=5; printf("%d", x++);',o:['5','6','Error','4'],c:0,e:'x++ evaluates to the current value (5), then increments x to 6.',d:'medium'}
],,
'upc2': [
  {q:'Which loop is guaranteed to execute at least once?',o:['for','while','do-while','None'],c:2,e:'A do-while loop evaluates its condition only AFTER the first execution completes.',d:'easy'},
  {q:'Which keyword is used for decision making?',o:['loop','if','case','break'],c:1,e:'The "if" keyword establishes the primary decision-making branch.',d:'easy'},
  {q:'Which operator is used for comparison?',o:['=','==',':=','->'],c:1,e:'== is the logical equality comparison operator.',d:'easy'},
  {q:'Which operator is used for logical AND?',o:['&','&&','AND','||'],c:1,e:'&& is logical AND, whereas & is bitwise AND.',d:'easy'},
  {q:'Which loop is best when number of iterations is known?',o:['while','do-while','for','None'],c:2,e:'The for loop is explicitly designed for a known predetermined number of iterations.',d:'easy'},
  {q:'Which loop checks condition after execution?',o:['for','while','do-while','None'],c:2,e:'The do-while loop evaluates its condition at the end of the loop body.',d:'medium'},
  {q:'What is the output of printf("%d", 5==5);',o:['0','1','Error','None'],c:1,e:'A true relational expression evaluates to the integer 1 in C.',d:'medium'},
  {q:'What will be output of printf("%d", !0);',o:['0','1','Error','Undefined'],c:1,e:'The logical NOT operator (!) converts a falsy value (0) into a truthy value (1).',d:'medium'}
],
'upc3': [
  {q:'Which function is used to read input from user?',o:['scanf()','input()','read()','get()'],c:0,e:'scanf() heavily reads formatted input from the standard input stream (stdin).',d:'easy'},
  {q:'Which keyword is used to return a value from a function?',o:['break','return','exit','stop'],c:1,e:'The return statement stops execution inside the function block and returns the specified value.',d:'easy'},
  {q:'What is the default return type of main()?',o:['float','void','int','char'],c:2,e:'main() uniquely returns an int back to the operating system, normally 0 for success.',d:'easy'},
  {q:'Which keyword is used to define a function?',o:['func','define','return','No keyword needed'],c:3,e:'Functions in C do not require a special keyword to announce them, just a return type signature.',d:'easy'},
  {q:'What is the default value of a static variable?',o:['garbage','0','null','undefined'],c:1,e:'Static variables are automatically initialized to 0 (or equivalent null pointer) by default.',d:'medium'},
  {q:'What is recursion?',o:['Loop','Function calling itself','Pointer','Array'],c:1,e:'Recursion is a technique where a function makes a call to itself to solve smaller subproblems.',d:'medium'}
],
'upc4': [
  {q:'What is array?',o:['Collection of different types','Collection of same types','Function','Pointer'],c:1,e:'An array stores a fixed-size sequential collection of elements of the same type.',d:'medium'}
],
'upc5': [
  {q:'What is pointer?',o:['Variable storing address','Variable storing value','Function','Loop'],c:0,e:'A pointer is a variable whose value is the memory address of another variable.',d:'medium'},
  {q:'Which symbol is used to access value at address?',o:['&','*','->','%'],c:1,e:'The * operator (dereference operator) accesses the value stored at the pointer\'s address.',d:'medium'},
  {q:'Which operator is used to get address of variable?',o:['*','&','->','%'],c:1,e:'The & (address-of) operator returns the memory address of a variable.',d:'medium'},
  {q:'Which function is used to allocate memory dynamically?',o:['alloc()','malloc()','new()','create()'],c:1,e:'malloc() allocates a specified number of bytes and returns a pointer to the allocated memory.',d:'medium'},
  {q:'Which header file is used for malloc()?',o:['stdio.h','stdlib.h','math.h','string.h'],c:1,e:'malloc(), calloc(), and free() are defined in the stdlib.h header file.',d:'medium'}
],
'upc6': [
  {q:'Which keyword is used to define structure?',o:['struct','class','define','object'],c:0,e:'The struct keyword creates a user-defined data type that groups different variable types under a single name.',d:'medium'}
],

// C++ PROGRAMMING
'ucpp1': [
  {q:'What is the output of the following code snippet?\n\nint x = 5;\ncout << (x == 5 ? "Equal" : "Not Equal");',o:['Equal','Not Equal','5','Compile Error'],c:0,e:'The ternary operator evaluates to "Equal" since x is indeed 5.',d:'easy'},
  {q:'Evaluate the output of this C++ program:\n\nint a = 10, b = 20;\nif (a = b) {\n    cout << a;\n} else {\n    cout << 0;\n}',o:['20','10','0','Compile Error'],c:0,e:'`a = b` is an assignment, not a comparison. `a` becomes 20, which evaluates to true, so it prints 20.',d:'medium'},
  {q:'What will be printed to the console?\n\nint i = 0;\nwhile (i < 3) {\n    cout << i++;\n}',o:['012','123','0123','Infinite Loop'],c:0,e:'Post-increment (i++) yields the current value before incrementing, so it prints 0, 1, and 2 continuously.',d:'easy'},
  {q:'Which of the following is strictly true regarding C++ references compared to pointers?',o:['A reference cannot be explicitly reassigned to refer to a different object after initialization.','References can be null.','Pointers are conceptually safer than references.','References take up more memory space than standard pointers.'],c:0,e:'Unlike pointers, references must refer to an existing object immediately and cannot be reseated or null.',d:'medium'},
  {q:'What is the output of this array indexing trick?\n\nint arr[] = {1, 2, 3};\ncout << 1[arr];',o:['2','1','3','Syntax Error'],c:0,e:'`1[arr]` is perfectly valid in C++ and equivalent to `arr[1]` due to pointer arithmetic ( *(1 + arr) ). The element at index 1 is 2.',d:'hard'},
],
'ucpp2': [
  {q:'Determine the output of the following OOP code:\n\nclass A { public: A() { cout<<"A"; } };\nclass B : public A { public: B() { cout<<"B"; } };\nB obj;',o:['AB','BA','B','Compile Error'],c:0,e:'The base class (A) constructor is always called before the derived class (B) constructor.',d:'medium'},
  {q:'Select the correct answer regarding this code block:\n\nclass Base {\n    virtual void print() { cout<<"Base"; }\n};\nclass Derived : public Base {\n    void print() override { cout<<"Derived"; }\n};\nBase* b = new Derived();\nb->print();',o:['Compile Error: print() is private by default','Base','Derived','Runtime Error'],c:0,e:'In a `class`, members are private by default. Without a `public:` access specifier, `b->print()` fails compilation.',d:'hard'},
  {q:'What exactly constitutes a "pure virtual function" in C++?',o:['A virtual function declared with `= 0` that makes the base class abstract.','A function that returns exactly 0.','A function declared outside a class but inside a namespace.','A function that cannot be overridden by derived classes.'],c:0,e:'Declared with `= 0`, it forces derived classes to implement it, making the base class an abstract interface.',d:'easy'},
  {q:'Under what specific condition should a class destructor be explicitly marked as `virtual`?',o:['When the class is designed to be used polymorphically and deleted via a base class pointer.','Always, it is a strict requirement for all classes.','Only when no constructors are defined in the class.','Destructors cannot be virtual in C++.'],c:0,e:'This ensures the derived class destructor is correctly called when deleting a base pointer pointing to a derived object to prevent memory leaks.',d:'medium'},
  {q:'What is the output of this static scope example?\n\nclass C { public: ~C(){ cout<<"D"; } };\nvoid func() { static C obj; }\nint main() {\n    func();\n    cout<<"M";\n    return 0;\n}',o:['MD','DM','Nothing is printed','Compile Error'],c:0,e:'`obj` is static. It gets created when `func()` is called, but is destroyed only when the program entirely exits (after main returns). So M prints, then D.',d:'hard'},
],
'ucpp3': [
  {q:'What happens when this code is executed?\n\nint* p = new int(10);\ndelete p;\ncout << *p;',o:['Undefined Behavior','10','0','Compile Error'],c:0,e:'Dereferencing a deleted pointer (dangling pointer) results in undefined behavior. It may crash or print garbage.',d:'easy'},
  {q:'Which modern C++11 smart pointer provides built-in reference counting to allow shared ownership of a dynamically allocated object?',o:['std::shared_ptr','std::unique_ptr','std::weak_ptr','std::auto_ptr'],c:0,e:'`std::shared_ptr` uses an atomic control block to track reference counts, deleting the memory when the count reaches zero.',d:'easy'},
  {q:'Identify the memory management flaw in this function:\n\nvoid run() {\n    int* arr = new int[50];\n    delete arr;\n}',o:['Undefined Behavior: Incorrect array deallocation','Memory Leak: Size not specified','Buffer Overflow: 50 is too large','Segmentation Fault: Null pointer dereference'],c:0,e:'Memory allocated with `new[]` must be freed with `delete[]`. Using standard `delete` leads to undefined behavior and potential memory leaks.',d:'medium'},
  {q:'What is the specific functionality of the `std::unique_ptr::release()` method?',o:['It relinquishes ownership and returns the raw pointer without deleting the object.','It deletes the managed object immediately and nullifies the pointer.','It transfers ownership to a newly created `unique_ptr`.','It returns the current reference count of the pointer.'],c:0,e:'`release()` stops managing the pointer so it won\'t be automatically deleted when the `unique_ptr` goes out of scope.',d:'hard'},
  {q:'What does "Placement new" achieve in advanced C++?',o:['It invokes an object constructor on a specific, pre-allocated memory address.','It forces memory allocation to happen on the CPU cache.','It provides automatic garbage collection for legacy code.','It places an object perfectly into a C++ STL container.'],c:0,e:'Syntax: `new (pointer) Object()`. It constructs the object in pre-allocated buffers, highly useful in game engines and custom allocators.',d:'hard'},
],
'ucpp5': [
  {q:'What will the following code output regarding the vector state?\n\nstd::vector<int> v = {1, 2, 3};\nv.push_back(4);\ncout << v.size();',o:['4','3','6','Compile Error'],c:0,e:'Adding the 4th element increases the size (number of valid elements) to 4.',d:'easy'},
  {q:'Which internal data structure is the C++ STL `std::map` normally built upon to maintain sorted key-value pairs?',o:['Self-balancing Binary Search Tree (e.g., Red-Black tree)','Contiguous Array','Hash Table','Doubly Linked List'],c:0,e:'`std::map` guarantees O(log N) operations and ordered keys by using a self-balancing BST.',d:'medium'},
  {q:'What is the output of the following C++11 Lambda function?\n\nauto compute = [](int x) { return x * 2; };\ncout << compute(3);',o:['6','3','Syntax Error','0'],c:0,e:'The lambda captures no variables (`[]`), takes `x`, and returns `x*2`. Passing 3 correctly outputs 6.',d:'easy'},
  {q:'What exactly does "template specialization" achieve in C++ meta-programming?',o:['Providing a specific overriding implementation of a generic template for a specific datatype (e.g., int).','Restricting a template to only compile on specific operating systems.','Converting generic templates automatically into runtime interfaces.','Banning the use of specific datatypes in standard functions.'],c:0,e:'Specialization allows you to write custom, highly optimized code for a specific type while keeping the general template for everything else.',d:'medium'},
  {q:'Which function is called in the following complex overloading scenario?\n\ntemplate<typename T> void f(T x) { cout << "Generic "; }\ntemplate<> void f(int x) { cout << "Int "; }\nvoid f(double x) { cout << "Double "; }\n\nint main() { f(0.0); }',o:['Double','Int','Generic','Compile Error: Ambiguous match'],c:0,e:'`0.0` is a double. A non-template function is always preferred over a template if it perfectly matches the argument type.',d:'hard'},
],

// JAVA PROGRAMMING
'uj1': [
  {q:'What is the output of this Java code snippet?\n\nint x = 5;\nSystem.out.print(x++ + ++x);',o:['12','10','13','11'],c:0,e:'x++ returns 5, x becomes 6. Then ++x makes x 7 and returns 7. 5 + 7 = 12.',d:'medium'},
  {q:'Evaluate this comparison:\n\nString s1 = "Java";\nString s2 = new String("Java");\nSystem.out.println(s1 == s2);',o:['false','true','NullPointerException','Compile Error'],c:0,e:'`==` checks object reference memory locations. `s1` is in the string pool, `s2` is created on the heap, so they are not the same reference.',d:'easy'},
  {q:'What does the `transient` keyword do in Java?',o:['Prevents an object field from being serialized.','Limits variable access to the same thread.','Marks a variable to be garbage collected immediately.','Makes a method run concurrently.'],c:0,e:'During serialization, fields marked as `transient` are ignored and not saved.',d:'hard'},
  {q:'What happens if you run a Java class with no `main` method?',o:['Runtime Error: Main method not found','Compile Error','The application terminates silently','It runs the constructor automatically'],c:0,e:'The JVM strictly requires a `public static void main(String[] args)` to begin execution.',d:'easy'},
  {q:'Output of the following?\n\ntry {\n  return 1;\n} finally {\n  return 2;\n}',o:['2','1','Compile Error','Exception thrown'],c:0,e:'The `finally` block ALWAYS executes and overrides the return value of the `try` block.',d:'hard'},
],

// ADVANCED PYTHON
'upa1': [
  {q:'What is the output of this OOP code?\n\nclass A:\n    def __init__(self):\n        self.x = 1\nclass B(A):\n    def __init__(self):\n        self.y = 2\n\nb = B()\nprint(b.x)',o:['AttributeError','1','None','2'],c:0,e:'B overrides A\'s __init__ without calling super().__init__(), so b.x is never initialized.',d:'medium'},
  {q:'What happens when you declare a method with `@staticmethod`?',o:['It does not receive an implicit first argument (like self or cls).','It can alter class state but not instance state.','It makes the method private.','It throws an error if called rapidly.'],c:0,e:'Static methods behave like regular functions but belong to the class\'s namespace.',d:'easy'},
  {q:'Evaluate this Python output:\n\nnums = [1, 2, 3]\nnums[1:2] = [4, 5, 6]\nprint(nums)',o:['[1, 4, 5, 6, 3]','[1, 4, 5, 6]','[1, [4, 5, 6], 3]','Error'],c:0,e:'Slice assignment replaces the sliced region with the provided iterable elements.',d:'hard'}
],
'upa2': [
  {q:'What does the `yield` keyword do in Python?',o:['Pauses a function and saves its local state so it can be resumed later.','Terminates the program immediately.','Automatically catches exceptions.','Returns a value permanently without possibility of continuation.'],c:0,e:'`yield` turns a regular function into a generator, allowing lazy iteration.',d:'easy'},
  {q:'Output of this decorator?\n\ndef deco(func):\n    def wrapper():\n        return func() + 1\n    return wrapper\n\n@deco\ndef test():\n    return 2\n\nprint(test())',o:['3','2','Error','None'],c:0,e:'The decorator overrides `test` with `wrapper`, which returns `test() [2] + 1 = 3`.',d:'medium'}
],

// DATA STRUCTURES
'uds1': [
  {q:'What is the time complexity of appending to a dynamic array (like std::vector or list) that requires resizing?',o:['O(n) worst-case, O(1) amortized','O(1) strictly','O(log n)','O(n²)'],c:0,e:'Resizing means allocating a new array and copying elements (O(n)), but overall amortized over many appends, it averages to O(1).',d:'hard'},
  {q:'Identify the bug in trying to delete the tail of a Singly Linked List quickly without a tail pointer.',o:['You must traverse the entire list from the head to find the node before the tail.','Memory leak will occur if not cast properly.','It takes O(1) time consistently.','You cannot delete the tail.'],c:0,e:'Because you cannot traverse backwards in a SLL, you must go O(n) from the head to find the second-to-last node to sever the link.',d:'medium'},
  {q:'Array access by index is:',o:['O(n)','O(log n)','O(1)','O(n²)'],c:2,e:'Direct index = O(1) constant time.',d:'easy'},
  {q:'Linked list head insertion is:',o:['O(1)','O(n)','O(log n)','O(n²)'],c:0,e:'Just update head pointer — O(1).',d:'easy'},
  {q:'Which does NOT allow random access?',o:['Array','ArrayList','Linked List','Vector'],c:2,e:'Linked lists need traversal — no index access.',d:'medium'},
  {q:'Reversing a linked list takes:',o:['O(1)','O(n)','O(n²)','O(n log n)'],c:1,e:'Visit each node once = O(n).',d:'medium'},
  {q:'Time to search unsorted array of n elements:',o:['O(1)','O(log n)','O(n)','O(n²)'],c:2,e:'Linear search: check each element = O(n) worst case.',d:'easy'},
  {q:'Amortized cost of dynamic array append:',o:['O(1)','O(n)','O(log n)','O(n²)'],c:0,e:'Despite occasional resizing, amortized append is O(1).',d:'hard'},
],
'uds5': [
  {q:'BFS uses which data structure?',o:['Stack','Queue','Heap','Tree'],c:1,e:'BFS uses a queue for level-order traversal.',d:'easy'},
  {q:'DFS uses which data structure?',o:['Queue','Hash Map','Stack','Array'],c:2,e:'DFS uses a stack (or recursion, which uses the call stack).',d:'easy'},
  {q:'Time complexity of DFS on a graph?',o:['O(V)','O(E)','O(V+E)','O(V²)'],c:2,e:'DFS visits all vertices and edges: O(V+E).',d:'medium'},
  {q:'Dijkstra\'s algorithm finds:',o:['MST','Shortest path','Topological sort','Cycle detection'],c:1,e:'Dijkstra finds shortest path from source to all vertices.',d:'medium'},
  {q:'Topological sort works on:',o:['Undirected graphs','DAGs only','Cyclic graphs','Trees only'],c:1,e:'Topological sort requires a Directed Acyclic Graph (DAG).',d:'hard'},
],

// ML
'uml1': [
  {q:'Supervised learning uses:',o:['Only input','Labeled data','No data','Reinforcement'],c:1,e:'Supervised = learning from labeled input-output pairs.',d:'easy'},
  {q:'Which is unsupervised?',o:['Classification','Regression','Clustering','Object detection'],c:2,e:'Clustering groups data without labels — unsupervised.',d:'easy'},
  {q:'Overfitting means:',o:['Model fails on training data','Good train, bad test performance','Model is too simple','Model cannot learn'],c:1,e:'Overfitting = memorized training data, poor generalization.',d:'medium'},
  {q:'Regularization helps prevent:',o:['Underfitting','Overfitting','Data collection','Feature engineering'],c:1,e:'Regularization adds penalty to complexity, reducing overfitting.',d:'hard'},
],
'udl1': [
  {q:'Activation functions introduce:',o:['Linearity','Randomness','Non-linearity','Bias'],c:2,e:'Non-linearity enables learning complex patterns.',d:'easy'},
  {q:'ReLU is defined as:',o:['max(0, x)','1/(1+e⁻ˣ)','tanh(x)','x²'],c:0,e:'ReLU(x) = max(0, x).',d:'medium'},
  {q:'Backpropagation computes:',o:['Forward pass','Gradients for weight updates','Data augmentation','Feature scaling'],c:1,e:'Backprop calculates loss gradients w.r.t. weights.',d:'medium'},
  {q:'Vanishing gradient problem is worst with:',o:['ReLU','Sigmoid in deep networks','Linear activation','No activation'],c:1,e:'Sigmoid squashes values to (0,1), gradients shrink in deep nets.',d:'hard'},
],

// Python Uni
'up1': [
  {q:'List comprehension creates:',o:['A dictionary','A new list','A tuple','A function'],c:1,e:'[x for x in range(5)] creates a new list.',d:'easy'},
  {q:'What does a decorator do?',o:['Loops','Modifies a function','Creates a class','Handles errors'],c:1,e:'Decorators wrap functions to modify behavior.',d:'medium'},
  {q:'A generator yields values:',o:['All at once','One at a time lazily','Never','Randomly'],c:1,e:'Generators use yield to produce values lazily on demand.',d:'hard'},
],

// JavaScript Uni
'ujs1': [
  {q:'A closure is:',o:['A loop','Function with its scope','A class','An error handler'],c:1,e:'Closures capture variables from their enclosing scope.',d:'medium'},
  {q:'Promise states are:',o:['start, end','pending, fulfilled, rejected','open, closed','sync, async'],c:1,e:'Promises: pending → fulfilled or rejected.',d:'medium'},
  {q:'Event loop handles:',o:['CSS rendering','Async callbacks','File writing only','Nothing'],c:1,e:'Event loop manages async callbacks from the task queue.',d:'hard'},
],

// Calculus
'ucl1': [
  {q:'lim(x→0) sin(x)/x = ?',o:['0','1','∞','Undefined'],c:1,e:'Fundamental limit: lim sin(x)/x = 1 as x → 0.',d:'medium'},
  {q:'Derivative of x² is:',o:['x','2x','x²','2x²'],c:1,e:'d/dx(x²) = 2x by the power rule.',d:'easy'},
  {q:'∫ 2x dx = ?',o:['2x','x²','x² + C','2x + C'],c:2,e:'∫2x dx = x² + C (power rule for integration).',d:'easy'},
  {q:'d/dx(sin x) = ?',o:['-sin x','cos x','tan x','-cos x'],c:1,e:'The derivative of sin x is cos x.',d:'medium'},
],

// Linear Algebra
'ula1': [
  {q:'Orthogonal vectors have dot product:',o:['1','0','-1','∞'],c:1,e:'Orthogonal ⟺ dot product = 0.',d:'easy'},
  {q:'A 3×2 matrix times a 2×4 matrix gives:',o:['3×4','2×2','3×2','Cannot multiply'],c:0,e:'(3×2)(2×4) = 3×4. Inner dims must match.',d:'medium'},
  {q:'Determinant of [[1,2],[3,4]] is:',o:['2','-2','10','-10'],c:1,e:'det = 1(4) - 2(3) = 4 - 6 = -2.',d:'medium'},
],

// OS
'uos1': [
  {q:'Ready queue holds processes that are:',o:['Waiting for I/O','Running','Ready to execute','Terminated'],c:2,e:'Ready queue = processes loaded and waiting for CPU.',d:'easy'},
  {q:'Context switch saves:',o:['Hard disk','PCB','Monitor','File system'],c:1,e:'Context switch saves/restores Process Control Block.',d:'easy'},
  {q:'Which scheduling can cause starvation?',o:['Round Robin','FCFS','SJF','FIFO'],c:2,e:'SJF: long jobs starve if short ones keep arriving.',d:'medium'},
],

// DBMS
'udb2': [
  {q:'SQL command to retrieve data:',o:['INSERT','UPDATE','SELECT','DELETE'],c:2,e:'SELECT retrieves data from tables.',d:'easy'},
  {q:'INNER JOIN returns:',o:['All left rows','All right rows','Only matching rows','All rows'],c:2,e:'INNER JOIN = only rows matching in both tables.',d:'easy'},
  {q:'HAVING filters:',o:['Rows','Groups after GROUP BY','Columns','Tables'],c:1,e:'HAVING filters after aggregation; WHERE filters before.',d:'medium'},
  {q:'2NF requires:',o:['No partial dependencies','No transitive dependencies','Only atomic values','No dependencies'],c:0,e:'2NF: no partial dependency of non-key on composite key.',d:'hard'},
],
};

// ── Build complete question bank ──
let ALL_QUESTIONS = null;

export function getAllQuestions() {
  if (ALL_QUESTIONS) return ALL_QUESTIONS;
  ALL_QUESTIONS = {};
  const allCourses = [...SCHOOL_COURSES, ...UNI_COURSES];

  allCourses.forEach(course => {
    course.topics.forEach(topic => {
      const handCrafted = QUESTION_BANK[topic.id] || [];

      // Apply answer randomization to every question
      const randomized = handCrafted.map(q => randomizeOptions(q));

      ALL_QUESTIONS[topic.id] = {
        easy: randomized.filter(q => q.d === 'easy').map(q => ({
          question: q.q, options: q.o, correct: q.c, explanation: q.e, difficulty: 'easy', topicId: topic.id, courseId: course.id
        })),
        medium: randomized.filter(q => q.d === 'medium').map(q => ({
          question: q.q, options: q.o, correct: q.c, explanation: q.e, difficulty: 'medium', topicId: topic.id, courseId: course.id
        })),
        hard: randomized.filter(q => q.d === 'hard').map(q => ({
          question: q.q, options: q.o, correct: q.c, explanation: q.e, difficulty: 'hard', topicId: topic.id, courseId: course.id
        })),
      };
    });
  });
  return ALL_QUESTIONS;
}

export function getTopicQuestions(topicId, difficulty, count = 5) {
  const bank = getAllQuestions();
  const topicQ = bank[topicId];

  // Get requested difficulty, supplement from adjacent if needed
  let pool = [];
  if (topicQ) {
    pool = [...(topicQ[difficulty] || [])];
    if (pool.length < count) {
      const fallbackOrder = difficulty === 'easy' ? ['medium','hard'] : difficulty === 'hard' ? ['medium','easy'] : ['easy','hard'];
      for (const fb of fallbackOrder) {
        if (pool.length >= count) break;
        pool.push(...(topicQ[fb] || []).filter(q => !pool.includes(q)));
      }
    }
  }

  // Supplement with placeholders if we still don't have enough
  if (pool.length < count) {
    const allCourses = [...SCHOOL_COURSES, ...UNI_COURSES];
    let courseId = '';
    for(const c of allCourses) {
      if(c.topics.find(t => t.id === topicId)) { courseId = c.id; break; }
    }
    pool.push(...generatePlaceholders(topicId, courseId, difficulty, count - pool.length));
  }

  // Shuffle and re-randomize options for each attempt
  return shuffle(pool).slice(0, count).map(q => {
    const indices = q.options.map((_, i) => i);
    const shuffledIdx = shuffle(indices);
    return {
      ...q,
      options: shuffledIdx.map(i => q.options[i]),
      correct: shuffledIdx.indexOf(q.correct)
    };
  });
}

export function getCourseQuestions(courseId, difficulty, count = 5) {
  const bank = getAllQuestions();
  const allCourses = [...SCHOOL_COURSES, ...UNI_COURSES];
  const course = allCourses.find(c => c.id === courseId);
  if (!course) return [];

  let pool = [];
  course.topics.forEach(t => {
    const topicQ = bank[t.id];
    if (topicQ && topicQ[difficulty]) pool.push(...topicQ[difficulty]);
  });

  // Supplement from adjacent difficulty if needed
  if (pool.length < count) {
    const fallbackOrder = difficulty === 'easy' ? ['medium','hard'] : difficulty === 'hard' ? ['medium','easy'] : ['easy','hard'];
    for (const fb of fallbackOrder) {
      if (pool.length >= count) break;
      course.topics.forEach(t => {
        const topicQ = bank[t.id];
        if (topicQ && topicQ[fb]) pool.push(...topicQ[fb].filter(q => !pool.includes(q)));
      });
    }
  }

  // Supplement with placeholders if we still don't have enough
  if (pool.length < count) {
    const topicId = course.topics.length > 0 ? course.topics[0].id : 'general';
    pool.push(...generatePlaceholders(topicId, courseId, difficulty, count - pool.length));
  }

  // Shuffle and re-randomize options
  return shuffle(pool).slice(0, count).map(q => {
    const indices = q.options.map((_, i) => i);
    const shuffledIdx = shuffle(indices);
    return {
      ...q,
      options: shuffledIdx.map(i => q.options[i]),
      correct: shuffledIdx.indexOf(q.correct)
    };
  });
}
