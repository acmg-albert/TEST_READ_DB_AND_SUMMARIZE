"""
Server startup script.
"""

import os
import sys
import uvicorn
from dotenv import load_dotenv

# Add backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    # Get configuration from environment variables
    host = os.getenv("API_HOST", "0.0.0.0")
    # 优先使用 Render 的 PORT 环境变量
    port = int(os.getenv("PORT") or os.getenv("API_PORT", "8000"))
    debug = os.getenv("DEBUG", "False").lower() == "true"
    
    print(f"Starting server on {host}:{port}")
    
    # Run the server
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info" if debug else "error"
    ) 