from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/cartridge')
def cartridge():
    return render_template('cartridge.html')


@app.route('/run_game')
def run_game():
    return render_template('run_game.html')


@app.route('/tetris')
def tetris():
    return render_template('tetris.html')


@app.route('/really_tetris')
def really_teris():
    return  render_template('tet_tetris.html')

if __name__ == '__main__':
    app.run()
