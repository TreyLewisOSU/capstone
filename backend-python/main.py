from flask import Flask, request
import students
import classes

app = Flask(__name__)
app.register_blueprint(students.bp)
app.register_blueprint(classes.bp)

@app.route('/')
def index():
    return "/classes will have API information"

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)