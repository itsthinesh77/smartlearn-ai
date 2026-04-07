#define _WIN32_WINNT 0x0A00
#define WIN32_LEAN_AND_MEAN
#include <winsock2.h>
#include <ws2tcpip.h>
#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include "data.hpp"
#include "persistence.hpp"

#pragma comment(lib, "ws2_32.lib")

using namespace std;

// --- Helper: CORS Headers ---
string get_cors_response(int status, string content_type, string body) {
    stringstream ss;
    ss << "HTTP/1.1 " << status << " OK\r\n";
    ss << "Content-Type: " << content_type << "\r\n";
    ss << "Access-Control-Allow-Origin: *\r\n";
    ss << "Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT\r\n";
    ss << "Access-Control-Allow-Headers: Content-Type, Authorization\r\n";
    ss << "Content-Length: " << body.length() << "\r\n\r\n";
    ss << body;
    return ss.str();
}

string get_courses_json(string level) {
    vector<Course> courses;
    if (level == "school") courses = DataRepo::getSchoolCourses();
    else if (level == "university") courses = DataRepo::getUniCourses();
    else {
        auto s = DataRepo::getSchoolCourses();
        auto u = DataRepo::getUniCourses();
        courses.insert(courses.end(), s.begin(), s.end());
        courses.insert(courses.end(), u.begin(), u.end());
    }

    string json = "[";
    for (size_t i = 0; i < courses.size(); i++) {
        json += "{\"id\":\"" + courses[i].id + "\",\"subject\":\"" + courses[i].subject + "\",\"name\":\"" + courses[i].name + "\",\"icon\":\"" + courses[i].icon + "\",\"color\":\"" + courses[i].color + "\",\"description\":\"" + courses[i].description + "\",\"topics\":[";
        for (size_t j = 0; j < courses[i].topics.size(); j++) {
            json += "{\"id\":\"" + courses[i].topics[j].id + "\",\"name\":\"" + courses[i].topics[j].name + "\",\"notes\":\"" + courses[i].topics[j].notes + "\"}";
            if (j < courses[i].topics.size() - 1) json += ",";
        }
        json += "]}";
        if (i < courses.size() - 1) json += ",";
    }
    json += "]";
    return json;
}

void handle_client(SOCKET client) {
    char buffer[16384];
    int bytesReceived = recv(client, buffer, sizeof(buffer) - 1, 0);
    if (bytesReceived <= 0) return;
    buffer[bytesReceived] = '\0';
    string request(buffer);
    
    // Simple header parsing
    stringstream ss(request);
    string method, path, protocol;
    ss >> method >> path >> protocol;
    
    cout << "Incoming " << method << " " << path << endl;

    // OPTIONS preflight
    if (method == "OPTIONS") {
        string response = "HTTP/1.1 200 OK\r\n"
                          "Access-Control-Allow-Origin: *\r\n"
                          "Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT\r\n"
                          "Access-Control-Allow-Headers: Content-Type, Authorization\r\n"
                          "Content-Length: 0\r\n\r\n";
        send(client, response.c_str(), response.length(), 0);
        return;
    }

    // Body parsing
    string body = "";
    size_t body_pos = request.find("\r\n\r\n");
    if (body_pos != string::npos) {
        body = request.substr(body_pos + 4);
    }

    string response_json = "";
    int res_status = 200;

    // --- Routing ---
    if (path.find("/api/courses") != string::npos) {
        string level = "all";
        if (path.find("level=school") != string::npos) level = "school";
        else if (path.find("level=university") != string::npos) level = "university";
        response_json = get_courses_json(level);
    } 
    else if (path == "/api/auth/register") {
        string email = JsonHelper::get_value(body, "email");
        string password = JsonHelper::get_value(body, "password");
        string name = JsonHelper::get_value(body, "name");
        
        string users_json = Persistence::read_file("users.json");
        if (users_json.find("\"email\":\"" + email + "\"") != string::npos) {
            res_status = 400;
            response_json = "{\"error\":\"User already exists\"}";
        } else {
            string id = "user_" + Persistence::generate_id();
            string entry = "{\"id\":\"" + id + "\",\"email\":\"" + email + "\",\"password\":\"" + password + "\",\"name\":\"" + name + "\",\"xp\":0,\"education_level\":\"Beginner\"}";
            if (users_json == "[]" || users_json.empty()) users_json = "[" + entry + "]";
            else { 
                if (users_json.back() == ']') users_json.pop_back();
                users_json += "," + entry + "]"; 
            }
            Persistence::write_file("users.json", users_json);
            response_json = "{\"status\":\"success\",\"user\":{\"id\":\"" + id + "\",\"name\":\"" + name + "\"}}";
        }
    }
    else if (path == "/api/auth/login") {
        string email = JsonHelper::get_value(body, "email");
        string password = JsonHelper::get_value(body, "password");
        string users_json = Persistence::read_file("users.json");
        size_t email_pos = users_json.find("\"email\":\"" + email + "\"");
        if (email_pos != string::npos) {
            size_t obj_start = users_json.rfind('{', email_pos);
            size_t obj_end = users_json.find('}', email_pos);
            string user_obj = users_json.substr(obj_start, obj_end - obj_start + 1);
            if (user_obj.find("\"password\":\"" + password + "\"") != string::npos) {
                string id = JsonHelper::get_value(user_obj, "id");
                string name = JsonHelper::get_value(user_obj, "name");
                string xp = JsonHelper::get_value(user_obj, "xp");
                string edu_level = JsonHelper::get_value(user_obj, "education_level");
                response_json = "{\"status\":\"success\",\"user\":{\"id\":\"" + id + "\",\"name\":\"" + name + "\",\"xp\":" + (xp.empty() ? "0" : xp) + ",\"education_level\":\"" + edu_level + "\"}}";
            } else { res_status = 401; response_json = "{\"error\":\"Invalid password\"}"; }
        } else { res_status = 404; response_json = "{\"error\":\"User not found\"}"; }
    }
    else if (path == "/api/quiz/save") {
        string results_json = Persistence::read_file("results.json");
        if (results_json == "[]" || results_json.empty()) results_json = "[" + body + "]";
        else { 
            if (results_json.back() == ']') results_json.pop_back();
            results_json += "," + body + "]"; 
        }
        Persistence::write_file("results.json", results_json);
        response_json = "{\"status\":\"success\"}";
    }
    else if (path == "/api/quiz/results") {
        response_json = Persistence::read_file("results.json");
    }
    else if (path == "/api/profiles/update") {
        response_json = "{\"status\":\"success\"}";
    }
    else {
        res_status = 404;
        response_json = "{\"error\":\"Not found\"}";
    }

    string response = get_cors_response(res_status, "application/json", response_json);
    send(client, response.c_str(), response.length(), 0);
}

int main() {
    WSAData wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) return 1;

    SOCKET server = socket(AF_INET, SOCK_STREAM, 0);
    sockaddr_in addr;
    addr.sin_family = AF_INET;
    addr.sin_port = htons(5000);
    addr.sin_addr.s_addr = INADDR_ANY;

    if (bind(server, (struct sockaddr*)&addr, sizeof(addr)) == SOCKET_ERROR) {
        cout << "Bind failed: " << WSAGetLastError() << endl;
        return 1;
    }

    listen(server, 5);
    cout << "🚀 SmartLearn Native C++ Backend running on port 5000 (Manual Winsock Mode)..." << endl;

    while (true) {
        SOCKET client = accept(server, NULL, NULL);
        if (client != INVALID_SOCKET) {
            handle_client(client);
            closesocket(client);
        }
    }

    WSACleanup();
    return 0;
}
