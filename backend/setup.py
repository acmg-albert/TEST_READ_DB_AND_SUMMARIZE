from setuptools import setup, find_packages

setup(
    name="backend",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.109.2",
        "uvicorn==0.27.1",
        "supabase==1.2.0",
        "pandas==2.2.0",
        "python-dotenv==1.0.1",
        "pydantic==2.6.1",
        "sqlalchemy==2.0.25",
        "python-multipart==0.0.6",
        "pytest==8.0.0",
        "httpx>=0.24,<0.26",
        "gotrue==1.1.0",
        "postgrest>=0.10.8,<0.12.0"
    ],
) 