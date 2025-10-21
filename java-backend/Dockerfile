# Use an official Java runtime
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy your app files
COPY . .

# Compile the Java file
RUN javac -cp ".:lib/*" keywordFinder.java

# Expose port 3000 (your Spark port)
EXPOSE 3000

# Run your Java app
CMD ["java", "-cp", ".:lib/*", "keywordFinder"]
