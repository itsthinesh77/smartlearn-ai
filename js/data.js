// ===== Dummy Data for AI Smart Learning Platform =====

export const USERS = [
  { id: 1, username: 'alex_dev', email: 'alex@example.com', password: 'pass123', name: 'Alex Johnson', avatar: '🧑‍💻', role: 'student' },
  { id: 2, username: 'sara_ml', email: 'sara@example.com', password: 'pass123', name: 'Sara Williams', avatar: '👩‍🎓', role: 'student' },
  { id: 3, username: 'mike_cs', email: 'mike@example.com', password: 'pass123', name: 'Mike Chen', avatar: '👨‍💻', role: 'student' },
  { id: 4, username: 'admin', email: 'admin@example.com', password: 'admin123', name: 'Admin', avatar: '🛡️', role: 'admin' },
  { id: 5, username: 'priya_k', email: 'priya@example.com', password: 'pass123', name: 'Priya Kumar', avatar: '👩‍🔬', role: 'student' },
  { id: 6, username: 'james_w', email: 'james@example.com', password: 'pass123', name: 'James Wilson', avatar: '🧑‍🏫', role: 'student' },
  { id: 7, username: 'emily_r', email: 'emily@example.com', password: 'pass123', name: 'Emily Roberts', avatar: '👩‍💼', role: 'student' },
  { id: 8, username: 'david_t', email: 'david@example.com', password: 'pass123', name: 'David Thompson', avatar: '👨‍🎓', role: 'student' },
];

