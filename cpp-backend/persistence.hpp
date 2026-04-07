#pragma once
#include <fstream>
#include <string>
#include <vector>
#include <iostream>
#include <sstream>
#include <algorithm>
#include <chrono>

// Very simple JSON string helper (not a full parser, but enough for our needs)
namespace JsonHelper {
    std::string get_value(const std::string& json, const std::string& key) {
        std::string search_key = "\"" + key + "\":\"";
        size_t start_pos = json.find(search_key);
        if (start_pos == std::string::npos) {
            // Try without quotes for numeric values
            search_key = "\"" + key + "\":";
            start_pos = json.find(search_key);
            if (start_pos == std::string::npos) return "";
            start_pos += search_key.length();
            size_t end_pos = json.find_first_of(",}", start_pos);
            return json.substr(start_pos, end_pos - start_pos);
        }
        start_pos += search_key.length();
        size_t end_pos = json.find("\"", start_pos);
        if (end_pos == std::string::npos) return "";
        return json.substr(start_pos, end_pos - start_pos);
    }

    std::string escape(const std::string& s) {
        std::string res;
        for (char c : s) {
            if (c == '\"') res += "\\\"";
            else if (c == '\\') res += "\\\\";
            else res += c;
        }
        return res;
    }
}

class Persistence {
public:
    static std::string read_file(const std::string& filename) {
        std::ifstream file(filename);
        if (!file.is_open()) return "[]";
        std::stringstream buffer;
        buffer << file.rdbuf();
        std::string content = buffer.str();
        return content.empty() ? "[]" : content;
    }

    static void write_file(const std::string& filename, const std::string& content) {
        std::ofstream file(filename);
        if (file.is_open()) {
            file << content;
        }
    }

    static std::string generate_id() {
        return std::to_string(std::chrono::system_clock::now().time_since_epoch().count());
    }
};
