// ===== Database Seed Script =====
// Run: cd backend && node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Question = require('./models/Question');

const VIDEOS = {
  smf1:'https://www.youtube.com/embed/0jBHEGo7NIk',smf2:'https://www.youtube.com/embed/athjVjpKMjQ',smf3:'https://www.youtube.com/embed/znmPfDfsir8',
  sma1:'https://www.youtube.com/embed/NybHckSEQBI',sma2:'https://www.youtube.com/embed/MelAhAojdrk',sma3:'https://www.youtube.com/embed/IlNAJl36-10',
  smg1:'https://www.youtube.com/embed/MtyY8x0yGLs',smg2:'https://www.youtube.com/embed/mLeNaj2A7cI',smg4:'https://www.youtube.com/embed/O-cawByg2aA',
  smt1:'https://www.youtube.com/embed/F21S9Wpi0y8',spb3:'https://www.youtube.com/embed/ZM8ECpBuQYE',spb4:'https://www.youtube.com/embed/kKKM8Y-u7ds',
  spm1:'https://www.youtube.com/embed/w4QFJb9a8vo',scb1:'https://www.youtube.com/embed/FSyAehMdpyI',sbh1:'https://www.youtube.com/embed/X9ZZ6tcxArI',
  sbg1:'https://www.youtube.com/embed/CBezq1fFUEA',sbe1:'https://www.youtube.com/embed/GlBA_7bBLFk',sbc1:'https://www.youtube.com/embed/URUJD5NEXC8',
  spy1:'https://www.youtube.com/embed/kqtD5dpn9C8',scw1:'https://www.youtube.com/embed/UB1O30fR-EE',scw3:'https://www.youtube.com/embed/hdI2bqOjy3c',
  uds1:'https://www.youtube.com/embed/8hly31xKli0',uds5:'https://www.youtube.com/embed/tWVWeAqZ0WU',
  uml1:'https://www.youtube.com/embed/7eh4d6sabA0',udl1:'https://www.youtube.com/embed/aircAruvnKk',
  up1:'https://www.youtube.com/embed/rfscVS0vtbw',ujs1:'https://www.youtube.com/embed/PkZNo7MFNFg',
  ula1:'https://www.youtube.com/embed/fNk_zzaMoSs',ucl1:'https://www.youtube.com/embed/WUvTyaaNkzM',
};

