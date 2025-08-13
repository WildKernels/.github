#!/usr/bin/env python3
"""
Simple HTTP server for StinkHub website
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

# Set the port
PORT = 8080

# Get the directory where this script is located
WEB_DIR = Path(__file__).parent.absolute()

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_DIR, **kwargs)
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    # Change to the web directory
    os.chdir(WEB_DIR)
    
    # Create the server
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"StinkHub website is running at: http://localhost:{PORT}")
        print(f"Serving files from: {WEB_DIR}")
        print("Press Ctrl+C to stop the server")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            sys.exit(0)

if __name__ == "__main__":
    main()