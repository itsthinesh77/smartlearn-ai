# C++ Backend Guide (Native Version) 🚀

I have updated your backend to use **Native Windows Sockets**. 
**Good news**: You no longer need to download ANY external libraries (no Crow, no httplib). It uses only the core C++ that comes with your computer!

## Prerequisites
1.  **C++ Compiler**: You have `g++` (TDM-GCC) already.
2.  **Files**: You only need `main.cpp` and `data.hpp` (which are already in the folder).

## How to Compile (Windows)
Open your terminal in the `cpp-backend` folder and run this command:
```bash
g++ main.cpp -o server.exe -lws2_32
```

## How to Run
1.  Run the generated `server.exe`.
2.  The terminal will show: `🚀 SmartLearn Native C++ Backend running on port 5000...`
3.  Open the website (`index.html`) in your browser. 

## Why this is better?
This is "Bare-Metal" C++. It doesn't rely on third-party code, which makes it faster and much more impressive for a student project!

## How to Run
1.  Run the generated `server.exe`.
2.  The terminal will show: `🚀 SmartLearn C++ Backend running on port 5000...`
3.  Open the website (`index.html`) in your browser. 
4.  The website will now automatically use the **C++ Server** for Login and Courses!

## Verify it's working
Check your browser console (F12). You will see messages like:
- `✅ Authenticated via C++ Backend`
- `📚 Loaded courses from C++ Backend`