const SCHOOL_COURSES = [
  { cid:'s-math-foundation', subject:'Mathematics', name:'Foundation Mathematics', icon:'🔢', color:'#3b82f6', level:'school',
    description:'Number systems, fractions, ratios, percentages, and profit & loss',
    topics:[
      {tid:'smf1',name:'Number Systems',notes:'<p><strong>Number Systems</strong> include Natural (1,2,3…), Whole (0,1,2…), Integers (…-2,-1,0,1,2…), Rational (p/q form), and Irrational (√2, π). Understanding classifications is the foundation of mathematics.</p>'},
      {tid:'smf2',name:'Fractions & Decimals',notes:'<p><strong>Fractions</strong> represent parts of a whole. Operations include addition, subtraction, multiplication and division. Decimals use base 10 representation.</p>'},
      {tid:'smf3',name:'LCM & HCF',notes:'<p><strong>LCM</strong> (Least Common Multiple) and <strong>HCF</strong> (Highest Common Factor) are fundamental for simplifying fractions and ratios.</p>'},
    ]},
  { cid:'s-math-algebra', subject:'Mathematics', name:'Algebra Mastery', icon:'📐', color:'#3b82f6', level:'school',
    description:'Variables, equations, polynomials, and inequalities',
    topics:[
      {tid:'sma1',name:'Variables & Expressions',notes:'<p>Variables represent unknowns. <strong>Algebraic expressions</strong> combine variables, constants and operators.</p>'},
      {tid:'sma2',name:'Linear Equations',notes:'<p>Form: ax + b = 0. Solve by isolating the variable. Applications include age and distance problems.</p>'},
      {tid:'sma3',name:'Quadratic Equations',notes:'<p>Form: ax² + bx + c = 0. Solutions via factoring or quadratic formula: x = (-b ± √(b²-4ac)) / 2a.</p>'},
    ]},
  { cid:'s-phys-basics', subject:'Physics', name:'Physics Fundamentals', icon:'⚡', color:'#f59e0b', level:'school',
    description:'Units, motion, laws of motion, and gravitation',
    topics:[
      {tid:'spb3',name:'Motion in a Straight Line',notes:'<p>Distance vs displacement. Speed vs velocity. Equations: v=u+at, s=ut+½at², v²=u²+2as.</p>'},
      {tid:'spb4',name:'Laws of Motion',notes:'<p>Newton\'s First (inertia), Second (F=ma), Third (action-reaction). Free body diagrams.</p>'},
      {tid:'spm1',name:'Work & Energy',notes:'<p>Work = Force × displacement × cos θ. KE = ½mv². PE = mgh. Conservation of energy.</p>'},
    ]},
  { cid:'s-chem-basic', subject:'Chemistry', name:'Basic Chemistry', icon:'🧪', color:'#10b981', level:'school',
    description:'Matter, atoms, bonding, and states of matter',
    topics:[
      {tid:'scb1',name:'Matter & Classification',notes:'<p>Matter: anything with mass and volume. Pure substances vs mixtures. Elements and compounds.</p>'},
    ]},
  { cid:'s-bio-human', subject:'Biology', name:'Human Biology', icon:'🧬', color:'#ec4899', level:'school',
    description:'Digestive, respiratory, circulatory, and nervous systems',
    topics:[
      {tid:'sbh1',name:'Digestive System',notes:'<p>Mouth → Esophagus → Stomach → Small intestine → Large intestine. Enzymes break down food.</p>'},
      {tid:'sbg1',name:'DNA & Genes',notes:'<p>DNA carries genetic information. Genes are segments of DNA. Mendel\'s laws of inheritance.</p>'},
    ]},
  { cid:'s-cs-python', subject:'Computer Science', name:'Python Programming', icon:'🐍', color:'#8b5cf6', level:'school',
    description:'Variables, loops, functions, lists, and file handling',
    topics:[
      {tid:'spy1',name:'Python Basics',notes:'<p>Python is a high-level language. Variables, data types (int, float, str, bool). Print and input.</p>'},
      {tid:'scw1',name:'HTML Fundamentals',notes:'<p>HTML structures web pages. Tags: &lt;html&gt;, &lt;head&gt;, &lt;body&gt;, &lt;h1&gt;-&lt;h6&gt;, &lt;p&gt;, &lt;a&gt;, &lt;img&gt;.</p>'},
      {tid:'scw3',name:'JavaScript Basics',notes:'<p>JS adds interactivity. Variables (let, const), functions, DOM manipulation, event listeners.</p>'},
    ]},
];

const UNI_COURSES = [
  { cid:'u-dsa', subject:'Computer Science', name:'Data Structures & Algorithms', icon:'🏗️', color:'#3b82f6', level:'university',
    description:'Arrays, linked lists, trees, graphs, and sorting algorithms',
    topics:[
      {tid:'uds1',name:'Arrays & Strings',notes:'<p>Arrays are contiguous memory. O(1) access, O(n) search. Strings are character arrays.</p>'},
      {tid:'uds5',name:'Graphs',notes:'<p>G = (V, E). Representations: adjacency matrix, adjacency list. BFS, DFS traversals.</p>'},
    ]},
  { cid:'u-ml', subject:'AI & ML', name:'Machine Learning Foundations', icon:'🤖', color:'#8b5cf6', level:'university',
    description:'Linear regression, classification, decision trees, and model evaluation',
    topics:[
      {tid:'uml1',name:'ML Introduction',notes:'<p>ML: computers learn from data. Types: supervised, unsupervised, reinforcement learning.</p>'},
      {tid:'udl1',name:'Neural Networks',notes:'<p>Inspired by the brain. Input → Hidden → Output layers. Activation functions. Backpropagation.</p>'},
    ]},
  { cid:'u-python', subject:'Programming', name:'Python Mastery', icon:'🐍', color:'#10b981', level:'university',
    description:'OOP, functional programming, libraries, and project development',
    topics:[
      {tid:'up1',name:'Advanced Python',notes:'<p>List comprehensions, generators, decorators, context managers. Pythonic code.</p>'},
      {tid:'ujs1',name:'JavaScript Deep Dive',notes:'<p>Closures, prototypes, event loop, promises, async/await. ES6+ features.</p>'},
    ]},
  { cid:'u-calc', subject:'Mathematics', name:'Calculus', icon:'📊', color:'#f59e0b', level:'university',
    description:'Limits, derivatives, integrals, and differential equations',
    topics:[
      {tid:'ucl1',name:'Limits & Continuity',notes:'<p>lim(x→a) f(x). L\'Hôpital\'s rule. Continuity at a point and on intervals.</p>'},
      {tid:'ula1',name:'Vectors & Spaces',notes:'<p>Vectors in Rⁿ. Linear independence, span, basis. Vector spaces and subspaces.</p>'},
    ]},
];

