# Use official Nginx base image
FROM nginx:alpine

# Remove default nginx.conf and replace with ours
COPY nginx.conf /etc/nginx/nginx.conf

# Copy dist folder contents into Nginx web root
COPY dist/ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start Nginx when container launches
CMD ["nginx", "-g", "daemon off;"]