export const COURSES = [
  {
    id: 'ds',
    name: 'Data Structures',
    description: 'Master fundamental data structures used in computer science and software engineering.',
    icon: '🏗️',
    color: '#3b82f6',
    topics: [
      {
        id: 'ds-arrays',
        name: 'Arrays',
        notes: `<p><strong>Arrays</strong> are one of the most fundamental data structures. An array stores elements of the same type in contiguous memory locations.</p>
<p><strong>Key Operations:</strong></p>
<p>• <strong>Access</strong> — O(1) time complexity using index<br>• <strong>Search</strong> — O(n) for unsorted, O(log n) for sorted (binary search)<br>• <strong>Insert</strong> — O(n) worst case (shifting elements)<br>• <strong>Delete</strong> — O(n) worst case (shifting elements)</p>
<pre><code>// Example: Array declaration
int arr[5] = {10, 20, 30, 40, 50};

// Accessing element
int x = arr[2]; // x = 30

// Traversal
for (int i = 0; i < 5; i++) {
    printf("%d ", arr[i]);
}</code></pre>
<p><strong>Types of Arrays:</strong></p>
<p>• <strong>1D Array</strong> — Linear list of elements<br>• <strong>2D Array</strong> — Matrix-like structure with rows and columns<br>• <strong>Dynamic Array</strong> — Resizable arrays (e.g., ArrayList in Java, vector in C++)</p>
<p><strong>Applications:</strong> Storing lists, implementing stacks/queues, lookup tables, matrix operations.</p>`
      },
      {
        id: 'ds-ll',
        name: 'Linked Lists',
        notes: `<p><strong>Linked Lists</strong> are linear data structures where elements (nodes) are connected via pointers. Unlike arrays, elements are not stored in contiguous memory.</p>
<p><strong>Types:</strong></p>
<p>• <strong>Singly Linked List</strong> — Each node points to the next node<br>• <strong>Doubly Linked List</strong> — Each node points to both next and previous<br>• <strong>Circular Linked List</strong> — Last node points back to the first</p>
<pre><code>// Node structure
struct Node {
    int data;
    Node* next;
};

// Insertion at beginning
void insertFront(Node*& head, int val) {
    Node* newNode = new Node{val, head};
    head = newNode;
}</code></pre>
<p><strong>Key Operations:</strong></p>
<p>• <strong>Insert at head</strong> — O(1)<br>• <strong>Insert at tail</strong> — O(n) or O(1) with tail pointer<br>• <strong>Delete</strong> — O(n) to find, O(1) to remove<br>• <strong>Search</strong> — O(n)</p>
<p><strong>Advantages:</strong> Dynamic size, efficient insertion/deletion at known positions.<br><strong>Disadvantages:</strong> No random access, extra memory for pointers.</p>`
      },
      {
        id: 'ds-trees',
        name: 'Trees',
        notes: `<p><strong>Trees</strong> are hierarchical data structures consisting of nodes connected by edges. The topmost node is the <strong>root</strong>, and nodes with no children are <strong>leaves</strong>.</p>
<p><strong>Key Terminology:</strong></p>
<p>• <strong>Root</strong> — Top node of the tree<br>• <strong>Parent/Child</strong> — Relative node relationships<br>• <strong>Height</strong> — Longest path from root to a leaf<br>• <strong>Depth</strong> — Distance from root to a node</p>
<p><strong>Binary Search Tree (BST):</strong></p>
<pre><code>// BST Property: left < root < right
// Searching in BST
Node* search(Node* root, int key) {
    if (!root || root->data == key) return root;
    if (key < root->data) return search(root->left, key);
    return search(root->right, key);
}</code></pre>
<p><strong>Tree Traversals:</strong></p>
<p>• <strong>Inorder</strong> (Left, Root, Right) — gives sorted order for BST<br>• <strong>Preorder</strong> (Root, Left, Right) — useful for copying trees<br>• <strong>Postorder</strong> (Left, Right, Root) — useful for deletion<br>• <strong>Level Order</strong> — BFS traversal using queue</p>
<p><strong>Applications:</strong> File systems, databases (B-trees), expression parsing, decision trees in AI.</p>`
      },
      {
        id: 'ds-stacks',
        name: 'Stacks & Queues',
        notes: `<p><strong>Stack</strong> follows <strong>LIFO</strong> (Last In, First Out) principle. Think of a stack of plates.</p>
<p><strong>Stack Operations:</strong></p>
<p>• <code>push(x)</code> — Add element to top — O(1)<br>• <code>pop()</code> — Remove top element — O(1)<br>• <code>peek()</code> — View top element — O(1)</p>
<pre><code>// Stack using array
class Stack {
    int top = -1, arr[100];
    void push(int x) { arr[++top] = x; }
    int pop() { return arr[top--]; }
    int peek() { return arr[top]; }
};</code></pre>
<p><strong>Queue</strong> follows <strong>FIFO</strong> (First In, First Out) principle. Like a line at a ticket counter.</p>
<p><strong>Queue Variants:</strong></p>
<p>• <strong>Simple Queue</strong> — Basic FIFO<br>• <strong>Circular Queue</strong> — Wraps around to reuse space<br>• <strong>Priority Queue</strong> — Elements have priorities<br>• <strong>Deque</strong> — Insert/delete at both ends</p>
<p><strong>Applications:</strong> Undo operations (stack), BFS (queue), function call management (stack), scheduling (queue).</p>`
      },
      {
        id: 'ds-graphs',
        name: 'Graphs',
        notes: `<p><strong>Graphs</strong> consist of <strong>vertices (V)</strong> and <strong>edges (E)</strong> connecting them. They can be directed or undirected, weighted or unweighted.</p>
<p><strong>Representations:</strong></p>
<p>• <strong>Adjacency Matrix</strong> — 2D array, O(V²) space<br>• <strong>Adjacency List</strong> — Array of linked lists, O(V+E) space</p>
<pre><code>// Adjacency List representation
vector&lt;vector&lt;int&gt;&gt; adj(V);
adj[0].push_back(1); // edge 0 → 1
adj[1].push_back(2); // edge 1 → 2</code></pre>
<p><strong>Graph Traversals:</strong></p>
<p>• <strong>BFS</strong> (Breadth-First Search) — Uses queue, explores level by level<br>• <strong>DFS</strong> (Depth-First Search) — Uses stack/recursion, goes deep first</p>
<p><strong>Important Algorithms:</strong></p>
<p>• Dijkstra's — Shortest path (weighted)<br>• Bellman-Ford — Shortest path (negative weights)<br>• Kruskal's/Prim's — Minimum spanning tree<br>• Topological Sort — DAG ordering</p>`
      }
    ]
  },
  {
    id: 'dbms',
    name: 'DBMS',
    description: 'Learn database management systems, SQL, normalization, and transaction management.',
    icon: '🗄️',
    color: '#a855f7',
    topics: [
      {
        id: 'dbms-sql',
        name: 'SQL Basics',
        notes: `<p><strong>SQL (Structured Query Language)</strong> is the standard language for managing relational databases.</p>
<p><strong>Key SQL Commands:</strong></p>
<pre><code>-- DDL (Data Definition Language)
CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    age INT,
    grade CHAR(1)
);

-- DML (Data Manipulation Language)
INSERT INTO students VALUES (1, 'Alice', 20, 'A');
SELECT * FROM students WHERE age > 18;
UPDATE students SET grade = 'B' WHERE id = 1;
DELETE FROM students WHERE id = 1;</code></pre>
<p><strong>Types of SQL Commands:</strong></p>
<p>• <strong>DDL</strong> — CREATE, ALTER, DROP, TRUNCATE<br>• <strong>DML</strong> — SELECT, INSERT, UPDATE, DELETE<br>• <strong>DCL</strong> — GRANT, REVOKE<br>• <strong>TCL</strong> — COMMIT, ROLLBACK, SAVEPOINT</p>
<p><strong>Joins:</strong> INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN</p>`
      },
      {
        id: 'dbms-norm',
        name: 'Normalization',
        notes: `<p><strong>Normalization</strong> is the process of organizing a database to reduce redundancy and improve data integrity.</p>
<p><strong>Normal Forms:</strong></p>
<p><strong>1NF</strong> — Atomic values, no repeating groups<br><strong>2NF</strong> — 1NF + no partial dependencies<br><strong>3NF</strong> — 2NF + no transitive dependencies<br><strong>BCNF</strong> — Stricter version of 3NF</p>
<p><strong>Example:</strong></p>
<pre><code>-- Unnormalized
| StudentID | Name  | Courses         |
|-----------|-------|-----------------|
| 1         | Alice | Math, Science   |

-- 1NF (atomic values)
| StudentID | Name  | Course  |
|-----------|-------|---------|
| 1         | Alice | Math    |
| 1         | Alice | Science |</code></pre>
<p><strong>Benefits:</strong> Eliminates redundancy, prevents update anomalies, ensures data consistency.</p>
<p><strong>Denormalization:</strong> Sometimes intentionally added redundancy for read performance in data warehouses.</p>`
      },
      {
        id: 'dbms-txn',
        name: 'Transactions & ACID',
        notes: `<p><strong>Transaction</strong> is a logical unit of work that contains one or more SQL operations. It must be treated as an atomic unit.</p>
<p><strong>ACID Properties:</strong></p>
<p>• <strong>Atomicity</strong> — All or nothing execution<br>• <strong>Consistency</strong> — Database remains in valid state<br>• <strong>Isolation</strong> — Concurrent transactions don't interfere<br>• <strong>Durability</strong> — Committed changes are permanent</p>
<pre><code>BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 500 WHERE id = 1;
  UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;</code></pre>
<p><strong>Concurrency Problems:</strong></p>
<p>• Dirty Read • Non-repeatable Read • Phantom Read • Lost Update</p>
<p><strong>Isolation Levels:</strong> Read Uncommitted → Read Committed → Repeatable Read → Serializable</p>`
      },
      {
        id: 'dbms-indexing',
        name: 'Indexing',
        notes: `<p><strong>Indexing</strong> improves the speed of data retrieval operations at the cost of additional storage and write overhead.</p>
<p><strong>Types of Indexes:</strong></p>
<p>• <strong>Primary Index</strong> — On primary key, ordered file<br>• <strong>Secondary Index</strong> — On non-key attributes<br>• <strong>B-Tree Index</strong> — Balanced tree, most common<br>• <strong>Hash Index</strong> — Uses hash function, O(1) for equality</p>
<pre><code>-- Creating an index
CREATE INDEX idx_student_name ON students(name);

-- Composite index
CREATE INDEX idx_name_age ON students(name, age);

-- Unique index
CREATE UNIQUE INDEX idx_email ON students(email);</code></pre>
<p><strong>B+ Tree:</strong> Most widely used. All data in leaf nodes, internal nodes for routing. Supports range queries efficiently.</p>
<p><strong>Trade-offs:</strong> Faster reads ↔ Slower writes, More storage needed.</p>`
      }
    ]
  },
  {
    id: 'os',
    name: 'Operating Systems',
    description: 'Understand process management, memory management, file systems, and OS concepts.',
    icon: '⚙️',
    color: '#06b6d4',
    topics: [
      {
        id: 'os-process',
        name: 'Process Management',
        notes: `<p><strong>Process</strong> is a program in execution. It includes the program code, current activity, stack, heap, and data section.</p>
<p><strong>Process States:</strong></p>
<p>• <strong>New</strong> → <strong>Ready</strong> → <strong>Running</strong> → <strong>Terminated</strong><br>• Running → <strong>Waiting</strong> (I/O) → Ready</p>
<p><strong>Process vs Thread:</strong></p>
<p>• Process: Independent, own memory space, heavyweight<br>• Thread: Shares process memory, lightweight, faster context switch</p>
<p><strong>CPU Scheduling Algorithms:</strong></p>
<pre><code>// FCFS - First Come First Served
// SJF - Shortest Job First
// Round Robin - Time quantum based
// Priority Scheduling - Based on priority values
// Multilevel Queue - Multiple ready queues</code></pre>
<p><strong>Context Switching:</strong> Saving state of current process and loading state of next process. Overhead that reduces CPU efficiency.</p>`
      },
      {
        id: 'os-memory',
        name: 'Memory Management',
        notes: `<p><strong>Memory Management</strong> handles allocation and deallocation of memory to processes.</p>
<p><strong>Techniques:</strong></p>
<p>• <strong>Contiguous Allocation</strong> — Each process gets a single contiguous block<br>• <strong>Paging</strong> — Memory divided into fixed-size pages<br>• <strong>Segmentation</strong> — Memory divided into variable-size segments</p>
<p><strong>Virtual Memory:</strong></p>
<pre><code>// Page Table Entry
| Page Number | Frame Number | Valid Bit | Dirty Bit |
|-------------|-------------|-----------|-----------|
| 0           | 5           | 1         | 0         |
| 1           | 8           | 1         | 1         |
| 2           | -           | 0         | 0         |</code></pre>
<p><strong>Page Replacement Algorithms:</strong></p>
<p>• <strong>FIFO</strong> — Replace oldest page<br>• <strong>LRU</strong> — Replace least recently used<br>• <strong>Optimal</strong> — Replace page not needed for longest time</p>
<p><strong>Thrashing:</strong> When a process spends more time paging than executing. Solution: Working Set Model.</p>`
      },
      {
        id: 'os-deadlock',
        name: 'Deadlocks',
        notes: `<p><strong>Deadlock</strong> occurs when two or more processes are waiting for each other to release resources, creating a circular wait.</p>
<p><strong>Necessary Conditions (all four must hold):</strong></p>
<p>• <strong>Mutual Exclusion</strong> — Resource can only be held by one process<br>• <strong>Hold and Wait</strong> — Process holds resources while waiting for others<br>• <strong>No Preemption</strong> — Resources can't be forcibly taken<br>• <strong>Circular Wait</strong> — Circular chain of processes waiting</p>
<p><strong>Handling Deadlocks:</strong></p>
<p>• <strong>Prevention</strong> — Eliminate one of the four conditions<br>• <strong>Avoidance</strong> — Banker's Algorithm<br>• <strong>Detection</strong> — Resource Allocation Graph<br>• <strong>Recovery</strong> — Process termination or resource preemption</p>
<pre><code>// Banker's Algorithm - Safety Check
// Available = [3, 3, 2]
// Max demand, Allocation, Need matrices
// Check if safe sequence exists</code></pre>`
      },
      {
        id: 'os-filesys',
        name: 'File Systems',
        notes: `<p><strong>File System</strong> manages how data is stored and retrieved on disk. It provides a logical view over physical storage.</p>
<p><strong>File Allocation Methods:</strong></p>
<p>• <strong>Contiguous</strong> — Files stored in consecutive blocks, fast but fragmentation<br>• <strong>Linked</strong> — Each block points to next, no external fragmentation<br>• <strong>Indexed</strong> — Index block holds pointers to data blocks</p>
<p><strong>Directory Structures:</strong></p>
<p>• Single-level • Two-level • Tree-structured • Acyclic graph • General graph</p>
<p><strong>Common File Systems:</strong></p>
<p>• <strong>FAT32</strong> — Simple, widely supported, 4GB file limit<br>• <strong>NTFS</strong> — Windows default, journaling, large files<br>• <strong>ext4</strong> — Linux default, journaling, extents<br>• <strong>ZFS</strong> — Advanced, checksums, snapshots</p>
<p><strong>Disk Scheduling:</strong> FCFS, SSTF, SCAN (Elevator), C-SCAN, LOOK</p>`
      }
    ]
  }
];

