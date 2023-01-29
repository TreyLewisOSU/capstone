
from flask import Blueprint, request, make_response
from google.cloud import datastore
import json
import constants

APP_URL = 'https://osu-craft-center-capstone-f22.uw.r.appspot.com'

client = datastore.Client()

bp = Blueprint('student', __name__, url_prefix='/students')


def current_students_email_check(student_email):
    """
    check to see if the student email is in the datastore
    """
    current_student_emails = []
    query = client.query(kind=constants.students)
    results = list(query.fetch())
    print(results)

    for e in results:
        current_student_emails.append(e["email"])

    if student_email in current_student_emails:
        return True
    
    return False


@bp.route('', methods=['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'])
def students_get_post():
    if request.method == 'POST':
        # create a student based on given parameters, tell user if they don't have it correct
        content = request.get_json()
        new_student = datastore.entity.Entity(key=client.key(constants.students))
        if len(content) == 3:
            if current_students_email_check(content["email"]):
                return ({'Error': 'This student already exists'}, 403)

            new_student.update({"OSUID": content["OSUID"], "name": content["name"], "email": content["email"], 
                                "notes": [], "membership": [], "classes_taken": [], "locker": None})
            client.put(new_student)
            new_student['id'] = new_student.key.id
            new_student.update({"self": f"{APP_URL}/students/{new_student.key.id}"})
            client.put(new_student)
            res = make_response(json.dumps(new_student))
            res.headers.set("Access-Control-Allow-Origin", "*")
            res.status_code = 201
            print(res)
            return res
        else:
            return ({'Error': 'The request object is missing at least one of the required attributes'}, 400)
        
    elif request.method == 'GET':
        query = client.query(kind=constants.students)
        results = list(query.fetch())
        for e in results:
            e['id'] = e.key.id
        res = make_response(json.dumps(results))
        res.headers.set("Access-Control-Allow-Origin", "*")
        print(res)
        return res

    elif request.method == 'OPTIONS':
        res = make_response("")
        
        res.headers.set('Access-Control-Allow-Origin', "*")
        res.headers.set("Access-Control-Allow-Methods", "*")
        res.headers.set("Access-Control-Allow-Headers", "*")
        print(res)
        return res
    
    else:
        return ({'Error': 'Method not recognized'}, 415)


@bp.route('/<student_id>', methods=["GET", "PATCH", "PUT", "DELETE", "OPTIONS"])
def students_get_patch_put_delete(student_id):
    student_key = client.key(constants.students, int(student_id))
    student = client.get(key=student_key)

    if student == None:
        return ({'Error': 'No student with this student_id exists'}, 404)

    if request.method == 'GET':
        # get a student
        res = make_response(json.dumps(student))
        res.headers.set("Access-Control-Allow-Origin", "*")
        print(res)
        return res

    elif request.method == 'PATCH':
        content = request.get_json()
        if current_students_email_check(content["email"]) and "email" in content:
            return ({'Error': 'This student already exists'}, 403)

        keysList = list(content.keys())
        for key in keysList:
            if key not in ["name", "email", "notes", "OSUID"]:
                return ({'Error': 'There is at least one invalid field'}, 400)

        if "OSUID" in content:
            student.update({"OSUID": content["OSUID"]})
        if "name" in content:
            student.update({"name": content["name"]})
        if "notes" in content:
            student.update({"notes": content["notes"]})
        if "email" in content:
            student.update({"email": content["email"]})
        
        client.put(student)
        res = make_response(json.dumps(student))
        res.headers.set("Access-Control-Allow-Origin", "*")
        print(res)
        return res

    elif request.method == 'PUT':
        content = request.get_json()
        if current_students_email_check(content["email"]):
            return ({'Error': 'This student already exists'}, 403)

        if len(content) == 4:
            if "OSUID" in content and "name" in content and "email" in content and "notes" in content:
                student.update({"OSUID": content["OSUID"], "name": content["name"], 
                                "email": content["email"], "notes": content["notes"]})
                client.put(student)
                res = make_response(json.dumps(student))
                res.headers.set("Access-Control-Allow-Origin", "*")
                print(res)
                return res

    elif request.method == 'DELETE':
        # need to add to remove class from student
        class_query = client.query(kind=constants.classes)
        results = list(class_query.fetch())
        print(results)

        class_1_index = 0
        for _ in results:
            # if student is in class, remove
            for i in range(len(results[class_1_index]["students"])):
                if int(results[class_1_index]["students"][i]['id']) == int(student_id):
                    del results[class_1_index]["students"][i]
            
            results[class_1_index].update({"students": results[class_1_index]["students"]})
            client.put(results[class_1_index])
            class_1_index += 1


        client.delete(student)
        res = make_response('')
        res.headers.set("Access-Control-Allow-Origin", "*")
        res.status_code = 204
        print(res)
        return res
    
    elif request.method == 'OPTIONS':
        res = make_response("")
        
        res.headers.set('Access-Control-Allow-Origin', "*")
        res.headers.set("Access-Control-Allow-Methods", "*")
        res.headers.set("Access-Control-Allow-Headers", "*")
        print(res)
        return res


