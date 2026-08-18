USE studyflow;

-- Insert Users
INSERT INTO users (id, name, email, password, program, semester, theme_preference) VALUES 
(1, 'Riyan Shrestha', 'riyan@studyflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bachelor of Computer Applications', 'Fall 2024', 'dark'),
(2, 'Demo Student', 'demo@studyflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Computer Science', 'Fall 2024', 'light');

-- Insert Courses for User 1 (Riyan)
INSERT INTO courses (id, user_id, name, description, instructor, semester, start_date, end_date, progress, status) VALUES 
(1, 1, 'Web Development Fundamentals', 'Core concepts of modern web development including HTML5, CSS3, JavaScript, and React.', 'Dr. Sarah Johnson', 'Fall 2024', '2024-08-15', '2024-12-15', 65, 'active'),
(2, 1, 'UX Evaluation Methods', 'Techniques for evaluating user interfaces including heuristic evaluation, usability testing, and cognitive walkthroughs.', 'Prof. Michael Chen', 'Fall 2024', '2024-08-16', '2024-12-14', 40, 'active'),
(3, 1, 'Database Systems', 'Relational database design, SQL, normalization, and an introduction to NoSQL databases.', 'Dr. Emily Watson', 'Fall 2024', '2024-08-15', '2024-12-16', 75, 'active'),
(4, 1, 'Data Structures & Algorithms', 'Fundamental data structures and algorithm analysis, big-O notation, sorting, and searching.', 'Prof. James Williams', 'Fall 2024', '2024-08-17', '2024-12-18', 50, 'active'),
(5, 1, 'Operating Systems', 'Principles of operating systems, process management, memory management, and file systems.', 'Dr. Robert Brown', 'Fall 2024', '2024-08-14', '2024-12-10', 100, 'completed');

-- Insert Tasks for User 1
-- Overdue (past dates relative to typical Fall mid-semester e.g., October 2024)
INSERT INTO tasks (user_id, course_id, title, description, priority, status, due_date) VALUES 
(1, 1, 'Complete React Components Lab', 'Finish the laboratory exercises focusing on state and props in React.', 'high', 'completed', '2024-09-15 23:59:00'),
(1, 2, 'Complete Heuristic Evaluation Report', 'Apply Nielsen''s 10 heuristics to the target website and document findings.', 'medium', 'completed', '2024-09-20 17:00:00'),
(1, 5, 'Review OS Chapter 5', 'Read and summarize the chapter on process synchronization.', 'low', 'completed', '2024-09-25 10:00:00'),
(1, 3, 'Design Database ER Diagram', 'Create an Entity-Relationship diagram for the final project database schema.', 'high', 'pending', '2024-10-01 23:59:00'),

-- Due soon (relative to mid-October)
(1, 4, 'Implement Binary Search Tree', 'Write the implementation of a BST in Java with insert, delete, and search operations.', 'high', 'in-progress', '2024-10-15 23:59:00'),
(1, 3, 'Study for Database Midterm', 'Review chapters 1-6 and practice SQL queries.', 'high', 'in-progress', '2024-10-18 09:00:00'),
(1, 1, 'Submit Web Dev Portfolio', 'Deploy the personal portfolio website and submit the GitHub repository link.', 'medium', 'pending', '2024-10-20 23:59:00'),
(1, 5, 'Read OS Memory Management', 'Read chapters on paging and segmentation before the next lecture.', 'low', 'pending', '2024-10-22 14:00:00'),

-- Future tasks
(1, 2, 'Write UX Research Paper', 'Draft the final research paper on the evolution of user interface paradigms.', 'medium', 'pending', '2024-11-10 23:59:00'),
(1, 3, 'Practice SQL Joins Exercises', 'Complete the online exercises for INNER, LEFT, RIGHT, and FULL OUTER JOINs.', 'low', 'pending', '2024-10-30 23:59:00'),
(1, 4, 'Prepare DSA Presentation', 'Create slides for the group presentation on graph traversal algorithms.', 'medium', 'pending', '2024-11-15 11:00:00'),
(1, 1, 'Build REST API Project', 'Develop a simple Express.js REST API with CRUD operations.', 'high', 'pending', '2024-11-20 23:59:00');