export const QUESTIONS = [
  // Data Structures - Easy
  { id: 1, subject: 'ds', difficulty: 'easy', question: 'What is the time complexity of accessing an element in an array by index?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correct: 0, explanation: 'Arrays provide O(1) random access because elements are stored in contiguous memory and can be accessed directly using the index offset.' },
  { id: 2, subject: 'ds', difficulty: 'easy', question: 'Which data structure follows the LIFO (Last In First Out) principle?', options: ['Queue', 'Stack', 'Linked List', 'Tree'], correct: 1, explanation: 'A Stack follows LIFO — the last element added (pushed) is the first one to be removed (popped).' },
  { id: 3, subject: 'ds', difficulty: 'easy', question: 'What is the maximum number of children a node can have in a Binary Tree?', options: ['1', '2', '3', 'Unlimited'], correct: 1, explanation: 'In a binary tree, each node can have at most 2 children — a left child and a right child.' },
  { id: 4, subject: 'ds', difficulty: 'easy', question: 'Which traversal gives sorted output for a Binary Search Tree?', options: ['Preorder', 'Postorder', 'Inorder', 'Level order'], correct: 2, explanation: 'Inorder traversal (Left, Root, Right) of a BST gives elements in ascending sorted order.' },
  { id: 5, subject: 'ds', difficulty: 'easy', question: 'A queue follows which principle?', options: ['LIFO', 'FIFO', 'LILO', 'Random Access'], correct: 1, explanation: 'Queue follows FIFO (First In First Out) — the first element enqueued is the first to be dequeued.' },
  // Data Structures - Medium
  { id: 6, subject: 'ds', difficulty: 'medium', question: 'What is the worst-case time complexity of inserting an element at the beginning of an array?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correct: 2, explanation: 'Inserting at the beginning requires shifting all existing elements one position to the right, which takes O(n) time.' },
  { id: 7, subject: 'ds', difficulty: 'medium', question: 'Which of the following is NOT an application of a stack?', options: ['Function call management', 'Expression evaluation', 'BFS traversal', 'Undo operation'], correct: 2, explanation: 'BFS (Breadth-First Search) uses a Queue, not a Stack. DFS uses a Stack.' },
  { id: 8, subject: 'ds', difficulty: 'medium', question: 'In a doubly linked list, each node contains how many pointers?', options: ['0', '1', '2', '3'], correct: 2, explanation: 'Each node in a doubly linked list has two pointers: one to the next node and one to the previous node.' },
  { id: 9, subject: 'ds', difficulty: 'medium', question: 'What is the height of a balanced BST with n nodes?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1, explanation: 'A balanced BST has a height of O(log n), ensuring efficient search, insert, and delete operations.' },
  { id: 10, subject: 'ds', difficulty: 'medium', question: 'Which algorithm is used to find the shortest path in a weighted graph?', options: ['DFS', 'BFS', 'Dijkstra\'s', 'Kruskal\'s'], correct: 2, explanation: 'Dijkstra\'s algorithm finds the shortest path from a source to all other vertices in a weighted graph with non-negative edges.' },
  // Data Structures - Hard
  { id: 11, subject: 'ds', difficulty: 'hard', question: 'What is the amortized time complexity of inserting into a dynamic array?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n log n)'], correct: 1, explanation: 'While occasional resizing takes O(n), the amortized cost per insertion is O(1) because resizing happens infrequently (doubling strategy).' },
  { id: 12, subject: 'ds', difficulty: 'hard', question: 'Which data structure is most efficient for implementing a priority queue?', options: ['Array', 'Linked List', 'Binary Heap', 'Stack'], correct: 2, explanation: 'A Binary Heap provides O(log n) insert and extract-min/max operations, making it ideal for priority queues.' },
  { id: 13, subject: 'ds', difficulty: 'hard', question: 'In a Red-Black tree, what is the maximum ratio of the longest path to the shortest path?', options: ['1:1', '2:1', '3:1', 'n:1'], correct: 1, explanation: 'In a Red-Black tree, the longest path is at most twice the shortest path, guaranteed by the red-black properties.' },
  { id: 14, subject: 'ds', difficulty: 'hard', question: 'What is the time complexity of Kruskal\'s algorithm with union-find optimization?', options: ['O(V²)', 'O(E log E)', 'O(VE)', 'O(V + E)'], correct: 1, explanation: 'Kruskal\'s algorithm sorts edges (O(E log E)) and uses union-find for cycle detection. The dominant factor is the sorting step.' },
  { id: 15, subject: 'ds', difficulty: 'hard', question: 'Which self-balancing BST guarantees O(log n) for all operations?', options: ['Binary Search Tree', 'AVL Tree', 'Skip List', 'Splay Tree'], correct: 1, explanation: 'AVL trees maintain strict balance (height difference ≤ 1), guaranteeing O(log n) worst-case for search, insert, and delete.' },

  // DBMS - Easy
  { id: 16, subject: 'dbms', difficulty: 'easy', question: 'Which SQL command is used to retrieve data from a database?', options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], correct: 2, explanation: 'SELECT is the DML command used to query and retrieve data from database tables.' },
  { id: 17, subject: 'dbms', difficulty: 'easy', question: 'What does ACID stand for in database transactions?', options: ['Atomicity, Consistency, Isolation, Durability', 'Addition, Computation, Iteration, Deletion', 'Access, Control, Integrity, Design', 'Atomicity, Control, Isolation, Design'], correct: 0, explanation: 'ACID stands for Atomicity, Consistency, Isolation, Durability — the four key properties of database transactions.' },
  { id: 18, subject: 'dbms', difficulty: 'easy', question: 'Which normal form eliminates repeating groups?', options: ['2NF', '3NF', '1NF', 'BCNF'], correct: 2, explanation: 'First Normal Form (1NF) requires that all attributes contain only atomic (indivisible) values and eliminates repeating groups.' },
  { id: 19, subject: 'dbms', difficulty: 'easy', question: 'What type of key uniquely identifies each row in a table?', options: ['Foreign Key', 'Candidate Key', 'Primary Key', 'Super Key'], correct: 2, explanation: 'A Primary Key uniquely identifies each row in a table. It must be unique and cannot contain NULL values.' },
  { id: 20, subject: 'dbms', difficulty: 'easy', question: 'Which SQL clause is used to filter rows?', options: ['ORDER BY', 'GROUP BY', 'WHERE', 'HAVING'], correct: 2, explanation: 'The WHERE clause is used to filter rows based on specified conditions before grouping.' },
  // DBMS - Medium
  { id: 21, subject: 'dbms', difficulty: 'medium', question: 'Which type of JOIN returns all rows from both tables, matching where possible?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], correct: 3, explanation: 'FULL OUTER JOIN returns all rows from both tables, with NULL values where there is no match.' },
  { id: 22, subject: 'dbms', difficulty: 'medium', question: 'What is denormalization?', options: ['Removing all redundancy', 'Adding controlled redundancy for performance', 'Converting to 1NF', 'Deleting unused tables'], correct: 1, explanation: 'Denormalization is the intentional introduction of redundancy to improve read performance, often used in data warehouses.' },
  { id: 23, subject: 'dbms', difficulty: 'medium', question: 'Which isolation level prevents dirty reads but allows phantom reads?', options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'], correct: 1, explanation: 'Read Committed prevents dirty reads (reading uncommitted data) but still allows phantom reads and non-repeatable reads.' },
  { id: 24, subject: 'dbms', difficulty: 'medium', question: 'In a B+ tree index, where is the actual data stored?', options: ['Root nodes', 'Internal nodes', 'Leaf nodes', 'All nodes'], correct: 2, explanation: 'In a B+ tree, all actual data/record pointers are stored in leaf nodes. Internal nodes only contain keys for routing.' },
  { id: 25, subject: 'dbms', difficulty: 'medium', question: 'What is a view in SQL?', options: ['A physical table', 'A stored query that acts as a virtual table', 'An index', 'A trigger'], correct: 1, explanation: 'A view is a virtual table based on a stored SQL query. It doesn\'t store data itself but provides a way to simplify complex queries.' },
  // DBMS - Hard
  { id: 26, subject: 'dbms', difficulty: 'hard', question: 'Which concurrency control protocol uses timestamps to order transactions?', options: ['Two-Phase Locking', 'Timestamp Ordering', 'Optimistic Concurrency', 'MVCC'], correct: 1, explanation: 'Timestamp Ordering Protocol assigns timestamps to transactions and uses them to determine the serialization order.' },
  { id: 27, subject: 'dbms', difficulty: 'hard', question: 'What is the primary advantage of MVCC (Multi-Version Concurrency Control)?', options: ['Uses less memory', 'Readers don\'t block writers', 'Simpler implementation', 'Faster writes'], correct: 1, explanation: 'MVCC allows readers and writers to operate concurrently without blocking each other by maintaining multiple versions of data.' },
  { id: 28, subject: 'dbms', difficulty: 'hard', question: 'In BCNF, every determinant must be a:', options: ['Foreign key', 'Candidate key', 'Primary key', 'Super key'], correct: 1, explanation: 'BCNF (Boyce-Codd Normal Form) requires that every determinant (attribute that determines another) must be a candidate key.' },
  { id: 29, subject: 'dbms', difficulty: 'hard', question: 'Which recovery technique uses both undo and redo operations?', options: ['Deferred update', 'Immediate update', 'Shadow paging', 'Checkpointing only'], correct: 1, explanation: 'Immediate update (ARIES-style) may need both undo (for uncommitted transactions) and redo (for committed transactions) during recovery.' },
  { id: 30, subject: 'dbms', difficulty: 'hard', question: 'What is the maximum number of candidate keys possible for a relation with n attributes?', options: ['n', '2^n', 'n!', '2^n - 1'], correct: 3, explanation: 'A candidate key can be any non-empty subset of attributes, so the maximum is 2^n - 1 (all non-empty subsets). In practice, many subsets won\'t be minimal.' },

  // OS - Easy
  { id: 31, subject: 'os', difficulty: 'easy', question: 'Which of the following is NOT a state of a process?', options: ['Ready', 'Running', 'Sleeping', 'Waiting'], correct: 2, explanation: 'The standard process states are: New, Ready, Running, Waiting (Blocked), and Terminated. "Sleeping" is not a standard state.' },
  { id: 32, subject: 'os', difficulty: 'easy', question: 'What is the main purpose of an Operating System?', options: ['Run applications', 'Manage hardware resources', 'Connect to internet', 'Store data'], correct: 1, explanation: 'The primary purpose of an OS is to manage hardware resources (CPU, memory, I/O) and provide services to applications.' },
  { id: 33, subject: 'os', difficulty: 'easy', question: 'Which scheduling algorithm can cause starvation?', options: ['FCFS', 'Round Robin', 'SJF', 'None of these'], correct: 2, explanation: 'Shortest Job First (SJF) can cause starvation because longer processes may wait indefinitely if shorter processes keep arriving.' },
  { id: 34, subject: 'os', difficulty: 'easy', question: 'What is virtual memory?', options: ['RAM', 'Cache memory', 'Disk space used as extended RAM', 'ROM'], correct: 2, explanation: 'Virtual memory uses disk space to extend the apparent amount of RAM available, allowing processes larger than physical memory to run.' },
  { id: 35, subject: 'os', difficulty: 'easy', question: 'Which is NOT a necessary condition for deadlock?', options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption', 'Circular Wait'], correct: 2, explanation: 'The four necessary conditions are: Mutual Exclusion, Hold and Wait, No Preemption (not Preemption), and Circular Wait.' },
  // OS - Medium
  { id: 36, subject: 'os', difficulty: 'medium', question: 'In Round Robin scheduling, what happens when a process\'s time quantum expires?', options: ['Process is terminated', 'Process moves to ready queue', 'Process gets more time', 'Process is blocked'], correct: 1, explanation: 'When a process\'s time quantum expires in Round Robin, it\'s preempted and moved to the back of the ready queue.' },
  { id: 37, subject: 'os', difficulty: 'medium', question: 'What is thrashing in OS?', options: ['CPU overheating', 'Excessive paging reducing performance', 'Too many processes', 'Disk failure'], correct: 1, explanation: 'Thrashing occurs when a system spends more time paging (swapping pages in/out of memory) than executing actual processes.' },
  { id: 38, subject: 'os', difficulty: 'medium', question: 'Which page replacement algorithm suffers from Belady\'s anomaly?', options: ['LRU', 'Optimal', 'FIFO', 'LFU'], correct: 2, explanation: 'FIFO page replacement can suffer from Belady\'s anomaly — increasing the number of frames can increase page faults.' },
  { id: 39, subject: 'os', difficulty: 'medium', question: 'What is the difference between a process and a thread?', options: ['Threads share memory, processes don\'t', 'Processes are faster', 'Threads can\'t run concurrently', 'No difference'], correct: 0, explanation: 'Threads within a process share the same memory space (code, data, heap), while processes have separate memory spaces.' },
  { id: 40, subject: 'os', difficulty: 'medium', question: 'Which disk scheduling algorithm works like an elevator?', options: ['FCFS', 'SSTF', 'SCAN', 'C-LOOK'], correct: 2, explanation: 'SCAN (Elevator Algorithm) moves the head in one direction, serving requests, then reverses — like an elevator.' },
  // OS - Hard
  { id: 41, subject: 'os', difficulty: 'hard', question: 'In Banker\'s Algorithm, what is the "safe state"?', options: ['No deadlock can occur', 'All processes are running', 'A safe sequence exists to finish all processes', 'Resources are fully allocated'], correct: 2, explanation: 'A safe state means there exists at least one sequence (safe sequence) in which all processes can finish executing without deadlock.' },
  { id: 42, subject: 'os', difficulty: 'hard', question: 'What is the purpose of TLB (Translation Lookaside Buffer)?', options: ['Store process states', 'Cache page table entries', 'Manage disk I/O', 'Schedule CPU'], correct: 1, explanation: 'TLB is a high-speed cache that stores recently used page table entries to speed up virtual-to-physical address translation.' },
  { id: 43, subject: 'os', difficulty: 'hard', question: 'Which of the following is used to achieve mutual exclusion in hardware?', options: ['Semaphores', 'Test-and-Set instruction', 'Monitors', 'Message passing'], correct: 1, explanation: 'Test-and-Set is a hardware instruction that atomically reads and modifies a memory location, used to implement mutual exclusion.' },
  { id: 44, subject: 'os', difficulty: 'hard', question: 'What is the maximum number of page faults possible with Optimal page replacement for n pages and m frames?', options: ['n', 'n - m', 'm', 'n × m'], correct: 0, explanation: 'Even with Optimal replacement, every page might cause a fault on first access (compulsory miss), giving a maximum of n faults.' },
  { id: 45, subject: 'os', difficulty: 'hard', question: 'In which scenario does a convoy effect occur?', options: ['SJF scheduling', 'FCFS scheduling', 'Priority scheduling', 'Round Robin'], correct: 1, explanation: 'Convoy effect occurs in FCFS when a long CPU-bound process holds the CPU, causing shorter processes to wait excessively in the queue.' },
];

export const LEADERBOARD_DATA = [
  { userId: 3, name: 'Mike Chen', avatar: '👨‍💻', score: 2850, quizzes: 24, accuracy: 92 },
  { userId: 5, name: 'Priya Kumar', avatar: '👩‍🔬', score: 2720, quizzes: 22, accuracy: 89 },
  { userId: 1, name: 'Alex Johnson', avatar: '🧑‍💻', score: 2580, quizzes: 20, accuracy: 85 },
  { userId: 2, name: 'Sara Williams', avatar: '👩‍🎓', score: 2340, quizzes: 18, accuracy: 82 },
  { userId: 7, name: 'Emily Roberts', avatar: '👩‍💼', score: 2180, quizzes: 17, accuracy: 80 },
  { userId: 6, name: 'James Wilson', avatar: '🧑‍🏫', score: 1960, quizzes: 15, accuracy: 78 },
  { userId: 8, name: 'David Thompson', avatar: '👨‍🎓', score: 1750, quizzes: 14, accuracy: 75 },
];

export function getQuestions(subject, difficulty, count = 5) {
  let pool = QUESTIONS.filter(q => q.subject === subject && q.difficulty === difficulty);
  // Shuffle and return requested count
  pool = pool.sort(() => Math.random() - 0.5);
  return pool.slice(0, count);
}

export function getCourseById(courseId) {
  return COURSES.find(c => c.id === courseId);
}

export function getTopicById(courseId, topicId) {
  const course = getCourseById(courseId);
  if (!course) return null;
  return course.topics.find(t => t.id === topicId);
}