@bp.route('/<student_id>/membership', methods=["PUT", "OPTIONS"])
def student_add_membership(student_id):
    #check to see if student exists
    student_key = client.key(constants.students, int(student_id))
    student = client.get(key=student_key)

    if student == None:
        return ({'Error': 'No student with this student_id exists'}, 404)

    if request.method == 'PUT':
        content = request.get_json()
        if len(content) == 1 and "term" in content:
            if content["term"] not in student["membership"]:
                student["membership"].append(content["term"])
                student.update({"membership": student["membership"]})
                client.put(student)

        res = make_response(json.dumps(student))
        res.headers.set("Access-Control-Allow-Origin", "*")
        res.status_code = 200
        print(res)
        return res

    elif request.method == 'OPTIONS':
        res = make_response("")
        
        res.headers.set('Access-Control-Allow-Origin', "*")
        res.headers.set("Access-Control-Allow-Methods", "*")
        res.headers.set("Access-Control-Allow-Headers", "*")
        print(res)
        return res


@bp.route('/<student_id>/classes/<class_id>', methods=["PUT", "DELETE", "OPTIONS"])
def student_to_class_put_delete(student_id, class_id):
    #check to see if student exists
    student_key = client.key(constants.students, int(student_id))
    student = client.get(key=student_key)

    if student == None:
        return ({'Error': 'No student with this student_id exists'}, 404)

    # check to see if class exists
    class_key = client.key(constants.classes, int(class_id))
    class_selected = client.get(key=class_key)

    if class_selected == None:
        return ({'Error': 'No class with this class_id exists'}, 404)

    if request.method == 'PUT':
        # add the student to class
        new_student = {"id": student["id"], "name": student["name"], "self": student["self"]}
        class_selected["students"].append(new_student)
        class_selected.update({"students": class_selected["students"]})
        client.put(class_selected)

        # add the class to the student
        new_class = {"id": class_selected["id"], "name": class_selected["name"], "self": class_selected["self"]}
        student["classes_taken"].append(new_class)
        student.update({"classes_taken": student["classes_taken"]})
        client.put(student)

        res = make_response('')
        res.headers.set("Access-Control-Allow-Origin", "*")
        res.status_code = 204
        print(res)
        return res
    
    elif request.method == 'DELETE':
        # if student is in class, remove
        for i in range(len(class_selected["students"])):
            if int(class_selected["students"][i]['id']) == int(student_id):
                del class_selected["students"][i]
        
        class_selected.update({"students": class_selected["students"]})
        client.put(class_selected)

        # if class in students taken, remove
        for i in range(len(student["classes_taken"])):
            if int(student["classes_taken"][i]['id']) == int(class_id):
                del student["classes_taken"][i]
            
        student.update({"classes_taken": student["classes_taken"]})
        client.put(student)

        res = make_response('')
        res.headers.set("Access-Control-Allow-Origin", "*")
        res.status_code = 204
        print(res)
        return res

    elif request.method == 'OPTIONS':
        res = make_response("")
        
        res.headers.set('Access-Control-Allow-Origin', "*")
        res.headers.set("Access-Control-Allow-Methods", "*")
        res.headers.set("Access-Control-Allow-Headers", "*")
        print(res)
        return res