-- Insert Assignments for User 1
INSERT INTO assignments (user_id, course_id, title, description, priority, status, due_date, grade) VALUES 
(1, 1, 'Portfolio Website Project', 'Create a responsive personal portfolio using HTML, CSS, and vanilla JS.', 'high', 'completed', '2024-09-25 23:59:00', '95/100'),
(1, 2, 'Usability Testing Report', 'Conduct usability testing sessions with 5 users and write a comprehensive report.', 'high', 'in-progress', '2024-10-25 23:59:00', NULL),
(1, 3, 'Database Normalization Assignment', 'Normalize the given unnormalized table to 3NF and show all steps.', 'medium', 'completed', '2024-09-30 23:59:00', '88/100'),
(1, 4, 'Linked List Implementation', 'Implement singly and doubly linked lists with all basic operations.', 'high', 'completed', '2024-09-10 23:59:00', '92/100'),
(1, 5, 'Process Scheduling Simulation', 'Write a program to simulate FCFS, SJF, and Round Robin scheduling algorithms.', 'high', 'completed', '2024-10-05 23:59:00', '100/100'),
(1, 1, 'Full-Stack CRUD Application', 'Develop a full MERN stack application with user authentication.', 'high', 'pending', '2024-11-30 23:59:00', NULL),
(1, 2, 'User Interview Analysis', 'Analyze the transcripts from the user interviews and extract key insights using thematic analysis.', 'medium', 'pending', '2024-11-05 23:59:00', NULL),
(1, 3, 'SQL Query Optimization Lab', 'Analyze slow queries using EXPLAIN and optimize them using appropriate indexes.', 'medium', 'in-progress', '2024-10-22 23:59:00', NULL);

-- Insert Notes for User 1
INSERT INTO notes (user_id, course_id, title, content) VALUES 
(1, 1, 'React Component Lifecycle', 'React components go through a lifecycle of mounting, updating, and unmounting. \n\nIn functional components, we use the useEffect hook to tap into these phases. For example, useEffect with an empty dependency array [] runs only once on mount, mimicking componentDidMount. If we provide dependencies, it runs whenever those dependencies change, similar to componentDidUpdate. Returning a function from useEffect handles the unmounting cleanup phase (componentWillUnmount).'),
(1, 3, 'SQL JOIN Types Summary', 'Inner Join: Returns records that have matching values in both tables.\nLeft Join: Returns all records from the left table, and the matched records from the right table.\nRight Join: Returns all records from the right table, and the matched records from the left table.\nFull Outer Join: Returns all records when there is a match in either left or right table.\n\nIt''s crucial to use the correct join to avoid Cartesian products (Cross Join) which can severely degrade performance on large datasets.'),
(1, 4, 'Big-O Notation Cheat Sheet', 'O(1) - Constant Time: Accessing an array element by index.\nO(log n) - Logarithmic Time: Binary search in a sorted array.\nO(n) - Linear Time: Iterating through an array.\nO(n log n) - Linearithmic Time: Efficient sorting algorithms like Merge Sort and Quick Sort.\nO(n^2) - Quadratic Time: Simple sorting algorithms like Bubble Sort and Insertion Sort.\nO(2^n) - Exponential Time: Recursive calculation of Fibonacci numbers without memoization.\n\nAlways aim for algorithms with time complexities O(n log n) or better for large inputs.'),
(1, 2, 'Nielsen''s Heuristics Core Ideas', '1. Visibility of system status: Keep users informed about what is going on.\n2. Match between system and real world: Speak the users'' language.\n3. User control and freedom: Provide emergency exits (undo/redo).\n4. Consistency and standards: Follow platform conventions.\n5. Error prevention: Design to prevent problems from occurring in the first place.\n\nThese principles should be used as a checklist when designing any interactive system.'),
(1, 5, 'Deadlock Conditions', 'For a deadlock to occur, all four of these conditions must be met simultaneously:\n\n1. Mutual Exclusion: At least one resource must be non-sharable.\n2. Hold and Wait: A process is holding at least one resource and waiting to acquire additional resources held by other processes.\n3. No Preemption: Resources cannot be forcibly taken from a process; they must be released voluntarily.\n4. Circular Wait: A set of processes exists such that P0 is waiting for P1, P1 is waiting for P2... and Pn is waiting for P0.\n\nBreaking any one of these conditions prevents deadlocks.'),
(1, 1, 'CSS Grid vs Flexbox', 'Flexbox is designed for one-dimensional layouts - either in a row or a column. It is excellent for aligning items within a container and distributing space dynamically.\n\nCSS Grid is designed for two-dimensional layouts - rows and columns at the same time. It provides a more structured approach to building complex web pages.\n\nBest practice is often to use them together: use Grid for the overall page layout and Flexbox for the layout of items within the individual grid areas.');
