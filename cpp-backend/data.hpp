#pragma once
#include <string>
#include <vector>
#include <map>

// --- Models ---
struct Topic {
    std::string id;
    std::string name;
    std::string notes;
};

struct Course {
    std::string id;
    std::string subject;
    std::string name;
    std::string icon;
    std::string color;
    std::string description;
    std::vector<Topic> topics;
};

struct User {
    std::string id;
    std::string name;
    std::string email;
    int xp;
};

// --- Repository ---
class DataRepo {
public:
    static std::vector<Course> getSchoolCourses() {
        std::vector<Course> courses;
        
        // Mathematics
        Course math;
        math.id = "s-math-foundation";
        math.subject = "Mathematics";
        math.name = "Foundation Mathematics Course";
        math.icon = "🔢";
        math.color = "#3b82f6";
        math.description = "Build a strong base in numbers and basic operations.";
        math.topics.push_back({"smf1", "Number Systems", "<p>Basics of Natural, Whole numbers and Integers.</p>"});
        math.topics.push_back({"smf2", "Fractions & Decimals", "<p>Understanding parts of a whole.</p>"});
        courses.push_back(math);

        // Physics
        Course phys;
        phys.id = "s-phys-basics";
        phys.subject = "Physics";
        phys.name = "Basics of Physics";
        phys.icon = "⚡";
        phys.color = "#f59e0b";
        phys.description = "Fundamental concepts: units and measurements.";
        phys.topics.push_back({"spb1", "Units & Measurements", "<p>SI units and dimensional analysis.</p>"});
        courses.push_back(phys);

        return courses;
    }

    static std::vector<Course> getUniCourses() {
        std::vector<Course> courses;

        // Programming
        Course cpp;
        cpp.id = "u-prog-cpp";
        cpp.subject = "Programming";
        cpp.name = "C++ Programming Mastery";
        cpp.icon = "➕";
        cpp.color = "#3b82f6";
        cpp.description = "Object-oriented programming with C++ and STL.";
        cpp.topics.push_back({"ucpp1", "C++ Fundamentals", "<p>Namespaces, references and cin/cout basics.</p>"});
        cpp.topics.push_back({"ucpp2", "Classes & Objects", "<p>The core of OOP: abstraction and encapsulation.</p>"});
        courses.push_back(cpp);

        return courses;
    }
};
