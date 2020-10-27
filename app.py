from flask import Flask, render_template

app = Flask(__name__)
app.debug = False


@app.route('/sender/sign-up')
def sign_up():
    return render_template("sign-up.html")


@app.route('/')
def index():
    return render_template("index.html")


if __name__ == '__main__':
    app.run()
