# The reviews image, provided with the build steps you practised in the
# previous module: a working folder, dependencies installed before the code
# is copied, and a .dockerignore that keeps caches and secrets out.
# TODO (README phase 3): the start command is the wrong one for an image.
# Change only the start command.
FROM python:3.14-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ./app ./app
EXPOSE 8000
CMD ["fastapi", "dev", "app/main.py", "--port", "8000"]