// Add video URLs
function addVideos(courses) {
  courses.forEach(c => {
    c.topics.forEach(t => {
      if (VIDEOS[t.tid]) t.videoUrl = VIDEOS[t.tid];
    });
  });
}
addVideos(SCHOOL_COURSES);
addVideos(UNI_COURSES);

// Questions
const QUESTIONS = [
  // Math
  {topicId:'smf1',courseId:'s-math-foundation',question:'Which of these is an irrational number?',options:['3/4','0.5','√2','7'],correct:2,explanation:'√2 cannot be expressed as p/q, making it irrational.',difficulty:'easy'},
  {topicId:'smf1',courseId:'s-math-foundation',question:'Natural numbers start from?',options:['0','1','-1','0.5'],correct:1,explanation:'Natural numbers are counting numbers starting from 1.',difficulty:'easy'},
  {topicId:'smf1',courseId:'s-math-foundation',question:'Which set includes negative numbers?',options:['Natural','Whole','Integers','None'],correct:2,explanation:'Integers include negative numbers, zero, and positive numbers.',difficulty:'medium'},
  {topicId:'sma2',courseId:'s-math-algebra',question:'Solve: 2x + 6 = 0',options:['x = 3','x = -3','x = 6','x = -6'],correct:1,explanation:'2x = -6, so x = -3.',difficulty:'easy'},
  {topicId:'sma2',courseId:'s-math-algebra',question:'What is the slope of y = 3x + 5?',options:['5','3','8','15'],correct:1,explanation:'In y = mx + c, slope m = 3.',difficulty:'medium'},
  {topicId:'sma3',courseId:'s-math-algebra',question:'Discriminant of x²-4x+4=0?',options:['0','16','8','-16'],correct:0,explanation:'D = b²-4ac = 16-16 = 0. Equal roots.',difficulty:'hard'},
  // Physics
  {topicId:'spb3',courseId:'s-phys-basics',question:'SI unit of velocity?',options:['m/s','km/h','m/s²','N'],correct:0,explanation:'Velocity is displacement/time = m/s in SI.',difficulty:'easy'},
  {topicId:'spb4',courseId:'s-phys-basics',question:'F = ma is Newton\'s which law?',options:['First','Second','Third','None'],correct:1,explanation:'Newton\'s Second Law: Force equals mass times acceleration.',difficulty:'easy'},
  {topicId:'spb4',courseId:'s-phys-basics',question:'Inertia depends on?',options:['Velocity','Mass','Acceleration','Shape'],correct:1,explanation:'Inertia is the resistance to change in motion, depends on mass.',difficulty:'medium'},
  {topicId:'spm1',courseId:'s-phys-basics',question:'KE formula?',options:['½mv²','mgh','Fd','mv'],correct:0,explanation:'Kinetic Energy = ½ × mass × velocity².',difficulty:'easy'},
  // Chemistry
  {topicId:'scb1',courseId:'s-chem-basic',question:'Which is a pure substance?',options:['Salt water','Air','Gold','Milk'],correct:2,explanation:'Gold is an element — a pure substance.',difficulty:'easy'},
  {topicId:'scb1',courseId:'s-chem-basic',question:'Smallest unit of an element?',options:['Molecule','Cell','Atom','Electron'],correct:2,explanation:'An atom is the smallest unit that retains the properties of an element.',difficulty:'medium'},
  // Biology
  {topicId:'sbh1',courseId:'s-bio-human',question:'Where does digestion begin?',options:['Stomach','Small intestine','Mouth','Esophagus'],correct:2,explanation:'Digestion starts in the mouth with saliva and chewing.',difficulty:'easy'},
  {topicId:'sbg1',courseId:'s-bio-human',question:'DNA stands for?',options:['Deoxyribose Nucleic Acid','Deoxyribonucleic Acid','Dinucleotide Acid','None'],correct:1,explanation:'DNA = Deoxyribonucleic Acid.',difficulty:'easy'},
  // CS
  {topicId:'spy1',courseId:'s-cs-python',question:'print(type(3.14)) outputs?',options:["<class 'int'>","<class 'float'>","<class 'str'>","Error"],correct:1,explanation:'3.14 is a floating-point number.',difficulty:'easy'},
  {topicId:'spy1',courseId:'s-cs-python',question:'Which keyword defines a function?',options:['func','function','def','define'],correct:2,explanation:'In Python, functions are defined using the "def" keyword.',difficulty:'easy'},
  {topicId:'scw3',courseId:'s-cs-python',question:'document.getElementById is part of?',options:['CSS','HTML','DOM API','Python'],correct:2,explanation:'DOM API allows JavaScript to interact with HTML elements.',difficulty:'medium'},
  // University - DSA
  {topicId:'uds1',courseId:'u-dsa',question:'Array access by index is?',options:['O(n)','O(log n)','O(1)','O(n²)'],correct:2,explanation:'Direct index access is constant time O(1).',difficulty:'easy'},
  {topicId:'uds1',courseId:'u-dsa',question:'Worst case of linear search?',options:['O(1)','O(log n)','O(n)','O(n²)'],correct:2,explanation:'Linear search checks each element — O(n) worst case.',difficulty:'medium'},
  {topicId:'uds5',courseId:'u-dsa',question:'BFS uses which data structure?',options:['Stack','Queue','Heap','Tree'],correct:1,explanation:'BFS uses a queue for level-order traversal.',difficulty:'medium'},
  {topicId:'uds5',courseId:'u-dsa',question:'Time complexity of DFS?',options:['O(V)','O(E)','O(V+E)','O(V²)'],correct:2,explanation:'DFS visits all vertices and edges: O(V+E).',difficulty:'hard'},
  // ML
  {topicId:'uml1',courseId:'u-ml',question:'Which is supervised learning?',options:['Clustering','Classification','Dimensionality reduction','Anomaly detection'],correct:1,explanation:'Classification uses labeled data — supervised learning.',difficulty:'easy'},
  {topicId:'udl1',courseId:'u-ml',question:'Activation function that outputs 0 or 1?',options:['ReLU','Sigmoid','Step','Tanh'],correct:2,explanation:'Step function outputs 0 below threshold, 1 above.',difficulty:'medium'},
  // Python/JS
  {topicId:'up1',courseId:'u-python',question:'What does a decorator do?',options:['Loops','Modifies a function','Creates a class','Handles errors'],correct:1,explanation:'Decorators wrap a function to modify its behavior.',difficulty:'medium'},
  {topicId:'ujs1',courseId:'u-python',question:'What is a closure?',options:['A loop','A function with its scope','A class','An error'],correct:1,explanation:'A closure is a function that captures variables from its enclosing scope.',difficulty:'hard'},
  // Calculus
  {topicId:'ucl1',courseId:'u-calc',question:'lim(x→0) sin(x)/x = ?',options:['0','1','∞','Undefined'],correct:1,explanation:'This is a fundamental limit: lim sin(x)/x = 1 as x→0.',difficulty:'medium'},
  {topicId:'ula1',courseId:'u-calc',question:'Two vectors are orthogonal if their dot product is?',options:['1','0','-1','∞'],correct:1,explanation:'Orthogonal vectors have a dot product of zero.',difficulty:'easy'},
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await Course.deleteMany({});
    await Question.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert courses
    const allCourses = [...SCHOOL_COURSES, ...UNI_COURSES];
    await Course.insertMany(allCourses);
    console.log(`📚 Inserted ${allCourses.length} courses`);

    // Insert questions
    await Question.insertMany(QUESTIONS);
    console.log(`❓ Inserted ${QUESTIONS.length} questions`);

    console.log('\n✅ Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
