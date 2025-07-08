import http.server
import socketserver
import json
from urllib.parse import urlparse, parse_qs

PORT = 8000

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-type")
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        with open('db.json', 'r') as f:
            data = json.load(f)

        parsed_path = urlparse(self.path)
        path = parsed_path.path

        if path == '/api/ideas':
            self.wfile.write(json.dumps(data['ideas']).encode())
        elif path == '/api/categories':
            self.wfile.write(json.dumps(data['categories']).encode())
        else:
            self.wfile.write(json.dumps({"error": "Not Found"}).encode())

    def do_POST(self):
        if self.path == '/api/ideas':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            new_idea = json.loads(post_data)

            with open('db.json', 'r+') as f:
                data = json.load(f)
                new_idea['id'] = max(i['id'] for i in data['ideas']) + 1 if data['ideas'] else 1
                new_idea['likes'] = 0
                new_idea['comments'] = []
                data['ideas'].append(new_idea)
                f.seek(0)
                json.dump(data, f, indent=2)

            self.send_response(201)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(new_idea).encode())
        elif self.path.startswith('/api/ideas/') and self.path.endswith('/like'):
            idea_id = int(self.path.split('/')[-2])
            with open('db.json', 'r+') as f:
                data = json.load(f)
                for idea in data['ideas']:
                    if idea['id'] == idea_id:
                        idea['likes'] = idea.get('likes', 0) + 1
                        updated_idea = idea
                        break
                else:
                    self.send_response(404)
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Idea not found"}).encode())
                    return
                f.seek(0)
                f.truncate()
                json.dump(data, f, indent=2)
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(updated_idea).encode())
        elif self.path.startswith('/api/ideas/') and self.path.endswith('/comments'):
            idea_id = int(self.path.split('/')[-2])
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            new_comment = json.loads(post_data)

            with open('db.json', 'r+') as f:
                data = json.load(f)
                for idea in data['ideas']:
                    if idea['id'] == idea_id:
                        if 'comments' not in idea:
                            idea['comments'] = []
                        idea['comments'].append(new_comment)
                        updated_idea = idea
                        break
                else:
                    self.send_response(404)
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Idea not found"}).encode())
                    return
                f.seek(0)
                f.truncate()
                json.dump(data, f, indent=2)

            self.send_response(201)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(updated_idea).encode())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not Found"}).encode())

    def do_DELETE(self):
        if self.path.startswith('/api/ideas/'):
            idea_id = int(self.path.split('/')[-1])
            with open('db.json', 'r+') as f:
                data = json.load(f)
                data['ideas'] = [idea for idea in data['ideas'] if idea['id'] != idea_id]
                f.seek(0)
                f.truncate()
                json.dump(data, f, indent=2)

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"message": "Idea deleted successfully"}).encode())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not Found"}).encode())

    def do_PUT(self):
        if self.path.startswith('/api/ideas/'):
            idea_id = int(self.path.split('/')[-1])
            content_length = int(self.headers['Content-Length'])
            put_data = self.rfile.read(content_length)
            updated_idea = json.loads(put_data)

            with open('db.json', 'r+') as f:
                data = json.load(f)
                for idx, idea in enumerate(data['ideas']):
                    if idea['id'] == idea_id:
                        updated_idea['id'] = idea_id
                        data['ideas'][idx] = updated_idea
                        break
                else:
                    self.send_response(404)
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Idea not found"}).encode())
                    return
                f.seek(0)
                f.truncate()
                json.dump(data, f, indent=2)

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(updated_idea).encode())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not Found"}).encode())

Handler = MyHttpRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()