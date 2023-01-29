
from flask import Blueprint, request, make_response
from google.cloud import datastore
import json
import constants

APP_URL = 'https://osu-craft-center-capstone-f22.uw.r.appspot.com'

client = datastore.Client()

bp = Blueprint('class', __name__, url_prefix='/classes')

@bp.route('', methods=['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'])
def classes_get_post_options():
    print("Method: ", str(request.method))

    if request.method == 'POST':
        # create a class based on given parameters, tell user if they don't have it correct
        content = request.get_json()
        new_class = datastore.entity.Entity(key=client.key(constants.classes))
        if len(content) == 7:
            new_class.update({"name": content["name"], "description": content["description"], 
                              "price": content["price"], "member_price": content["member_price"], 
                              "teacher": content["teacher"], "datetime": content["datetime"], 
                              "capacity": content["capacity"], "students": []})
            client.put(new_class)
            new_class['id'] = new_class.key.id
            new_class.update({"self": f"{APP_URL}/classes/{new_class.key.id}"})
            client.put(new_class)
            res = make_response(json.dumps(new_class))
            res.mimetype = 'application/json'
            res.status_code = 201
            res.headers.set('Access-Control-Allow-Methods', '*')
            res.headers.add_header("Access-Control-Allow-Origin", "*") 
            return res
        else:
            return ({'Error': 'The request object is missing at least one of the required attributes'}, 400)

    elif request.method == 'GET':
        # get all of the classes
        query = client.query(kind=constants.classes)
        results = list(query.fetch())
        for e in results:
            e["id"] = e.key.id
        output = {"classes": results}
        res = make_response(json.dumps(output))
        res.headers.set("Access-Control-Allow-Origin", "*")
        print(res)
        return res

    # only support post and get 
    elif request.method == 'PUT' or request.method == 'DELETE':
        return('Method Not Allowed', 405)

    elif request.method == 'OPTIONS':
        res = make_response("")
        
        res.headers.set('Access-Control-Allow-Origin', "*")
        res.headers.set("Access-Control-Allow-Methods", "*")
        res.headers.set("Access-Control-Allow-Headers", "*")
        print(res)
        return res


@bp.route('/<class_id>', methods=["GET", "PATCH", "PUT", "DELETE", "OPTIONS"])
def classes_get_patch_put_delete(class_id):
    class_key = client.key(constants.classes, int(class_id))
    class_selected = client.get(key=class_key)

    if class_selected == None:
        return ({'Error': 'No class with this class_id exists'}, 404)

    if request.method == 'GET':
        # get a class
        res = make_response(json.dumps(class_selected))
        res.headers.set("Access-Control-Allow-Origin", "*")
        res.status_code = 200
        print(res)
        return res
    
    elif request.method == 'PATCH':
        content = request.get_json()

        # check to see if there's a wrong key
        keysList = list(content.keys())
        for key in keysList:
            if key not in ["name", "description", "price", "member_price", 
                            "teacher", "datetime", "capacity"]:
                return ({'Error': 'There is at least one invalid field'}, 400)

        if "name" in content: 
            class_selected.update({"name": content["name"]})
        if "description" in content: 
            class_selected.update({"description": content["description"]})
        if "price" in content: 
            class_selected.update({"price": content["price"]})
        if "member_price" in content: 
            class_selected.update({"member_price": content["member_price"]})
        if "teacher" in content: 
            class_selected.update({"teacher": content["teacher"]})
        if "datetime" in content: 
            class_selected.update({"datetime": content["datetime"]})
        if "capacity" in content: 
            class_selected.update({"capacity": content["capacity"]})
        
        client.put(class_selected)
        
        res = make_response(json.dumps(class_selected))
        res.headers.set("Access-Control-Allow-Origin", "*")
        res.status_code = 200
        print(res)
        return res
    
    elif request.method == 'PUT':
        content = request.get_json()

        if len(content) == 7:
            class_selected.update({"name": content["name"], "description": content["description"], 
                                    "price": content["price"], "member_price": content["member_price"],
                                    "teacher": content["teacher"], "datetime": content["datetime"],
                                    "capacity": content["capacity"]})

            res = make_response(json.dumps(class_selected))
            res.headers.set("Access-Control-Allow-Origin", "*")
            res.status_code = 200
            print(res)
            return res
        
        else:
            return ({'Error': 'There is at least one invalid field'}, 400)

        

    elif request.method == 'DELETE':
        # need to add to remove student from class,

        client.delete(class_key)
        res = make_response("")
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


@bp.route('/<class_id>/students', methods=['GET', 'OPTIONS'])
def classes_get_students(class_id):
    class_key = client.key(constants.classes, int(class_id))
    class_selected = client.get(key=class_key)

    if class_selected == None:
        return ({'Error': 'No class with this class_id exists'}, 404)

    if request.method == 'GET':
        # get the students in a class
        current_students = class_selected["students"]
        # for i in range(len(class_selected["students"])):
        #     student_id = class_selected["students"][i]['id']
        #     student_key = client.key(constants.students, int(student_id))
        #     student = client.get(key=student_key)

        #     add_student = {"id": student["id"], "name": student["name"], "self": student["self"]}
        #     current_students.append(add_student)

        # class_selected["students"] = current_students

        res = make_response(json.dumps(current_students))
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
